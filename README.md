# 🚗 Car MarketPlace

A modern, full-stack web application designed for buying and selling cars. Built robustly using the MERN stack (MongoDB, Express.js, React, Node.js) with secure authentication and an intuitive user interface.

## ✨ Features

- **Secure User Authentication**: Custom email/password login securely hashed with bcryptjs, plus seamless integration with **Google OAuth**.
- **Car Listings Management**: Browse, create, and manage car listings in real-time.
- **Modern Frontend**: Built with React and Vite for a lightning-fast development experience and optimized production builds.
- **Robust RESTful API**: Powered by Express.js and Mongoose for efficient database operations and data modeling.

## 🛠️ Technology Stack

**Frontend**
- [React](https://reactjs.org/) (v18)
- [Vite](https://vitejs.dev/) - Frontend Tooling
- [React Router DOM](https://reactrouter.com/) - Navigation
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) - Google Login Integration

**Backend**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - Database and ODM
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password Hashing
- [google-auth-library](https://www.npmjs.com/package/google-auth-library) - Backend Google Verification

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or MongoDB Atlas)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd "Car MarketPlace"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory (you can use `.env.example` as a reference) and add the following keys:
   ```env
   # Example .env configuration
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the Application**
   The project is configured to run both the frontend and backend.

   *Start the frontend development server (Vite):*
   ```bash
   npm run dev
   ```

   *Start the backend development server (with Nodemon):*
   ```bash
   npm run dev:server
   ```

## 📂 Project Structure

```text
Car MarketPlace/
├── backend/            # Express server, controllers, models, and routes
│   └── server.js       # Main backend entry point
├── src/                # React frontend application
│   ├── components/     # Reusable UI components
│   └── App.jsx         # Main React application component
├── .env                # Environment variables (not tracked by git)
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is privately owned and developed.
