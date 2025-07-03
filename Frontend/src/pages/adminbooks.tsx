// src/pages/admin/AdminBooks.tsx
import AdminLayout from "../Layouts/adminLayouts";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface Book {
  id: number;
  author: string;
  title: string;
  total: number;
  available: number;
}

export default function AdminBooks() {
  const [search, setSearch] = useState("");
  const [books] = useState<Book[]>([
    { id: 1, author: "James Yaung", title: "1984", total: 20, available: 3 },
    { id: 2, author: "Nicole Akinyi", title: "Milk and Honey", total: 12, available: 8 },
    { id: 3, author: "James Yaung", title: "1984", total: 15, available: 3 },
    { id: 4, author: "Nicole Akinyi", title: "Milk and Honey", total: 10, available: 10 },
    { id: 5, author: "James Yaung", title: "1984", total: 13, available: 3 },
    { id: 6, author: "Nicole Akinyi", title: "Milk and Honey", total: 40, available: 23 },
  ]);

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">📚 Books</h3>
        <Button variant="primary">➕ Add Book</Button>
      </div>

      <Form.Control
        type="text"
        className="mb-3"
        placeholder="🔍 Search books..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: "400px" }}
      />

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Author</th>
              <th>Title</th>
              <th>Total Copies</th>
              <th>Copies Left</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">No books found</td>
              </tr>
            ) : (
              filtered.map(book => (
                <tr key={book.id}>
                  <td>{book.author}</td>
                  <td>{book.title}</td>
                  <td>{book.total}</td>
                  <td>{book.available}</td>
                  <td>
                    <Button size="sm" variant="link" className="text-primary me-2">Edit</Button>
                    <Button size="sm" variant="link" className="text-danger">Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
