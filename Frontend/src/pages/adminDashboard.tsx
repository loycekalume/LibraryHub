import AdminLayout from "../Layouts/adminLayouts";
import { Card, Row, Col, Table } from "react-bootstrap";

export default function AdminDashboard() {
  // Fake counts
  const stats = {
    users: 24,
    books: 67,
    borrowers: 15,
  };

  const recentUsers = [
    { name: "James Yaung", role: "librarian", joined: "2025-06-20" },
    { name: "Nicole Akinyi", role: "borrower", joined: "2025-06-19" },
    { name: "Alice Mwangi", role: "admin", joined: "2025-06-15" },
  ];

  return (
    <AdminLayout>
      <div>
        <h3 className="fw-bold mb-4">📊 Welcome, Admin</h3>

        {/* Stats */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm text-center border-0 bg-light">
              <Card.Body>
                <h6>Total Users</h6>
                <h2 className="text-primary fw-bold">{stats.users}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm text-center border-0 bg-light">
              <Card.Body>
                <h6>Total Books</h6>
                <h2 className="text-success fw-bold">{stats.books}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm text-center border-0 bg-light">
              <Card.Body>
                <h6>Total Borrowers</h6>
                <h2 className="text-danger fw-bold">{stats.borrowers}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <Card.Header className="fw-semibold bg-white">🕒 Recent Users</Card.Header>
          <Card.Body className="p-0">
            <Table className="mb-0" responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td className="text-capitalize">{user.role}</td>
                    <td>{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
}
