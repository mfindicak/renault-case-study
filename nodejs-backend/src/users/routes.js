const { Router } = require('express');
const controller = require('./controller');

const router = Router();

//Need: Authentication
router.get('/', controller.authenticateToken, controller.getUsers);

//Need: Authentication and Manager Role
router.get('/:id', controller.getUserById);

//Need: Authentication and Manager Role
router.post('/', controller.addUser);

//Need: Authentication and Manager Role
router.put('/:id', controller.updateUser);

//Need: Authentication and Manager Role
router.delete('/:id', controller.deleteUser);

module.exports = router;
