
import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import pool from "../db/db.config";


export const getBooksSummary = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT 
      b.book_id AS book_id,
      b.title,
      b.author,
      COUNT(c.copy_id) AS total_copies,
      COUNT(CASE WHEN c.is_available = true THEN 1 END) AS available_copies
    FROM books b
    LEFT JOIN book_copies c ON b.book_id = c.book_id
    GROUP BY b.book_id, b.title, b.author
    ORDER BY b.title ASC;
  `);

  res.status(200).json({ books: result.rows });
});
