import pool from "../db/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";

// controllers/adminController.ts
export const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const books = await pool.query("SELECT COUNT(*) FROM books");
  const borrowers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'borrower'");
  
  res.status(200).json({
    users: parseInt(users.rows[0].count),
    books: parseInt(books.rows[0].count),
    borrowers: parseInt(borrowers.rows[0].count),
  });
});

export const getRecentUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT first_name, last_name, role, created_at 
     FROM users 
     ORDER BY created_at DESC 
     LIMIT 5`
  );

  const users = result.rows.map((u) => ({
    name: `${u.first_name} ${u.last_name}`,
    role: u.role,
    joined: u.created_at,
  }));

  res.status(200).json({ users });
});
