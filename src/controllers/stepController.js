const prisma = require("../config/database");

const createStep = async (req, res) => {
  const { instructionId, action, component, location, toolId, details, objective } = req.body;

  if (!instructionId || !action) {
    return res.status(400).json({ error: "instructionId and action are required" });
  }

  try {
    const instruction = await prisma.instruction.findUnique({
      where: { id: parseInt(instructionId) },
    });
    if (!instruction) {
      console.log(`Instruction with ID ${instructionId} not found`);
      return res.status(404).json({ error: "Instruction not found" });
    }
    const stepCount = await prisma.step.count({ where: { instructionId: parseInt(instructionId) } });
    const step = await prisma.step.create({
      data: {
        instructionId: parseInt(instructionId),
        action,
        component: component || null,
        location: location || null,
        toolId: toolId ? parseInt(toolId) : null,
        details: details || null,
        objective: objective || null,
        media: null,
        order: stepCount,
      },
      include: { tool: true },
    });
    console.log("Step created successfully:", {
      id: step.id,
      instructionId: step.instructionId,
      action: step.action,
    });
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(step);
  } catch (error) {
    console.error("Error creating step:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStepById = async (req, res) => {
  const { id } = req.params;
  console.log(`[DEBUG] Attempting to fetch step with ID: ${id}, type: ${typeof id}, parsed: ${parseInt(id)}`);
  try {
    const step = await prisma.step.findUnique({
      where: { id: parseInt(id) },
      include: { tool: true },
    });
    if (!step) {
      console.log(`[DEBUG] Step with ID ${id} not found in database. Checking all steps...`);
      const allSteps = await prisma.step.findMany();
      console.log("[DEBUG] All steps in database:", allSteps);
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Step not found" });
    }
    console.log(`[DEBUG] Step found:`, step);
    res.setHeader("Content-Type", "application/json");
    res.json(step);
  } catch (error) {
    console.error("[DEBUG] Error fetching step:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateStep = async (req, res) => {
  const { id } = req.params;
  const { action, component, location, toolId, details, objective } = req.body;
  const media = req.file ? `/uploads/${req.file.filename}` : req.body.media;

  try {
    const step = await prisma.step.findUnique({
      where: { id: parseInt(id) },
    });
    if (!step) {
      console.log(`Step with ID ${id} not found for update`);
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Step not found" });
    }
    const updatedStep = await prisma.step.update({
      where: { id: parseInt(id) },
      data: {
        action: action || step.action,
        component: component || step.component,
        location: location || step.location,
        toolId: toolId ? parseInt(toolId) : step.toolId,
        details: details || step.details,
        objective: objective || step.objective,
        media: media || step.media,
      },
      include: { tool: true },
    });
    console.log("Step updated:", { id: updatedStep.id, media: updatedStep.media });
    res.setHeader("Content-Type", "application/json");
    res.json(updatedStep);
  } catch (error) {
    console.error("Error updating step:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Internal server error" });
  }
};

const reorderSteps = async (req, res) => {
  const { steps } = req.body;
  try {
    await prisma.$transaction(
      steps.map((step) =>
        prisma.step.update({
          where: { id: parseInt(step.id) },
          data: { order: step.order },
        })
      )
    );
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating step order:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createStep, getStepById, updateStep, reorderSteps };