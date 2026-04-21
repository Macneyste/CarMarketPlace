import { Link } from 'react-router-dom';

const cars = [
  { id: 'tesla-model-3', name: 'Tesla Model 3', year: 2024 },
  { id: 'bmw-x5', name: 'BMW X5', year: 2023 },
  { id: 'toyota-rav4', name: 'Toyota RAV4', year: 2024 },
];

function InventoryPage() {
  return (
    <section className="stack">
      <div className="section-heading">
        <span className="eyebrow">Pages and Routes</span>
        <h1>Inventory</h1>
        <p>Sample inventory cards are here only to verify navigation.</p>
      </div>

      <div className="card-grid">
        {cars.map((car) => (
          <article key={car.id} className="car-card">
            <span className="car-year">{car.year}</span>
            <h2>{car.name}</h2>
            <p>Route demo page for individual vehicle details.</p>
            <Link to={`/inventory/${car.id}`} className="text-link">
              View details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InventoryPage;
