const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importQuiz() {
  try {
    if (!fs.existsSync('quiz_seed.json')) {
      console.error('File quiz_seed.json tidak ditemukan!');
      return;
    }

    const quizzes = JSON.parse(fs.readFileSync('quiz_seed.json', 'utf8'));
    console.log(`Menemukan ${quizzes.length} kuis. Memulai proses import...`);

    for (const q of quizzes) {
      // Create or update quiz
      const quiz = await prisma.quiz.upsert({
        where: { code: q.code },
        update: {
          title: q.title,
          is_active: q.is_active,
        },
        create: {
          id: q.id,
          title: q.title,
          code: q.code,
          is_active: q.is_active,
          created_at: q.created_at,
        }
      });

      console.log(`- Kuis: ${quiz.title} (Code: ${quiz.code})`);

      // Import questions
      if (q.questions && q.questions.length > 0) {
        for (const quest of q.questions) {
          const question = await prisma.question.upsert({
            where: { id: quest.id },
            update: {
              type: quest.type,
              text: quest.text,
              images: quest.images,
              time_limit: quest.time_limit,
            },
            create: {
              id: quest.id,
              quiz_id: quiz.id,
              type: quest.type,
              text: quest.text,
              images: quest.images,
              time_limit: quest.time_limit,
            }
          });

          // Import options
          if (quest.options && quest.options.length > 0) {
            for (const opt of quest.options) {
              await prisma.questionOption.upsert({
                where: { id: opt.id },
                update: {
                  text: opt.text,
                  is_correct: opt.is_correct,
                },
                create: {
                  id: opt.id,
                  question_id: question.id,
                  text: opt.text,
                  is_correct: opt.is_correct,
                }
              });
            }
          }
        }
      }

      // Import submissions
      if (q.submissions && q.submissions.length > 0) {
        for (const sub of q.submissions) {
          await prisma.quizSubmission.upsert({
            where: { id: sub.id },
            update: {
              participant_name: sub.participant_name,
              score: sub.score,
            },
            create: {
              id: sub.id,
              quiz_id: quiz.id,
              participant_name: sub.participant_name,
              score: sub.score,
              created_at: sub.created_at,
            }
          });
        }
      }
    }

    console.log('Import data kuis berhasil diselesaikan tanpa mengganggu tabel lain!');
  } catch (error) {
    console.error('Gagal mengimport data kuis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importQuiz();
