import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

const trustPoints = [
  'New deals added every day',
  'Verified seller onboarding flow',
  'Fast shortlist and inquiry experience',
];

function SignupPage() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus({
      loading: true,
      error: '',
      success: '',
    });

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account');
      }

      setStatus({
        loading: false,
        error: '',
        success: `Welcome, ${data.name}. Your account has been created.`,
      });

      setFormData(initialForm);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'Something went wrong',
        success: '',
      });
    }
  }

  return (
    <section className="signup-shell">
      <div className="signup-intro">
        <span className="eyebrow">Signup</span>
        <h1>Join the marketplace with a polished, fast account setup.</h1>
        <p>
          Create your buyer account to save favorites, compare listings, and
          move faster when the right car shows up.
        </p>

        <div className="signup-trust-grid">
          {trustPoints.map((point) => (
            <article key={point} className="signup-trust-card">
              <span className="signup-trust-dot" />
              <p>{point}</p>
            </article>
          ))}
        </div>

        <div className="signup-showcase">
          <div className="signup-showcase-copy">
            <span className="signup-showcase-label">Member Preview</span>
            <h2>Shortlist smarter</h2>
            <p>
              Keep your favorite vehicles in one place and return to them
              whenever you are ready to compare.
            </p>
          </div>

          <div className="signup-showcase-metrics">
            <div>
              <strong>24/7</strong>
              <span>Saved access</span>
            </div>
            <div>
              <strong>Fresh</strong>
              <span>Daily listing updates</span>
            </div>
            <div>
              <strong>Quick</strong>
              <span>Cleaner inquiry flow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-card">
        <div className="signup-card-header">
          <span className="signup-badge">Create account</span>
          <h2>Start in under a minute</h2>
          <p>Use your email and a secure password to open your account.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Abdirahman Ali"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </label>

          <button
            type="submit"
            className="signup-submit"
            disabled={status.loading}
          >
            {status.loading ? 'Creating account...' : 'Create my account'}
          </button>

          {status.error ? <p className="form-message form-error">{status.error}</p> : null}
          {status.success ? (
            <p className="form-message form-success">{status.success}</p>
          ) : null}
        </form>

        <p className="signup-footnote">
          By continuing, you agree to a simple account setup experience for this
          starter project.
        </p>

        <p className="signup-switch">
          Want to explore first?{' '}
          <Link to="/inventory" className="text-link signup-link">
            Browse the inventory
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
