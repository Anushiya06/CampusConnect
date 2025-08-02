'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../styles/navbar.css';

export default function Navbar() {
  const [userRole, setUserRole] = useState('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='));
    
    if (tokenCookie) {
      setIsLoggedIn(true);
      if (roleCookie) {
        const role = roleCookie.split('=')[1];
        setUserRole(role);
      }
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsLoggedIn(false);
    setUserRole('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/" className="nav-logo">
            Campus Connect
          </Link>
        </div>
        
        <div className="nav-menu">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/guestbook" className="nav-link">
            Guestbook
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
          {!isLoggedIn && (
            <>
              <Link href="/signup" className="nav-link">
                Sign Up
              </Link>
              <Link href="/login" className="nav-link">
                Login
              </Link>
            </>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}