require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/users/routes');
const controller = require('./src/users/controller');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Renault Case Study Api.');
});

app.post('/login', controller.userLogin);

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
