import { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { apiService } from '../utils/api';

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB4qe-u7q2XKKX-FXF5d7kVFCjBKKiKBhk",
  authDomain: "studio-7740314856-cbdca.firebaseapp.com",
  projectId: "studio-7740314856-cbdca",
  storageBucket: "studio-7740314856-cbdca.appspot.com",
  messagingSenderId: "436148299955",
  appId: "1:436148299955:web:f994a090ae6de34ea8c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// -----------------
// Context Setup
// -----------------
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// -----------------
// AuthProvider
// -----------------
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = localStorage.getItem('healthnest_token');
          if (token) {
            const cachedUser = JSON.parse(localStorage.getItem('healthnest_user'));
            setUser(cachedUser); // Set cached user first for speed

            // Fetch profile to get latest user data (including role)
            const response = await apiService.auth.getProfile();
            const freshUser = response.data.user;
            setUser(freshUser);
            
            // UPDATED: Store fresh user data and role
            localStorage.setItem('healthnest_user', JSON.stringify(freshUser));
            localStorage.setItem('healthnest_role', freshUser.role);
          }
        } catch (error) {
          console.error("Profile fetch error:", error.message);
          await signOut(auth);
          localStorage.removeItem('healthnest_token');
          localStorage.removeItem('healthnest_user');
          localStorage.removeItem('healthnest_role'); // UPDATED: Clear role
          setUser(null);
        }
      } else {
        // No Firebase user, clear everything
        localStorage.removeItem('healthnest_token');
        localStorage.removeItem('healthnest_user');
        localStorage.removeItem('healthnest_role'); // UPDATED: Clear role
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // -----------------
  // Auth Functions
  // -----------------
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const response = await apiService.auth.login({ email, password });
      const { token, user: backendUser } = response.data; // backendUser now includes 'role'

      localStorage.setItem('healthnest_token', token);
      localStorage.setItem('healthnest_user', JSON.stringify(backendUser));
      localStorage.setItem('healthnest_role', backendUser.role); // UPDATED: Store role
      setUser(backendUser);

      return { success: true };
    } catch (error) {
      const message = error?.message || 'Login failed';
      console.error("Login Error:", message);
      return { success: false, error: message };
    }
  };

  // UPDATED: Added 'role' parameter
  const register = async (name, email, password, role) => {
    try {
      // UPDATED: Pass 'role' to backend registration
      const response = await apiService.auth.register({ name, email, password, role });
      const { token, user: backendUser } = response.data; // backendUser now includes 'role'

      // Create Firebase user *after* backend confirms registration
      await createUserWithEmailAndPassword(auth, email, password);

      localStorage.setItem('healthnest_token', token);
      localStorage.setItem('healthnest_user', JSON.stringify(backendUser));
      localStorage.setItem('healthnest_role', backendUser.role); // UPDATED: Store role
      setUser(backendUser);

      return { success: true };
    } catch (error) {
      const message = error?.message || 'Registration failed';
      console.error("Registration Error:", message);
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then(async (result) => {
        const firebaseUser = result.user;

        // This logic seems incorrect, Google sign-in should go to a dedicated backend route
        // But following your *original* file's logic:
        const tokenResponse = await apiService.auth.login({
          email: firebaseUser.email,
          password: firebaseUser.uid, 
        }).catch(() => {
          // Auto-register as 'patient' if login fails
          return apiService.auth.register({
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            password: firebaseUser.uid,
            role: 'patient' // Google signups default to patient
          });
        });

        const { token, user: backendUser } = tokenResponse.data;
        localStorage.setItem('healthnest_token', token);
        localStorage.setItem('healthnest_user', JSON.stringify(backendUser));
        localStorage.setItem('healthnest_role', backendUser.role); // UPDATED: Store role
        setUser(backendUser);

        return { success: true };
      })
      .catch((error) => {
        const message = error?.message || 'Google login failed';
        console.error("Google Login Error:", message);
        return { success: false, error: message };
      });
  };

  const updateProfile = async (updates) => {
    try {
      const response = await apiService.auth.updateProfile(updates);
      const { user: updatedUser } = response.data; // updatedUser may have new info

      // Update local storage and state
      localStorage.setItem('healthnest_user', JSON.stringify(updatedUser));
      localStorage.setItem('healthnest_role', updatedUser.role); // UPDATED: Re-store role
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error?.message || 'Profile update failed';
      console.error("Profile Update Error:", message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('healthnest_token');
      localStorage.removeItem('healthnest_user');
      localStorage.removeItem('healthnest_role'); // UPDATED: Clear role
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error?.message);
    }
  };

  // -----------------
  // Context Value
  // -----------------
  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default useAuth;