const express = require('express');
const router = express.Router();

const { login, getProfile, register } = require('../controllers/auth.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/register', authenticate, requireAdmin, register);
router.get('/me', authenticate, getProfile);

module.exports = router;
