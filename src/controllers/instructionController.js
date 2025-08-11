const prisma = require('../config/database');

const getAllInstructions = async (req, res) => {
  const { folderId } = req.query;
  try {
    const instructions = await prisma.instruction.findMany({
      where: folderId ? { folderId: parseInt(folderId) } : {},
      include: { steps: { include: { tool: true }, orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    res.json(instructions);
  } catch (error) {
    console.error('Erreur lors de la récupération des instructions:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getInstructionById = async (req, res) => {
  const { id } = req.params;
  try {
    const instruction = await prisma.instruction.findUnique({
      where: { id: parseInt(id) },
      include: {
        steps: {
          include: {
            tool: true, // Inclure les détails de l'outil
          },
          orderBy: { order: 'asc' }, // Trier par ordre
        },
      },
    });
    if (!instruction) {
      return res.status(404).json({ error: 'Instruction non trouvée' });
    }
    console.log('Instruction récupérée avec steps:', instruction); // Ajout pour débogage
    res.json(instruction);
  } catch (error) {
    console.error('Erreur lors de la récupération de l’instruction:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const createInstruction = async (req, res) => {
  const { title, folderId } = req.body;
  if (!title || !folderId) {
    return res.status(400).json({ error: 'Le titre et l’ID du dossier sont requis' });
  }
  try {
    const instructionCount = await prisma.instruction.count({ where: { folderId: parseInt(folderId) } });
    const instruction = await prisma.instruction.create({
      data: {
        title,
        folderId: parseInt(folderId),
        order: instructionCount,
      },
    });
    res.status(201).json(instruction);
  } catch (error) {
    console.error('Erreur lors de la création de l’instruction:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const reorderInstructions = async (req, res) => {
  const { instructions } = req.body;
  try {
    await prisma.$transaction(
      instructions.map((instr) =>
        prisma.instruction.update({
          where: { id: parseInt(instr.id) },
          data: { order: instr.order },
        })
      )
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la réorganisation des instructions:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { getAllInstructions, getInstructionById, createInstruction, reorderInstructions };