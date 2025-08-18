import  { useEffect, useState } from 'react';

import axios from '../utils/axios'; 

interface MyBook {
  id: number;
  title: string;
  author: string;
  status: 'normal' | 'overdue' | 'due';
  category: 'all' | 'borrowed' | 'overdue' | 'due-soon';
  dueDate: string;
  image: string;
}

type BookCategory = 'all' | 'borrowed' | 'overdue' | 'due-soon';
type BookStatus = 'normal' | 'overdue' | 'due';

export default function MyBooksPage() {
  const [userBooks, setUserBooks] = useState<MyBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<BookCategory>('all');

  // Fetch user's issued books
  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get("/issues/mybooks");
        const data = res.data.issues || [];

        const transformed = data.map((issue: any) => {
          const today = new Date();
          const due = new Date(issue.due_date);
          const status: BookStatus =
            issue.return_date
              ? 'normal'
              : due < today
              ? 'overdue'
              : Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 2
              ? 'due'
              : 'normal';

          const category: BookCategory =
            status === 'overdue'
              ? 'overdue'
              : status === 'due'
              ? 'due-soon'
              : 'borrowed';

          return {
            id: issue.issue_id,
            title: issue.title,
            author: issue.author,
            dueDate: new Date(issue.due_date).toLocaleDateString(),
            image: issue.image_url || '/book-placeholder.jpg',
            status,
            category,
          };
        });

        setUserBooks(transformed);
      } catch (err) {
        console.error("Failed to load user books", err);
      }
    };

    fetchMyBooks();
  }, []);

  // Filter logic
  const filteredBooks = userBooks.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && book.category === activeFilter;
  });

  const getStatusBadge = (status: BookStatus) => {
    return {
      normal: { class: 'bg-success', text: 'Normal' },
      due: { class: 'bg-warning text-dark', text: 'Due Soon' },
      overdue: { class: 'bg-danger', text: 'Overdue' },
    }[status];
  };

  const handleReturn = async (issueId: number) => {
    try {
      await axios.patch(`/issues/return/${issueId}`, {
        return_date: new Date().toISOString(),
      });
      setUserBooks(prev => prev.map(b => b.id === issueId ? { ...b, status: 'normal' } : b));
    } catch (err) {
      console.error("Failed to return book", err);
    }
  };

  const counts = {
    all: userBooks.length,
    borrowed: userBooks.filter(b => b.category === 'borrowed').length,
    overdue: userBooks.filter(b => b.status === 'overdue').length,
    'due-soon': userBooks.filter(b => b.category === 'due-soon').length,
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📘 My Borrowed Books</h2>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {(['all', 'borrowed', 'overdue', 'due-soon'] as BookCategory[]).map(filter => (
          <button
            key={filter}
            className={`btn btn-sm px-4 py-2 rounded-pill ${filter === activeFilter ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.replace('-', ' ').toUpperCase()} ({counts[filter]})
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
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Book Grid */}
      <div className="row g-4">
        {filteredBooks.map(book => {
          const badge = getStatusBadge(book.status);
          return (
            <div key={book.id} className="col-md-4 col-lg-3">
              <div className="card shadow-sm h-100">
                <img src={book.image} className="card-img-top" alt={book.title} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{book.title}</h6>
                  <p className="text-muted small mb-1">by {book.author}</p>
                  <p className="text-muted small">Due: {book.dueDate}</p>
                  <span className={`badge ${badge.class} mb-2 w-50`}>{badge.text}</span>
                  {book.status !== 'normal' && (
                    <button
                      className="btn btn-sm btn-outline-primary mt-auto"
                      onClick={() => handleReturn(book.id)}
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

      {/* No books found */}
      {filteredBooks.length === 0 && (
        <div className="text-center mt-5 text-muted">
          <h5>No books match your search/filter.</h5>
        </div>
      )}
    </div>
  );
}
