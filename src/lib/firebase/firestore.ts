import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

/**
 * Get all documents from a Firestore collection
 */
export async function getCollectionDocs<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  if (!db) return [];
  const colRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as T),
  }));
}

/**
 * Get a single document by ID
 */
export async function getDocumentById<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  if (!db) return null;
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...(docSnap.data() as T),
  };
}

/**
 * Add a new document with an auto-generated ID
 */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  if (!db) throw new Error("Firestore is not initialized");
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Set/overwrite document with a custom ID
 */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = true
): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized");
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge });
}

/**
 * Update specific fields in a document
 */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized");
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized");
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

export { query, where, orderBy, limit };
