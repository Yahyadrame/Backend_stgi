const express = require('express');
const { convertToGif } = require('../controllers/videoController');

const router = express.Router();

router.post('/convert-to-gif', convertToGif);

module.exports = router;