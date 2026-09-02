import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CounsellingBooking } from '../types';

// Initialize Firebase App
export const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Auth configuration
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore instance (using configured database ID if specified)
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Single authorized administrator account
export const AUTHORIZED_ADMIN_EMAIL = 'swati.soam@primipassiedu.com';

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
}

/**
 * Public function to submit a student lead to Firestore
 */
export async function submitLeadToFirestore(bookingData: {
  fullName: string;
  email: string;
  phone: string;
  destinationCountry?: string;
  intake: string;
  degree: string;
  selectedSlot: string;
  prefilledDetails?: string;
}): Promise<string> {
  const now = new Date();
  const timestampStr = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const leadPayload = {
    fullName: bookingData.fullName.trim(),
    email: bookingData.email.trim(),
    phone: bookingData.phone.trim(),
    destinationCountry: bookingData.destinationCountry || 'Global Admissions',
    intake: bookingData.intake || 'September 2026',
    degree: bookingData.degree || 'Masters / Post-Graduate',
    selectedSlot: bookingData.selectedSlot || '4:00 PM IST',
    prefilledDetails: bookingData.prefilledDetails || 'General Admission Counseling Inquiry',
    status: 'New',
    isArchived: false,
    createdAt: timestampStr,
    createdAtMs: now.getTime()
  };

  const docRef = await addDoc(collection(db, 'leads'), leadPayload);
  return docRef.id;
}

/**
 * Admin function to fetch all leads from Firestore
 */
export async function fetchLeadsFromFirestore(): Promise<CounsellingBooking[]> {
  try {
    const leadsCollection = collection(db, 'leads');
    const q = query(leadsCollection, orderBy('createdAtMs', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        fullName: data.fullName || 'Student Inquirer',
        email: data.email || '',
        phone: data.phone || '',
        destinationCountry: data.destinationCountry || 'Global Admissions',
        intake: data.intake || 'September 2026',
        degree: data.degree || 'Degree Program',
        selectedSlot: data.selectedSlot || 'Convenient Slot',
        prefilledDetails: data.prefilledDetails || '',
        createdAt: data.createdAt || new Date().toISOString(),
        createdAtMs: data.createdAtMs || 0,
        status: data.status || 'New',
        isArchived: Boolean(data.isArchived),
        notificationRecipientEmail: AUTHORIZED_ADMIN_EMAIL,
        emailSentAt: data.createdAt || ''
      };
    });
  } catch (error) {
    // If order by createdAtMs fails due to missing index, fallback to un-ordered query
    const leadsCollection = collection(db, 'leads');
    const snapshot = await getDocs(leadsCollection);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        fullName: data.fullName || 'Student Inquirer',
        email: data.email || '',
        phone: data.phone || '',
        destinationCountry: data.destinationCountry || 'Global Admissions',
        intake: data.intake || 'September 2026',
        degree: data.degree || 'Degree Program',
        selectedSlot: data.selectedSlot || 'Convenient Slot',
        prefilledDetails: data.prefilledDetails || '',
        createdAt: data.createdAt || new Date().toISOString(),
        createdAtMs: data.createdAtMs || 0,
        status: data.status || 'New',
        isArchived: Boolean(data.isArchived),
        notificationRecipientEmail: AUTHORIZED_ADMIN_EMAIL,
        emailSentAt: data.createdAt || ''
      };
    }).sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
  }
}

/**
 * Admin function to update lead status in Firestore
 */
export async function updateLeadStatusInFirestore(
  leadId: string,
  status: CounsellingBooking['status']
): Promise<void> {
  const leadRef = doc(db, 'leads', leadId);
  await updateDoc(leadRef, { status });
}

/**
 * Admin function to toggle lead archive state in Firestore
 */
export async function updateLeadArchiveInFirestore(
  leadId: string,
  isArchived: boolean
): Promise<void> {
  const leadRef = doc(db, 'leads', leadId);
  await updateDoc(leadRef, {
    isArchived,
    status: isArchived ? 'Archived' : 'New'
  });
}

/**
 * Admin function to batch archive multiple leads
 */
export async function bulkArchiveLeadsInFirestore(leadIds: string[]): Promise<void> {
  if (leadIds.length === 0) return;
  const batch = writeBatch(db);
  leadIds.forEach((id) => {
    const leadRef = doc(db, 'leads', id);
    batch.update(leadRef, { isArchived: true, status: 'Archived' });
  });
  await batch.commit();
}

/**
 * Admin function to delete a lead from Firestore
 */
export async function deleteLeadFromFirestore(leadId: string): Promise<void> {
  const leadRef = doc(db, 'leads', leadId);
  await deleteDoc(leadRef);
}

/**
 * Admin function to bulk delete multiple leads
 */
export async function bulkDeleteLeadsFromFirestore(leadIds: string[]): Promise<void> {
  if (leadIds.length === 0) return;
  const batch = writeBatch(db);
  leadIds.forEach((id) => {
    const leadRef = doc(db, 'leads', id);
    batch.delete(leadRef);
  });
  await batch.commit();
}
