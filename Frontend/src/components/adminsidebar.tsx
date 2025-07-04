// src/components/AdminSidebar.tsx
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div
      className="d-flex flex-column p-3 text-white"
      style={{ width: "250px", backgroundColor: "#9333ea", minHeight: "100vh" }}
    >
      <h5 className="mb-4">🛠 Admin Panel</h5>

      <NavLink
        to="/admindashboard"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/adminbooks"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Books
      </NavLink>

      <NavLink
        to="/adminusers"
        className={({ isActive }) =>
          `nav-link mb-2 ${isActive ? "fw-bold text-white bg-dark rounded px-2 py-1" : "text-white"}`
        }
      >
        Users
      </NavLink>

      <div className="mt-auto">
        <button className="btn btn-outline-light w-100 mt-4">🔓 Log out</button>
      </div>
    </div>
  );
}
