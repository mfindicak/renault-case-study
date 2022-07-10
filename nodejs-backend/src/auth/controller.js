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
      //Access Token will be expired in 15 minutes.
      const accesToken = jwt.sign(
        { user_id: results.rows[0].user_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      //Refresh Token will be expired in 30 days.
      const refreshToken = jwt.sign(
        { user_id: results.rows[0].user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
      );
      res.cookie('accesToken', accesToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 900000, //15 Minutes
      });
      res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 2592000000, //30 Days
      });
      res.status(200).json({ status: 'ok' });
    });
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accesToken;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(401);
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

const refresh = (req, res) => {
  const refreshToken = req.cookies.accesToken;
  if (!refreshToken) return res.sendStatus(400);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, result) => {
      if (error) return res.sendStatus(401);

      //Refresh token is valid create new pair acces and refresh tokens.

      //Access Token will be expired in 15 minutes.
      const accesToken = jwt.sign(
        { user_id: result.user_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      //Refresh Token will be expired in 30 days.
      const refreshToken = jwt.sign(
        { user_id: result.user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
      );
      res.cookie('accesToken', accesToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 900000, //15 Minutes
      });
      res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 2592000000, //30 Days
      });
      res.status(200).json({ status: 'ok' });
    }
  );
};

module.exports = {
  userLogin,
  authenticateToken,
  authRole,
  refresh,
};
