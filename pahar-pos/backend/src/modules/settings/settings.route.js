import express from "express";
import { getSettings, updateSettings } from "./settings.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import upload, { cloudinaryUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSettings);
router.put("/", upload.single("logo"), cloudinaryUpload, updateSettings);

export default router;
