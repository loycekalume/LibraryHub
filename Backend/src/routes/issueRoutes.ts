// routes/issue.ts
import express from "express";
import { extendDueDate, getDueToday, getIssuedBooks, getMyBooks, getOverdueBooks, issueBook, returnBook } from "../controllers/issueController"

const router = express.Router();

router.post("/", issueBook); // Issue a book
router.patch("/:issue_id/return", returnBook); // Return a book
router.get("/issued", getIssuedBooks); 
router.patch('/:issue_id/extend', extendDueDate);
router.get("/overdue", getOverdueBooks);
router.get("/due-today", getDueToday);
router.get("/mybooks", getMyBooks);



export default router;
