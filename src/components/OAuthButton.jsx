import { GoogleLogin } from '@react-oauth/google';

const googleClientIdConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

function OAuthButton({ mode = 'signin', onSuccess, onError, disabled = false }) {
  if (!googleClientIdConfigured) {
    return (
      <button
        type="button"
        className="oauth-fallback"
        onClick={() =>
          onError(
            'Add GOOGLE_CLIENT_ID and VITE_GOOGLE_CLIENT_ID in your .env to enable Google OAuth.',
          )
        }
        disabled={disabled}
      >
        Continue with Google
      </button>
    );
  }

  return (
    <div className="oauth-button-shell">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) {
            onError('Google sign-in did not return a credential.');
            return;
          }

          onSuccess(credentialResponse.credential);
        }}
        onError={() => {
          onError('Google sign-in was cancelled or failed.');
        }}
        text={mode === 'signup' ? 'signup_with' : 'continue_with'}
        theme="outline"
        shape="pill"
        size="large"
        width="320"
        useOneTap={false}
      />
    </div>
  );
}

export default OAuthButton;
