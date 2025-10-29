const express = require('express');
const folderRoutes = require('./folderRoutes');
const instructionRoutes = require('./instructionRoutes');
const stepRoutes = require('./stepRoutes');
const toolRoutes = require('./toolRoutes');
const videoRoutes = require('./videoRoutes');

const router = express.Router();

// Route de health check
router.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Backend STGI API is running' });
});

router.use('/folders', folderRoutes);
router.use('/instructions', instructionRoutes);
router.use('/steps', stepRoutes);
router.use('/tools', toolRoutes);
router.use('/video', videoRoutes);

module.exports = router;