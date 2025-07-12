import express from 'express'


import { getAllBorrows, getOverdueBorrows} from '../controllers/borrowController'

const router = express.Router()



// router.put("/extend/:id",  extendDueDate);
router.get("/overdue",  getOverdueBorrows);
router.get("/",getAllBorrows)




export default router