import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAppContext } from '../context/AppContext';

const initialForm = {
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

const initialToast = {
  open: false,
  tone: 'success',
  message: '',
};

const sellingPoints = [
  'Add a polished title and vehicle story',
  'Highlight mileage, location, and pricing clearly',
  'Publish a listing that looks ready for buyers immediately',
];

function CreateListingPage() {
  const navigate = useNavigate();
  const { userInfo } = useAppContext();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({
    submitting: false,
  });
  const [toast, setToast] = useState(initialToast);

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

  function validateForm() {
    if (
      !formData.title.trim() ||
      !formData.make.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.price ||
      !formData.mileage ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      return 'Please fill in all listing fields';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      showToast('error', validationMessage);
      return;
    }

    setStatus({
      submitting: true,
    });
    hideToast();

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: userInfo?._id,
          title: formData.title.trim(),
          make: formData.make.trim(),
          model: formData.model.trim(),
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          location: formData.location.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to publish this listing');
      }

      setStatus({
        submitting: false,
      });
      setFormData(initialForm);
      showToast('success', 'Listing published successfully. Opening it now...');

      window.setTimeout(() => {
        navigate(`/inventory/${data._id}`);
      }, 1200);
    } catch (error) {
      setStatus({
        submitting: false,
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

      <section className="listing-shell">
        <div className="listing-intro">
          <span className="eyebrow">Create listing</span>
          <h1>Publish a car listing with a cleaner seller experience.</h1>
          <p>
            Add the core details buyers care about first, then we will build on
            it with richer media and sharper presentation.
          </p>

          <div className="listing-highlight-grid">
            {sellingPoints.map((point) => (
              <article key={point} className="listing-highlight-card">
                <span className="signup-trust-dot" />
                <p>{point}</p>
              </article>
            ))}
          </div>

          <div className="listing-intro-panel">
            <span className="listing-intro-label">Seller note</span>
            <h2>Strong listings start with strong basics</h2>
            <p>
              Clear specs, clear pricing, and a simple description make your
              inventory look more trustworthy from the first click.
            </p>
          </div>
        </div>

        <div className="listing-form-card">
          <div className="signup-card-header">
            <span className="signup-badge">Seller flow</span>
            <h2>Build your listing</h2>
            <p>Enter the main details of the car you want to publish.</p>
          </div>

          <form className="listing-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Listing title</span>
              <input
                type="text"
                name="title"
                placeholder="2021 Toyota Corolla LE in excellent condition"
                value={formData.title}
                onChange={handleChange}
              />
            </label>

            <div className="listing-form-grid">
              <label className="field">
                <span>Make</span>
                <input
                  type="text"
                  name="make"
                  placeholder="Toyota"
                  value={formData.make}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span>Model</span>
                <input
                  type="text"
                  name="model"
                  placeholder="Corolla"
                  value={formData.model}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span>Year</span>
                <input
                  type="number"
                  name="year"
                  placeholder="2021"
                  value={formData.year}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span>Price</span>
                <input
                  type="number"
                  name="price"
                  placeholder="18500"
                  value={formData.price}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span>Mileage</span>
                <input
                  type="number"
                  name="mileage"
                  placeholder="42000"
                  value={formData.mileage}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span>Location</span>
                <input
                  type="text"
                  name="location"
                  placeholder="Mogadishu"
                  value={formData.location}
                  onChange={handleChange}
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
                placeholder="Tell buyers about the condition, service history, and standout features."
                value={formData.description}
                onChange={handleChange}
              />
            </label>

            <div className="listing-form-footer">
              <button
                type="submit"
                className="signup-submit"
                disabled={status.submitting}
              >
                {status.submitting ? 'Publishing listing...' : 'Publish listing'}
              </button>

              <p className="listing-footnote">
                Need to review current live listings first?{' '}
                <Link to="/inventory" className="text-link signup-link">
                  Browse inventory
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default CreateListingPage;
