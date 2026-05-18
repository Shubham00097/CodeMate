import express from "express";
import protect from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";

const router = express.Router();

router.get("/:id", protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("users", "name email")
      .populate("problem");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Security: Check if current authenticated user belongs to this session
    const isMember = session.users.some(
      (user) => user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not authorized to access this session room." });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Server error retrieving session details" });
  }
});

export default router;
