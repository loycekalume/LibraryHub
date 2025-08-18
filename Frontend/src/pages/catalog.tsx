import { useEffect, useState } from "react";

interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string | null;
  image_url: string;
  description: string;
  total_copies: number;
  available_copies: number;
}

export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All Categories");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const data: { books: Book[] } = await response.json();

        setBooks(data.books);
        setFilteredBooks(data.books);

        //  Explicitly cast genres to string[]
        const uniqueGenres: string[] = [
          ...new Set(
            data.books.map((b: Book) =>
              b.genre ? b.genre : "Uncategorized"
            )
          ),
        ];

        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === "All Categories") {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter((book) => (book.genre || "Uncategorized") === genre)
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📚 Book Catalog</h1>

      {/* Genre Filter */}
      <div className="mb-6">
        <select
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option>All Categories</option>
          {genres.map((genre, idx) => (
            <option key={idx} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.book_id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500 mb-2">
              Genre: {book.genre || "Uncategorized"}
            </p>
            <p className="text-sm text-gray-700">
              Available: {book.available_copies} / {book.total_copies}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
