import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="details-card">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The route you tried does not exist in this starter project.</p>
      <Link to="/" className="text-link">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;
