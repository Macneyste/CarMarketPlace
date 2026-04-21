import 'dotenv/config';
import app from './app.js';
import connectDB from './config/connectDB.js';
import seedDatabase from './seed.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
