import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/signin" element={!isAuthenticated ? <SignIn setIsAuthenticated={setIsAuthenticated} setToken={setToken} /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard token={token} /> : <Navigate to="/signin" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
