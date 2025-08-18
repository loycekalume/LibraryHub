import LibrarianLayout from "../Layouts/librarian";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "../utils/axios";

interface Book {
  book_id: number;
  title: string;
  author: string;
  total_copies: number;
  available_copies: number;
  description?: string;
  published_year?: number;
  pages?: number;
  image_url?: string;
  genre?: string;
}

export default function LibrarianBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<Book, "book_id" | "available_copies">>({
    title: "",
    author: "",
    total_copies: 1,
    description: "",
    published_year: undefined,
    pages: undefined,
    image_url: "",
    genre: ""
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/summary");
      const parsedBooks = res.data.books.map((b: any) => ({
        ...b,
        total_copies: parseInt(b.total_copies),
        available_copies: parseInt(b.available_copies)
      }));
      setBooks(parsedBooks);
    } catch (err) {
      console.error("Failed to fetch books", err);
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "total_copies" ? parseInt(value) : value
    }));
  };

  const handleAddOrUpdate = async () => {
    try {
      if (editingId) {
        await axios.patch(`/books/${editingId}`, formData);
      } else {
        await axios.post("/books", formData);
      }
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchBooks();
    } catch (err) {
      console.error("Failed to save book", err);
      alert("Failed to save book. Check inputs and try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book", err);
      alert("Failed to delete book");
    }
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.book_id);
    setFormData({
      title: book.title,
      author: book.author,
      total_copies: book.total_copies,
      description: book.description || "",
      published_year: book.published_year,
      pages: book.pages,
      image_url: book.image_url || "",
      genre: book.genre || ""
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      total_copies: 1,
      description: "",
      published_year: undefined,
      pages: undefined,
      image_url: "",
      genre: ""
    });
  };

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LibrarianLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">📚 Books</h3>
        <Button variant="primary" onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}>
          ➕ Add Book
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="🔍 Search books by title or author..."
        className="mb-3"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: "400px" }}
      />

      <div className="card p-3 shadow-sm">
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <div className="text-danger text-center">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-muted text-center">No books found</div>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Total</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(book => (
                <tr key={book.book_id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.total_copies}</td>
                  <td>{book.available_copies}</td>
                  <td>
                    <Button variant="link" size="sm" className="text-primary me-2" onClick={() => handleEdit(book)}>
                      Edit
                    </Button>
                    <Button variant="link" size="sm" className="text-danger" onClick={() => handleDelete(book.book_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit Book */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Book" : "Add Book"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Author</Form.Label>
              <Form.Control name="author" value={formData.author} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Copies</Form.Label>
              <Form.Control type="number" name="total_copies" value={formData.total_copies} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={formData.description} onChange={handleChange} as="textarea" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Genre</Form.Label>
              <Form.Control name="genre" value={formData.genre || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Published Year</Form.Label>
              <Form.Control name="published_year" value={formData.published_year || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Pages</Form.Label>
              <Form.Control name="pages" value={formData.pages || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image URL</Form.Label>
              <Form.Control name="image_url" value={formData.image_url || ""} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddOrUpdate}>
            {editingId ? "Update Book" : "Add Book"}
          </Button>
        </Modal.Footer>
      </Modal>
    </LibrarianLayout>
  );
}
