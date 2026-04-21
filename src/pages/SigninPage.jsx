import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { USER_STORAGE_KEY } from '../constants/auth';

const initialForm = {
  email: '',
  password: '',
};

const initialToast = {
  open: false,
  tone: 'success',
  message: '',
};

const trustPoints = [
  'Access saved favorites instantly',
  'Pick up where you left off',
  'Reach the right listings faster',
];

function SigninPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({
    loading: false,
  });
  const [toast, setToast] = useState(initialToast);

  const formIsComplete = formData.email.trim() && formData.password;

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
    const trimmedEmail = formData.email.trim();

    if (!trimmedEmail || !formData.password) {
      return 'Please enter your email and password';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setStatus({ loading: false });
      showToast('error', validationMessage);
      return;
    }

    setStatus({ loading: true });
    hideToast();

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await fetch('/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in');
      }

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
      setStatus({ loading: false });
      showToast(
        'success',
        `Welcome back, ${data.name}. Signing you in now...`,
      );
      setFormData(initialForm);

      window.setTimeout(() => {
        navigate('/inventory');
      }, 1400);
    } catch (error) {
      setStatus({ loading: false });
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
          <span className="eyebrow">Signin</span>
          <h1>Welcome back to your car search shortlist.</h1>
          <p>
            Sign in to continue browsing, revisit saved listings, and get back to
            the marketplace without starting over.
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
              <span className="signup-showcase-label">Member Access</span>
              <h2>Jump back in fast</h2>
              <p>
                Your account keeps the experience focused, so you can continue
                from the listings that already caught your attention.
              </p>
            </div>

            <div className="signup-showcase-metrics">
              <div>
                <strong>1 Login</strong>
                <span>Access your account instantly</span>
              </div>
              <div>
                <strong>Saved</strong>
                <span>Keep favorites in one place</span>
              </div>
              <div>
                <strong>Ready</strong>
                <span>Continue browsing smoothly</span>
              </div>
            </div>
          </div>
        </div>

        <div className="signup-card">
          <div className="signup-card-header">
            <span className="signup-badge">Sign in</span>
            <h2>Access your account</h2>
            <p>Use the email and password you created during signup.</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </label>

            <div className="signup-helper-row">
              <p className="signup-helper-text">
                Sign in with the same credentials you used when creating your
                marketplace account.
              </p>
            </div>

            <button
              type="submit"
              className="signup-submit"
              disabled={status.loading || !formIsComplete}
            >
              {status.loading ? 'Signing you in...' : 'Sign in to my account'}
            </button>
          </form>

          <p className="signup-footnote">
            This starter signs you in against the backend route you already
            connected to MongoDB.
          </p>

          <p className="signup-switch">
            Need a new account?{' '}
            <Link to="/signup" className="text-link signup-link">
              Create one here
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default SigninPage;
