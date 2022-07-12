const { Router } = require('express');
const userController = require('./controller');
const authController = require('../auth/controller');
const ROLE = require('../roles/roles');

const router = Router();

//Show limited informations of all users which undeleted. Need: Authentication
router.get('/', authController.authenticateToken, userController.getUsers);

//Show certain user details. Need: Authentication and Manager Role
//If you are not manager you can only reach details of your own.
router.get(
  '/:id',
  authController.authenticateToken,
  authController.authRole(ROLE.MANAGER, true),
  userController.getUserById
);

//Add a new user. Need: Authentication and Manager Role
router.post(
  '/',
  authController.authenticateToken,
  authController.authRole(ROLE.MANAGER),
  userController.addUser
);

//Update the exists user. Need: Authentication and Manager Role
router.put(
  '/:id',
  authController.authenticateToken,
  authController.authRole(ROLE.MANAGER),
  userController.updateUser
);

//Delete the exists user. Need: Authentication and Manager Role
router.delete(
  '/:id',
  authController.authenticateToken,
  authController.authRole(ROLE.MANAGER),
  userController.deleteUser
);

module.exports = router;
