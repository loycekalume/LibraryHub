import express from 'express'


import { createBook, deleteBook, getBookById, getBooks, patchBook, updateBook } from '../controllers/bookController'

const router = express.Router()

router.post("/", createBook)
router.get("/", getBooks)
router.get("/:id", getBookById)
router.put("/:id", updateBook)
router.delete("/:id", deleteBook)
router.patch('/books/:id', patchBook);




export default router