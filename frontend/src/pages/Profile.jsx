import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, UsersRound, Save, Edit, X, Ruler, Weight } from 'lucide-react'; 
import useAuthHook from '../hooks/useAuth';

// --- Helper Functions (Keep these outside) ---

const toDateInputFormat = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

const DateDisplay = ({ dateString }) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50">
        <div className="flex items-center">
            <Icon className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm font-medium text-gray-700">{label}:</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
);

// --- VIEW COMPONENTS (MOVED OUTSIDE 'Profile' TO FIX FOCUS ISSUE) ---

// Component for the read-only display
const ProfileDisplay = ({ user }) => {
    const HeightDisplayValue = () => {
        const ft = user?.heightFt;
        const inch = user?.heightIn;
        if ((ft === null || ft === undefined || ft === '') && (inch === null || inch === undefined || inch === '')) return 'N/A';
        
        let display = '';
        if (ft !== null && ft !== undefined && ft !== '') display += `${ft}'`;
        if (inch !== null && inch !== undefined && inch !== '') display += ` ${inch}"`;
        
        return display.trim() || 'N/A';
    }

    const WeightDisplayValue = () => {
        const weight = user?.weightKg;
        return (weight !== null && weight !== undefined && weight !== '') ? `${weight} kg` : 'N/A';
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-1">Personal Information</h3>
            <div className="space-y-4">
                <DetailRow 
                    icon={Calendar} 
                    label="Date of Birth" 
                    value={<DateDisplay dateString={user?.dateOfBirth} />} 
                />
                <DetailRow 
                    icon={UsersRound} 
                    label="Gender" 
                    value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'} 
                />
                <DetailRow 
                    icon={Ruler} 
                    label="Height" 
                    value={<HeightDisplayValue />} 
                />
                <DetailRow 
                    icon={Weight} 
                    label="Weight" 
                    value={<WeightDisplayValue />} 
                />
            </div>
        </div>
    );
};

// Component for the editable form
const ProfileEditForm = ({ formData, handleChange, handleSubmit, handleEditToggle, isSubmitting, error, success }) => (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-1">Personal Information</h3>

        {/* Date of Birth */}
        <div>
            <label htmlFor="dateOfBirth" className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
            <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
        </div>

        {/* Gender */}
        <div>
            <label htmlFor="gender" className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
            <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
            <option value="other">Other</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            </select>
        </div>

        {/* Height */}
        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Height (ft & in)</label>
            <div className="flex space-x-4">
            <input
                type="number"
                name="heightFt"
                value={formData.heightFt}
                onChange={handleChange}
                min="0"
                placeholder="Feet (ft)"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <input
                type="number"
                name="heightIn"
                value={formData.heightIn}
                onChange={handleChange}
                min="0"
                max="11"
                placeholder="Inches (in)"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            </div>
        </div>

        {/* Weight */}
        <div>
            <label htmlFor="weightKg" className="block text-xs font-medium text-gray-500 mb-1">Weight (kg)</label>
            <input
            type="number"
            name="weightKg"
            id="weightKg"
            value={formData.weightKg}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Weight in kg"
            />
        </div>
        
        {/* Name and Phone - Editable in Edit Mode */}
        <div className="pt-4 space-y-4">
            <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
            <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your name"
            />
            <label htmlFor="phone" className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
            <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="+1 (555) 555-5555"
            />
        </div>

        {/* Status Message */}
        {error && (
            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg" role="alert">
                {error}
            </div>
        )}
        
        {/* Save and Cancel Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
            <button
            type="button"
            onClick={handleEditToggle}
            className="w-full sm:w-1/3 py-3 px-4 text-center border border-gray-300 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
            <X className="h-5 w-5 mr-2" />
            Cancel
            </button>
            <button
            type="submit"
            className="w-full sm:w-2/3 py-3 px-4 text-center rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 flex items-center justify-center transition"
            disabled={isSubmitting}
            >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    </form>
);

// --- Main Profile Component ---

const Profile = () => {
  const { user, updateProfile } = useAuthHook(); 
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dateOfBirth: toDateInputFormat(user?.dateOfBirth), 
    gender: user?.gender || 'other',
    heightFt: user?.heightFt || '',
    heightIn: user?.heightIn || '',
    weightKg: user?.weightKg || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dateOfBirth: toDateInputFormat(user.dateOfBirth),
        gender: user.gender || 'other',
        heightFt: user.heightFt || '',
        heightIn: user.heightIn || '',
        weightKg: user.weightKg || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === 'number') {
        value = value === '' ? '' : Number(value);
    }
    setFormData((prevFormData) => ({ ...prevFormData, [e.target.name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleEditToggle = () => {
    if (editing) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dateOfBirth: toDateInputFormat(user.dateOfBirth),
        gender: user.gender || 'other',
        heightFt: user.heightFt || '',
        heightIn: user.heightIn || '',
        weightKg: user.weightKg || '',
      });
    }
    setEditing(!editing);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const updates = {};
    const checkUpdate = (key, value) => {
      if (String(user[key] || '') !== String(value || '')) {
        updates[key] = value === '' ? null : value;
      }
    }

    checkUpdate('name', formData.name);
    checkUpdate('phone', formData.phone);
    checkUpdate('gender', formData.gender);
    checkUpdate('heightFt', formData.heightFt);
    checkUpdate('heightIn', formData.heightIn);
    checkUpdate('weightKg', formData.weightKg);

    const currentDobFormatted = toDateInputFormat(user.dateOfBirth);
    if (formData.dateOfBirth !== currentDobFormatted) {
      updates.dateOfBirth = formData.dateOfBirth || null;
    }

    if (Object.keys(updates).length > 0) {
      const result = await updateProfile(updates);

      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
      } else {
        setError(result.error);
      }
    } else {
      setSuccess('No changes detected.');
      setEditing(false);
    }

    setIsSubmitting(false);
  };

  // The main layout, using the external components
  return (
    <motion.div
        initial={{ opacity: 0, x: 50 }} // Slide-in from right animation
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-green-50 to-pink-50 p-4 sm:p-8"
    >
        <div className="w-full h-full"> 
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Profile</h1>

            {/* Profile Card: Centered and full width of the container */}
            <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-4xl mx-auto w-full"> 
                
                {/* Edit Button */}
                <button 
                className={`absolute top-4 right-4 p-2 rounded-full text-white font-medium shadow-md transition ${editing ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
                onClick={handleEditToggle}
                data-testid="edit-profile-btn"
                disabled={editing}
                >
                <Edit className="h-5 w-5" />
                </button>

                {/* User Header Section (Avatar, Name, Contact) */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b mb-6">
                
                    {/* Circular Avatar */}
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-3xl font-bold text-white">
                            {getInitials(user?.name)}
                        </span>
                    </div>

                    {/* User Details */}
                    <div className="text-center md:text-left space-y-1 w-full">
                        <p className="text-2xl font-bold text-gray-800">{user?.name || 'User Name'}</p>
                        
                        {/* Email */}
                        <div className="flex items-center justify-center md:justify-start text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <p className="text-sm">{user?.email || 'N/A'}</p>
                        </div>
                        
                        {/* Phone */}
                        <div className="flex items-center justify-center md:justify-start text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <p className="text-sm">{editing ? formData.phone || 'N/A' : user?.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                
                {/* Status Message */}
                {success && !editing && (
                    <div className="mb-4 p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg" role="alert">
                        {success}
                    </div>
                )}

                {/* Conditional Display: View or Edit Form */}
                {/* PASSING STATE AND HANDLERS AS PROPS */}
                {editing ? (
                    <ProfileEditForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleEditToggle={handleEditToggle}
                        isSubmitting={isSubmitting}
                        error={error}
                        success={success}
                    />
                ) : (
                    <ProfileDisplay user={user} />
                )}
            </div>
        </div>
    </motion.div>
  );
};

export default Profile;