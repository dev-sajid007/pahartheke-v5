import express from "express";
import { createBadge, getBadges, updateBadge, deleteBadge } from "./badge.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createBadge);
router.get("/", getBadges);
router.put("/:id", updateBadge);
router.delete("/:id", deleteBadge);

export default router;
