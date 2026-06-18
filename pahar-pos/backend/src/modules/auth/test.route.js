import express from "express";

import authMiddleware from "../../middleware/authMiddleware.js";

import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/admin-only",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

export default router;
