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
      return res.status(400).send('The username does not exists.');
    }

    const user = results.rows[0];

    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }

      if (!result) {
        return res.status(401).send('The password is not correct.');
      }

      delete user.password; //user object will send with json. We don't wanna add password to json even if encrypted.

      //Logged in successfully. Create JWT Acces and Refresh tokens and send to user.
      //Access Token will be expired in 15 minutes.
      const accesToken = jwt.sign(
        { user_id: user.user_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      //Refresh Token will be expired in 30 days.
      const refreshToken = jwt.sign(
        { user_id: user.user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
      );
      res.cookie('acces_token', accesToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 900000, //15 Minutes
      });
      res.cookie('refresh_token', refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/refresh', //only send this cookie to /refresh path for get more security.
        maxAge: 2592000000, //30 Days
      });
      res.status(200).json({ status: 'ok', data: user });
    });
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.acces_token;
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
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(400);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, result) => {
      if (error) return res.sendStatus(401);

      //Refresh token is valid now create new access token.

      //Access Token will be expired in 15 minutes.
      const accesToken = jwt.sign(
        { user_id: result.user_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      res.cookie('acces_token', accesToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 900000, //15 Minutes
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
