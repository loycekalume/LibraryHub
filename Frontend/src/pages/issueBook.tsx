// src/pages/librarian/IssueBook.tsx
import LibrarianLayout from "../Layouts/librarian";
import { useState, useEffect } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import axios from "../utils/axios";

interface Borrower {
  user_id: number;
  name: string;
}

interface BookCopy {
  copy_id: number;
  book_id: number;
  title: string;
  copy_number: string;
  is_available: boolean;
}

export default function IssueBook() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [bookCopies, setBookCopies] = useState<BookCopy[]>([]);
  const [borrowerId, setBorrowerId] = useState("");
  const [selectedCopyId, setSelectedCopyId] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch borrowers and book copies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const borrowerRes = await axios.get("/users");
        const borrowersList = borrowerRes.data.users
          .filter((user: any) => user.role === "borrower")
          .map((user: any) => ({
            user_id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
          }));

        const copyRes = await axios.get("/bookCopies");
        const availableCopies = copyRes.data.copies.filter((c: any) => c.is_available);

        setBorrowers(borrowersList);
        setBookCopies(availableCopies);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerId || !selectedCopyId || !dueDate || !borrowDate) {
      alert("Please fill in all fields.");
      return;
    }

    const selectedCopy = bookCopies.find(copy => copy.copy_id === parseInt(selectedCopyId));
    if (!selectedCopy) {
      alert("Invalid book copy selected.");
      return;
    }

    try {
      await axios.post("/issue", {
        user_id: parseInt(borrowerId),
        book_id: selectedCopy.book_id,
        copy_id: selectedCopy.copy_id,
        borrow_date: borrowDate,
        due_date: dueDate,
      });

      alert("Book issued successfully!");
    
      setBorrowerId("");
      setSelectedCopyId("");
      setBorrowDate("");
      setDueDate("");
    } catch (err) {
      console.error("Failed to issue book", err);
      alert("Something went wrong issuing the book.");
    }
  };

  return (
    <LibrarianLayout>
      <h3 className="fw-bold mb-4">📖 Issue Book</h3>

      <Card className="p-4 shadow-sm" style={{ maxWidth: "600px" }}>
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
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
                  <option key={b.user_id} value={b.user_id}>
                    {b.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Book Copy Select */}
            <Form.Group className="mb-3">
              <Form.Label>Available Book Copy</Form.Label>
              <Form.Select
                value={selectedCopyId}
                onChange={e => setSelectedCopyId(e.target.value)}
                required
              >
                <option value="">-- Select Book Copy --</option>
                {bookCopies.map(copy => (
                  <option key={copy.copy_id} value={copy.copy_id}>
                    {copy.title} - {copy.copy_number}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Borrow Date */}
            <Form.Group className="mb-3">
              <Form.Label>Borrow Date</Form.Label>
              <Form.Control
                type="date"
                value={borrowDate}
                onChange={e => setBorrowDate(e.target.value)}
                required
              />
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
        )}
      </Card>
    </LibrarianLayout>
  );
}
