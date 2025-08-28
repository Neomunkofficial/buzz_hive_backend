import auth from "../../config/firebase.js";  // default import

// Example test route
import express from "express";
const router = express.Router();

router.get("/test-auth", async (req, res) => {
  try {
    const userList = await auth.listUsers(5); // test Firebase call
    res.json(userList.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
