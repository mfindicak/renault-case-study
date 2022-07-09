const jwt = require('jsonwebtoken');
const pool = require('../../db');
const userQueries = require('../users/queries');
const bcrypt = require('bcrypt');

const userLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing metadata.');
  }

  pool.query(userQueries.checkUsernameExists, [username], (error, results) => {
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
    pool.query(userQueries.getUserById, [user.user_id], (error, results) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }
      if (results.rowCount == 0) {
        return res
          .status(404)
          .send(
            'The user could not found on server. Your account might be deleted.'
          );
      }
      req.user = results.rows[0];
      console.log(req.user);
      next();
    });
  });
};

const authRole = (role) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (req.user.role_id === role.role_id) {
      next();
    } else {
      res.status(403).send('Permission denied.');
    }
  };
};

module.exports = {
  userLogin,
  authenticateToken,
  authRole,
};
