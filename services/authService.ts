// Firebase Authentication Service for STEMM-LAB
//
// Usage:
//   import { signUp, signIn, signOutUser, getCurrentUser } from '../services/authService';
//
//   // Register a new user
//   const user = await signUp('email@test.com', 'password123');
//
//   // Login
//   const user = await signIn('email@test.com', 'password123');
//
//   // Logout
//   await signOutUser();

import app from '../config/firebaseConfig';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';

// Initialize Auth with the Firebase app
const auth = getAuth(app);

/**
 * Register a new user with email and password.
 * @returns The Firebase User object.
 */
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  const credential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return credential.user;
};

/**
 * Sign in an existing user with email and password.
 * @returns The Firebase User object.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const credential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return credential.user;
};

/**
 * Sign out the current user.
 */
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Get the currently logged-in user (or null).
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes.
 * @returns An unsubscribe function.
 *
 * @example
 *   useEffect(() => {
 *     const unsub = onAuthChange((user) => {
 *       if (user) console.log('Logged in:', user.uid);
 *       else console.log('Logged out');
 *     });
 *     return () => unsub();
 *   }, []);
 */
export const onAuthChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
