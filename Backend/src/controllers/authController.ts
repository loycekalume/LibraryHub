import { Request, Response, NextFunction } from "express";
import pool from "../db/db.config";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/helpers/generateToken";
import asyncHandler from "../middlewares/asyncHandler";

// ----------------- REGISTER -----------------
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { first_name, last_name, phone_number, email, password, role } = req.body;

  // 1. Validation
  if (!first_name || !last_name || !email || !phone_number || !password || !role) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  if (!['admin', 'librarian', 'borrower'].includes(role.toLowerCase())) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  // 2. Check if user exists
  const existingUser = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);

  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Insert user
  const insertQuery = `
    INSERT INTO users (email, password, phone_number, first_name, last_name, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING user_id, email, phone_number, first_name, last_name, role
  `;

  const result = await pool.query(insertQuery, [
    email,
    hashedPassword,
    phone_number,
    first_name,
    last_name,
    role,
  ]);

  const user = result.rows[0];

  // 5. Set token in cookie
  const token = await generateToken(res, user.user_id, user.role);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user
  });
});

// ----------------- LOGIN -----------------
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const userQuery = `
    SELECT user_id, email, password, phone_number, first_name, last_name, role
    FROM users WHERE email = $1
  `;
  const result = await pool.query(userQuery, [email]);

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = await generateToken(res, user.user_id, user.role);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      role: user.role,
    },
  });
});

// ----------------- LOGOUT -----------------
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out successfully" });
});
