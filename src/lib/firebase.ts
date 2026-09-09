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
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { CounsellingBooking, MediaItem, MediaCategory, ItalyEligibilityLead } from '../types';

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

// Firebase Storage instance
export const storage = getStorage(app);

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
  targetCountry?: string;
  intake: string;
  degree: string;
  selectedSlot: string;
  callbackDate?: string;
  callbackTime?: string;
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
    destinationCountry: bookingData.destinationCountry || bookingData.targetCountry || 'Global Admissions',
    intake: bookingData.intake || 'September 2026',
    degree: bookingData.degree || 'Masters / Post-Graduate',
    selectedSlot: bookingData.selectedSlot || 'Immediate Consultation',
    callbackDate: bookingData.callbackDate || '',
    callbackTime: bookingData.callbackTime || '',
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

/**
 * Public function to submit an Italy Eligibility Assessment questionnaire lead
 */
export async function submitItalyEligibilityLeadToFirestore(
  leadData: Omit<ItalyEligibilityLead, 'id' | 'createdAt' | 'createdAtMs'>
): Promise<string> {
  const docPath = 'italyEligibilityLeads';
  const now = new Date();
  const timestampStr = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const payload = {
    ...leadData,
    fullName: leadData.fullName.trim(),
    email: leadData.email.trim(),
    phone: leadData.phone.trim(),
    createdAt: timestampStr,
    createdAtMs: now.getTime(),
    updatedAt: timestampStr,
    updatedAtMs: now.getTime(),
    counsellorStatus: leadData.counsellorStatus || 'New'
  };

  try {
    const docRef = await addDoc(collection(db, 'italyEligibilityLeads'), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

/**
 * Admin function to fetch all Italy Eligibility Leads from Firestore
 */
export async function fetchItalyEligibilityLeadsFromFirestore(): Promise<ItalyEligibilityLead[]> {
  const docPath = 'italyEligibilityLeads';
  try {
    const colRef = collection(db, 'italyEligibilityLeads');
    const q = query(colRef, orderBy('createdAtMs', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data
      } as ItalyEligibilityLead;
    });
  } catch (error) {
    try {
      const colRef = collection(db, 'italyEligibilityLeads');
      const snapshot = await getDocs(colRef);
      const leads = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      } as ItalyEligibilityLead));
      return leads.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.LIST, docPath);
    }
  }
}

/**
 * Admin function to subscribe to real-time updates for Italy Eligibility Leads
 */
export function subscribeToItalyEligibilityLeads(
  onUpdate: (leads: ItalyEligibilityLead[]) => void,
  onError?: (error: any) => void
): () => void {
  const docPath = 'italyEligibilityLeads';
  const colRef = collection(db, 'italyEligibilityLeads');
  const q = query(colRef, orderBy('createdAtMs', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const leads = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      } as ItalyEligibilityLead));
      onUpdate(leads);
    },
    (error) => {
      console.warn(`Firestore onSnapshot notice for ${docPath}:`, error.message);
      const unsubFallback = onSnapshot(
        colRef,
        (snap) => {
          const leads = snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          } as ItalyEligibilityLead));
          leads.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
          onUpdate(leads);
        },
        (fallbackErr) => {
          if (onError) onError(fallbackErr);
        }
      );
      return unsubFallback;
    }
  );
}

/**
 * Admin function to update an Italy Eligibility Lead
 */
export async function updateItalyEligibilityLeadInFirestore(
  leadId: string,
  updates: Partial<ItalyEligibilityLead>
): Promise<void> {
  const docPath = `italyEligibilityLeads/${leadId}`;
  const now = new Date();
  const timestampStr = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  try {
    const leadRef = doc(db, 'italyEligibilityLeads', leadId);
    await updateDoc(leadRef, {
      ...updates,
      updatedAt: timestampStr,
      updatedAtMs: now.getTime()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Admin function to delete an Italy Eligibility Lead
 */
export async function deleteItalyEligibilityLeadFromFirestore(leadId: string): Promise<void> {
  const docPath = `italyEligibilityLeads/${leadId}`;
  try {
    const leadRef = doc(db, 'italyEligibilityLeads', leadId);
    await deleteDoc(leadRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Format bytes to readable size string
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validate image file format and file size
 */
export function validateImageFile(
  file: File,
  maxSizeBytes: number = 15 * 1024 * 1024 // 15MB max
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/avif',
    'image/jpg'
  ];

  if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i)) {
    return {
      valid: false,
      error: 'Unsupported image format. Allowed formats: PNG, JPG, JPEG, WEBP, SVG, GIF, AVIF.'
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum allowed size is ${formatBytes(maxSizeBytes)}.`
    };
  }

  return { valid: true };
}

/**
 * Upload an image from desktop directly to Firebase Storage and persist metadata in Firestore
 */
export async function uploadImageToFirebaseStorage(
  file: File,
  options: {
    category?: MediaCategory;
    altText?: string;
    associatedEntityId?: string;
    associatedEntityTitle?: string;
  } = {},
  onProgress?: (progressPercent: number) => void
): Promise<MediaItem> {
  // 1. Validation
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file.');
  }

  // 2. Prepare unique storage reference
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const storagePath = `media_uploads/${options.category || 'general'}/${uniqueId}_${sanitizedName}`;
  const fileRef = storageRef(storage, storagePath);

  // 3. Upload bytes with resumable task
  return new Promise<MediaItem>((resolve, reject) => {
    const metadata = {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        uploadedBy: auth.currentUser?.email || 'admin',
        category: options.category || 'general'
      }
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) {
          onProgress(isNaN(progress) ? 0 : progress);
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(new Error(`Firebase Storage upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const now = new Date();
          const timestampStr = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          const mediaItem: MediaItem = {
            id: uniqueId,
            name: file.name,
            url: downloadUrl,
            storagePath: uploadTask.snapshot.ref.fullPath,
            sizeBytes: file.size,
            sizeFormatted: formatBytes(file.size),
            contentType: file.type || 'image/jpeg',
            uploadedAt: timestampStr,
            uploadedAtMs: now.getTime(),
            uploadedBy: auth.currentUser?.email || 'swati.soam@primipassiedu.com',
            altText: options.altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            category: options.category || 'general',
            associatedEntityId: options.associatedEntityId,
            associatedEntityTitle: options.associatedEntityTitle
          };

          // Save metadata into Firestore collection 'media_items'
          const docRef = doc(db, 'media_items', mediaItem.id);
          await setDoc(docRef, mediaItem, { merge: true });

          resolve(mediaItem);
        } catch (postUploadError) {
          console.error('Error saving image metadata to Firestore:', postUploadError);
          reject(postUploadError);
        }
      }
    );
  });
}

/**
 * Delete an image permanently from Firebase Storage and Firestore metadata
 */
export async function deleteImageFromFirebaseStorage(mediaItem: MediaItem): Promise<void> {
  const docPath = `media_items/${mediaItem.id}`;
  try {
    // 1. Delete from Firebase Storage if path exists
    if (mediaItem.storagePath) {
      try {
        const fileRef = storageRef(storage, mediaItem.storagePath);
        await deleteObject(fileRef);
      } catch (storageErr: any) {
        // Continue deleting Firestore record even if file was already deleted
        console.warn('Storage delete notice (file may not exist):', storageErr?.message);
      }
    }

    // 2. Delete document from Firestore
    const docRef = doc(db, 'media_items', mediaItem.id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Update media item metadata in Firestore (alt text, category, associated entity)
 */
export async function updateMediaItemInFirestore(
  mediaId: string,
  updates: Partial<MediaItem>
): Promise<void> {
  const docPath = `media_items/${mediaId}`;
  try {
    const docRef = doc(db, 'media_items', mediaId);
    await updateDoc(docRef, { ...updates, updatedAtMs: Date.now() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Fetch all media items from Firestore ordered by newest first
 */
export async function fetchMediaItemsFromFirestore(): Promise<MediaItem[]> {
  const docPath = 'media_items';
  try {
    const mediaCollection = collection(db, 'media_items');
    const q = query(mediaCollection, orderBy('uploadedAtMs', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Untitled Image',
        url: data.url || '',
        storagePath: data.storagePath,
        sizeBytes: data.sizeBytes || 0,
        sizeFormatted: data.sizeFormatted || formatBytes(data.sizeBytes || 0),
        contentType: data.contentType || 'image/jpeg',
        uploadedAt: data.uploadedAt || '',
        uploadedAtMs: data.uploadedAtMs || 0,
        uploadedBy: data.uploadedBy || 'admin',
        altText: data.altText || '',
        category: data.category || 'general',
        associatedEntityId: data.associatedEntityId,
        associatedEntityTitle: data.associatedEntityTitle,
        dimensions: data.dimensions
      };
    });
  } catch (error) {
    try {
      const mediaCollection = collection(db, 'media_items');
      const snapshot = await getDocs(mediaCollection);
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'Untitled Image',
          url: data.url || '',
          storagePath: data.storagePath,
          sizeBytes: data.sizeBytes || 0,
          sizeFormatted: data.sizeFormatted || formatBytes(data.sizeBytes || 0),
          contentType: data.contentType || 'image/jpeg',
          uploadedAt: data.uploadedAt || '',
          uploadedAtMs: data.uploadedAtMs || 0,
          uploadedBy: data.uploadedBy || 'admin',
          altText: data.altText || '',
          category: data.category || 'general',
          associatedEntityId: data.associatedEntityId,
          associatedEntityTitle: data.associatedEntityTitle,
          dimensions: data.dimensions
        };
      }).sort((a, b) => (b.uploadedAtMs || 0) - (a.uploadedAtMs || 0));
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.LIST, docPath);
    }
  }
}

/**
 * Real-time listener for Media Library items
 */
export function subscribeToMediaItems(
  onUpdate: (items: MediaItem[]) => void,
  onError?: (error: any) => void
): () => void {
  const docPath = 'media_items';
  const mediaCollection = collection(db, 'media_items');

  return onSnapshot(
    mediaCollection,
    (snapshot) => {
      const items: MediaItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'Untitled Image',
          url: data.url || '',
          storagePath: data.storagePath,
          sizeBytes: data.sizeBytes || 0,
          sizeFormatted: data.sizeFormatted || formatBytes(data.sizeBytes || 0),
          contentType: data.contentType || 'image/jpeg',
          uploadedAt: data.uploadedAt || '',
          uploadedAtMs: data.uploadedAtMs || 0,
          uploadedBy: data.uploadedBy || 'admin',
          altText: data.altText || '',
          category: data.category || 'general',
          associatedEntityId: data.associatedEntityId,
          associatedEntityTitle: data.associatedEntityTitle,
          dimensions: data.dimensions
        };
      }).sort((a, b) => (b.uploadedAtMs || 0) - (a.uploadedAtMs || 0));

      onUpdate(items);
    },
    (error) => {
      console.warn(`Firestore media_items onSnapshot notice for ${docPath}:`, error.message);
      if (onError) onError(error);
    }
  );
}

