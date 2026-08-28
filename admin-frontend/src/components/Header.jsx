import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Admin Header with logo, navigation, and user dropdown
 * Differentiates between logged-in and logged-out states
 */
const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/admin/login');
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle} className="container">
        {/* Logo */}
        <Link to="/admin/dashboard" style={logoStyle}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="#ff385c">
            <path d="M16 1c2.5 0 4.8 1.2 6.3 3.2C23.8 6.2 24.5 8.8 24 11.4c-.5 2.6-2.1 4.8-4.3 6.1l-.2.1-.3.2c-.2.1-.3.2-.5.4-.3.2-.5.5-.7.8-.2.3-.3.6-.3 1s.1.7.3 1c.2.3.4.6.7.8.2.1.3.3.5.4l.3.2.2.1c2.2 1.3 3.8 3.5 4.3 6.1.5 2.6-.2 5.2-1.7 7.2C19.8 37.8 17.5 39 15 39s-4.8-1.2-6.3-3.2C7.2 33.8 6.5 31.2 7 28.6c.5-2.6 2.1-4.8 4.3-6.1l.2-.1.3-.2c.2-.1.3-.2.5-.4.3-.2.5-.5.7-.8.2-.3.3-.6.3-1s-.1-.7-.3-1c-.2-.3-.4-.6-.7-.8-.2-.1-.3-.3-.5-.4l-.3-.2-.2-.1c-2.2-1.3-3.8-3.5-4.3-6.1-.5-2.6.2-5.2 1.7-7.2C10.2 2.2 12.5 1 15 1z"/>
          </svg>
          <span style={logoTextStyle}>Admin</span>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav style={navStyle}>
            <Link to="/admin/dashboard" style={navLinkStyle}>Dashboard</Link>
            <Link to="/admin/create" style={navLinkStyle}>Create Listing</Link>
          </nav>
        )}

        {/* User Section */}
        <div style={userSectionStyle}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={profileButtonStyle}
              >
                <span style={greetingStyle}>Hi, {user?.username}</span>
                <div style={avatarStyle}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </button>

              {dropdownOpen && (
                <div style={dropdownStyle}>
                  <Link
                    to="/admin/reservations"
                    style={dropdownItemStyle}
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Reservations
                  </Link>
                  <button onClick={handleLogout} style={dropdownLogoutStyle}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={guestActionsStyle}>
              <span style={hostLinkStyle}>Become a host</span>
              <Link to="/admin/login" style={loginButtonStyle}>Log in</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Styles
const headerStyle = {
  background: 'white',
  borderBottom: '1px solid #ebebeb',
  padding: '16px 0',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
};

const logoTextStyle = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#ff385c',
};

const navStyle = {
  display: 'flex',
  gap: '24px',
};

const navLinkStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#222',
  padding: '8px 12px',
  borderRadius: '22px',
  transition: 'background 0.2s',
};

const userSectionStyle = {
  display: 'flex',
  alignItems: 'center',
};

const profileButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '21px',
  padding: '5px 5px 5px 12px',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};

const greetingStyle = {
  fontSize: '14px',
  fontWeight: 500,
};

const avatarStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: '#222',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 600,
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
  minWidth: '200px',
  overflow: 'hidden',
  zIndex: 200,
};

const dropdownItemStyle = {
  display: 'block',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#222',
  borderBottom: '1px solid #ebebeb',
  transition: 'background 0.2s',
};

const dropdownLogoutStyle = {
  display: 'block',
  width: '100%',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#222',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const guestActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const hostLinkStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#222',
  cursor: 'pointer',
};

const loginButtonStyle = {
  padding: '10px 20px',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '21px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#222',
};

export default Header;
