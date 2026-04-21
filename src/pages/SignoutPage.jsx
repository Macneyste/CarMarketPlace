import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function SignoutPage() {
  const navigate = useNavigate();
  const { signout } = useAppContext();

  useEffect(() => {
    signout();
    navigate('/signin', {
      replace: true,
      state: {
        toast: {
          tone: 'success',
          message: 'You have been signed out successfully.',
        },
      },
    });
  }, [navigate, signout]);

  return (
    <section className="details-card">
      <span className="eyebrow">Signout</span>
      <h1>Signing you out...</h1>
      <p>Your session is being cleared and you are being redirected securely.</p>
    </section>
  );
}

export default SignoutPage;
