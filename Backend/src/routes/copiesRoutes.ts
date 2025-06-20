import express from "express";
import { getAllBookCopies, getBookCopiesByBookId } from "../controllers/copiesController";


const router = express.Router();

router.get("/:id/copies", getBookCopiesByBookId); 
router.get("/", getAllBookCopies);           

export default router;
