'use client';
import { useState, useEffect } from 'react';
import '../../styles/guestbook.css';

export default function GuestbookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    purpose: '',
    category: ''
  });
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, filterPurpose, filterCategory]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entry/getAll');
      const data = await response.json();
      if (response.ok) {
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPurpose) {
      filtered = filtered.filter(entry => entry.purpose === filterPurpose);
    }

    if (filterCategory) {
      filtered = filtered.filter(entry => entry.category === filterCategory);
    }

    setFilteredEntries(filtered);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/entry/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Entry added successfully!');
        setFormData({ name: '', email: '', message: '', purpose: '', category: '' });
        setShowCreateForm(false);
        fetchEntries();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const purposeOptions = [
    'Student Visit', 'Alumni Visit', 'Faculty Meeting', 'Campus Tour',
    'Seminar/Workshop', 'Event Attendance', 'Job Interview',
    'Research', 'Administrative', 'Other'
  ];

  const categoryOptions = [
    'Academic', 'Social', 'Professional', 'Cultural', 'Sports',
    'Technology', 'Arts', 'Community Service', 'Other'
  ];

  return (
    <div className="guestbook">
      <div className="guestbook-header">
        <h1>Campus Connect Guestbook</h1>
        <p>Share your campus experience and connect with our community</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            className="filter-select"
          >
            <option value="">All Purposes</option>
            {purposeOptions.map((purpose, index) => (
              <option key={`purpose-${index}`} value={purpose}>{purpose}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category, index) => (
              <option key={`category-${index}`} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Cancel' : 'Create New Entry'}
        </button>
      </div>

      {/* Create Form Section */}
      {showCreateForm && (
        <form onSubmit={handleSubmit} className="form-section">
          <h2>Create New Entry</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
          />
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          >
            <option value="">Select purpose</option>
            {purposeOptions.map((purpose, index) => (
              <option key={`form-purpose-${index}`} value={purpose}>{purpose}</option>
            ))}
          </select>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((category, index) => (
              <option key={`form-category-${index}`} value={category}>{category}</option>
            ))}
          </select>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            required
          />
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Entry...' : 'Create Entry'}
          </button>
        </form>
      )}

      {/* Entries Section */}
      <div className="entries-section">
        <h2>Guestbook Entries ({filteredEntries.length})</h2>
        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <h3>No entries found</h3>
            <p>{entries.length === 0 
              ? 'Be the first to sign the guestbook!' 
              : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="entries-grid">
            {filteredEntries.map((entry) => (
              <div key={entry._id} className="entry-card">
                <div className="entry-header">
                  <div className="entry-info">
                    <div className="entry-name">{entry.name}</div>
                    <div className="entry-email">{entry.email}</div>
                  </div>
                  <div className="entry-date">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="entry-tags">
                  {entry.purpose && <span className="entry-purpose">{entry.purpose}</span>}
                  {entry.category && <span className="entry-category">{entry.category}</span>}
                </div>
                <div className="entry-message">{entry.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
