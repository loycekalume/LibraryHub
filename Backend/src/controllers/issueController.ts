// controllers/issueController.ts
import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import pool from "../db/db.config";

export const issueBook = asyncHandler(async (req: Request, res: Response) => {
  const { user_id, book_id, copy_id, borrow_date, due_date } = req.body;

  // Basic validation
  if (!user_id || !book_id || !copy_id || !borrow_date || !due_date) {
    return res.status(400).json({ message: "Missing required fields: user_id, book_id, copy_id, borrow_date, due_date" });
  }

  // Check if the copy is available
  const copyCheck = await pool.query(
    "SELECT is_available FROM book_copies WHERE copy_id = $1",
    [copy_id]
  );

  if (copyCheck.rows.length === 0) {
    return res.status(404).json({ message: "Book copy not found" });
  }

  if (!copyCheck.rows[0].is_available) {
    return res.status(400).json({ message: "Book copy is already issued" });
  }

  // Mark the copy as unavailable
  await pool.query("UPDATE book_copies SET is_available = false WHERE copy_id = $1", [copy_id]);

  // Insert into issued_books
  const result = await pool.query(
    `INSERT INTO issued_books (user_id, book_id, copy_id, borrow_date, due_date, status)
     VALUES ($1, $2, $3, $4, $5, 'Borrowed')
     RETURNING *`,
    [user_id, book_id, copy_id, borrow_date, due_date]
  );

  res.status(201).json({ message: "Book issued successfully", issued: result.rows[0] });
});





export const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const { issue_id } = req.params;
  const { return_date } = req.body;

  // 1. Find the issued book
  const issued = await pool.query(
    `SELECT * FROM issued_books WHERE issue_id = $1`,
    [issue_id]
  );

  if (issued.rows.length === 0) {
    return res.status(404).json({ message: "Issued record not found" });
  }

  const copy_id = issued.rows[0].copy_id;

  // 2. Update issued_books (set return_date and status)
  await pool.query(
    `UPDATE issued_books 
     SET return_date = $1, status = 'Returned' 
     WHERE issue_id = $2`,
    [return_date || new Date(), issue_id]
  );

  // 3. Update book_copies to make it available again
  await pool.query(
    `UPDATE book_copies 
     SET is_available = true 
     WHERE copy_id = $1`,
    [copy_id]
  );

  res.status(200).json({ message: "Book returned successfully" });
});


export const getIssuedBooks = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT 
      i.issue_id,
      u.user_id,
      u.first_name,
      u.last_name,
      b.title,
      c.copy_number,
      i.status,
      i.borrow_date,
      i.due_date,
      i.return_date
    FROM issued_books i
    JOIN users u ON i.user_id = u.user_id
    JOIN book_copies c ON i.copy_id = c.copy_id
    JOIN books b ON c.book_id = b.book_id
    ORDER BY i.borrow_date DESC
  `);

  res.status(200).json({ issues: result.rows });
});
