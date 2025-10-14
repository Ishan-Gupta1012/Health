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
            setUser(cachedUser);

            const response = await apiService.auth.getProfile();
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Profile fetch error:", error.message);
          await signOut(auth);
          localStorage.removeItem('healthnest_token');
          localStorage.removeItem('healthnest_user');
          setUser(null);
        }
      } else {
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
      const { token, user: backendUser } = response.data;

      localStorage.setItem('healthnest_token', token);
      localStorage.setItem('healthnest_user', JSON.stringify(backendUser));
      setUser(backendUser);

      return { success: true };
    } catch (error) {
      const message = error?.message || 'Login failed';
      console.error("Login Error:", message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiService.auth.register({ name, email, password });
      const { token, user: backendUser } = response.data;

      await createUserWithEmailAndPassword(auth, email, password);

      localStorage.setItem('healthnest_token', token);
      localStorage.setItem('healthnest_user', JSON.stringify(backendUser));
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

        // Google OAuth backend call (no more googleSync)
        const tokenResponse = await apiService.auth.login({
          email: firebaseUser.email,
          password: firebaseUser.uid, // Use UID as temporary password if backend allows
        }).catch(() => {
          // Optional: If user doesn't exist in backend, auto-register
          return apiService.auth.register({
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            password: firebaseUser.uid
          });
        });

        const { token, user: backendUser } = tokenResponse.data;
        localStorage.setItem('healthnest_token', token);
        localStorage.setItem('healthnest_user', JSON.stringify(backendUser));
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
      const { user: updatedUser } = response.data;

      // Update local storage and state
      localStorage.setItem('healthnest_user', JSON.stringify(updatedUser));
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