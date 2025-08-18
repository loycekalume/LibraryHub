import AdminLayout from "../Layouts/adminLayouts";
import { Card, Row, Col, Table, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

interface Stats {
  users: number;
  books: number;
  borrowers: number;
}

interface RecentUser {
  name: string;
  role: string;
  joined: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, books: 0, borrowers: 0 });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get("/admin/stats"),
          axios.get("/admin/recent-users"),
        ]);

        setStats(statsRes.data);
        setRecentUsers(usersRes.data.users);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </AdminLayout>
    );
  }

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
                    <td>{new Date(user.joined).toLocaleDateString()}</td>
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
