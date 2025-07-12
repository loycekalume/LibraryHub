import LibrarianLayout from "../Layouts/librarian";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

interface Issue {
  issue_id: number;
  first_name: string;
  last_name: string;
  title: string;
  due_date: string;
  status: string;
  overdue_days?: number;
}

export default function LibrarianDashboard() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [booksIssued, setBooksIssued] = useState(0);
  const [overdueItems, setOverdueItems] = useState<Issue[]>([]);
  const [dueToday, setDueToday] = useState<Issue[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const booksRes = await axios.get("/books");
      setTotalBooks(booksRes.data.books.length);

      const issuesRes = await axios.get("/issue/issued");
      setBooksIssued(issuesRes.data.issues.length);

      const overdueRes = await axios.get("/issue/overdue");
      setOverdueItems(overdueRes.data.overdue);

      const dueTodayRes = await axios.get("/issue/due-today");
      setDueToday(dueTodayRes.data.dueToday);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  return (
    <LibrarianLayout>
      <h3 className="fw-bold">Welcome Librarian</h3>

      {/* Summary */}
      <div className="card p-3 my-3">
        <h5 className="mb-3">📅 Today’s Summary</h5>
        <div className="d-flex gap-3">
          <div className="border p-3 rounded text-center w-25">
            <p className="mb-0">Total Books</p>
            <h5 className="text-primary">{totalBooks}</h5>
          </div>
          <div className="border p-3 rounded text-center w-25">
            <p className="mb-0">Books Issued</p>
            <h5 className="text-danger">{booksIssued}</h5>
          </div>
          <div className="border p-3 rounded text-center w-25">
            <p className="mb-0">Overdue</p>
            <h5 className="text-danger">{overdueItems.length}</h5>
          </div>
        </div>
      </div>

      {/* Due Today */}
      <div className="card p-3 mb-3">
        <h6 className="fw-bold mb-3">❗Due today ({dueToday.length})</h6>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dueToday.length === 0 ? (
              <tr><td colSpan={3} className="text-muted text-center">No books due today</td></tr>
            ) : dueToday.map((i) => (
              <tr key={i.issue_id}>
                <td>{i.first_name} {i.last_name}</td>
                <td>{i.title}</td>
                <td><button className="btn btn-outline-danger btn-sm">Extend</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overdue Items */}
      <div className="card p-3">
        <h6 className="fw-bold mb-3">📣 Overdue items</h6>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Overdue Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {overdueItems.length === 0 ? (
              <tr><td colSpan={4} className="text-muted text-center">No overdue items</td></tr>
            ) : overdueItems.map((i) => (
              <tr key={i.issue_id}>
                <td>{i.first_name} {i.last_name}</td>
                <td>{i.title}</td>
                <td>{i.overdue_days} {i.overdue_days === 1 ? "day" : "days"}</td>
                <td><button className="btn btn-outline-primary btn-sm">Contact</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LibrarianLayout>
  );
}
