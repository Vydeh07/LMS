import express from "express";
import { purchaseCourse, verifyPayment } from "../controllers/userController.js";

const router = express.Router();

router.post("/purchase", purchaseCourse);
router.post("/verify", verifyPayment);

export default router;
