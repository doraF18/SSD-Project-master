const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());

const users = [
  { id: 1, email: 'user@example.com', password: 'password', role: 'Submitter' }
];

app.get('/api/test', (req,res) =>{
  res.json({"response":"Hello World!"});
  res.status(200);
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret');
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
