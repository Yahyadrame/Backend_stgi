const prisma = require('../config/database');

const createTool = async (req, res) => {
  const { name, description, type, location, image } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le nom de l\'outil est requis' });
  }
  try {
    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        type,
        location,
        image,
      },
    });
    res.status(201).json(tool);
  } catch (error) {
    console.error('Erreur lors de la création de l\'outil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getAllTools = async (req, res) => {
  try {
    const tools = await prisma.tool.findMany();
    res.json(tools);
  } catch (error) {
    console.error('Erreur lors de la récupération des outils:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { createTool, getAllTools };