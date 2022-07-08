const getUsers =
  'SELECT user_id, username, name FROM users WHERE is_deleted = false';

const getUserById =
  'SELECT user_id, username, name, role_id, created_at, updated_at FROM users WHERE is_deleted = false AND user_id = $1';

const checkUsernameExists =
  'SELECT * FROM users WHERE is_deleted = false AND username = $1';

const addUser =
  'INSERT INTO users (username, password, name, role_id) VALUES ($1, $2, $3, $4)';

module.exports = {
  getUsers,
  getUserById,
  checkUsernameExists,
  addUser,
};
