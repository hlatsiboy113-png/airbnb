import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
const { user, login, isAuthenticated, isHost, isAdmin, isGuest, logout } = useAuth();
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
          <Link to="/" className="logo-link" aria-label="AirStay home">
            <span className="logo-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3.2c-2.6 0-4.4 2.12-6.03 5.2L4.35 19.1C2.35 22.93 4.82 27.5 9.16 27.5c2.64 0 4.62-1.47 6.84-5.21 2.24 3.74 4.21 5.21 6.85 5.21 4.32 0 6.8-4.57 4.8-8.4L22.02 8.4C20.4 5.32 18.6 3.2 16 3.2Zm0 13.33c-1.18 0-2.14-.96-2.14-2.14S14.82 12.25 16 12.25s2.14.96 2.14 2.14-.96 2.14-2.14 2.14Z"/></svg>
            </span>
            <span className="logo-text">airstay</span>
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

          </div>
        </div>
      )}
    </>
  );
};
export default Header;