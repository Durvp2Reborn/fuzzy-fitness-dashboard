import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InputForm from './pages/InputForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏋️</span>
                <h1 className="text-xl font-bold text-gradient">
                  Fuzzy Fitness Dashboard
                </h1>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/input"
                  className="btn-primary"
                >
                  Enter Data
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/input" element={<InputForm />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>Fuzzy Fitness Dashboard - Using fuzzy logic for personalized fitness recommendations</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
