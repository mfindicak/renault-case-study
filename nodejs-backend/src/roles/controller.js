const pool = require('../../db');

const getRoles = (req, res) => {
  pool.query('SELECT * FROM roles', (error, results) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }
    res.status(200).json(results.rows);
  });
};

module.exports = { getRoles };
