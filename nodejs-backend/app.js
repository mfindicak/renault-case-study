require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/users/routes');
const authController = require('./src/auth/controller');

const app = express();
const port = 3000;

app.use(cors()); //This is need for get request from frontend. Angular uses 4200 port. That library solves CORS issue.

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
