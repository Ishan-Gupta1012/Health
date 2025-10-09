import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import useAuthHook from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuthHook();
  const [editing, setEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Profile</h1>
          <p className="text-xl text-gray-600">Manage your account information</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold">{user?.name || 'User Name'}</h2>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <span>{user?.email || 'user@example.com'}</span>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <span>Member since 2024</span>
            </div>
          </div>

          <div className="mt-8">
            <button className="btn-primary w-full" data-testid="edit-profile-btn">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;