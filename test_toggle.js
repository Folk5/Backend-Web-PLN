const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 1, role: 'Instruktur' },
  process.env.JWT_SECRET || 'secretkey',
  { expiresIn: '1h' }
);

async function main() {
  
  // Test Proxy directly
  const res = await fetch('http://localhost:3000/api/quiz/GGVI9Y/toggle-status', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': `auth_token=${token}`
    },
    body: JSON.stringify({ is_active: true })
  });
  
  console.log('Backend Direct Status:', res.status);
  console.log('Backend Direct Body:', await res.text());

  // Check if it's updated
  const res2 = await fetch('http://localhost:4000/api/quiz');
  const data = await res2.json();
  const quiz = data.quizzes.find(q => q.code === 'GGVI9Y');
  console.log('Quiz in DB is_active:', quiz.is_active);
}
main();
