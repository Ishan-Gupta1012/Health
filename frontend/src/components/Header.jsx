import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Stethoscope,
  Search,
  Calendar,
  FileText,
  ClipboardList,
  ChevronDown,
  Brain,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const servicesTimeoutRef = useRef(null);

  const handleServicesMouseEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  const servicesItems = [
    { name: 'Symptom Checker', path: '/symptom-checker', icon: Stethoscope },
    { name: 'Find Doctors', path: '/doctor-finder', icon: Search },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, requiresAuth: true },
    { name: 'My Meals', path: '/my-meals', icon: ClipboardList, requiresAuth: true },
    { name: 'MediSage AI', path: '/medisage', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-500 to-green-400 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white heartbeat" />
            </div>
            <span className="text-xl font-bold text-black">HealthNest</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-black font-medium'
                    : 'text-black/80 hover:text-black'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
             <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  className="flex items-center px-3 py-2 rounded-lg text-black/80 hover:text-black"
                >
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <AnimatePresence>
                {isServicesOpen && (
                   <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    /* --- THIS IS THE CORRECTED STYLE --- */
                    /* A strong blur (backdrop-blur-xl) is applied ONLY to this dropdown div. */
                    /* The background is semi-transparent (bg-white/60) to enhance readability. */
                    className="absolute left-0 mt-2 w-56 bg-white/100 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 py-2"
                   >
                     {servicesItems.map((item) => (
                       <Link
                         key={item.name}
                         to={item.requiresAuth && !user ? "/signin" : item.path}
                         className="flex items-center space-x-3 px-4 py-2 text-black font-semibold hover:bg-black/10 rounded-lg"
                         onClick={() => setIsServicesOpen(false)}
                       >
                         <item.icon className="h-5 w-5" />
                         <span>{item.name}</span>
                       </Link>
                     ))}
                   </motion.div>
                )}
                </AnimatePresence>
             </div>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-black/10 transition-colors"
                >
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium text-black hidden md:block">
                    {user.name}
                  </span>
                </button>
                <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    /* --- THIS IS ALSO CORRECTED FOR CONSISTENCY --- */
                    className="absolute right-0 mt-2 w-48 bg-white/60 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 py-2"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-black font-semibold hover:bg-black/10 rounded-lg"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 font-semibold hover:bg-red-500/20 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/signin" className="btn-secondary hidden sm:block">Sign In</Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-md"
          >
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                 <Link key={item.name} to={item.path} className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors ${isActive(item.path) ? 'text-black' : 'text-black/80 hover:text-black'}`} onClick={() => setIsMenuOpen(false)}>
                    <span>{item.name}</span>
                 </Link>
              ))}
              <div className="px-4 pt-2">
                <p className="text-sm font-semibold text-black/60">Services</p>
              </div>
              {servicesItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.requiresAuth && !user ? "/signin" : item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-black/80 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {!user && (
                <Link to="/signin" className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-black/80 hover:text-black" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;