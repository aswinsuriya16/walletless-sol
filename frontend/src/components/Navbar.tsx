import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div>
              <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Solana Wallet</h1>
              <p className="text-xs text-gray-400">Secure • Fast • Reliable</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-gray-100 transition-all duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="text-gray-300 hover:text-gray-100 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="text-gray-300 hover:text-gray-100 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 px-6 py-3 rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 