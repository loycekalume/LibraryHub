interface BookProps {
  title: string;
  author: string;
  status: "Available" | "Borrowed";
}

export default function BookCard({ title, author, status }: BookProps) {
  return (
    <div className={`book-card ${status.toLowerCase()}`}>
      <div className="cover-placeholder">📖</div>
      <h4>{title}</h4>
      <p>{author}</p>
      <span className="badge">{status}</span>
      <button className="borrow-btn">Borrow</button>
    </div>
  );
}
