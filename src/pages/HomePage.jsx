import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Project Intro</span>
        <h1>Find your next car in one clean marketplace.</h1>
        <p>
          This starter focuses only on the first project steps: setup, page
          structure, and routing.
        </p>
        <div className="hero-actions">
          <Link to="/inventory" className="button button-primary">
            Browse inventory
          </Link>
          <Link to="/about" className="button button-secondary">
            Learn more
          </Link>
        </div>
      </div>

      <div className="hero-card">
        <h2>Starter Scope</h2>
        <ul className="feature-list">
          <li>Vite + React setup</li>
          <li>Shared layout with navigation</li>
          <li>Pages wired with React Router</li>
        </ul>
      </div>
    </section>
  );
}

export default HomePage;
