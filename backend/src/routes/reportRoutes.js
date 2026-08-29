const express = require('express');
const router = express.Router();
const { getReports, createReport, verifyReport, upvoteReport } = require('../controllers/reportController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', getReports);
router.post('/', createReport);
router.patch('/:id/verify', requireAuth, requireRole('ngo', 'volunteer', 'admin'), verifyReport);
router.patch('/:id/upvote', requireAuth, upvoteReport);

module.exports = router;