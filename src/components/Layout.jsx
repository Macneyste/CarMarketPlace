import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/inventory', label: 'Inventory' },
  { to: '/signin', label: 'Signin' },
  { to: '/signup', label: 'Signup' },
  { to: '/about', label: 'About' },
];

function Layout() {
  const { isAuthenticated, signout, userInfo } = useAppContext();

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

              {isAuthenticated ? (
                <div className="header-user-panel">
                  <div className="header-user-copy">
                    <span className="header-user-label">Signed in</span>
                    <strong>{userInfo?.name}</strong>
                  </div>

                  <button type="button" className="header-signout" onClick={signout}>
                    Sign out
                  </button>
                </div>
              ) : (
                <NavLink to="/signup" className="header-cta">
                  Create Account
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container page-content">
        <section className="session-banner">
          <div className="session-banner-copy">
            <span className="session-banner-label">Session status</span>
            <strong>
              {isAuthenticated
                ? `Logged in as ${userInfo?.name}`
                : 'Browsing as guest'}
            </strong>
          </div>

          <p className="session-banner-text">
            {isAuthenticated
              ? userInfo?.email
              : 'Create an account or sign in to keep your user state in local storage.'}
          </p>
        </section>

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
