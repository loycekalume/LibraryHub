import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import axios from "../utils/axios";

interface Book {
  book_id: number;
  title: string;
  author: string;
  image_url?: string;
  total_copies: number;
  available_copies: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/books/overview");
        const parsed = res.data.books.map((book: any) => ({
          ...book,
          available_copies: parseInt(book.available_copies),
          total_copies: parseInt(book.total_copies),
        }));
        setBooks(parsed);
        setFilteredBooks(parsed); // Set initially
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };

    fetchBooks();
  }, []);

  const handleMainSearch = () => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const homeStyles = {
    heroSection: {
      backgroundColor: "#f8f9fa",
      padding: "4rem 0",
      textAlign: "center" as const,
    },
    searchSection: {
      maxWidth: "600px",
      margin: "2rem auto",
    },
    bookCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "1rem",
    },
    bookImage: {
      width: "100%",
      height: "200px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#ddd",
    },
    signUpSection: {
      backgroundColor: "#7c3aed",
      padding: "3rem 0",
      textAlign: "center" as const,
      color: "white",
    },
  };

  return (
    <>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />

        <main className="flex-grow-1">
          {/* Hero Section */}
          <section style={homeStyles.heroSection}>
            <div className="container">
              <h1 className="display-4 fw-bold mb-3">
                Discover a World of <span style={{ color: "#7c3aed" }}>Knowledge</span>
              </h1>
              <p className="lead text-muted mb-4">
                Explore and locate books available in our physical library
              </p>

              <div style={homeStyles.searchSection}>
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search books by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="btn"
                    type="button"
                    style={{ backgroundColor: "#7c3aed", color: "white" }}
                    onClick={handleMainSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Books Section */}
          <section className="py-5">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>All Books</h3>
                <small className="text-muted">
                  Showing {filteredBooks.length} of {books.length} books
                </small>
              </div>

              <div className="row">
                {filteredBooks.map((book) => (
                  <div key={book.book_id} className="col-md-3 mb-4">
                    <div style={homeStyles.bookCard}>
                      <div
                        style={{
                          ...homeStyles.bookImage,
                          backgroundImage: `url(${book.image_url || "/book-placeholder.jpg"})`,
                        }}
                      />
                      <div className="p-3">
                        <h6 className="fw-bold mb-1">{book.title}</h6>
                        <p className="text-muted small mb-2">{book.author}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className={`badge ${
                              book.available_copies > 0 ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {book.available_copies > 0 ? "Available" : "Not Available"}
                          </span>
                          <span className="text-muted small">
                            {book.available_copies} of {book.total_copies} copies
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section style={homeStyles.signUpSection}>
            <div className="container">
              <h2 className="mb-3">Ready to Start Reading?</h2>
              <Link to="/register">
                <button className="btn btn-light btn-lg">Sign Up</button>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
