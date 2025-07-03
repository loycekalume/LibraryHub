import LibrarianLayout from "../Layouts/librarian";
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export default function IssueBook() {
  const [borrowerId, setBorrowerId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Simulated data (can later come from backend)
  const borrowers = [
    { id: "1", name: "James Yaung" },
    { id: "2", name: "Nicole Akinyi" },
  ];

  const books = [
    { id: "1", title: "1984" },
    { id: "2", title: "Milk and Honey" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerId || !bookId || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Issue Book Data:", {
      borrowerId,
      bookId,
      dueDate,
    });

    alert("Book issued successfully!");
    // 🔗 Add Axios POST request here to your backend
  };

  return (
    <LibrarianLayout>
      <h3 className="fw-bold mb-4">📖 Issue Book</h3>

      <Card className="p-4 shadow-sm" style={{ maxWidth: "600px" }}>
        <Form onSubmit={handleSubmit}>
          {/* Borrower Select */}
          <Form.Group className="mb-3">
            <Form.Label>Borrower</Form.Label>
            <Form.Select
              value={borrowerId}
              onChange={e => setBorrowerId(e.target.value)}
              required
            >
              <option value="">-- Select Borrower --</option>
              {borrowers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Book Select */}
          <Form.Group className="mb-3">
            <Form.Label>Book</Form.Label>
            <Form.Select
              value={bookId}
              onChange={e => setBookId(e.target.value)}
              required
            >
              <option value="">-- Select Book --</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Due Date */}
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Issue Book
          </Button>
        </Form>
      </Card>
    </LibrarianLayout>
  );
}
