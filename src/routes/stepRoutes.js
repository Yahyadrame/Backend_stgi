const express = require('express');
const { createStep, getStepById, updateStep, reorderSteps } = require('../controllers/stepController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', createStep); // Pas de média initial
router.get('/:id', getStepById);
router.patch('/:id', upload.single('media'), updateStep); // Média uniquement en mise à jour
router.patch('/reorder', reorderSteps);

module.exports = router;