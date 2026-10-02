import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const ROUTES = [
  { to: '/', label: 'Home' },
  { to: '/add', label: 'Add' },
  { to: '/history', label: 'Monitoring' },
  { to: '/drinks', label: 'Drinks' },
];

/**
 * NavBar — organism
 * Appears on: Home, Add, Monitoring, Drinks
 * Props: none (reads the active route itself via NavLink)
 */
function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <span className="navbar-brand">SipCount</span>

      <nav className="navbar-links">
        {ROUTES.map((r) => (
          <NavLink
            key={r.to}
            to={r.to}
            className={({ isActive }) => (isActive ? 'current' : '')}
          >
            {r.label}
          </NavLink>
        ))}
      </nav>

      <button
        className="navbar-hamburger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className="navbar-drawer">
          {ROUTES.map((r) => (
            <NavLink
              key={r.to}
              to={r.to}
              className={({ isActive }) => (isActive ? 'current' : '')}
              onClick={() => setOpen(false)}
            >
              {r.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default NavBar;
