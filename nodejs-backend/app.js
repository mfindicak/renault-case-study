require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/users/routes');
const authController = require('./src/auth/controller');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Renault Case Study Api.');
});

app.post('/login', authController.userLogin);

app.post('/refresh', authController.refresh);

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
