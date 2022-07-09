const getUsers =
  'SELECT user_id, username, name FROM users WHERE is_deleted = false';

const getUserById =
  'SELECT user_id, username, name, role_id, created_at, updated_at FROM users WHERE is_deleted = false AND user_id = $1';

const checkUsernameExists =
  'SELECT * FROM users WHERE is_deleted = false AND username = $1';

const addUser =
  'INSERT INTO users (username, password, name, role_id) VALUES ($1, $2, $3, $4)';

const updateUser =
  'UPDATE users SET username = $2, name = $3, role_id = $4, updated_at = NOW() WHERE user_id = $1';

const deleteUser =
  'UPDATE users SET is_deleted = TRUE, deleted_at = NOW() WHERE user_id = $1';

module.exports = {
  getUsers,
  getUserById,
  checkUsernameExists,
  addUser,
  updateUser,
  deleteUser,
};
