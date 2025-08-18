import express from 'express'


import { createBook, deleteBook, getBookById, getBooks, getBooksOverview, patchBook, updateBook } from '../controllers/bookController'

const router = express.Router()

router.post("/", createBook)
router.get("/", getBooks)
router.get("/overview", getBooksOverview);
router.get("/:id", getBookById)
router.put("/:id", updateBook)
router.delete("/:id", deleteBook)
router.patch("/:id", patchBook);
router.get("/overview", getBooksOverview);





export default router