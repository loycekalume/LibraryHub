import LibrarianLayout from "../Layouts/librarian";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../utils/axios";

interface Borrower {
  issue_id: number;
  name: string;
  book: string;
  status: "Borrowed" | "Returned";
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
}

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const res = await axios.get("/issue/issued");
      const formatted = res.data.issues.map((item: any) => ({
        issue_id: item.issue_id,
        name: `${item.first_name} ${item.last_name}`,
        book: item.title,
        status: item.status === "Returned" ? "Returned" : "Borrowed",
        borrowDate: item.borrow_date?.split("T")[0],
        dueDate: item.due_date?.split("T")[0],
        returnDate: item.return_date?.split("T")[0] || null,
      }));
      setBorrowers(formatted);
    } catch (err) {
      console.error("Failed to fetch borrowers", err);
    }
  };

  const handleReturnClick = (id: number) => {
    setSelectedIssueId(id);
    setReturnDate(new Date().toISOString().split("T")[0]); // today
    setShowModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!selectedIssueId) return;
    try {
      await axios.patch(`/issue/${selectedIssueId}/return`, {
        return_date: returnDate,
      });
      setShowModal(false);
      setSelectedIssueId(null);
      fetchBorrowers(); // Refresh the UI with updated data
    } catch (err) {
      console.error("Failed to return book", err);
    }
  };

  const filteredBorrowers = borrowers.filter(
    b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.book.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LibrarianLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">👥 Borrowers</h3>
      </div>

      <Form.Control
        type="text"
        className="mb-3"
        placeholder="Search by borrower or book..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Borrower</th>
              <th>Book</th>
              <th>Status</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredBorrowers.map(b => (
                <tr key={b.issue_id}>
                  <td>{b.name}</td>
                  <td>{b.book}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        b.status === "Returned" ? "success" : "warning"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>{b.borrowDate}</td>
                  <td>{b.dueDate}</td>
                  <td>{b.returnDate || "-"}</td>
                  <td>
                    {b.status === "Borrowed" && (
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleReturnClick(b.issue_id)}
                      >
                        Mark Returned
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Return Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Return Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Return Date</Form.Label>
            <Form.Control
              type="date"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReturnSubmit}>
            Submit Return
          </Button>
        </Modal.Footer>
      </Modal>
    </LibrarianLayout>
  );
}
