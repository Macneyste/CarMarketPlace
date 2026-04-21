import { GoogleOAuthProvider } from '@react-oauth/google';

function OAuthProviderWrapper({ children }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return children;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}

export default OAuthProviderWrapper;
