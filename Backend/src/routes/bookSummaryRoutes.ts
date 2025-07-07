import express from 'express'

const router = express.Router()

import { getBooksSummary } from "../controllers/bookSummaryController";

export default router.get("/", getBooksSummary); 
