import LibrarianLayout from "../Layouts/librarian";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Book {
  id: number;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    totalCopies: 0,
    availableCopies: 0,
  });

  // Dummy data for now
  useEffect(() => {
    setBooks([
      {
        id: 1,
        title: "Milk and Honey",
        author: "Rupi Kaur",
        totalCopies: 10,
        availableCopies: 4,
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        totalCopies: 7,
        availableCopies: 2,
      },
    ]);
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      totalCopies: 0,
      availableCopies: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (editingBook) {
      // Update existing book
      setBooks(prev =>
        prev.map(book =>
          book.id === editingBook.id ? { ...editingBook, ...formData } : book
        )
      );
    } else {
      // Add new book
      const newBook: Book = {
        id: Date.now(),
        ...formData,
        totalCopies: Number(formData.totalCopies),
        availableCopies: Number(formData.availableCopies),
      };
      setBooks(prev => [...prev, newBook]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks(prev => prev.filter(book => book.id !== id));
    }
  };

  return (
    <LibrarianLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">📚 Books</h3>
        <Button variant="primary" onClick={openAddModal}>
          ➕ Add Book
        </Button>
      </div>

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Total Copies</th>
              <th>Copies Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.totalCopies}</td>
                  <td>{book.availableCopies}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingBook ? "Edit Book" : "Add Book"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Copies</Form.Label>
              <Form.Control
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Available Copies</Form.Label>
              <Form.Control
                type="number"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingBook ? "Update Book" : "Add Book"}
          </Button>
        </Modal.Footer>
      </Modal>
    </LibrarianLayout>
  );
}
