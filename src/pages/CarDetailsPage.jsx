import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAppContext } from '../context/AppContext';
import { fetchListingById } from '../utils/listingApi';
import { formatMileage, formatPrice, getListingTitle } from '../utils/listings';

function CarDetailsPage() {
  const { carId = '' } = useParams();
  const { userInfo } = useAppContext();
  const [listing, setListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState({
    sending: false,
  });
  const [toast, setToast] = useState({
    open: false,
    tone: 'success',
    message: '',
  });
  const [status, setStatus] = useState({
    loading: true,
    error: '',
  });

  useEffect(() => {
    let ignore = false;

    async function loadListing() {
      try {
        const data = await fetchListingById(carId);

        if (!ignore) {
          setListing(data);
          setStatus({
            loading: false,
            error: '',
          });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            loading: false,
            error: error.message || 'Something went wrong',
          });
        }
      }
    }

    loadListing();

    return () => {
      ignore = true;
    };
  }, [carId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [listing?._id]);

  useEffect(() => {
    setContactForm((current) => ({
      ...current,
      name: userInfo?.name || '',
      email: userInfo?.email || '',
    }));
  }, [userInfo?.name, userInfo?.email]);

  function showToast(tone, message) {
    setToast({
      open: true,
      tone,
      message,
    });
  }

  function hideToast() {
    setToast({
      open: false,
      tone: 'success',
      message: '',
    });
  }

  function handleContactChange(event) {
    const { name, value } = event.target;

    setContactForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  if (status.loading) {
    return (
      <section className="details-card">
        <span className="eyebrow">Loading</span>
        <h1>Preparing listing details...</h1>
        <p>The selected car is loading right now.</p>
      </section>
    );
  }

  if (status.error || !listing) {
    return (
      <section className="details-card">
        <span className="eyebrow">Listing status</span>
        <h1>Listing unavailable</h1>
        <p>{status.error || 'This listing could not be found.'}</p>
        <Link to="/inventory" className="text-link">
          Back to inventory
        </Link>
      </section>
    );
  }

  const isOwner = userInfo?._id && userInfo._id === listing.owner?._id;

  async function handleContactSubmit(event) {
    event.preventDefault();

    setContactStatus({
      sending: true,
    });
    hideToast();

    try {
      const response = await fetch(`/api/listings/${listing._id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send your seller message');
      }

      setContactStatus({
        sending: false,
      });
      setContactForm((current) => ({
        ...current,
        message: '',
      }));
      showToast('success', data.message || 'Your message was sent successfully.');
    } catch (error) {
      setContactStatus({
        sending: false,
      });
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

      <section className="listing-details-layout">
        <article className="details-card">
        <span className="eyebrow">Vehicle details</span>
        <h1>{getListingTitle(listing)}</h1>

        <div className="listing-detail-topbar">
          <span className="inventory-price">{formatPrice(listing.price)}</span>
          <span className="listing-status-pill">{listing.status}</span>
        </div>

        {listing.images?.length ? (
          <div className="listing-slider">
            <div className="listing-slider-stage">
              <img
                src={listing.images[activeImageIndex]}
                alt={`${getListingTitle(listing)} ${activeImageIndex + 1}`}
                className="listing-slider-image"
              />

              {listing.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="listing-slider-button listing-slider-button-left"
                    onClick={() =>
                      setActiveImageIndex((current) =>
                        current === 0 ? listing.images.length - 1 : current - 1,
                      )
                    }
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    className="listing-slider-button listing-slider-button-right"
                    onClick={() =>
                      setActiveImageIndex((current) =>
                        current === listing.images.length - 1 ? 0 : current + 1,
                      )
                    }
                  >
                    Next
                  </button>
                </>
              ) : null}
            </div>

            {listing.images.length > 1 ? (
              <div className="listing-slider-thumbs">
                {listing.images.map((image, index) => (
                  <button
                    key={`${listing._id}-thumb-${index + 1}`}
                    type="button"
                    className={
                      index === activeImageIndex
                        ? 'listing-thumb listing-thumb-active'
                        : 'listing-thumb'
                    }
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${getListingTitle(listing)} thumbnail ${index + 1}`}
                      className="listing-thumb-image"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="listing-gallery-empty">
            No listing images have been uploaded for this car yet.
          </div>
        )}

        <div className="listing-highlight-strip">
          <div>
            <strong>{listing.year}</strong>
            <span>Year</span>
          </div>
          <div>
            <strong>{formatMileage(listing.mileage)}</strong>
            <span>Mileage</span>
          </div>
          <div>
            <strong>{listing.fuelType}</strong>
            <span>Fuel type</span>
          </div>
          <div>
            <strong>{listing.transmission}</strong>
            <span>Transmission</span>
          </div>
        </div>

        <p>{listing.description}</p>

        <div className="listing-spec-grid">
          <div>
            <span>Price</span>
            <strong>{formatPrice(listing.price)}</strong>
          </div>
          <div>
            <span>Mileage</span>
            <strong>{formatMileage(listing.mileage)}</strong>
          </div>
          <div>
            <span>Fuel type</span>
            <strong>{listing.fuelType}</strong>
          </div>
          <div>
            <span>Transmission</span>
            <strong>{listing.transmission}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{listing.location}</strong>
          </div>
          <div>
            <span>Model year</span>
            <strong>{listing.year}</strong>
          </div>
        </div>

        <Link to="/inventory" className="text-link">
          Back to inventory
        </Link>
        </article>

        <aside className="listing-summary-card">
          <span className="profile-card-label">Seller summary</span>
          <div className="listing-seller-head">
            <div className="listing-seller-avatar">
              {listing.owner?.avatar ? (
                <img
                  src={listing.owner.avatar}
                  alt={listing.owner?.name || 'Seller avatar'}
                  className="listing-seller-avatar-image"
                />
              ) : (
                <span>
                  {(listing.owner?.name || 'Seller')
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join('')}
                </span>
              )}
            </div>

            <div className="listing-seller-copy">
              <h2>{listing.owner?.name || 'Marketplace Member'}</h2>
              <span>{listing.location}</span>
            </div>
          </div>

          <p>
            This listing is live in the marketplace and ready for buyers to review
            with a clearer detail layout.
          </p>

          <div className="listing-summary-stack">
            <div>
              <strong>Email</strong>
              <span>{listing.owner?.email || 'No email available'}</span>
            </div>
            <div>
              <strong>Status</strong>
              <span>{listing.status}</span>
            </div>
            <div>
              <strong>Published</strong>
              <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {!isOwner ? (
            <form className="listing-contact-form" onSubmit={handleContactSubmit}>
              <div className="listing-contact-header">
                <span className="profile-card-label">Contact seller</span>
                <h3>Send a direct message about this car</h3>
              </div>

              <label className="field">
                <span>Your name</span>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                />
              </label>

              <label className="field">
                <span>Your email</span>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                />
              </label>

              <label className="field">
                <span>Your message</span>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder="Ask about condition, availability, or your preferred viewing time."
                  minLength="20"
                  required
                />
              </label>

              <button
                type="submit"
                className="signup-submit"
                disabled={contactStatus.sending}
              >
                {contactStatus.sending ? 'Sending message...' : 'Send message'}
              </button>
            </form>
          ) : null}

          <div className="listing-summary-actions">
            <Link to="/inventory" className="header-secondary-cta">
              Browse more cars
            </Link>
            {isOwner ? (
              <Link to={`/inventory/${listing._id}/edit`} className="header-cta">
                Edit my listing
              </Link>
            ) : null}
          </div>
        </aside>
      </section>
    </>
  );
}

export default CarDetailsPage;
