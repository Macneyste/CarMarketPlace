import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const accountHighlights = [
  {
    title: 'Secure account access',
    description:
      'This page is protected, so only signed-in users can open and use it.',
  },
  {
    title: 'Local session sync',
    description:
      'Your basic account details stay available after refresh through app state and local storage.',
  },
  {
    title: 'Marketplace ready',
    description:
      'You can jump straight back into inventory without repeating the sign-in flow.',
  },
];

const quickActions = [
  {
    to: '/inventory',
    label: 'Browse inventory',
    description: 'Return to the car listings and keep exploring available options.',
  },
  {
    to: '/',
    label: 'Go to home',
    description: 'Review the main landing experience and featured marketplace sections.',
  },
  {
    to: '/about',
    label: 'Project overview',
    description: 'Read the overview page and revisit the purpose behind the app.',
  },
];

function getInitials(name = '') {
  const parts = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return 'CM';
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

function formatProvider(provider = 'local') {
  return provider === 'google' ? 'Google sign-in' : 'Email sign-in';
}

function getReference(id = '') {
  return id ? `...${id.slice(-6).toUpperCase()}` : 'Pending sync';
}

function ProfilePage() {
  const navigate = useNavigate();
  const { signout, userInfo } = useAppContext();
  const displayName = userInfo?.name || 'Marketplace Member';
  const firstName = displayName.trim().split(' ').filter(Boolean)[0] || 'Driver';
  const providerLabel = formatProvider(userInfo?.authProvider);
  const profileFacts = [
    {
      label: 'Full name',
      value: displayName,
    },
    {
      label: 'Email address',
      value: userInfo?.email || 'Not available',
    },
    {
      label: 'Sign-in method',
      value: providerLabel,
    },
    {
      label: 'User reference',
      value: getReference(userInfo?._id),
    },
  ];

  function handleSignout() {
    signout();
    navigate('/', { replace: true });
  }

  return (
    <section className="profile-shell">
      <div className="profile-hero">
        <article className="profile-card profile-main-card">
          <div className="profile-badge-row">
            <span className="eyebrow">Profile</span>
            <span className="profile-provider-pill">{providerLabel}</span>
          </div>

          <div className="profile-identity">
            <div className="profile-avatar-shell">
              {userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={`${displayName} avatar`}
                  className="profile-avatar-image"
                />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>

            <div className="profile-identity-copy">
              <h1>{displayName}</h1>
              <p>
                Welcome back, {firstName}. Your account is synced and ready for a
                cleaner car browsing session.
              </p>
            </div>
          </div>

          <div className="profile-facts-grid">
            {profileFacts.map((fact) => (
              <article key={fact.label} className="profile-fact">
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </article>
            ))}
          </div>

          <div className="profile-action-row">
            <Link to="/inventory" className="profile-primary-action">
              Browse inventory
            </Link>

            <button
              type="button"
              className="profile-secondary-action"
              onClick={handleSignout}
            >
              Sign out
            </button>
          </div>
        </article>

        <aside className="profile-card profile-side-card">
          <span className="profile-card-label">Account snapshot</span>
          <h2>Everything important in one clean place</h2>
          <p>
            Use this page as your account checkpoint before heading back into
            listings, details, and the rest of the marketplace.
          </p>

          <div className="profile-stat-grid">
            <div>
              <strong>Protected</strong>
              <span>Only authenticated users can access this route.</span>
            </div>
            <div>
              <strong>Synced</strong>
              <span>Your stored user details stay available after refresh.</span>
            </div>
            <div>
              <strong>Ready</strong>
              <span>Jump into inventory without repeating setup steps.</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="profile-content-grid">
        <article className="profile-card profile-panel">
          <div className="profile-panel-header">
            <span className="profile-card-label">Profile details</span>
            <h2>What your account is currently doing</h2>
          </div>

          <div className="profile-detail-list">
            {accountHighlights.map((item) => (
              <article key={item.title} className="profile-detail-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="profile-card profile-panel">
          <div className="profile-panel-header">
            <span className="profile-card-label">Quick actions</span>
            <h2>Keep moving through the marketplace</h2>
          </div>

          <div className="profile-link-list">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to} className="profile-link-card">
                <strong>{action.label}</strong>
                <span>{action.description}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProfilePage;
