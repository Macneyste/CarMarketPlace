import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatMileage, formatPrice, getListingTitle } from '../utils/listings';

function InventoryPage() {
  const { isAuthenticated } = useAppContext();
  const [status, setStatus] = useState({
    loading: true,
    error: '',
  });
  const [listings, setListings] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadListings() {
      try {
        const response = await fetch('/api/listings');
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load listings');
        }

        if (!ignore) {
          setListings(Array.isArray(data) ? data : []);
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

    loadListings();

    return () => {
      ignore = true;
    };
  }, []);

  const ctaPath = isAuthenticated ? '/sell' : '/signup';
  const ctaLabel = isAuthenticated ? 'Create a listing' : 'Create an account';

  return (
    <section className="stack">
      <div className="section-heading">
        <span className="eyebrow">Marketplace inventory</span>
        <h1>Explore live listings from the marketplace</h1>
        <p>
          Browse published cars, compare core specs quickly, and open each
          listing for a cleaner detail view.
        </p>
      </div>

      {status.loading ? (
        <article className="inventory-empty-card">
          <h2>Loading listings...</h2>
          <p>The marketplace inventory is being prepared now.</p>
        </article>
      ) : status.error ? (
        <article className="inventory-empty-card">
          <h2>Unable to load listings</h2>
          <p>{status.error}</p>
        </article>
      ) : listings.length ? (
        <div className="card-grid">
          {listings.map((listing) => (
            <article key={listing._id} className="car-card inventory-card">
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0]}
                  alt={getListingTitle(listing)}
                  className="inventory-cover-image"
                />
              ) : (
                <div className="inventory-cover-fallback">No image uploaded</div>
              )}

              <div className="inventory-card-top">
                <span className="car-year">{listing.year}</span>
                <span className="inventory-price">{formatPrice(listing.price)}</span>
              </div>

              <h2>{getListingTitle(listing)}</h2>
              <p>{listing.description}</p>

              <div className="inventory-meta-grid">
                <span>{listing.location}</span>
                <span>{formatMileage(listing.mileage)}</span>
                <span>{listing.fuelType}</span>
                <span>{listing.transmission}</span>
              </div>

              <span className="inventory-owner">
                Seller: {listing.owner?.name || 'Marketplace Member'}
              </span>

              <Link to={`/inventory/${listing._id}`} className="text-link">
                View details
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <article className="inventory-empty-card">
          <h2>No listings are live yet</h2>
          <p>
            The inventory is currently empty. Be the first to publish a car and
            start the marketplace.
          </p>
          <Link to={ctaPath} className="button button-primary">
            {ctaLabel}
          </Link>
        </article>
      )}
    </section>
  );
}

export default InventoryPage;
