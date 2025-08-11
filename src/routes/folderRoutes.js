const express = require('express');
const { getAllFolders, getFolderById, createFolder } = require('../controllers/folderController');

const router = express.Router();

router.get('/', getAllFolders);
router.get('/:id', getFolderById);
router.post('/', createFolder);

module.exports = router;