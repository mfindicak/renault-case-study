const getUsers =
  'SELECT user_id, username, name FROM users WHERE is_deleted=false';

module.exports = {
  getUsers,
};
