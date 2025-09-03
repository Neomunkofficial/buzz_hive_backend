import prisma from "../../config/prisma.js";

/**
 * Get all interests
 */
export const getAllInterests = async (req, res) => {
  try {
    const interests = await prisma.interests.findMany({
      orderBy: { name: "asc" },
    });
    res.json(interests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add interest(s) to a user
 */
export const addUserInterests = async (req, res) => {
  try {
    const { userId } = req.params;
    const { interestIds } = req.body; // array of interest IDs

    if (!Array.isArray(interestIds) || interestIds.length === 0) {
      return res.status(400).json({ error: "interestIds must be a non-empty array" });
    }

    const data = interestIds.map((id) => ({
      user_id: parseInt(userId),
      interest_id: id,
    }));

    await prisma.user_interests.createMany({
      data,
      skipDuplicates: true, // prevents duplicates
    });

    res.json({ message: "Interests added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Remove an interest from a user
 */
export const removeUserInterest = async (req, res) => {
  try {
    const { userId, interestId } = req.params;

    await prisma.user_interests.delete({
      where: {
        user_id_interest_id: {
          user_id: parseInt(userId),
          interest_id: parseInt(interestId),
        },
      },
    });

    res.json({ message: "Interest removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
