// routes/issue.ts
import express from "express";
import { issueBook, returnBook } from "../controllers/issueController"

const router = express.Router();

router.post("/", issueBook); // Issue a book
router.patch("/:issue_id/return", returnBook); // Return a book

export default router;
