import { Request } from "express";

export interface User {
    user_id: string;
    email: string;
    password?: string; // Optional for security when returning user data
    first_name: string;
    last_name: string;
    phone_number: string; 
    role: "librarian" | "borrower" | "admin";
    status:"active"|"inactive";
    is_active: boolean;
    created_at: string; 
    updated_at?: string; 
  }
  


export interface UserRequest extends Request {
    user?: User;
}
