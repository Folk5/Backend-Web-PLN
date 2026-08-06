const prisma = require('../config/db');
// Force restart to load new prisma client

// Create a new Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    
    // Generate unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Format questions for Prisma nested create
    const formattedQuestions = questions.map(q => ({
      type: q.type,
      text: q.text,
      images: Array.isArray(q.images) ? q.images : [],
      time_limit: q.time_limit || 20,
      options: {
        create: q.options ? q.options.map(opt => ({
          text: opt.text,
          is_correct: opt.is_correct || false
        })) : []
      }
    }));

    const quiz = await prisma.quiz.create({
      data: {
        title,
        code,
        questions: {
          create: formattedQuestions
        }
      },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    console.error('[quizController] createQuiz error:', error);
    res.status(500).json({ error: 'Gagal membuat quiz', details: error.message });
  }
};

// Fetch Quiz by code (Without returning correct answers to client)
exports.getQuizByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const quiz = await prisma.quiz.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        questions: {
          include: {
            options: {
              select: { id: true, text: true, question_id: true } // DO NOT send is_correct to client
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz tidak ditemukan' });
    }

    if (!quiz.is_active) {
      let userRole = null;
      if (req.user && req.user.role) {
        userRole = req.user.role;
      } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
          userRole = decoded.role;
        } catch (e) {
          // Ignore invalid token here
        }
      }

      if (userRole !== 'Instruktur' && userRole !== 'Admin') {
        return res.status(403).json({ error: 'Quiz ini sedang tidak aktif' });
      }
    }

    res.json(quiz);
  } catch (error) {
    console.error('[quizController] getQuizByCode error:', error);
    res.status(500).json({ error: 'Gagal mengambil quiz', details: error.message });
  }
};

// Submit Quiz and calculate score
exports.submitQuiz = async (req, res) => {
  try {
    const { code } = req.params;
    const { participant_name, answers } = req.body;
    // answers structure: { [questionId]: [optionId] or string }

    const quiz = await prisma.quiz.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz tidak ditemukan' });
    }

    if (!quiz.is_active) {
      return res.status(403).json({ error: 'Quiz ini sudah tidak aktif, jawaban tidak dapat disubmit' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    if (totalQuestions === 0) {
      return res.status(400).json({ error: 'Quiz ini tidak memiliki soal' });
    }

    // Evaluate answers
    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;

      if (q.type === 'PG') {
        const correctOption = q.options.find(o => o.is_correct);
        if (correctOption && userAnswer === correctOption.id) correctCount++;
      } 
      else if (q.type === 'CHECKBOX') {
        const correctOptionsIds = q.options.filter(o => o.is_correct).map(o => o.id);
        const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        
        // Match exact correct choices
        if (correctOptionsIds.length === userAnswersArray.length) {
          const isAllCorrect = correctOptionsIds.every(id => userAnswersArray.includes(id));
          if (isAllCorrect) correctCount++;
        }
      }
      else if (q.type === 'ESSAY') {
        // For essay, if options exist, we treat the first option text as keyword
        if (q.options.length > 0) {
          const keyword = q.options[0].text.toLowerCase();
          if (String(userAnswer).toLowerCase().includes(keyword)) correctCount++;
        } else {
           // If no keyword, maybe just count as correct or give partial points. (For now, we count as 0)
        }
      }
    });

    const score = (correctCount / totalQuestions) * 100;

    const submission = await prisma.quizSubmission.create({
      data: {
        quiz_id: quiz.id,
        participant_name,
        score
      }
    });

    res.json({ message: 'Quiz berhasil disubmit', score, submission });
  } catch (error) {
    console.error('[quizController] submitQuiz error:', error);
    res.status(500).json({ error: 'Gagal memproses quiz', details: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { questions: true, submissions: true }
        },
        questions: {
          include: { options: true }
        },
        submissions: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    const allSubmissions = await prisma.quizSubmission.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        quiz: {
          select: { title: true, code: true }
        }
      }
    });

    res.json({ quizzes, allSubmissions });
  } catch (error) {
    console.error('[quizController] getAllQuizzes error:', error);
    res.status(500).json({ error: 'Gagal mengambil data kuis', details: error.message });
  }
};

// Toggle Quiz Status
exports.toggleQuizStatus = async (req, res) => {
  try {
    const { code } = req.params;
    let { is_active } = req.body;
    
    // Explicitly cast to boolean to prevent any parsing issues
    is_active = is_active === true || is_active === 'true';
    
    console.log(`[toggleQuizStatus] code: ${code}, is_active: ${is_active} (type: ${typeof is_active}), req.body:`, req.body);

    // Role check temporarily disabled for testing
    // if (req.user.role !== 'Instruktur' && req.user.role !== 'Admin') {
    //   return res.status(403).json({ error: 'Hanya instruktur atau admin yang dapat mengubah status quiz' });
    // }

    const quiz = await prisma.quiz.update({
      where: { code: code.toUpperCase() },
      data: { is_active }
    });

    res.json({ message: 'Status quiz berhasil diubah', quiz });
  } catch (error) {
    console.error('[quizController] toggleQuizStatus error:', error);
    res.status(500).json({ error: 'Gagal mengubah status quiz', details: error.message });
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'Instruktur' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Hanya instruktur atau admin yang dapat menghapus kuis' });
    }

    await prisma.quiz.delete({
      where: { id: id }
    });

    res.json({ message: 'Kuis berhasil dihapus' });
  } catch (error) {
    console.error('[quizController] deleteQuiz error:', error);
    res.status(500).json({ error: 'Gagal menghapus kuis', details: error.message });
  }
};
