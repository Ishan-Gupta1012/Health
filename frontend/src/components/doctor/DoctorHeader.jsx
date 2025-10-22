import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DoctorHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/doctor-dashboard' },
    { name: 'Appointments', path: '/doctor-appointments' },
    { name: 'Patients', path: '/doctor-patients' },
    { name: 'Prescriptions', path: '/doctor-prescriptions' }, // Added Prescriptions
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Left Side: Logo & Nav */}
          <div className="flex items-center space-x-10">
            <Link to="/doctor-dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">DocPortal</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path} // Use actual paths
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-100/60'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side: Profile & Notifications */}
          <div className="flex items-center space-x-5">
            <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>

            <div className="relative">
              <button className="flex items-center space-x-2">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Doctor'}&background=0D8ABC&color=fff`}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                />
                <div className="hidden md:block text-left">
                  <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </button>
              {/* Profile dropdown would go here */}
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;