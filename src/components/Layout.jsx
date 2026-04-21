import { NavLink, Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/inventory', label: 'Inventory' },
  { to: '/about', label: 'About' },
];

function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-content">
          <NavLink to="/" className="brand">
            Car Marketplace
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
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
