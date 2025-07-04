import AdminLayout from "../Layouts/adminLayouts";
import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  role: "admin" | "librarian" | "borrower";
  status: "active" | "inactive";
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice Mwangi", role: "librarian", status: "active" },
    { id: 2, name: "James Yaung", role: "borrower", status: "inactive" },
    { id: 3, name: "Nicole Akinyi", role: "admin", status: "active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    role: "borrower",
    status: "active",
  });

  // ✅ Updated handler type
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    const created: User = {
      id: Date.now(),
      ...newUser,
    };
    setUsers(prev => [...prev, created]);
    setNewUser({ name: "", role: "borrower", status: "active" });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">👤 Users</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          ➕ Add User
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by name or role..."
        className="mb-3"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: "400px" }}
      />

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td className="text-capitalize">{user.role}</td>
                  <td>
                    <span className={`badge bg-${user.status === "active" ? "success" : "secondary"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <Button size="sm" variant="link" className="text-primary me-2">Edit</Button>
                    <Button size="sm" variant="link" className="text-danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ➕ Add User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={newUser.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="librarian">Librarian</option>
                <option value="borrower">Borrower</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={newUser.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
