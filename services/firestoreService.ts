// Firestore Service — Reusable CRUD operations for STEMM-LAB
//
// Usage:
//   import { addDocument, getDocument, ... } from '../services/firestoreService';
//
//   // Add a document
//   const id = await addDocument('teams', { name: 'Alpha', score: 100 });
//
//   // Get a document
//   const team = await getDocument('teams', id);
//
//   // Listen to real-time updates
//   const unsubscribe = subscribeToCollection('teams', (teams) => {
//     console.log(teams);
//   });

import { db } from '../config/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  WhereFilterOp,
  Unsubscribe,
} from 'firebase/firestore';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Document with its Firestore ID attached */
export interface FirestoreDoc extends DocumentData {
  id: string;
}

// ─── CREATE ─────────────────────────────────────────────────────────────────

/**
 * Add a new document to a collection (auto-generated ID).
 * @returns The generated document ID.
 */
export const addDocument = async (
  collectionName: string,
  data: DocumentData
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

/**
 * Set a document with a specific ID (creates or overwrites).
 */
export const setDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> => {
  await setDoc(doc(db, collectionName, docId), data);
};

// ─── READ ───────────────────────────────────────────────────────────────────

/**
 * Get a single document by ID.
 * @returns The document data with ID, or null if not found.
 */
export const getDocument = async (
  collectionName: string,
  docId: string
): Promise<FirestoreDoc | null> => {
  const docSnap = await getDoc(doc(db, collectionName, docId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

/**
 * Get all documents in a collection.
 */
export const getAllDocuments = async (
  collectionName: string
): Promise<FirestoreDoc[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Query documents with optional constraints.
 *
 * @example
 *   const topTeams = await queryDocuments('teams', [
 *     where('score', '>=', 50),
 *     orderBy('score', 'desc'),
 *     limit(10),
 *   ]);
 */
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<FirestoreDoc[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ─── UPDATE ─────────────────────────────────────────────────────────────────

/**
 * Update specific fields on an existing document.
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  await updateDoc(doc(db, collectionName, docId), data);
};

// ─── DELETE ─────────────────────────────────────────────────────────────────

/**
 * Delete a document by ID.
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docId));
};

// ─── REAL-TIME LISTENERS ────────────────────────────────────────────────────

/**
 * Subscribe to real-time updates on a collection.
 * @returns An unsubscribe function — call it to stop listening.
 *
 * @example
 *   useEffect(() => {
 *     const unsub = subscribeToCollection('teams', (teams) => {
 *       setTeams(teams);
 *     });
 *     return () => unsub();
 *   }, []);
 */
export const subscribeToCollection = (
  collectionName: string,
  callback: (docs: FirestoreDoc[]) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe => {
  const q =
    constraints.length > 0
      ? query(collection(db, collectionName), ...constraints)
      : collection(db, collectionName);

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(docs);
  });
};

/**
 * Subscribe to real-time updates on a single document.
 * @returns An unsubscribe function.
 */
export const subscribeToDocument = (
  collectionName: string,
  docId: string,
  callback: (doc: FirestoreDoc | null) => void
): Unsubscribe => {
  return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

// ─── CONVENIENCE RE-EXPORTS ─────────────────────────────────────────────────
// So screens can import query helpers from one place

export { where, orderBy, limit, arrayUnion, arrayRemove } from 'firebase/firestore';
