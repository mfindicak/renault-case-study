const { Router } = require('express');
const controller = require('./controller');

const router = Router();

//Need: Authentication
router.get('/', controller.authenticateToken, controller.getUsers);

//Need: Authentication and Manager Role
router.get('/:id', controller.getUserById);

//Need: Authentication and Manager Role
router.post('/', controller.addUser);

module.exports = router;
