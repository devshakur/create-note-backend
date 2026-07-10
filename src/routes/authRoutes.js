import express from "express";
import authController from "../controllers/authController.js";
import { validateMiddleware } from "../middlewares/validateMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many auth attempts, try again later" },
});

router.post("/register", authLimiter, validateMiddleware(registerSchema), authController.register);
router.post("/login", authLimiter, validateMiddleware(loginSchema), authController.login);
router.post("/logout", authController.logout);

export default router;
