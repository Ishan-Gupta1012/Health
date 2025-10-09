import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Heart, 
  User, 
  LogOut,
  Stethoscope,
  Search,
  Calendar,
  FileText
} from 'lucide-react';
import useAuthHook from '../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuthHook();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('healthnest_token');
    localStorage.removeItem('healthnest_user');
    window.location.href = '/';
  };

  const navigationItems = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: Stethoscope },
    { name: 'Find Doctors', path: '/doctor-finder', icon: Search },
    ...(user ? [
      { name: 'Reminders', path: '/medicine-reminders', icon: Calendar },
      { name: 'Medical Records', path: '/medical-records', icon: FileText },
    ] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg"
            >
              <Heart className="h-6 w-6 text-white heartbeat" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">HealthNest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid="user-profile-button"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-white hidden md:block">
                    {user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 py-2"
                    data-testid="profile-dropdown"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:bg-white/20"
                      onClick={() => setIsProfileOpen(false)}
                      data-testid="profile-link"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/20"
                      data-testid="logout-button"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/signin"
                  className="btn-secondary hidden sm:block"
                  data-testid="signin-button"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-md"
            data-testid="mobile-menu"
          >
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white border-r-2 border-green-400'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {!user && (
                <Link
                  to="/signin"
                  className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="mobile-signin-button"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;