const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'mfindicak',
  host: 'localhost',
  database: 'dbusers',
  port: 5432,
});

module.exports = pool;
