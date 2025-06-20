import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import pool from '../db/db.config';
import { BookRequest } from '../utils/types/bookType';


export const getBooks = asyncHandler(async (req: BookRequest, res: Response) => {
  const result = await pool.query("SELECT * FROM books ORDER BY title ASC");
  res.status(200).json({ books: result.rows });
});


export const getBookById = asyncHandler(async (req: BookRequest, res: Response) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM books WHERE book_id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(result.rows[0]);
});


export const createBook = asyncHandler(async (req: BookRequest, res: Response) => {
  const {
    title,
    author,
    published_year,
    pages,
    image_url,
    genre,
    total_copies,
    description,
  } = req.body;

  if (!title || !author || total_copies == null || !description) {
    return res.status(400).json({
      message: "Missing required fields: title, author, total_copies, description",
    });
  }

  
  const bookResult = await pool.query(
    `INSERT INTO books 
     (title, author, published_year, pages, image_url, genre, total_copies, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [title, author, published_year, pages, image_url, genre, total_copies, description]
  );

  const book = bookResult.rows[0];
  const bookId = book.book_id;

 
  const copyQueries = [];

  for (let i = 1; i <= total_copies; i++) {
    const copyNumber = `BOOK${bookId}-COPY${String(i).padStart(3, '0')}`;
    copyQueries.push(pool.query(
      `INSERT INTO book_copies (book_id, copy_number, is_available)
       VALUES ($1, $2, true)`,
      [bookId, copyNumber]
    ));
  }

  await Promise.all(copyQueries);

  res.status(201).json({
    message: "Book created and copies generated",
    book,
  });
});


export const updateBook = asyncHandler(async (req: BookRequest, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const {
    title,
    author,
    published_year,
    pages,
    image_url,
    genre,
    total_copies,
    description,
  } = req.body;

  const existingBook = await pool.query("SELECT * FROM books WHERE book_id = $1", [id]);

  if (existingBook.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  const updatedBook = await pool.query(
    `UPDATE books SET
      title = $1,
      author = $2,
      published_year = $3,
      pages = $4,
      image_url = $5,
      genre = $6,
      total_copies = $7,
      description = $8,
      updated_at = CURRENT_TIMESTAMP
     WHERE book_id = $9
     RETURNING *`,
    [title, author, published_year, pages, image_url, genre, total_copies, description, id]
  );

  res.status(200).json(updatedBook.rows[0]);
});


export const deleteBook = asyncHandler(async (req: BookRequest, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const deleted = await pool.query("DELETE FROM books WHERE book_id = $1 RETURNING *", [id]);

  if (deleted.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json({ message: "Book and its copies deleted successfully" });
});
