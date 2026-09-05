import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
);

const GlobeIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.25 2.46 3.38 5.46 3.38 9S14.25 18.54 12 21c-2.25-2.46-3.38-5.46-3.38-9S9.75 5.46 12 3Z" /></svg>
);

const MenuIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

const Header = () => {
  const { user, isAuthenticated, isHost, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const destination = searchQuery.trim();
    setDropdownOpen(false);
    navigate(destination ? `/locations/${encodeURIComponent(destination)}` : '/explore');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className={`public-header ${isAuthPage ? 'header-compact' : ''}`}>
      <Link to="/" className="brand" aria-label="AirStay home">
        <svg className="brand-mark" aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3.2c-2.6 0-4.4 2.12-6.03 5.2L4.35 19.1C2.35 22.93 4.82 27.5 9.16 27.5c2.64 0 4.62-1.47 6.84-5.21 2.24 3.74 4.21 5.21 6.85 5.21 4.32 0 6.8-4.57 4.8-8.4L22.02 8.4C20.4 5.32 18.6 3.2 16 3.2Zm0 13.33c-1.18 0-2.14-.96-2.14-2.14S14.82 12.25 16 12.25s2.14.96 2.14 2.14-.96 2.14-2.14 2.14Z" /></svg>
        <span>airstay</span>
      </Link>

      {!isAuthPage && (
        <form className="header-search" onSubmit={submitSearch} aria-label="Search stays">
          <label>
            <span>Where</span>
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search destinations" aria-label="Where do you want to go?" />
          </label>
          <button type="submit" className="search-submit" aria-label="Search stays"><SearchIcon /></button>
        </form>
      )}

      <div className="header-actions" ref={dropdownRef}>
        {!isAuthenticated && !isAuthPage && <Link className="host-link" to="/register">Become a host</Link>}
        {!isAuthPage && <button className="icon-button globe-button" aria-label="Choose language and region"><GlobeIcon /></button>}
        {!isAuthPage && (
          <button className="profile-trigger" type="button" aria-expanded={dropdownOpen} aria-controls="profile-menu" onClick={() => setDropdownOpen((open) => !open)}>
            <MenuIcon />
            <span className="avatar" aria-hidden="true">{user?.username?.slice(0, 1).toUpperCase() || 'A'}</span>
          </button>
        )}
        {dropdownOpen && (
          <div className="profile-menu" id="profile-menu" role="menu">
            {!isAuthenticated ? (
              <>
                <Link role="menuitem" to="/register" onClick={() => setDropdownOpen(false)}>Sign up</Link>
                <Link role="menuitem" to="/login" onClick={() => setDropdownOpen(false)}>Log in</Link>
                <div className="menu-rule" />
                <Link role="menuitem" to="/register" onClick={() => setDropdownOpen(false)}>AirStay your home</Link>
              </>
            ) : (
              <>
                <p className="menu-greeting">Signed in as {user?.username}</p>
                <Link role="menuitem" to="/reservations" onClick={() => setDropdownOpen(false)}>My reservations</Link>
                {isHost && <a role="menuitem" href={`${process.env.REACT_APP_ADMIN_URL || 'http://localhost:3001'}/host/dashboard?token=${encodeURIComponent(localStorage.getItem('token'))}`}>Host dashboard</a>}
                {isAdmin && <a role="menuitem" href={`${process.env.REACT_APP_ADMIN_URL || 'http://localhost:3001'}/admin/dashboard?token=${encodeURIComponent(localStorage.getItem('token'))}`}>Admin dashboard</a>}
                <button role="menuitem" type="button" onClick={handleLogout}>Log out</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
