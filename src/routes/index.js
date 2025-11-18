const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const accessRoutes = require('./access.routes');
const authRoutes = require('./auth.routes');


router.use('/users', userRoutes);
router.use('/access', accessRoutes);
router.use('/auth', authRoutes);

module.exports = router;