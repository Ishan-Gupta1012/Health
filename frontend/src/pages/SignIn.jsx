import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Eye, EyeOff, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient', // Default role
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      // Calls register with correct argument order from your useAuth.js
      // (name, email, password, role)
      result = await register(formData.name, formData.email, formData.password, formData.role);
    }

    if (result.success) {
      navigate('/'); // Navigate to home, Home.jsx will redirect based on role
    } else {
      setError(result.error);
    }

    setLoading(false);
  };
  
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white heartbeat" />
            </div>
            <span className="text-2xl font-bold text-black">HealthNest</span>
          </Link>
          <h2 className="text-3xl font-bold text-black mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-black/80">
            {isLogin 
              ? 'Sign in to access your dashboard' 
              : 'Join to manage your health with HealthNest'
            }
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="auth-form">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 text-red-700 px-4 py-3 rounded-lg text-sm"
                data-testid="error-message"
              >
                {error}
              </motion.div>
            )}

            {/* Role Selector */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('patient')}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'patient' 
                      ? 'bg-blue-500/30 border-blue-600 text-blue-800' 
                      : 'bg-white/30 border-white/50 text-black/70 hover:bg-white/50'
                  }`}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  <span className="font-medium">I'm a Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('doctor')}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'doctor' 
                      ? 'bg-green-500/30 border-green-600 text-green-800' 
                      : 'bg-white/30 border-white/50 text-black/70 hover:bg-white/50'
                  }`}
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span className="font-medium">I'm a Doctor</span>
                </button>
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/50" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    /* UPDATED: Added 'pr-4' for right-side padding */
                    className="input pl-10 pr-4"
                    placeholder="Full Name"
                    data-testid="name-input"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/50" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  /* UPDATED: Added 'pr-4' for right-side padding */
                  className="input pl-10 pr-4"
                  placeholder="Email Address"
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/50" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  /* UNCHANGED: This one was correct as 'pr-10' was already present */
                  className="input pl-10 pr-10"
                  placeholder="Password"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black"
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-button"
            >
              {loading ? <LoadingSpinner size="small" color="white" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/10 text-black/80 backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center px-4 py-3 border border-black/20 rounded-lg text-black bg-white/50 hover:bg-white/70 transition-colors duration-200"
              data-testid="google-signin-button"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.229 1.621-2.029 3.559-2.029 5.706s.8 4.085 2.029 5.706l-5.657 5.657C1.492 30.153 0 27.228 0 24s1.492-6.153 3.44-8.319l2.866 2.867z"></path><path fill="#4CAF50" d="M24 48c5.27 0 9.991-1.492 13.434-3.957l-5.657-5.657C30.019 39.577 27.241 40 24 40c-4.559 0-8.59-2.502-10.615-6.053l-5.656 5.657C10.022 44.508 16.48 48 24 48z"></path><path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-0.792 2.237-2.231 4.16-4.087 5.571l5.657 5.657C39.954 36.608 44 31.056 44 24c0-1.341-0.138-2.65-0.389-3.917z"></path></svg>
              Sign in with Google
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                data-testid="toggle-auth-mode"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;