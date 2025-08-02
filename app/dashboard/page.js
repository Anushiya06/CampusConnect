'use client';
import { useState, useEffect } from 'react';
import '../../styles/dashboard.css';

export default function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    purposes: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
    fetchUserProfile();
    checkUserRole();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, filterPurpose, filterCategory]);

  const checkUserRole = () => {
    const cookies = document.cookie.split(';');
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='));
    if (roleCookie) {
      const role = roleCookie.split('=')[1];
      setUserRole(role);
    }
  };

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

  const fetchUserProfile = async () => {
    // For now, we'll create a mock user profile
    // In a real app, you'd fetch this from an API
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2024-01-15',
      lastLogin: new Date().toLocaleDateString(),
      totalEntries: 12
    });
  };

  const filterEntries = () => {
    let filtered = entries;

    // Search by name or message
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by purpose
    if (filterPurpose) {
      filtered = filtered.filter(entry => entry.purpose === filterPurpose);
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(entry => entry.category === filterCategory);
    }

    setFilteredEntries(filtered);
  };

  const calculateStats = (entries) => {
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
      new Date(entry.createdAt).toDateString() === today
    );

    const purposes = {};
    entries.forEach(entry => {
      purposes[entry.purpose] = (purposes[entry.purpose] || 0) + 1;
    });

    setStats({
      total: entries.length,
      today: todayEntries.length,
      purposes
    });
  };

  const handleDeleteEntry = async (entryId) => {
    if (userRole !== 'admin') return;
    
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/entry/delete/${entryId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchEntries();
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  if (!user) {
    return <div className="dashboard">Loading...</div>;
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
            <p>{user.email}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <label>Member Since</label>
            <span>{new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <label>Last Login</label>
            <span>{user.lastLogin}</span>
          </div>
          <div className="detail-item">
            <label>Account Type</label>
            <span>{userRole === 'admin' ? 'Administrator' : 'User'}</span>
          </div>
          <div className="detail-item">
            <label>Account Status</label>
            <span>Active</span>
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
          <h3>Today's Entries</h3>
          <div className="stat-number">{stats.today}</div>
          <div className="stat-label">New entries today</div>
        </div>
        <div className="stat-card">
          <h3>Your Entries</h3>
          <div className="stat-number">{user.totalEntries}</div>
          <div className="stat-label">Your contributions</div>
        </div>
      </div>

      {/* Admin Features */}
      {userRole === 'admin' && (
        <div className="admin-section">
          <h2>Admin Controls</h2>
          
          {/* Search and Filter */}
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search entries..."
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
          </div>
        </div>
      )}

      {/* Purpose Breakdown */}
      <div className="entries-section">
        <h2>Purpose Breakdown</h2>
        {Object.entries(stats.purposes).length > 0 ? (
          Object.entries(stats.purposes).map(([purpose, count]) => (
            <div key={purpose} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
              <span>{purpose}</span>
              <span style={{ fontWeight: 'bold', color: '#007bff' }}>{count}</span>
            </div>
          ))
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
            <p>Start by adding your first guestbook entry!</p>
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
                
                {/* Admin Delete Button */}
                {userRole === 'admin' && (
                  <div className="entry-actions">
                    <button 
                      onClick={() => handleDeleteEntry(entry._id)}
                      className="btn btn-danger"
                    >
                      Delete
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