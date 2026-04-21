import { NavLink, Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/inventory', label: 'Inventory' },
  { to: '/signup', label: 'Signup' },
  { to: '/about', label: 'About' },
];

function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container">
          <div className="header-panel">
            <div className="header-content">
              <NavLink to="/" className="brand" aria-label="Car Marketplace home">
                <span className="brand-mark">CM</span>
                <span className="brand-copy">
                  <span className="brand-title">Car Marketplace</span>
                  <span className="brand-subtitle">Premium car listing starter</span>
                </span>
              </NavLink>

              <nav className="main-nav" aria-label="Primary navigation">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      isActive ? 'nav-link nav-link-active' : 'nav-link'
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <NavLink to="/signup" className="header-cta">
                Create Account
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
