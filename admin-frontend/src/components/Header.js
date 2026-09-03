import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
const { user, login, isAuthenticated, isHost, isAdmin, isGuest, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, login, logout, isHost } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const loggedInUser = await login(loginForm.email, loginForm.password);
      setLoginModalOpen(false);
      setLoginForm({ email: '', password: '' });
      // Role-based redirect
      if (loggedInUser.role === 'admin') navigate('/admin/dashboard');
      else if (loggedInUser.role === 'host') navigate('/host/dashboard');
      else navigate('/');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Don't show public header on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isHost) return 'Host';
    return 'Guest';
  };

  return (
    <>
      <header className="public-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">airbnb</span>
          </Link>
        </div>
        <div className="header-center">
          <SearchBar />
        </div>
        <div className="header-right" ref={dropdownRef}>
          {isAuthenticated ? (
            <div className="profile-section">
              <span className="greeting role-greeting">{getRoleLabel()} · {user?.username}</span>
              <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>☰ 👤</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {isGuest && (
                    <>
                      <Link to="/" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Explore</Link>
                      <Link to="/my-reservations" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Reservations</Link>
                      <div className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/host/dashboard'); }}>Become a Host</div>
                    </>
                  )}
                  {isHost && !isAdmin && (
                    <>
                      <Link to="/host/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Host Dashboard</Link>
                      <Link to="/host/listings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Listings</Link>
                      <Link to="/host/create" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Create Listing</Link>
                      <Link to="/host/reservations" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Host Reservations</Link>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                      <Link to="/admin/listings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Manage Listings</Link>
                      <Link to="/admin/users" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Manage Users</Link>
                      <Link to="/admin/reservations" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Reservations</Link>
                    </>
                  )}
                  <div className="dropdown-item logout" onClick={handleLogout}>Log Out</div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-section">
              {!isAuthPage && (
                <>
                  <span className="become-host" onClick={() => navigate('/register')}>Become a host</span>
                  <button className="profile-btn" onClick={() => navigate('/login')}>☰ 👤</button>
                </>
              )}
            </div>
          )}
        </div>
      </header>
      {loginModalOpen && (
        <div className="modal-overlay" onClick={() => setLoginModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Log In</h3>
            {loginError && <div className="error-banner">{loginError}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group"><input type="email" placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required /></div>
              <div className="form-group"><input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required /></div>
              <button type="submit" className="submit-btn" disabled={loginLoading}>{loginLoading ? 'Logging in...' : 'Log In'}</button>
            </form>
            <p className="test-creds">Test: john@example.com / password123</p>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;