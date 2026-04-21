import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAppContext } from '../context/AppContext';
import { formatPrice, getListingTitle } from '../utils/listings';

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

const MAX_AVATAR_SIZE = 1_500_000;
const supportedAvatarTypes = ['image/png', 'image/jpeg', 'image/webp'];

const initialToast = {
  open: false,
  tone: 'success',
  message: '',
};

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read this file'));
    reader.readAsDataURL(file);
  });
}

function ProfilePage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { signout, saveUser, userInfo } = useAppContext();
  const [profileForm, setProfileForm] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
  });
  const [pendingAvatar, setPendingAvatar] = useState('');
  const [pendingFileName, setPendingFileName] = useState('');
  const [userListings, setUserListings] = useState([]);
  const [listingStatus, setListingStatus] = useState({
    loading: true,
    error: '',
    deletingId: '',
  });
  const [status, setStatus] = useState({
    uploading: false,
    savingProfile: false,
    deletingAccount: false,
  });
  const [toast, setToast] = useState(initialToast);
  const displayName = userInfo?.name || 'Marketplace Member';
  const firstName = displayName.trim().split(' ').filter(Boolean)[0] || 'Driver';
  const providerLabel = formatProvider(userInfo?.authProvider);
  const currentAvatar = pendingAvatar || userInfo?.avatar || '';
  const trimmedName = profileForm.name.trim();
  const trimmedEmail = profileForm.email.trim();
  const profileHasChanges =
    trimmedName !== (userInfo?.name || '') || trimmedEmail !== (userInfo?.email || '');
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

  useEffect(() => {
    setProfileForm({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
    });
  }, [userInfo?.name, userInfo?.email]);

  useEffect(() => {
    if (!userInfo?._id) {
      setUserListings([]);
      setListingStatus({
        loading: false,
        error: '',
      });
      return;
    }

    let ignore = false;

    async function loadUserListings() {
      try {
        const response = await fetch(`/api/listings/user/${userInfo._id}`);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load your listings');
        }

        if (!ignore) {
          setUserListings(Array.isArray(data) ? data : []);
          setListingStatus({
            loading: false,
            error: '',
            deletingId: '',
          });
        }
      } catch (error) {
        if (!ignore) {
          setListingStatus({
            loading: false,
            error: error.message || 'Something went wrong',
            deletingId: '',
          });
        }
      }
    }

    setListingStatus({
      loading: true,
      error: '',
      deletingId: '',
    });
    loadUserListings();

    return () => {
      ignore = true;
    };
  }, [userInfo?._id]);

  function showToast(tone, message) {
    setToast({
      open: true,
      tone,
      message,
    });
  }

  function hideToast() {
    setToast(initialToast);
  }

  function handleProfileFieldChange(event) {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSignout() {
    navigate('/signout');
  }

  async function handleDeleteAccount() {
    if (!userInfo?._id || status.deletingAccount) {
      return;
    }

    const confirmed = window.confirm(
      'Delete your account permanently? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    setStatus((current) => ({
      ...current,
      deletingAccount: true,
    }));

    try {
      const response = await fetch(`/api/users/profile/${userInfo._id}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete your account');
      }

      signout();
      navigate('/', { replace: true });
    } catch (error) {
      setStatus((current) => ({
        ...current,
        deletingAccount: false,
      }));
      showToast('error', error.message || 'Something went wrong');
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const [file] = Array.from(event.target.files || []);

    if (!file) {
      return;
    }

    if (!supportedAvatarTypes.includes(file.type)) {
      showToast('error', 'Please choose a PNG, JPG, or WEBP image');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      showToast('error', 'Please choose an image smaller than 1.5MB');
      event.target.value = '';
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file);

      setPendingAvatar(imageDataUrl);
      setPendingFileName(file.name);
      showToast('success', 'Preview ready. Click upload to save your new photo.');
    } catch (error) {
      showToast('error', error.message || 'Unable to read this file');
    } finally {
      event.target.value = '';
    }
  }

  async function handleUploadAvatar() {
    if (!pendingAvatar || !userInfo?._id) {
      showToast('error', 'Choose an image before uploading');
      return;
    }

    setStatus({
      uploading: true,
    });
    hideToast();

    try {
      const response = await fetch('/api/users/profile-image', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo._id,
          avatar: pendingAvatar,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update profile image');
      }

      saveUser(data);
      setPendingAvatar('');
      setPendingFileName('');
      setStatus({
        uploading: false,
      });
      showToast('success', 'Profile image updated successfully.');
    } catch (error) {
      setStatus({
        uploading: false,
      });
      showToast('error', error.message || 'Something went wrong');
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    if (!trimmedName || !trimmedEmail) {
      showToast('error', 'Please enter both your name and email address.');
      return;
    }

    if (!profileHasChanges) {
      showToast('success', 'Your profile is already up to date.');
      return;
    }

    setStatus((current) => ({
      ...current,
      savingProfile: true,
    }));
    hideToast();

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo?._id,
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update your profile');
      }

      saveUser(data);
      setStatus((current) => ({
        ...current,
        savingProfile: false,
      }));
      showToast('success', 'Profile details saved successfully.');
    } catch (error) {
      setStatus((current) => ({
        ...current,
        savingProfile: false,
      }));
      showToast('error', error.message || 'Something went wrong');
    }
  }

  async function handleDeleteListing(listingId) {
    if (!userInfo?._id || !listingId || listingStatus.deletingId) {
      return;
    }

    const confirmed = window.confirm(
      'Delete this listing permanently? This cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    setListingStatus((current) => ({
      ...current,
      deletingId: listingId,
    }));

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo._id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete this listing');
      }

      setUserListings((current) => current.filter((listing) => listing._id !== listingId));
      setListingStatus((current) => ({
        ...current,
        deletingId: '',
      }));
      showToast('success', 'Listing deleted successfully.');
    } catch (error) {
      setListingStatus((current) => ({
        ...current,
        deletingId: '',
      }));
      showToast('error', error.message || 'Something went wrong');
    }
  }

  return (
    <>
      <Toast
        open={toast.open}
        tone={toast.tone}
        message={toast.message}
        onClose={hideToast}
      />

      <section className="profile-shell">
        <div className="profile-hero">
          <article className="profile-card profile-main-card">
            <div className="profile-badge-row">
              <span className="eyebrow">Profile</span>
              <span className="profile-provider-pill">{providerLabel}</span>
            </div>

            <div className="profile-identity">
              <div className="profile-avatar-shell">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
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

            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <div className="profile-form-header">
                <span className="profile-card-label">Account details</span>
                <h2>Edit your name and email</h2>
              </div>

              <div className="profile-form-grid">
                <label className="profile-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileFieldChange}
                    placeholder="Your full name"
                  />
                </label>

                <label className="profile-field">
                  <span>Email address</span>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileFieldChange}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-primary-action"
                  disabled={status.savingProfile}
                >
                  {status.savingProfile ? 'Saving changes...' : 'Save profile changes'}
                </button>

                <p className="profile-form-feedback">
                  Update your account details and keep the marketplace info current.
                </p>
              </div>
            </form>

            <div className="profile-upload-panel">
              <div className="profile-upload-copy">
                <span className="profile-card-label">Profile image</span>
                <h2>Upload a sharper photo for your account</h2>
                <p>
                  Choose a PNG, JPG, or WEBP image up to 1.5MB. Your preview shows
                  immediately before you save it.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="profile-file-input"
                onChange={handleFileChange}
              />

              <div className="profile-upload-actions">
                <button
                  type="button"
                  className="profile-secondary-action"
                  onClick={openFilePicker}
                >
                  Choose image
                </button>

                <button
                  type="button"
                  className="profile-primary-action"
                  onClick={handleUploadAvatar}
                  disabled={status.uploading || !pendingAvatar}
                >
                  {status.uploading ? 'Uploading...' : 'Upload photo'}
                </button>
              </div>

              <p className="profile-upload-helper">
                {pendingFileName
                  ? `Selected file: ${pendingFileName}`
                  : 'No new image selected yet.'}
              </p>
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

              <button
                type="button"
                className="profile-danger-action"
                onClick={handleDeleteAccount}
                disabled={status.deletingAccount}
              >
                {status.deletingAccount ? 'Deleting account...' : 'Delete account'}
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

        <article className="profile-card profile-panel profile-listing-panel">
          <div className="profile-panel-header">
            <span className="profile-card-label">Your listings</span>
            <h2>Manage the cars you have already published</h2>
          </div>

          {listingStatus.loading ? (
            <p className="profile-form-feedback">Loading your listings...</p>
          ) : listingStatus.error ? (
            <p className="profile-form-feedback">{listingStatus.error}</p>
          ) : userListings.length ? (
            <div className="profile-listing-grid">
              {userListings.map((listing) => (
                <article key={listing._id} className="profile-listing-card">
                  <div className="profile-listing-header">
                    <strong>{getListingTitle(listing)}</strong>
                    <span>{formatPrice(listing.price)}</span>
                  </div>

                  <p>{listing.location}</p>

                  <div className="profile-listing-actions">
                    <Link to={`/inventory/${listing._id}`} className="text-link">
                      View listing
                    </Link>

                    <Link to={`/inventory/${listing._id}/edit`} className="text-link">
                      Edit listing
                    </Link>

                    <button
                      type="button"
                      className="profile-danger-inline"
                      onClick={() => handleDeleteListing(listing._id)}
                      disabled={listingStatus.deletingId === listing._id}
                    >
                      {listingStatus.deletingId === listing._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-link-list">
              <Link to="/sell" className="profile-link-card">
                <strong>Create your first listing</strong>
                <span>
                  You have not published any cars yet. Start with a new seller
                  listing now.
                </span>
              </Link>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

export default ProfilePage;
