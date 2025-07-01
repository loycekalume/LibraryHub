
import LibrarianLayout from "../Layouts/librarian";

export default function LibrarianDashboard() {
  return (
    <LibrarianLayout>
      <h3 className="fw-bold">Welcome Librarian</h3>

      {/* Summary */}
      <div className="card p-3 my-3">
        <h5 className="mb-3">📅 Today’s Summary</h5>
        <div className="d-flex gap-3">
          <div className="border p-3 rounded text-center w-25">
            <p className="mb-0">Total Books</p>
            <h5 className="text-primary">150</h5>
          </div>
          <div className="border p-3 rounded text-center w-25">
            <p className="mb-0">Books Issued</p>
            <h5 className="text-danger">10</h5>
          </div>
          <div className="border p-3 rounded text-center w-25">
            <p className="mb-0">Overdue</p>
            <h5 className="text-danger">3</h5>
          </div>
        </div>
      </div>

      {/* Due Today */}
      <div className="card p-3 mb-3">
        <h6 className="fw-bold mb-3">❗Due today (12)</h6>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>James Yaung</td>
              <td>1984</td>
              <td><button className="btn btn-outline-danger btn-sm">Extend</button></td>
            </tr>
            <tr>
              <td>Nicole Akinyi</td>
              <td>Milk and Honey</td>
              <td><button className="btn btn-outline-danger btn-sm">Extend</button></td>
            </tr>
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
              <th>Overdue Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>James Yaung</td>
              <td>3 days</td>
              <td><button className="btn btn-outline-primary btn-sm">Contact</button></td>
            </tr>
            <tr>
              <td>Nicole Akinyi</td>
              <td>1 day</td>
              <td><button className="btn btn-outline-primary btn-sm">Contact</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </LibrarianLayout>
  );
}
