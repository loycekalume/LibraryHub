import express from 'express'
import { getAdminStats, getRecentUsers } from "../controllers/adminController";

const router = express.Router();
router.get("/stats", getAdminStats);
router.get("/recent-users", getRecentUsers);
export default router;
