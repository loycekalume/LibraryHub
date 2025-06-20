import { Request, Response } from "express";
import pool from "../db/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import bcrypt from "bcrypt";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, password, role } = req.body;

    const checkUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (checkUser.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    let hashedPassword = checkUser.rows[0].password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const result = await pool.query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           email = $3,
           phone_number = $4,
           password = $5,
           role = $6,
           updated_at = NOW()
       WHERE user_id = $7
       RETURNING user_id, first_name, last_name, email, phone_number, role`,
      [first_name, last_name, email, phone_number, hashedPassword, role, id]
    );

    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT user_id, first_name, last_name, email, phone_number, role, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  res.status(200).json({
    message: "Users retrieved successfully",
    users: result.rows,
  });
});



export const getSingleUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT user_id, first_name, last_name, email, phone_number, role, created_at
     FROM users WHERE user_id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User retrieved successfully",
    user: result.rows[0],
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
  
    const check = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
  
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
  
    res.status(200).json({ message: "User deleted successfully" });
  });