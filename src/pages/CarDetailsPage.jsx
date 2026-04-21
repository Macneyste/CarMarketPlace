import { Link, useParams } from 'react-router-dom';

function formatSlug(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function CarDetailsPage() {
  const { carId = '' } = useParams();

  return (
    <section className="details-card">
      <span className="eyebrow">Dynamic Route</span>
      <h1>{formatSlug(carId)}</h1>
      <p>
        This page confirms that the `inventory/:carId` route is connected and
        rendering correctly.
      </p>
      <Link to="/inventory" className="text-link">
        Back to inventory
      </Link>
    </section>
  );
}

export default CarDetailsPage;
