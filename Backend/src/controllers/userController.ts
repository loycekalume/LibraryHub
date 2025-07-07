import { Request, Response } from "express";
import pool from "../db/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import bcrypt from "bcrypt";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, password, role,status } = req.body;

    const checkUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Check if email is already used by another user
    const existingEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND user_id != $2",
      [email, id]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let hashedPassword = checkUser.rows[0].password;

    // Hash new password only if it's provided
    if (password && password.trim() !== "") {
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
           status =$7,
           updated_at = NOW()
       WHERE user_id = $8
       RETURNING user_id, first_name, last_name, email, phone_number, role, status`,
      [first_name, last_name, email, phone_number, hashedPassword, role, status,id]
    );

    res.json({
      message: "User updated successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT user_id, first_name, last_name, email, phone_number, role,status created_at
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
    `SELECT user_id, first_name, last_name, email, phone_number, role,status, created_at
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


  export const patchUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;

  const checkUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
  if (checkUser.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const currentUser = checkUser.rows[0];

  const {
    first_name = currentUser.first_name,
    last_name = currentUser.last_name,
    email = currentUser.email,
    phone_number = currentUser.phone_number,
    password,
    role = currentUser.role,
    status = currentUser.status
   
  } = fields;

  let hashedPassword = currentUser.password;
  if (password && password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const result = await pool.query(
    `UPDATE users SET
      first_name = $1,
      last_name = $2,
      email = $3,
      phone_number = $4,
      password = $5,
      role = $6,
      status =$7,
      updated_at = NOW()
    WHERE user_id = $8
    RETURNING user_id, first_name, last_name, email, phone_number, role,status`,
    [first_name, last_name, email, phone_number, hashedPassword, role,status, id]
  );

  res.status(200).json({ message: "User updated", user: result.rows[0] });
});
