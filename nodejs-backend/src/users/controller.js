const pool = require('../../db');
const queries = require('./queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing metadata.');
  }

  pool.query(queries.checkUsernameExists, [username], (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    if (!results.rows.length) {
      return res.status(400).send('The username does not exits.');
    }

    bcrypt.compare(password, results.rows[0].password, (error, result) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }

      if (!result) {
        return res.status(400).send('The password is not correct.');
      }

      //Logged in successfully. Create JWT Acces and Refresh tokens and send to user.
      const accesToken = jwt.sign(
        { user_id: results.rows[0].user_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      const refreshToken = jwt.sign(
        { user_id: results.rows[0].user_id },
        process.env.REFRESH_TOKEN_SECRET
      );
      res
        .status(200)
        .json({ accesToken: accesToken, refreshToken: refreshToken });
    });
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    console.log(user);
    req.user = user;
    next();
  });
};

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }
    res.status(200).json(results.rows);
  });
};

//Only managers can reach to this function.
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }
    res.status(200).json(results.rows);
  });
};

//Only managers can reach to this function.
const addUser = (req, res) => {
  const { username, password, name, role_id } = req.body;

  if (!username || !password || !name || !role_id) {
    return res.status(400).send('Missing metadata.');
  }

  //Check username if exists
  pool.query(queries.checkUsernameExists, [username], (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    if (results.rows.length) {
      return res.status(400).send('The username already exists.');
    }

    //This is for hashing the password. bcrypt library produces different hash values with salt value even be passwords equal.
    bcrypt.hash(password, 10, (err, hash) => {
      pool.query(
        queries.addUser,
        [username, hash, name, role_id],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.sendStatus(500);
          }
          res.status(201).send('User successfully created.');
        }
      );
    });
  });
};

module.exports = {
  userLogin,
  authenticateToken,
  getUsers,
  getUserById,
  addUser,
};
