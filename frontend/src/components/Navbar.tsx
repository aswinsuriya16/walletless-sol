import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            SOLANA WALLET
          </Link>
          <div className="flex space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors duration-200">
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