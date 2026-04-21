import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAppContext } from '../context/AppContext';
import { fetchListingById } from '../utils/listingApi';

const initialToast = {
  open: false,
  tone: 'success',
  message: '',
};

const emptyForm = {
  title: '',
  make: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  location: '',
  description: '',
};

function EditListingPage() {
  const navigate = useNavigate();
  const { carId = '' } = useParams();
  const { userInfo } = useAppContext();
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState({
    loading: true,
    saving: false,
    error: '',
  });
  const [toast, setToast] = useState(initialToast);

  useEffect(() => {
    let ignore = false;

    async function loadListing() {
      try {
        const listing = await fetchListingById(carId);

        if (!ignore) {
          setFormData({
            title: listing.title || '',
            make: listing.make || '',
            model: listing.model || '',
            year: String(listing.year || ''),
            price: String(listing.price || ''),
            mileage: String(listing.mileage || ''),
            fuelType: listing.fuelType || 'Petrol',
            transmission: listing.transmission || 'Automatic',
            location: listing.location || '',
            description: listing.description || '',
          });
          setStatus({
            loading: false,
            saving: false,
            error: '',
          });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            loading: false,
            saving: false,
            error: error.message || 'Unable to load this listing',
          });
        }
      }
    }

    loadListing();

    return () => {
      ignore = true;
    };
  }, [carId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

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

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus((current) => ({
      ...current,
      saving: true,
    }));
    hideToast();

    try {
      const response = await fetch(`/api/listings/${carId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo?._id,
          ...formData,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update this listing');
      }

      setStatus((current) => ({
        ...current,
        saving: false,
      }));
      showToast('success', 'Listing updated successfully.');

      window.setTimeout(() => {
        navigate(`/inventory/${data._id}`);
      }, 1200);
    } catch (error) {
      setStatus((current) => ({
        ...current,
        saving: false,
      }));
      showToast('error', error.message || 'Something went wrong');
    }
  }

  if (status.loading) {
    return (
      <section className="details-card">
        <span className="eyebrow">Listing editor</span>
        <h1>Loading your listing...</h1>
        <p>We are preparing the editor with the current listing data.</p>
      </section>
    );
  }

  if (status.error) {
    return (
      <section className="details-card">
        <span className="eyebrow">Listing editor</span>
        <h1>Unable to open this listing</h1>
        <p>{status.error}</p>
        <Link to="/profile" className="text-link">
          Back to profile
        </Link>
      </section>
    );
  }

  return (
    <>
      <Toast
        open={toast.open}
        tone={toast.tone}
        message={toast.message}
        onClose={hideToast}
      />

      <section className="listing-shell">
        <div className="listing-intro">
          <span className="eyebrow">Edit listing</span>
          <h1>Update the details of your published car listing.</h1>
          <p>
            Make quick changes to the vehicle details and push a cleaner updated
            version back to the marketplace.
          </p>

          <div className="listing-intro-panel">
            <span className="listing-intro-label">Editor status</span>
            <h2>Your current listing data is loaded</h2>
            <p>
              Edit the basics here, then return to the live listing once your
              changes are saved.
            </p>
          </div>
        </div>

        <div className="listing-form-card">
          <div className="signup-card-header">
            <span className="signup-badge">Listing editor</span>
            <h2>Refine your listing</h2>
            <p>Update any field below and save the latest version.</p>
          </div>

          <form className="listing-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Listing title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <div className="listing-form-grid">
              <label className="field">
                <span>Make</span>
                <input type="text" name="make" value={formData.make} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>Model</span>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>Year</span>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>Price</span>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>Mileage</span>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Location</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Fuel type</span>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </label>

              <label className="field">
                <span>Transmission</span>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>

            <div className="listing-form-footer">
              <button
                type="submit"
                className="signup-submit"
                disabled={status.saving}
              >
                {status.saving ? 'Saving listing...' : 'Save listing changes'}
              </button>

              <p className="listing-footnote">
                Want to go back first?{' '}
                <Link to="/profile" className="text-link signup-link">
                  Open your profile
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default EditListingPage;
