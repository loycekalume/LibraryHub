import AdminLayout from "../Layouts/adminLayouts";
import { useState, useEffect } from "react";
import { Form, Button, Modal, Pagination } from "react-bootstrap";
import axios from "../utils/axios";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: "admin" | "librarian" | "borrower";
  status: "active" | "inactive";
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [newUser, setNewUser] = useState<Omit<User, "id"> & { password?: string }>({
    name: "",
    email: "",
    phone_number: "",
    role: "borrower",
    status: "active",
    password: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        const mapped = res.data.users.map((user: any) => ({
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
          status: user.status ?? "active",
        }));
        setUsers(mapped);
      } catch (err: any) {
        console.error("Axios error:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const [first_name, ...lastParts] = newUser.name.trim().split(" ");
      const last_name = lastParts.join(" ") || "";

      const res = await axios.post("/auth/register", {
        first_name,
        last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        password: newUser.password || "password123",
        role: newUser.role,
      });

      const created = res.data.user;
      const formatted: User = {
        id: created.user_id,
        name: `${created.first_name} ${created.last_name}`,
        email: created.email,
        phone_number: created.phone_number,
        role: created.role,
        status: "active",
      };

      setUsers(prev => [...prev, formatted]);
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Failed to add user", err);
      alert("Failed to add user.");
    }
  };

  const handleEditUser = (user: User) => {
    setNewUser({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      status: user.status,
    });
    setEditingUserId(user.id);
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUserId) return;

    try {
      const [first_name, ...lastParts] = newUser.name.trim().split(" ");
      const last_name = lastParts.join(" ") || "";

      const payload: any = {
        first_name,
        last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: newUser.role,
      };

      if (newUser.password) payload.password = newUser.password;

      await axios.put(`/users/${editingUserId}`, payload);

      setUsers(prev =>
        prev.map(user =>
          user.id === editingUserId
            ? {
              ...user,
              name: `${first_name} ${last_name}`,
              email: newUser.email,
              phone_number: newUser.phone_number,
              role: newUser.role,
              status: newUser.status,
            }
            : user
        )
      );

      setEditingUserId(null);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Update failed.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch {
        alert("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      phone_number: "",
      role: "borrower",
      status: "active",
      password: "",
    });
    setEditingUserId(null);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">👤 Users</h3>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          ➕ Add User
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by name or role..."
        className="mb-3"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurrentPage(1); 
        }}
        style={{ maxWidth: "400px" }}
      />

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-muted">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-danger text-center">{error}</td></tr>
            ) : paginatedUsers.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-muted">No users found</td></tr>
            ) : (
              paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td className="text-capitalize">{user.role}</td>
                  <td>
                    <span className={`badge bg-${user.status === "active" ? "success" : "secondary"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <Button size="sm" variant="link" className="text-primary me-2" onClick={() => handleEditUser(user)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="link" className="text-danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <Pagination className="mt-3">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
      </div>

      {/* ➕ Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUserId ? "Edit User" : "Add New User"}</Modal.Title>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone_number"
                value={newUser.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            {!editingUserId && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={newUser.password || ""}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
              </Form.Group>
            )}

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
          <Button variant="primary" onClick={editingUserId ? handleUpdateUser : handleAddUser}>
            {editingUserId ? "Update User" : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
