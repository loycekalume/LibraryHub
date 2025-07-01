import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="d-flex flex-column vh-100 p-3 text-white"
      style={{ width: "250px", backgroundColor: "#9333ea" }}
    >
      <h5 className="mb-4">📚 LibraryHub</h5>

      <NavLink
        to="/librariandashboard"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/books"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Books
      </NavLink>

      <NavLink
        to="/issue"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Book Issue
      </NavLink>

      <NavLink
        to="/borrowers"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Borrowers
      </NavLink>

      <div className="mt-auto">
        <button className="btn btn-outline-light w-100 mt-4">🔓 Logout</button>
      </div>
    </div>
  );
}
