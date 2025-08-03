'use client';
import { useState, useEffect, useCallback } from 'react';
import '../../styles/dashboard.css';

export default function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    purposes: {},
    categories: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filterEntries = useCallback(() => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  }, [entries, searchTerm, filterPurpose, filterCategory]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entry/getAll');
      const data = await response.json();
      if (response.ok) {
        setEntries(data.entries);
        calculateStats(data.entries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const checkAuthAndFetchData = useCallback(async () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='));
    const nameCookie = cookies.find(cookie => cookie.trim().startsWith('userName='));
    const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('userId='));

    if (!tokenCookie) {
      window.location.href = '/login';
      return;
    }

    if (roleCookie) {
      const role = roleCookie.split('=')[1];
      setUserRole(role);
    }

    if (nameCookie && userIdCookie) {
      const name = decodeURIComponent(nameCookie.split('=')[1]);
      const userId = userIdCookie.split('=')[1];
      setUser({
        id: userId,
        name: name,
        role: roleCookie ? roleCookie.split('=')[1] : 'user'
      });
    }

    await fetchEntries();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [checkAuthAndFetchData]);

  useEffect(() => {
    filterEntries();
  }, [filterEntries]);

  const calculateStats = (entries) => {
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry =>
      new Date(entry.createdAt).toDateString() === today
    );

    const purposes = {};
    const categories = {};

    entries.forEach(entry => {
      if (entry.purpose) {
        purposes[entry.purpose] = (purposes[entry.purpose] || 0) + 1;
      }
      if (entry.category) {
        categories[entry.category] = (categories[entry.category] || 0) + 1;
      }
    });

    setStats({
      total: entries.length,
      today: todayEntries.length,
      purposes,
      categories
    });
  };

  const handleDeleteEntry = async (entryId) => {
    if (userRole !== 'admin') {
      alert('Only administrators can delete entries.');
      return;
    }

    if (confirm(`Are you sure you want to delete this entry? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/entry/delete/${entryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchEntries();
          alert('Entry deleted successfully!');
        } else {
          alert('Failed to delete entry. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Error deleting entry. Please try again.');
      }
    }
  };

  const handleExportData = () => {
    if (userRole !== 'admin') {
      alert('Only administrators can export data.');
      return;
    }

    const csvContent = [
      ['Name', 'Email', 'Purpose', 'Category', 'Message', 'Created At'],
      ...filteredEntries.map(entry => [
        entry.name,
        entry.email,
        entry.purpose || '',
        entry.category || '',
        entry.message,
        new Date(entry.createdAt).toLocaleString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-connect-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <h2>Loading Dashboard...</h2>
          <p>Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard">
        <div className="error">
          <h2>Access Denied</h2>
          <p>Please log in to access the dashboard.</p>
          <a href="/login" className="btn btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <p>Role: {userRole === 'admin' ? 'Administrator' : 'User'}</p>
      </div>

      {/* Profile Section */}
      <div className="profile">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>User ID: {user.id}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label>Account Type</label>
            <span className={userRole === 'admin' ? 'admin-badge' : 'user-badge'}>
              {userRole === 'admin' ? 'Administrator' : 'User'}
            </span>
          </div>
          <div className="detail-item">
            <label>Account Status</label>
            <span className="status-active">Active</span>
          </div>
          <div className="detail-item">
            <label>Last Login</label>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Entries</h3>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">All time entries</div>
        </div>
        <div className="stat-card">
          <h3>Today&apos;s Entries</h3>
          <div className="stat-number">{stats.today}</div>
          <div className="stat-label">New entries today</div>
        </div>
        <div className="stat-card">
          <h3>Unique Purposes</h3>
          <div className="stat-number">{Object.keys(stats.purposes).length}</div>
          <div className="stat-label">Different purposes</div>
        </div>
        {userRole === 'admin' && (
          <div className="stat-card admin-card">
            <h3>Admin Controls</h3>
            <div className="stat-number">Active</div>
            <div className="stat-label">Full access enabled</div>
          </div>
        )}
      </div>

      {/* Admin Features */}
      {userRole === 'admin' && (
        <div className="admin-section">
          <h2>Administrator Controls</h2>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search entries by name, email, or message..."
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
              <option value="Student Visit">Student Visit</option>
              <option value="Alumni Visit">Alumni Visit</option>
              <option value="Faculty Meeting">Faculty Meeting</option>
              <option value="Campus Tour">Campus Tour</option>
              <option value="Seminar/Workshop">Seminar/Workshop</option>
              <option value="Event Attendance">Event Attendance</option>
              <option value="Job Interview">Job Interview</option>
              <option value="Research">Research</option>
              <option value="Administrative">Administrative</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
              <option value="Professional">Professional</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Technology">Technology</option>
              <option value="Arts">Arts</option>
              <option value="Community Service">Community Service</option>
              <option value="Other">Other</option>
            </select>
            <button onClick={handleExportData} className="btn btn-export">
              Export Data
            </button>
          </div>
        </div>
      )}

      {/* Purpose Breakdown */}
      <div className="entries-section">
        <h2>Purpose Breakdown</h2>
        {Object.entries(stats.purposes).length > 0 ? (
          <div className="purpose-grid">
            {Object.entries(stats.purposes).map(([purpose, count]) => (
              <div key={purpose} className="purpose-item">
                <span className="purpose-name">{purpose}</span>
                <span className="purpose-count">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No entries found.</p>
        )}
      </div>

      {/* All Entries Section */}
      <div className="entries-section">
        <h2>All Entries ({filteredEntries.length})</h2>
        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <h3>No entries found</h3>
            <p>Try adjusting your search or filters.</p>
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
                  {entry.purpose && (
                    <span className="entry-purpose">{entry.purpose}</span>
                  )}
                  {entry.category && (
                    <span className="entry-category">{entry.category}</span>
                  )}
                </div>

                <div className="entry-message">{entry.message}</div>

                {userRole === 'admin' && (
                  <div className="entry-actions">
                    <button
                      onClick={() => handleDeleteEntry(entry._id)}
                      className="btn btn-danger"
                    >
                      Delete Entry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
