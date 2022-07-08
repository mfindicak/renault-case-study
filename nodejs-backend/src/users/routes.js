const { Router } = require('express');
const controller = require('./controller');

const router = Router();

//Need: Authentication
router.get('/', controller.getUsers);

//Need: Authentication and Manager Role
router.get('/:id', controller.getUserById);

module.exports = router;
