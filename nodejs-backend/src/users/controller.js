const pool = require('../../db');
const queries = require('./queries');
const bcrypt = require('bcrypt');

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

    if (results.rowCount == 0) {
      return res.status(404).send("The user id couldn't find.");
    }

    res.status(200).json(results.rows[0]);
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

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  let { username, name, role_id } = req.body;

  if (!username && !name && !role_id) {
    return res.status(400).send('Missing metadata.');
  }

  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    if (results.rowCount == 0) {
      return res.status(404).send("The user id couldn't find.");
    }

    const theUser = results.rows[0];

    username = username ? username : theUser.username;
    name = name ? name : theUser.name;
    role_id = role_id ? role_id : theUser.role_id;

    pool.query(
      queries.updateUser,
      [id, username, name, role_id],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.sendStatus(500);
        }
        res.sendStatus(200);
      }
    );
  });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    if (results.rowCount == 0) {
      return res.status(404).send("The user id couldn't find.");
    }

    pool.query(queries.deleteUser, [id], (error, results) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
