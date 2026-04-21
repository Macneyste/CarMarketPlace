import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatMileage, formatPrice, getListingTitle } from '../utils/listings';

const STATS = [
  { value: '500+', label: 'Cars Listed' },
  { value: '12', label: 'Cities Covered' },
  { value: '200+', label: 'Happy Sellers' },
  { value: '24/7', label: 'Always Open' },
];

const HOW_STEPS = [
  {
    icon: '🔍',
    step: '01',
    title: 'Browse the inventory',
    description: 'Explore hundreds of verified car listings with detailed specs, photos, and pricing.',
  },
  {
    icon: '📩',
    step: '02',
    title: 'Contact the seller',
    description: 'Send a direct message to the seller straight from the listing page — no middlemen.',
  },
  {
    icon: '🚗',
    step: '03',
    title: 'Drive away happy',
    description: 'Arrange a viewing, agree on a price, and close the deal with confidence.',
  },
];

function CarCard({ listing }) {
  const title = getListingTitle(listing);

  return (
    <article className="car-card home-car-card">
      <div className="home-car-image-wrap">
        {listing.images?.[0] ? (
          <img
            src={listing.images[0]}
            alt={title}
            className="home-car-image"
          />
        ) : (
          <div className="home-car-image-fallback">
            <span className="home-car-fallback-icon">🚘</span>
            <span>{listing.make}</span>
          </div>
        )}
        <span className="home-car-year-badge">{listing.year}</span>
      </div>

      <div className="home-car-body">
        <div className="home-car-top-row">
          <h2>{title}</h2>
          <span className="home-car-price">{formatPrice(listing.price)}</span>
        </div>

        <p className="home-car-description">{listing.description}</p>

        <div className="home-car-specs">
          <span>📍 {listing.location}</span>
          <span>⛽ {listing.fuelType}</span>
          <span>⚙️ {listing.transmission}</span>
          <span>🛣️ {formatMileage(listing.mileage)}</span>
        </div>

        <Link to={`/inventory/${listing._id}`} className="home-car-cta">
          View details →
        </Link>
      </div>
    </article>
  );
}

function HomePage() {
  const { isAuthenticated } = useAppContext();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadFeatured() {
      try {
        const response = await fetch('/api/listings');
        const data = await response.json().catch(() => []);

        if (!ignore && response.ok) {
          setListings(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch {
        // fail silently on homepage
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadFeatured();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="home-shell">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="eyebrow">🚀 Somalia&apos;s Premier Car Marketplace</span>
          <h1 className="home-hero-title">
            Find your next car.<br />
            <span className="home-hero-accent">Sell yours faster.</span>
          </h1>
          <p className="home-hero-subtitle">
            Browse verified listings from real sellers across Mogadishu, Hargeisa,
            Bosaso and more — with a clean experience built for buyers and sellers alike.
          </p>
          <div className="home-hero-actions">
            <Link to="/inventory" className="home-btn-primary">
              Browse all cars
            </Link>
            {isAuthenticated ? (
              <Link to="/sell" className="home-btn-secondary">
                List my car
              </Link>
            ) : (
              <Link to="/signup" className="home-btn-secondary">
                Create free account
              </Link>
            )}
          </div>
        </div>

        <div className="home-hero-card">
          <span className="home-hero-card-label">Marketplace at a glance</span>
          <div className="home-stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="home-stat-item">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="home-hero-badge-row">
            <span className="home-badge">✓ Verified Sellers</span>
            <span className="home-badge">✓ Free to Browse</span>
            <span className="home-badge">✓ Direct Contact</span>
          </div>
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="home-section">
        <div className="home-section-header">
          <div>
            <span className="eyebrow">🔥 Fresh off the lot</span>
            <h2 className="home-section-title">Featured listings</h2>
            <p className="home-section-subtitle">
              Hand-picked cars ready for a new owner. Browse the latest arrivals from trusted sellers.
            </p>
          </div>
          <Link to="/inventory" className="home-btn-ghost">
            View all listings →
          </Link>
        </div>

        {loading ? (
          <div className="home-loading">
            <div className="home-loading-spinner" />
            <p>Loading featured cars…</p>
          </div>
        ) : listings.length ? (
          <div className="home-car-grid">
            {listings.map((listing) => (
              <CarCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="home-empty">
            <span className="home-empty-icon">🚗</span>
            <h3>No listings yet</h3>
            <p>Be the first to publish a car and kickstart the marketplace.</p>
            <Link to={isAuthenticated ? '/sell' : '/signup'} className="home-btn-primary">
              {isAuthenticated ? 'Create a listing' : 'Join &amp; sell'}
            </Link>
          </div>
        )}
      </section>

      {/* ── How It Works ── */}
      <section className="home-section">
        <div className="home-section-header home-section-header-center">
          <span className="eyebrow">🗺️ Simple process</span>
          <h2 className="home-section-title">How it works</h2>
          <p className="home-section-subtitle">
            Three easy steps from browsing to driving away in your perfect car.
          </p>
        </div>

        <div className="home-how-grid">
          {HOW_STEPS.map((step) => (
            <article key={step.step} className="home-how-card">
              <div className="home-how-icon">{step.icon}</div>
              <span className="home-how-step-num">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="home-cta-banner">
        <div className="home-cta-copy">
          <h2>Ready to sell your car?</h2>
          <p>
            Create a free account and publish your listing in under 5 minutes.
            Reach thousands of buyers across Somalia.
          </p>
        </div>
        <div className="home-cta-actions">
          {isAuthenticated ? (
            <Link to="/sell" className="home-btn-primary">
              Create a listing now
            </Link>
          ) : (
            <>
              <Link to="/signup" className="home-btn-primary">
                Get started free
              </Link>
              <Link to="/signin" className="home-btn-white">
                Already have an account
              </Link>
            </>
          )}
        </div>
      </section>

    </div>
  );
}

export default HomePage;
