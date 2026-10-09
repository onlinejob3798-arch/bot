import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore';
import type { FirebaseConfig, UserProfile, WithdrawalRequest, AppSettings } from '../types';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export const initFirebase = (config: FirebaseConfig | null): boolean => {
  if (!config || !config.apiKey || !config.projectId) {
    firebaseApp = null;
    firestoreDb = null;
    return false;
  }

  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      firebaseApp = existingApps[0];
    } else {
      firebaseApp = initializeApp(config);
    }
    firestoreDb = getFirestore(firebaseApp);
    return true;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    firebaseApp = null;
    firestoreDb = null;
    return false;
  }
};

export const isFirebaseConnected = (): boolean => {
  return firestoreDb !== null;
};

// User Profile Operations
export const saveUserToFirestore = async (user: UserProfile): Promise<void> => {
  if (firestoreDb) {
    try {
      const userRef = doc(firestoreDb, 'users', user.id);
      await setDoc(userRef, user, { merge: true });
    } catch (e) {
      console.warn('Firestore write error, falling back to local storage:', e);
    }
  }
  localStorage.setItem(`yuze_user_${user.id}`, JSON.stringify(user));
  localStorage.setItem('yuze_current_user_id', user.id);
};

export const fetchUserFromFirestore = async (userId: string): Promise<UserProfile | null> => {
  if (firestoreDb) {
    try {
      const userRef = doc(firestoreDb, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
    } catch (e) {
      console.warn('Firestore read error, falling back to local storage:', e);
    }
  }

  const local = localStorage.getItem(`yuze_user_${userId}`);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return null;
    }
  }
  return null;
};

// Withdrawal Operations
export const submitWithdrawalToFirestore = async (
  request: WithdrawalRequest
): Promise<void> => {
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'withdrawals', request.id);
      await setDoc(docRef, request);
    } catch (e) {
      console.warn('Firestore withdrawal write error:', e);
    }
  }

  const existingRaw = localStorage.getItem('yuze_withdrawals');
  const existing: WithdrawalRequest[] = existingRaw ? JSON.parse(existingRaw) : [];
  existing.unshift(request);
  localStorage.setItem('yuze_withdrawals', JSON.stringify(existing));
};

export const fetchWithdrawalsFromFirestore = async (): Promise<WithdrawalRequest[]> => {
  if (firestoreDb) {
    try {
      const colRef = collection(firestoreDb, 'withdrawals');
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: WithdrawalRequest[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as WithdrawalRequest);
      });
      if (list.length > 0) {
        localStorage.setItem('yuze_withdrawals', JSON.stringify(list));
        return list;
      }
    } catch (e) {
      console.warn('Firestore withdrawals read error:', e);
    }
  }

  const existingRaw = localStorage.getItem('yuze_withdrawals');
  return existingRaw ? JSON.parse(existingRaw) : [];
};

export const updateWithdrawalStatusInFirestore = async (
  requestId: string,
  status: 'approved' | 'rejected',
  txHash?: string,
  reason?: string
): Promise<void> => {
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'withdrawals', requestId);
      await setDoc(docRef, { status, txHash, rejectionReason: reason }, { merge: true });
    } catch (e) {
      console.warn('Firestore withdrawal update error:', e);
    }
  }

  const existingRaw = localStorage.getItem('yuze_withdrawals');
  if (existingRaw) {
    const list: WithdrawalRequest[] = JSON.parse(existingRaw);
    const updated = list.map((item) =>
      item.id === requestId
        ? { ...item, status, txHash: txHash || item.txHash, rejectionReason: reason || item.rejectionReason }
        : item
    );
    localStorage.setItem('yuze_withdrawals', JSON.stringify(updated));
  }
};

// Firestore Security Rules Template
export const FIRESTORE_RULES_TEMPLATE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile collection
    match /users/{userId} {
      allow read, write: if true; // In production restrict to request.auth.uid == userId
    }
    // Withdrawal requests
    match /withdrawals/{withdrawalId} {
      allow read, write: if true;
    }
    // Global app settings
    match /settings/{settingId} {
      allow read: if true;
      allow write: if true; // Restrict to admin in production
    }
    // Ad impression records
    match /ad_logs/{logId} {
      allow create, read: if true;
    }
  }
}`;

// Firebase Step-by-Step Instructions in Bengali and English
export const FIREBASE_GUIDE_BN = [
  '১. Firebase Console-এ যান: https://console.firebase.google.com/ এবং একটি নতুন প্রজেক্ট তৈরি করুন।',
  '২. প্রজেক্টের ড্যাশবোর্ডে "Web" আইকন (</>) ক্লিক করে অ্যাপ রেজিস্টার করুন।',
  '৩. সেখান থেকে প্রাপ্ত "firebaseConfig" অবজেক্টটি (apiKey, projectId, appId ইত্যাদি) কপি করে নিচের বক্সে পেস্ট করুন।',
  '৪. Firebase কনসোলে বাঁদিকের মেনু থেকে "Build" > "Firestore Database" এ যান এবং "Create Database" চাপুন।',
  '৫. "Start in test mode" নির্বাচন করে ডেটাবেস চালু করুন যাতে রিড/রাইট পারমিশন পায়।',
  '৬. আমাদের দেওয়া Rules কোডটি Firestore Rules ট্যাবে পেস্ট করে Publish করে দিন।',
  '৭. নিচে "Connect to Firebase" বাটনে ক্লিক করুন। সাথে সাথে আপনার সমস্ত ইউজার ব্যালেন্স, বিজ্ঞাপন হিস্ট্রি এবং উইথড্রয়াল রিকোয়েস্ট ক্লাউডে সেভ হবে!'
];

export const FIREBASE_GUIDE_EN = [
  '1. Open Google Firebase Console (https://console.firebase.google.com) and create a project.',
  '2. Register a Web App by clicking the Web (</>) icon on the project overview page.',
  '3. Copy the firebaseConfig object (apiKey, authDomain, projectId, appId) and paste it into the admin settings below.',
  '4. Go to Build > Firestore Database and click "Create Database".',
  '5. Select "Start in test mode" so your Telegram mini app can read and write data.',
  '6. Copy the provided Firestore Security Rules into the Rules tab and click Publish.',
  '7. Click "Connect to Firebase" to sync all users, wallet balances, Monetag ad views, and withdrawals instantly!'
];
