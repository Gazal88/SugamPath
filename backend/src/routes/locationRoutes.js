const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocationById,
  createLocation,
} = require('../controllers/locationController');

router.get('/', getLocations);
router.get('/:id', getLocationById);
router.post('/', createLocation);

module.exports = router;
