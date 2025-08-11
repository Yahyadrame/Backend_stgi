const express = require('express');
const { createTool, getAllTools } = require('../controllers/toolController');

const router = express.Router();

router.post('/', createTool);
router.get('/', getAllTools);

module.exports = router;