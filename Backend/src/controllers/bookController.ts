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

  // 1. Check if book exists
  const existingBookRes = await pool.query("SELECT * FROM books WHERE book_id = $1", [id]);

  if (existingBookRes.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  const existingBook = existingBookRes.rows[0];

  // 2. Update book fields
  const updatedBookRes = await pool.query(
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

  const updatedBook = updatedBookRes.rows[0];

  // 3. Check if total_copies increased
  const currentCopyCountRes = await pool.query(
    "SELECT COUNT(*) FROM book_copies WHERE book_id = $1",
    [id]
  );

  const currentCopyCount = parseInt(currentCopyCountRes.rows[0].count);

  if (total_copies > currentCopyCount) {
    const newCopyQueries = [];

    for (let i = currentCopyCount + 1; i <= total_copies; i++) {
      const copyNumber = `BOOK${id}-COPY${String(i).padStart(3, '0')}`;
      newCopyQueries.push(
        pool.query(
          `INSERT INTO book_copies (book_id, copy_number, is_available)
           VALUES ($1, $2, true)`,
          [id, copyNumber]
        )
      );
    }

    await Promise.all(newCopyQueries);
  }

  res.status(200).json({
    message: "Book updated successfully",
    book: updatedBook,
  });
});


export const deleteBook = asyncHandler(async (req: BookRequest, res: Response) => {
  const { id } = req.params;

  // if (!req.user) {
  //   return res.status(401).json({ message: "Not authorized" });
  // }

  const deleted = await pool.query("DELETE FROM books WHERE book_id = $1 RETURNING *", [id]);

  if (deleted.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json({ message: "Book and its copies deleted successfully" });
});



export const patchBook = asyncHandler(async (req: BookRequest, res: Response) => {
  const { id } = req.params;

  // Check if book exists
  const check = await pool.query("SELECT * FROM books WHERE book_id = $1", [id]);
  if (check.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Define whitelist of fields allowed to update
  const allowedFields = [
    "title",
    "author",
    "description",
    "published_year",
    "pages",
    "image_url",
    "genre",
    "total_copies"
  ];

  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const key in req.body) {
    if (
      allowedFields.includes(key) &&
      req.body[key] !== undefined &&
      req.body[key] !== null
    ) {
      fields.push(`${key} = $${index}`);
      values.push(req.body[key]);
      index++;
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  // Add updated_at field
  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  // Final query
  const query = `
    UPDATE books
    SET ${fields.join(", ")}
    WHERE book_id = $${index}
    RETURNING *;
  `;
  values.push(id);

  const result = await pool.query(query, values);
  res.status(200).json({
    message: "Book updated successfully",
    book: result.rows[0],
  });
});

export const getBooksOverview = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT 
      b.book_id,
      b.title,
      b.author,
       b.genre, 
      b.image_url,
      b.description,
      b.total_copies,
      COUNT(CASE WHEN bc.is_available = true THEN 1 END) AS available_copies
    FROM books b
    LEFT JOIN book_copies bc ON bc.book_id = b.book_id
    GROUP BY b.book_id
    ORDER BY b.title
  `);

  res.status(200).json({ books: result.rows });
});
