import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, isHost, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const logoutAndLeave = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const dashboardBase = isAdmin ? '/admin/dashboard' : '/host/dashboard';
  const listingsBase = isAdmin ? '/admin/listings' : '/host/listings';
  const createBase = isAdmin ? '/admin/create' : '/host/create';
  const reservationsBase = isAdmin ? '/admin/reservations' : '/host/reservations';

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <Link to={dashboardBase} className="admin-brand" aria-label="AirStay workspace">
          <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3.2c-2.6 0-4.4 2.12-6.03 5.2L4.35 19.1C2.35 22.93 4.82 27.5 9.16 27.5c2.64 0 4.62-1.47 6.84-5.21 2.24 3.74 4.21 5.21 6.85 5.21 4.32 0 6.8-4.57 4.8-8.4L22.02 8.4C20.4 5.32 18.6 3.2 16 3.2Zm0 13.33c-1.18 0-2.14-.96-2.14-2.14S14.82 12.25 16 12.25s2.14.96 2.14 2.14-.96 2.14-2.14 2.14Z" /></svg>
          <span>AirStay <em>{isAdmin ? 'Admin' : 'Host'}</em></span>
        </Link>

        {isAuthenticated && <nav className="admin-nav" aria-label="Workspace navigation">
          <Link to={dashboardBase} className={isActive(dashboardBase)}>Overview</Link>
          <Link to={listingsBase} className={isActive(listingsBase)}>Listings</Link>
          <Link to={createBase} className={isActive(createBase)}>Create listing</Link>
          <Link to={reservationsBase} className={isActive(reservationsBase)}>Reservations</Link>
          {isAdmin && <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>}
        </nav>}

        <div className="admin-profile" ref={menuRef}>
          <button type="button" className="admin-profile-trigger" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span className="admin-avatar">{user?.username?.slice(0, 1).toUpperCase() || 'A'}</span>
            <span>{user?.username || 'Account'}</span>
            <span aria-hidden="true">⌄</span>
          </button>
          {open && <div className="admin-profile-menu" role="menu">
            {isAdmin && <Link role="menuitem" to="/admin/users" onClick={() => setOpen(false)}>Manage users</Link>}
            {isHost && <Link role="menuitem" to="/host/reservations" onClick={() => setOpen(false)}>Host reservations</Link>}
            {!isHost && <Link role="menuitem" to="/reservations" onClick={() => setOpen(false)}>My reservations</Link>}
            <button role="menuitem" type="button" onClick={logoutAndLeave}>Log out</button>
          </div>}
        </div>
      </div>
    </header>
  );
};

export default Header;
