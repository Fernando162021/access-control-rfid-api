const express = require('express');
const router = express.Router();

const { accessByRfid, accessByCamera, getAccessLogs, getUserAccessLogs } = require('../controllers/access.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/rfid', accessByRfid);
router.post('/camera', accessByCamera);
router.get('/logs', authenticate, requireAdmin, getAccessLogs);
router.get('/logs/:userId', authenticate, requireAdmin, getUserAccessLogs);

module.exports = router;