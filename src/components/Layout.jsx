import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const primaryLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/inventory', label: 'Inventory' },
  { to: '/about', label: 'About' },
];

function Layout() {
  const { isAuthenticated, signout, userInfo } = useAppContext();
  const navigationLinks = isAuthenticated
    ? [...primaryLinks, { to: '/profile', label: 'Profile' }]
    : primaryLinks;
  const sessionLabel = isAuthenticated
    ? `Welcome back, ${userInfo?.name?.split(' ')[0] || 'Driver'}`
    : 'Guest session';
  const sessionText = isAuthenticated
    ? userInfo?.email
    : 'Sign in to keep your account synced across the marketplace.';

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container">
          <div className="header-panel">
            <div className="header-meta">
              <span className="header-status-pill">Marketplace Live</span>
              <span className="header-session-chip">{sessionLabel}</span>
            </div>

            <div className="header-content">
              <div className="header-brand-group">
                <NavLink to="/" className="brand" aria-label="Car Marketplace home">
                  <span className="brand-mark">CM</span>
                  <span className="brand-copy">
                    <span className="brand-title">Car Marketplace</span>
                    <span className="brand-subtitle">
                      Premium browsing, clean auth, and a sharper buying flow
                    </span>
                  </span>
                </NavLink>

                <p className="header-caption">{sessionText}</p>
              </div>

              <div className="header-nav-group">
                <nav className="main-nav" aria-label="Primary navigation">
                  {navigationLinks.map((link) => (
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

                  {!isAuthenticated ? (
                    <NavLink
                      to="/signin"
                      className={({ isActive }) =>
                        isActive ? 'nav-link nav-link-active' : 'nav-link'
                      }
                    >
                      Signin
                    </NavLink>
                  ) : null}
                </nav>

                <div className="header-actions">
                  <NavLink to="/inventory" className="header-secondary-cta">
                    Browse Cars
                  </NavLink>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      className="header-signout"
                      onClick={signout}
                    >
                      Sign out
                    </button>
                  ) : (
                    <NavLink to="/signup" className="header-cta">
                      Create Account
                    </NavLink>
                  )}
                </div>
              </div>
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
