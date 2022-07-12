require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authController = require('./src/auth/controller');
const userRoutes = require('./src/users/routes');
const roleRoutes = require('./src/roles/routes');

const app = express();
const port = 3000;

app.use(cors({ credentials: true, origin: 'http://localhost:4200' })); //This is need for get request from frontend. Angular uses 4200 port. That library solves CORS issue.

app.use(cookieParser()); //We use this for read cookies.

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Renault Case Study Api.');
});

app.post('/login', authController.userLogin);

app.post('/refresh', authController.refresh);

app.use('/users', userRoutes);

app.use('/roles', roleRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
