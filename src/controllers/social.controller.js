// src/controllers/social.controller.js
import prisma from "../../config/prisma.js";

export const updateSocialLinks = async (req, res) => {
  try {
    const userId = req.user.user_id; // from auth middleware
    const { socials, show_social_on_profile } = req.body;

    if (!socials) {
      return res.status(400).json({ error: "No socials provided" });
    }

    // Clear existing socials
    await prisma.socialLink.deleteMany({ where: { user_id: userId } });

    // Insert new socials
    const entries = Object.entries(socials).map(([platform, url]) => ({
      user_id: userId,
      type: platform.toUpperCase(),
      url,
    }));

    await prisma.socialLink.createMany({ data: entries });

    // Optionally update user profile toggle
    await prisma.user.update({
      where: { user_id: userId },
      data: { is_social_visible: show_social_on_profile ?? true },
    });

    res.json({ message: "✅ Social links updated", socials });
  } catch (err) {
    console.error("❌ Error updating socials:", err);
    res.status(500).json({ error: "Failed to update socials" });
  }
};
