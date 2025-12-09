const express = require('express');
const router = express.Router();

const { login, register, refreshToken, logout, getProfile } = require('../controllers/auth.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/register', authenticate, requireAdmin, register);
router.post('/refresh-token', authenticate, refreshToken);
router.post('/logout', authenticate, logout);

router.get('/me', authenticate, getProfile);

module.exports = router;
