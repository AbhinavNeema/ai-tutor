import express from "express";
import multer from "multer";
import { evaluateAnswerSheet, evaluateTypedAnswers } from "../controllers/examController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// scanned PDF/image
router.post("/upload-answer-sheet", upload.single("file"), evaluateAnswerSheet);

// typed answers
router.post("/evaluate", evaluateTypedAnswers);

export default router;