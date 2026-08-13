// controllers/socketController.js
const prisma = require('../config/db');

// In-memory state for active quizzes and polls
const activeQuizzes = {};
const activePolls = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    // --- HOST EVENTS ---
    socket.on('host-join', async (data) => {
      const { code } = data;
      const quizCode = code.toUpperCase();
      
      const quiz = await prisma.quiz.findUnique({
        where: { code: quizCode },
        include: { 
          questions: { 
            orderBy: { id: 'asc' },
            include: { options: true }
          } 
        }
      });

      if (!quiz) {
        socket.emit('error', 'Quiz tidak ditemukan');
        return;
      }

      socket.join(quizCode);
      activeQuizzes[quizCode] = {
        quizId: quiz.id,
        hostSocketId: socket.id,
        currentQuestionIndex: 0,
        participants: [], 
        state: 'LOBBY',
        questions: quiz.questions
      };

      socket.emit('host-joined', { code: quizCode, participants: [] });
    });

    socket.on('host-start-quiz', (data) => {
      const { code } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      
      if (session && session.hostSocketId === socket.id) {
        session.state = 'QUESTION';
        session.currentQuestionIndex = 0;
        
        io.to(quizCode).emit('quiz-started', {
          questionIndex: session.currentQuestionIndex,
          totalQuestions: session.questions.length
        });
        
        sendQuestionToPlayers(quizCode);
      }
    });

    socket.on('host-next-question', (data) => {
      const { code } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      
      if (session && session.hostSocketId === socket.id) {
        session.currentQuestionIndex++;
        if (session.currentQuestionIndex < session.questions.length) {
          session.state = 'QUESTION';
          sendQuestionToPlayers(quizCode);
        } else {
          session.state = 'FINISHED';
          saveFinalScores(quizCode);
          io.to(quizCode).emit('quiz-finished', getLeaderboard(quizCode));
        }
      }
    });

    socket.on('host-show-leaderboard', (data) => {
      const { code } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      if (session && session.hostSocketId === socket.id) {
        session.state = 'LEADERBOARD';
        io.to(quizCode).emit('show-leaderboard', getLeaderboard(quizCode));
      }
    });

    socket.on('host-skip-timer', (data) => {
      const { code } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      if (session && session.hostSocketId === socket.id) {
        io.to(quizCode).emit('timer-skipped');
      }
    });

    // --- PLAYER EVENTS ---
    socket.on('player-join', (data) => {
      const { code, name } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];

      if (!session) {
        socket.emit('join-error', 'Quiz belum dimulai oleh Host atau PIN salah.');
        return;
      }
      if (session.state !== 'LOBBY') {
        socket.emit('join-error', 'Kuis sudah dimulai, tidak bisa bergabung.');
        return;
      }
      const isExists = session.participants.find(p => p.name === name);
      if (isExists) {
        socket.emit('join-error', 'Nama sudah dipakai, silakan gunakan nama lain.');
        return;
      }

      session.participants.push({
        socketId: socket.id,
        name,
        score: 0
      });

      socket.join(quizCode);
      socket.emit('player-joined', { name, code: quizCode });
      io.to(session.hostSocketId).emit('update-participants', session.participants.map(p => p.name));
    });

    socket.on('player-score-update', (data) => {
      const { code, points } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      
      if (session) {
        const p = session.participants.find(x => x.socketId === socket.id);
        if (p) {
          p.score += points;
          io.to(session.hostSocketId).emit('live-score-update', getLeaderboard(quizCode));
          
          session.answersReceived = (session.answersReceived || 0) + 1;
          if (session.answersReceived >= session.participants.length) {
            io.to(session.hostSocketId).emit('all-players-answered');
          }
        }
      }
    });

    // --- POLL (JAJAK PENDAPAT) EVENTS ---
    socket.on('poll-host-create', (data) => {
      const { code, title, time } = data;
      const pollCode = code.toUpperCase();
      
      socket.join(pollCode);
      activePolls[pollCode] = {
        hostSocketId: socket.id,
        title,
        time,
        participants: 0,
        words: [],
        state: 'LOBBY'
      };
      // Host doesn't need a specific return emit for create success in current frontend, 
      // but it will listen to 'poll-player-joined'
    });

    socket.on('poll-player-join', (data) => {
      const { code } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];

      if (!session) {
        socket.emit('poll-join-error', 'Sesi Jajak Pendapat tidak ditemukan.');
        return;
      }
      if (session.state !== 'LOBBY') {
        socket.emit('poll-join-error', 'Sesi Jajak Pendapat sudah dimulai atau selesai.');
        return;
      }

      session.participants++;
      socket.join(pollCode);
      
      // Notify host that participant count increased
      io.to(session.hostSocketId).emit('poll-player-joined', session.participants);
    });

    socket.on('poll-start', (data) => {
      const { code } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];

      if (session && session.hostSocketId === socket.id) {
        session.state = 'STARTED';
        // Notify all players in room that poll started
        io.to(pollCode).emit('poll-started', { title: session.title, time: session.time });
      }
    });

    socket.on('poll-submit-answer', (data) => {
      const { code, words } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];

      if (session && session.state === 'STARTED') {
        // Add words to session
        if (words && words.length > 0) {
          session.words.push(...words);
          // Update host with live word data
          io.to(session.hostSocketId).emit('poll-live-update', { words: session.words });
        }
      }
    });

    socket.on('poll-end', (data) => {
      const { code } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];

      if (session && session.hostSocketId === socket.id) {
        session.state = 'FINISHED';
        // Send final results to host
        io.to(session.hostSocketId).emit('poll-results', { words: session.words });
        // Notify players that results are shown
        io.to(pollCode).emit('poll-results-shown');
      }
    });

  });

  function sendQuestionToPlayers(quizCode) {
    const session = activeQuizzes[quizCode];
    if(!session) return;
    session.answersReceived = 0;
    const q = session.questions[session.currentQuestionIndex];
    io.to(quizCode).emit('new-question', {
      questionIndex: session.currentQuestionIndex,
      totalQuestions: session.questions.length,
      question: q 
    });
  }

  function getLeaderboard(quizCode) {
    const session = activeQuizzes[quizCode];
    if(!session) return [];
    return [...session.participants].sort((a,b) => b.score - a.score).map(p => ({
      name: p.name,
      score: Math.round(p.score)
    }));
  }

  async function saveFinalScores(quizCode) {
    const session = activeQuizzes[quizCode];
    if(!session) return;
    try {
      const records = session.participants.map(p => ({
        quiz_id: session.quizId,
        participant_name: p.name,
        score: p.score
      }));
      if(records.length > 0) {
        await prisma.quizSubmission.createMany({
          data: records
        });
      }
    } catch (e) {
      console.error('Failed to save final scores:', e);
    }
  }
};
