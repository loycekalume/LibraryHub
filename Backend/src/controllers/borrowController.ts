import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import pool from "../db/db.config";

// =========================
// 1. ISSUE A BOOK
// =========================




// =========================
// 3. EXTEND DUE DATE
// =========================
export const extendDueDate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // borrow_id
  const { new_due_date } = req.body;

  if (!new_due_date) {
    return res.status(400).json({ message: "Please provide new_due_date" });
  }

  const borrow = await pool.query(`SELECT * FROM borrows WHERE borrow_id = $1`, [id]);

  if (borrow.rows.length === 0) {
    return res.status(404).json({ message: "Borrow record not found" });
  }

  if (borrow.rows[0].status !== "borrowed") {
    return res.status(400).json({ message: "Cannot extend. Book is already returned or overdue." });
  }

  await pool.query(
    `UPDATE borrows SET due_date = $1 WHERE borrow_id = $2`,
    [new_due_date, id]
  );

  res.status(200).json({ message: "Due date extended successfully" });
});

// =========================
// 4. GET OVERDUE RECORDS
// =========================
export const getOverdueBorrows = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT b.borrow_id, u.email, u.first_name, u.last_name,
            bc.copy_number, bk.title, b.due_date
     FROM borrows b
     JOIN users u ON b.user_id = u.user_id
     JOIN book_copies bc ON b.copy_id = bc.copy_id
     JOIN books bk ON bc.book_id = bk.book_id
     WHERE b.due_date < CURRENT_DATE AND b.status = 'borrowed'`
  );

  res.status(200).json({ overdue: result.rows });
});


// controllers/borrowController.ts

export const getAllBorrows = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT 
      b.borrow_id,
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      bk.title,
      bc.copy_number,
      b.status,
      b.due_date,
      b.return_date,
      b.borrow_date
    FROM borrows b
    JOIN users u ON b.user_id = u.user_id
    JOIN book_copies bc ON b.copy_id = bc.copy_id
    JOIN books bk ON bc.book_id = bk.book_id
    ORDER BY b.borrow_date DESC;
  `);

  res.status(200).json({ borrows: result.rows });
});
