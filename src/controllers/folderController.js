const prisma = require('../config/database');

const getAllFolders = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      include: { instructions: true },
    });
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFolderById = async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
      include: { instructions: true },
    });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json(folder);
  } catch (error) {
    console.error('Error fetching folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createFolder = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const folder = await prisma.folder.create({
      data: { name },
    });
    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllFolders, getFolderById, createFolder };