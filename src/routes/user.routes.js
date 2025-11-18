const express = require('express');
const router = express.Router();

const { getUser, getUsers, deleteUser } = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', authenticate, requireAdmin, getUsers);
router.route('/:id')
    .get(authenticate, requireAdmin, getUser)
    .delete(authenticate, requireAdmin, deleteUser);

module.exports = router;
