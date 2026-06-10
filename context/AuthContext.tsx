// AuthContext — provides the current Firebase user to the whole app via React Context.
//
// Wrap your app in <AuthProvider> and use the useAuth() hook in any screen:
//
//   const { user, loading } = useAuth();
//   if (loading) return <LoadingSpinner />;
//   if (!user) navigation.navigate('Login');

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, getCurrentUser } from '../services/authService';
import { getDocument } from '../services/firestoreService';

/** Shape of the user profile stored in Firestore */
export interface UserProfile {
  uid: string;
  fullName: string;
  dateOfBirth: string;
  username: string;
  displayUsername: string;
  role: 'teacher' | 'student';
  createdAt: Date;
}

interface AuthContextType {
  /** The Firebase Auth user (null if not logged in) */
  user: User | null;
  /** The user's profile from Firestore (null if not loaded or not logged in) */
  profile: UserProfile | null;
  /** True while we're still checking auth state on app startup */
  loading: boolean;
  /** Call this to refresh the profile from Firestore */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const doc = await getDocument('users', uid);
      if (doc) {
        setProfile(doc as unknown as UserProfile);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to fetch profile:', error);
    }
  };

  const refreshProfile = async () => {
    // Get current user directly from Firebase Auth (not React state)
    // This avoids race conditions when called right after signUp/signIn
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      await fetchProfile(currentUser.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to access auth state from any screen */
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
