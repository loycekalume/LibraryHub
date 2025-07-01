
import Sidebar from "../components/sidebar";
import type{ ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LibrarianLayout({ children }: Props) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
