import express from "express";
import { ssoLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/sso", ssoLogin);

export default router;