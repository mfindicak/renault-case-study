const { Router } = require('express');
const authController = require('../auth/controller');
const roleController = require('./controller');

const router = Router();

//Return all roles in database if user logged in.
router.get('/', authController.authenticateToken, roleController.getRoles);

module.exports = router;
