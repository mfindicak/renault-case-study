const getUsers =
  'SELECT user_id, username, name FROM users WHERE is_deleted = false';

const getUserById =
  'SELECT * FROM users WHERE is_deleted = false AND user_id = $1';

module.exports = {
  getUsers,
  getUserById,
};
