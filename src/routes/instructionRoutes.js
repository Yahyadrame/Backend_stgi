const express = require('express');
const { getAllInstructions, getInstructionById, createInstruction, reorderInstructions } = require('../controllers/instructionController');

const router = express.Router();

router.get('/', getAllInstructions);
router.get('/:id', getInstructionById);
router.post('/', createInstruction);
router.patch('/reorder', reorderInstructions);

module.exports = router;