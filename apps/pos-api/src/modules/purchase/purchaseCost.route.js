import express from "express";
import {
  createCost,
  getCosts,
  updateCost,
  deleteCost,
} from "./purchaseCost.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleMiddleware("admin", "manager"), createCost);
router.get("/", getCosts);
router.put("/:id", roleMiddleware("admin", "manager"), updateCost);
router.delete("/:id", roleMiddleware("admin", "manager"), deleteCost);

export default router;
