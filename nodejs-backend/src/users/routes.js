const { Router } = require('express');
const controller = require('./controller');
const ROLE = require('./roles');

const router = Router();

//Show limited informations of all users which undeleted. Need: Authentication
router.get('/', controller.authenticateToken, controller.getUsers);

//Show certain user details. Need: Authentication and Manager Role
router.get(
  '/:id',
  controller.authenticateToken,
  controller.authRole(ROLE.MANAGER),
  controller.getUserById
);

//Add a new user. Need: Authentication and Manager Role
router.post(
  '/',
  controller.authenticateToken,
  controller.authRole(ROLE.MANAGER),
  controller.addUser
);

//Update the exists user. Need: Authentication and Manager Role
router.put(
  '/:id',
  controller.authenticateToken,
  controller.authRole(ROLE.MANAGER),
  controller.updateUser
);

//Delete the exists user. Need: Authentication and Manager Role
router.delete(
  '/:id',
  controller.authenticateToken,
  controller.authRole(ROLE.MANAGER),
  controller.deleteUser
);

module.exports = router;
