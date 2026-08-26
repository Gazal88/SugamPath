const express = require('express');
const router = express.Router();
const { getReports, createReport, verifyReport } = require('../controllers/reportController');

router.get('/', getReports);
router.post('/', createReport);
router.patch('/:id/verify', verifyReport);

module.exports = router;