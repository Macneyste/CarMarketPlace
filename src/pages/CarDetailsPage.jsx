import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatMileage, formatPrice, getListingTitle } from '../utils/listings';

function CarDetailsPage() {
  const { carId = '' } = useParams();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: '',
  });

  useEffect(() => {
    let ignore = false;

    async function loadListing() {
      try {
        const response = await fetch(`/api/listings/${carId}`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load this listing');
        }

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

  return (
    <section className="listing-details-layout">
      <article className="details-card">
        <span className="eyebrow">Vehicle details</span>
        <h1>{getListingTitle(listing)}</h1>

        {listing.images?.length ? (
          <div className="listing-gallery">
            {listing.images.map((image, index) => (
              <img
                key={`${listing._id}-${index + 1}`}
                src={image}
                alt={`${getListingTitle(listing)} ${index + 1}`}
                className="listing-gallery-image"
              />
            ))}
          </div>
        ) : (
          <div className="listing-gallery-empty">
            No listing images have been uploaded for this car yet.
          </div>
        )}

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
        <h2>{listing.owner?.name || 'Marketplace Member'}</h2>
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
      </aside>
    </section>
  );
}

export default CarDetailsPage;
