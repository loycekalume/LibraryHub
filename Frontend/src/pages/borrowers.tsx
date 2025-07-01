import LibrarianLayout from "../Layouts/librarian";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Borrower {
  id: number;
  name: string;
  book: string;
  status: "Borrowed" | "Returned";
  borrowDate: string;
  returnDate: string | null;
}

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([
    {
      id: 1,
      name: "James Yaung",
      book: "1984",
      status: "Borrowed",
      borrowDate: "2025-06-15",
      returnDate: null,
    },
    {
      id: 2,
      name: "Nicole Akinyi",
      book: "Milk and Honey",
      status: "Returned",
      borrowDate: "2025-06-10",
      returnDate: "2025-06-20",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Borrower, "id">>({
    name: "",
    book: "",
    status: "Borrowed",
    borrowDate: "",
    returnDate: null,
  });

  const handleOpenModal = () => {
    setFormData({
      name: "",
      book: "",
      status: "Borrowed",
      borrowDate: "",
      returnDate: null,
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newBorrower: Borrower = {
      id: Date.now(),
      ...formData,
      returnDate: formData.status === "Returned" ? formData.returnDate : null,
    };
    setBorrowers(prev => [...prev, newBorrower]);
    setShowModal(false);
  };

  const filteredBorrowers = borrowers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.book.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LibrarianLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">👥 Borrowers</h3>
        <Button variant="primary" onClick={handleOpenModal}>➕ Add Borrower</Button>
      </div>

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by borrower or book..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Borrower</th>
              <th>Book</th>
              <th>Status</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredBorrowers.map(borrower => (
                <tr key={borrower.id}>
                  <td>{borrower.name}</td>
                  <td>{borrower.book}</td>
                  <td>
                    <span className={`badge bg-${borrower.status === "Borrowed" ? "warning" : "success"}`}>
                      {borrower.status}
                    </span>
                  </td>
                  <td>{borrower.borrowDate}</td>
                  <td>{borrower.returnDate || "-"}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-2">Edit</Button>
                    <Button size="sm" variant="outline-danger">Delete</Button>
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
          <Modal.Title>Add Borrower</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Book</Form.Label>
              <Form.Control
                name="book"
                type="text"
                value={formData.book}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Borrowed">Borrowed</option>
                <option value="Returned">Returned</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Borrow Date</Form.Label>
              <Form.Control
                name="borrowDate"
                type="date"
                value={formData.borrowDate}
                onChange={handleChange}
              />
            </Form.Group>

            {formData.status === "Returned" && (
              <Form.Group className="mb-2">
                <Form.Label>Return Date</Form.Label>
                <Form.Control
                  name="returnDate"
                  type="date"
                  value={formData.returnDate || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Add</Button>
        </Modal.Footer>
      </Modal>
    </LibrarianLayout>
  );
}
