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
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  writeBatch,
  onSnapshot,
  getDocFromServer
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

// Authorized administrator accounts
export const AUTHORIZED_ADMIN_EMAILS = [
  'swati.soam@primipassiedu.com',
  'shubham.it2006@gmail.com'
];
export const AUTHORIZED_ADMIN_EMAIL = 'swati.soam@primipassiedu.com';

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore backend
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'content', 'site_config');
    await getDocFromServer(testDocRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection check: Client currently offline or initializing.');
    }
    return false;
  }
}

/**
 * Save a dynamic content section to Firestore
 */
export async function saveContentSectionToFirestore(
  sectionId: string,
  data: any
): Promise<void> {
  const docPath = `content/${sectionId}`;
  try {
    const docRef = doc(db, 'content', sectionId);
    await setDoc(
      docRef,
      {
        sectionId,
        data,
        updatedAt: Date.now(),
        updatedBy: auth.currentUser?.email || 'admin'
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Fetch a single dynamic content section from Firestore
 */
export async function fetchContentSectionFromFirestore<T>(
  sectionId: string
): Promise<T | null> {
  const docPath = `content/${sectionId}`;
  try {
    const docRef = doc(db, 'content', sectionId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data()?.data as T;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

/**
 * Real-time listener for any dynamic content section in Firestore
 */
export function subscribeToContentSection<T>(
  sectionId: string,
  onUpdate: (data: T | null) => void,
  onError?: (error: any) => void
): () => void {
  const docPath = `content/${sectionId}`;
  const docRef = doc(db, 'content', sectionId);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const payload = snapshot.data();
        onUpdate(payload?.data as T);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.warn(`Firestore onSnapshot notice for ${docPath}:`, error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Batch save all content sections to Firestore
 */
export async function batchSaveAllContentSections(
  contentMap: Record<string, any>
): Promise<void> {
  try {
    const batch = writeBatch(db);
    const now = Date.now();
    const userEmail = auth.currentUser?.email || 'admin';

    Object.entries(contentMap).forEach(([sectionId, data]) => {
      const docRef = doc(db, 'content', sectionId);
      batch.set(
        docRef,
        {
          sectionId,
          data,
          updatedAt: now,
          updatedBy: userEmail
        },
        { merge: true }
      );
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'content/batch');
  }
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
  const docPath = 'leads';
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

  try {
    const docRef = await addDoc(collection(db, 'leads'), leadPayload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

/**
 * Admin function to fetch all leads from Firestore
 */
export async function fetchLeadsFromFirestore(): Promise<CounsellingBooking[]> {
  const docPath = 'leads';
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
    try {
      // Fallback if orderBy index is compiling
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
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.LIST, docPath);
    }
  }
}

/**
 * Admin function to update lead status in Firestore
 */
export async function updateLeadStatusInFirestore(
  leadId: string,
  status: CounsellingBooking['status']
): Promise<void> {
  const docPath = `leads/${leadId}`;
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Admin function to toggle lead archive state in Firestore
 */
export async function updateLeadArchiveInFirestore(
  leadId: string,
  isArchived: boolean
): Promise<void> {
  const docPath = `leads/${leadId}`;
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, {
      isArchived,
      status: isArchived ? 'Archived' : 'New'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Admin function to batch archive multiple leads
 */
export async function bulkArchiveLeadsInFirestore(leadIds: string[]): Promise<void> {
  if (leadIds.length === 0) return;
  try {
    const batch = writeBatch(db);
    leadIds.forEach((id) => {
      const leadRef = doc(db, 'leads', id);
      batch.update(leadRef, { isArchived: true, status: 'Archived' });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'leads/bulkArchive');
  }
}

/**
 * Admin function to delete a lead from Firestore
 */
export async function deleteLeadFromFirestore(leadId: string): Promise<void> {
  const docPath = `leads/${leadId}`;
  try {
    const leadRef = doc(db, 'leads', leadId);
    await deleteDoc(leadRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Admin function to bulk delete multiple leads
 */
export async function bulkDeleteLeadsFromFirestore(leadIds: string[]): Promise<void> {
  if (leadIds.length === 0) return;
  try {
    const batch = writeBatch(db);
    leadIds.forEach((id) => {
      const leadRef = doc(db, 'leads', id);
      batch.delete(leadRef);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'leads/bulkDelete');
  }
}
