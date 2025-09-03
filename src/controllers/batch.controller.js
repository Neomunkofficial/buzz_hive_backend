import prisma from "../../config/prisma.js";

/**
 * Add a batch to a college
 */
export const addBatch = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { name, year } = req.body;

    const batch = await prisma.batch.create({
      data: {
        name,
        year,
        college_id: parseInt(collegeId),
      },
    });

    res.json(batch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all batches of a college
 */
export const getBatches = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const batches = await prisma.batch.findMany({
      where: { college_id: parseInt(collegeId) },
    });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
