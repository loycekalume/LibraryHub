import { useEffect, useState } from "react";
import axios from "../utils/axios";

interface Issue {
  issue_id: number;
  title: string;
  author: string;
  image_url: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "Borrowed" | "Returned";
}

type BookCategory = "all" | "borrowed" | "overdue" | "due-soon";

export default function MyBooksPage() {
  const [userBooks, setUserBooks] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookCategory>("all");

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get("/issues/mybooks");
        setUserBooks(res.data.issues || []);
      } catch (err) {
        console.error("Failed to load user books", err);
      }
    };

    fetchMyBooks();
  }, []);

  const getStatus = (book: Issue) => {
    if (book.status === "Returned") return "normal";

    const today = new Date();
    const due = new Date(book.due_date);

    if (due < today) return "overdue";

    const daysLeft = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 2 ? "due" : "normal";
  };

  const filteredBooks = userBooks.filter((book) => {
    const status = getStatus(book);
    const category =
      status === "overdue"
        ? "overdue"
        : status === "due"
        ? "due-soon"
        : "borrowed";

    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && category === activeFilter;
  });

  const getStatusBadge = (status: "normal" | "overdue" | "due") => {
    return {
      normal: { class: "bg-success", text: "Returned / OK" },
      due: { class: "bg-warning text-dark", text: "Due Soon" },
      overdue: { class: "bg-danger", text: "Overdue" },
    }[status];
  };

  const handleReturn = async (issueId: number) => {
    try {
      await axios.patch(`/issues/return/${issueId}`, {
        return_date: new Date().toISOString(),
      });

      // ✅ Refresh from backend instead of faking status
      const res = await axios.get("/issues/mybooks");
      setUserBooks(res.data.issues || []);
    } catch (err) {
      console.error("Failed to return book", err);
    }
  };

  const counts = {
    all: userBooks.length,
    borrowed: filteredBooks.filter((b) => getStatus(b) === "normal").length,
    overdue: filteredBooks.filter((b) => getStatus(b) === "overdue").length,
    "due-soon": filteredBooks.filter((b) => getStatus(b) === "due").length,
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📘 My Borrowed Books</h2>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {(Object.keys(counts) as BookCategory[]).map((filter) => (
          <button
            key={filter}
            className={`btn btn-sm px-4 py-2 rounded-pill ${
              filter === activeFilter ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.replace("-", " ").toUpperCase()} ({counts[filter]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search my books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Book Grid */}
      <div className="row g-4">
        {filteredBooks.map((book) => {
          const status = getStatus(book);
          const badge = getStatusBadge(status);

          return (
            <div key={book.issue_id} className="col-md-4 col-lg-3">
              <div className="card shadow-sm h-100">
                <img
                  src={book.image_url || "/book-placeholder.jpg"}
                  className="card-img-top"
                  alt={book.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{book.title}</h6>
                  <p className="text-muted small mb-1">by {book.author}</p>
                  <p className="text-muted small">
                    Due: {new Date(book.due_date).toLocaleDateString()}
                  </p>
                  <span className={`badge ${badge.class} mb-2 w-50`}>
                    {badge.text}
                  </span>
                  {status !== "normal" && book.status === "Borrowed" && (
                    <button
                      className="btn btn-sm btn-outline-primary mt-auto"
                      onClick={() => handleReturn(book.issue_id)}
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center mt-5 text-muted">
          <h5>No books match your search/filter.</h5>
        </div>
      )}
    </div>
  );
}
