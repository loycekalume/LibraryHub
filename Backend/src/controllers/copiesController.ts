// controllers/bookCopyController.ts
import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import pool from "../db/db.config";

export const getBookCopiesByBookId = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // book_id

  const result = await pool.query(
    `SELECT copy_id, copy_number, is_available, created_at
     FROM book_copies
     WHERE book_id = $1
     ORDER BY copy_number ASC`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "No copies found for this book" });
  }

  res.status(200).json({ copies: result.rows });
});


export const getAllBookCopies = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT bc.copy_id, bc.book_id, b.title, bc.copy_number, bc.is_available, bc.created_at
    FROM book_copies bc
    JOIN books b ON bc.book_id = b.book_id
    ORDER BY b.title ASC, bc.copy_number ASC
  `);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "No book copies found" });
  }

  res.status(200).json({ copies: result.rows });
});
