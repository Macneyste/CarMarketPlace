import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAppContext } from '../context/AppContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialToast = {
  open: false,
  tone: 'success',
  message: '',
};

const trustPoints = [
  'New deals added every day',
  'Verified seller onboarding flow',
  'Fast shortlist and inquiry experience',
];

function SignupPage() {
  const navigate = useNavigate();
  const { saveUser } = useAppContext();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({
    loading: false,
  });
  const [toast, setToast] = useState(initialToast);

  const formIsComplete =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword;

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
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || !trimmedEmail || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all signup fields';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setStatus({
        loading: false,
      });
      showToast('error', validationMessage);

      return;
    }

    setStatus({
      loading: true,
    });
    hideToast();

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account');
      }

      saveUser(data);

      setStatus({
        loading: false,
      });
      showToast(
        'success',
        `Welcome, ${data.name}. Your account has been created. Redirecting you now...`,
      );

      setFormData(initialForm);

      window.setTimeout(() => {
        navigate('/inventory');
      }, 1400);
    } catch (error) {
      setStatus({
        loading: false,
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

            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </label>

            <div className="signup-helper-row">
              <p className="signup-helper-text">
                {formData.password && formData.confirmPassword
                  ? formData.password === formData.confirmPassword
                    ? 'Passwords match and are ready to submit.'
                    : 'Make sure both password fields match.'
                  : 'Use at least 6 characters for your password.'}
              </p>
            </div>

            <button
              type="submit"
              className="signup-submit"
              disabled={status.loading || !formIsComplete}
            >
              {status.loading ? 'Creating account...' : 'Create my account'}
            </button>
          </form>

          <p className="signup-footnote">
            By continuing, you agree to a simple account setup experience for this
            starter project.
          </p>

          <p className="signup-switch">
            Already have an account?{' '}
            <Link to="/signin" className="text-link signup-link">
              Sign in here
            </Link>
          </p>

          <p className="signup-switch">
            Want to explore first?{' '}
            <Link to="/inventory" className="text-link signup-link">
              Browse the inventory
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default SignupPage;
