// src/layouts/AdminLayout.tsx
import type { ReactNode } from "react";
import AdminSidebar from "../components/adminsidebar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
