// controllers/socketController.js
const prisma = require('../config/db');

// In-memory state for active quizzes
const activeQuizzes = {};
// In-memory state for active polls (Jajak Pendapat)
const activePolls = {};
// In-memory state for active Whats In The Box games
const activeBoxes = {};

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

    socket.on('host-request-tally', (data) => {
      const { code } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      if (session && session.hostSocketId === socket.id) {
        io.to(socket.id).emit('answer-tally', {
           tallies: session.currentQuestionTallies || {},
           totalAnswers: session.answersReceived || 0
        });
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
      const { code, points, chosenOptionIndices } = data;
      const quizCode = code.toUpperCase();
      const session = activeQuizzes[quizCode];
      
      if (session) {
        if (!session.currentQuestionTallies) {
           session.currentQuestionTallies = {};
        }
        if (chosenOptionIndices && Array.isArray(chosenOptionIndices)) {
           chosenOptionIndices.forEach(idx => {
             session.currentQuestionTallies[idx] = (session.currentQuestionTallies[idx] || 0) + 1;
           });
        }
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
        title: title,
        time: time,
        state: 'LOBBY',
        participantsCount: 0,
        words: []
      };
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
        socket.emit('poll-join-error', 'Sesi Jajak Pendapat sudah berjalan, tidak bisa bergabung.');
        return;
      }

      session.participantsCount++;
      socket.join(pollCode);
      io.to(session.hostSocketId).emit('poll-player-joined', session.participantsCount);
    });

    socket.on('poll-start', (data) => {
      const { code } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];
      
      if (session && session.hostSocketId === socket.id) {
        session.state = 'LIVE';
        // Memberi tahu semua klien di room (kecuali host) bahwa polling dimulai
        socket.to(pollCode).emit('poll-started', { title: session.title });
      }
    });

    socket.on('poll-submit-answer', (data) => {
      const { code, words } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];
      
      if (session && session.state === 'LIVE') {
        if (Array.isArray(words)) {
          session.words.push(...words);
          io.to(pollCode).emit('poll-live-update', { newWords: words });
        }
      }
    });

    socket.on('poll-end', (data) => {
      const { code } = data;
      const pollCode = code.toUpperCase();
      const session = activePolls[pollCode];
      
      if (session && session.hostSocketId === socket.id) {
        session.state = 'FINISHED';
        io.to(session.hostSocketId).emit('poll-results', {
          words: session.words,
          participantsCount: session.participantsCount
        });
        socket.to(pollCode).emit('poll-results-shown');
      }
    });

    // --- WHATS IN THE BOX EVENTS ---
    socket.on('box-host-create', (data) => {
      const { code, items } = data;
      // items = [{ word, clues: [{ text, image }], timeBetweenClues }]
      const boxCode = code.toUpperCase();
      
      socket.join(boxCode);
      activeBoxes[boxCode] = {
        hostSocketId: socket.id,
        items: items || [],
        currentItemIndex: 0,
        state: 'LOBBY',
        currentClueIndex: -1,
        participants: [], // { socketId, name, totalPoints }
        currentAnswers: [] // { name, answer, points } for current word
      };
    });

    socket.on('box-player-join', (data) => {
      const { code, name } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (!session) {
        socket.emit('box-join-error', 'Sesi tidak ditemukan.');
        return;
      }
      if (session.state !== 'LOBBY') {
        socket.emit('box-join-error', 'Sesi sudah berjalan, tidak bisa bergabung.');
        return;
      }
      const isExists = session.participants.find(p => p.name === name);
      if (isExists) {
        socket.emit('box-join-error', 'Nama sudah dipakai.');
        return;
      }

      session.participants.push({ socketId: socket.id, name, totalPoints: 0 });
      socket.join(boxCode);
      io.to(session.hostSocketId).emit('box-player-joined', session.participants.map(p => p.name));
      socket.emit('box-joined', { code: boxCode, name });
    });

    socket.on('box-start', (data) => {
      const { code } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (session && session.hostSocketId === socket.id) {
        session.state = 'LIVE';
        socket.to(boxCode).emit('box-started');
      }
    });

    socket.on('box-next-clue', (data) => {
      const { code } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (session && session.hostSocketId === socket.id) {
        const currentItem = session.items[session.currentItemIndex];
        if (!currentItem) return;
        
        session.currentClueIndex++;
        if (session.currentClueIndex < currentItem.clues.length) {
          session.clueStartTime = Date.now(); // for speed scoring
          io.to(boxCode).emit('box-clue-revealed', {
            clueIndex: session.currentClueIndex,
            clue: currentItem.clues[session.currentClueIndex]
          });
        }
      }
    });

    socket.on('box-submit-answer', (data) => {
      const { code, name, answer } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (session && session.state === 'LIVE') {
        const currentItem = session.items[session.currentItemIndex];
        if (!currentItem) return;

        // Calculate points
        let points = 0;
        const isCorrect = answer.trim().toUpperCase() === currentItem.word.toUpperCase();
        if (isCorrect) {
          const maxBase = 1000;
          const cluePenalty = (session.currentClueIndex / currentItem.clues.length) * 500; 
          const timeTaken = (Date.now() - session.clueStartTime) / 1000;
          const timePenalty = Math.min(timeTaken, 10) * 20;

          points = Math.max(0, maxBase - cluePenalty - timePenalty);
        }

        session.currentAnswers.push({
          name,
          answer: answer.trim(),
          isCorrect,
          points: Math.round(points)
        });

        // Add to total participant score
        const participant = session.participants.find(p => p.name === name);
        if (participant) {
          participant.totalPoints += Math.round(points);
        }

        io.to(session.hostSocketId).emit('box-player-answered', { count: session.currentAnswers.length });
      }
    });

    socket.on('box-end-word', (data) => {
      const { code } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (session && session.hostSocketId === socket.id) {
        const currentItem = session.items[session.currentItemIndex];
        if (!currentItem) return;

        const wrongAnswers = session.currentAnswers.filter(a => !a.isCorrect).map(a => a.answer);
        const uniqueWrongAnswers = [...new Set(wrongAnswers)];

        // Leaderboard for CURRENT word
        const wordLeaderboard = session.currentAnswers
          .sort((a, b) => b.points - a.points)
          .map(a => ({ name: a.name, points: a.points, answer: a.answer }));

        const isLastWord = session.currentItemIndex >= session.items.length - 1;

        io.to(session.hostSocketId).emit('box-word-results', {
          correctWord: currentItem.word,
          wrongAnswers: uniqueWrongAnswers,
          leaderboard: wordLeaderboard,
          isLastWord: isLastWord
        });
        
        socket.to(boxCode).emit('box-ended'); // tell player to wait
      }
    });

    socket.on('box-next-word', (data) => {
      const { code } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (session && session.hostSocketId === socket.id) {
        session.currentItemIndex++;
        session.currentClueIndex = -1;
        session.currentAnswers = [];
        
        if (session.currentItemIndex < session.items.length) {
          // Tell players a new word is starting
          socket.to(boxCode).emit('box-started');
          io.to(session.hostSocketId).emit('box-word-started', { wordIndex: session.currentItemIndex });
        }
      }
    });

    socket.on('box-end-game', (data) => {
      const { code } = data;
      const boxCode = code.toUpperCase();
      const session = activeBoxes[boxCode];
      
      if (session && session.hostSocketId === socket.id && session.state !== 'FINISHED') {
        session.state = 'FINISHED';
        // Aggregate full game leaderboard
        const finalLeaderboard = session.participants
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map(p => ({ name: p.name, points: p.totalPoints }));
          
        io.to(session.hostSocketId).emit('box-final-results', { leaderboard: finalLeaderboard });
        socket.to(boxCode).emit('box-ended');
      }
    });

  });

  function sendQuestionToPlayers(quizCode) {
    const session = activeQuizzes[quizCode];
    if(!session) return;
    session.answersReceived = 0;
    session.currentQuestionTallies = {};
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
