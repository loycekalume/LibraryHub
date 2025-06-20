import express from 'express'

import { deleteUser, getAllUsers, getSingleUser, updateUser } from '../controllers/userController'

const router = express.Router()

//public routes 
router.get("/", getAllUsers)
router.get("/:id", getSingleUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)




export default router