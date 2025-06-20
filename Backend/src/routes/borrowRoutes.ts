import express from 'express'


import { extendDueDate, getAllBorrows, getOverdueBorrows, issueBook, returnBook } from '../controllers/borrowController'

const router = express.Router()


router.post("/issue", issueBook)
router.put("/return/:id",  returnBook);
router.put("/extend/:id",  extendDueDate);
router.get("/overdue",  getOverdueBorrows);
router.get("/",getAllBorrows)




export default router