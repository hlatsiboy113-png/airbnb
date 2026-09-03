import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, login, logout, isHost } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/locations/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setLoginModalOpen(false);
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
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
          <form onSubmit={handleSearch} className="search-bar">
            <input type="text" placeholder="Search destinations" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="search-btn">🔍</button>
          </form>
        </div>
        <div className="header-right" ref={dropdownRef}>
          {user ? (
            <div className="profile-section">
              <span className="greeting">{user.role === 'admin' ? 'Admin' : user.role === 'host' ? 'Host' : 'Guest'} · {user.username}</span>
              <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>☰ 👤</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {user.role === 'admin' && <div className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/admin/dashboard'); }}>Admin Dashboard</div>}
                  {user.role === 'host' && <div className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/admin/dashboard'); }}>Host Dashboard</div>}
                  {user.role === 'host' && <div className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/admin/create'); }}>Create Listing</div>}
                  <div className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate(isHost ? '/admin/reservations' : '/reservations'); }}>{user.role === 'admin' ? 'Admin Reservations' : user.role === 'host' ? 'Host Reservations' : 'My Reservations'}</div>
                  <div className="dropdown-item logout" onClick={() => { logout(); setDropdownOpen(false); }}>Log Out</div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-section">
              <button type="button" className="become-host" onClick={() => navigate('/admin/login')}>Become a host</button>
              <Link to="/register" className="become-host">Sign Up</Link>
              <button className="profile-btn" onClick={() => setLoginModalOpen(true)}>☰ 👤</button>
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
            <button type="button" className="dropdown-item" onClick={() => { setLoginModalOpen(false); navigate('/register'); }}>Create an account</button>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
