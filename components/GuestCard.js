export default function GuestCard({ entry }) {
  return (
    <div className="card guest-card">
      <h3>{entry.name}</h3>
      <p><strong>Email:</strong> {entry.email}</p>
      <p><strong>Message:</strong> {entry.message}</p>
      <div>
        <strong>Purpose:</strong>
        <span className="tag">{entry.purpose}</span>
      </div>
      <p><small>Posted on: {new Date(entry.createdAt).toLocaleDateString()}</small></p>
    </div>
  );
}