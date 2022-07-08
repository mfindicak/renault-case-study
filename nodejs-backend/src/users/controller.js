const pool = require('../../db');
const queries = require('./queries');
const bcrypt = require('bcrypt');

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, results) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
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
      res.sendStatus(500);
      return;
    }
    res.status(200).json(results.rows);
  });
};

//Only managers can reach to this function.
const addUser = (req, res) => {
  const { username, password, name, role_id } = req.body;

  if (!username || !password || !name || !role_id) {
    res.status(400).send('Missing metadata.');
    return;
  }

  //Check username if exists
  pool.query(queries.checkUsernameExists, [username], (error, results) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    if (results.rows.length) {
      res.status(400).send('The username already exists.');
      return;
    }

    //This is for hashing the password. bcrypt library produces different hash values with salt value even be passwords equal.
    bcrypt.hash(password, 10, (err, hash) => {
      pool.query(
        queries.addUser,
        [username, hash, name, role_id],
        (error, results) => {
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          res.status(201).send('User successfully created.');
        }
      );
    });
  });
};

module.exports = { getUsers, getUserById, addUser };
