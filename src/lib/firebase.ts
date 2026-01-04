import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAerboLllCRptvcn2hT1grWmK8Q0Uv58BQ",
  authDomain: "habbit-otp.firebaseapp.com",
  projectId: "habbit-otp",
  storageBucket: "habbit-otp.firebasestorage.app",
  messagingSenderId: "7122951500",
  appId: "1:7122951500:web:c651d6e27fbcb8d03583e9",
  measurementId: "G-GFX1FLLHV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set language to user's browser preference
auth.languageCode = navigator.language;

// Store confirmation result globally for OTP verification
let confirmationResult: ConfirmationResult | null = null;

export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber
    },
    'expired-callback': () => {
      // Response expired, ask user to solve reCAPTCHA again
    }
  });
  return recaptchaVerifier;
};

export const sendOTP = async (
  phoneNumber: string, 
  recaptchaVerifier: RecaptchaVerifier
): Promise<{ success: boolean; error?: string }> => {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true };
  } catch (error: any) {
    let errorMessage = 'Failed to send OTP. Please try again.';

    // Some errors are returned from the underlying Identity Toolkit API as plain strings.
    const rawMessage = String(error?.message || '');
    if (rawMessage.includes('BILLING_NOT_ENABLED')) {
      errorMessage = 'Phone OTP requires billing to be enabled for this Firebase project (Blaze plan), or use test phone numbers in Firebase Auth.';
      return { success: false, error: errorMessage };
    }
    
    switch (error.code) {
      case 'auth/invalid-phone-number':
        errorMessage = 'Invalid phone number format. Please include country code.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 'auth/captcha-check-failed':
        errorMessage = 'reCAPTCHA verification failed. Please refresh and try again.';
        break;
      case 'auth/quota-exceeded':
        errorMessage = 'SMS quota exceeded. Please try again later.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Phone sign-in is not enabled for this project. Enable Phone provider in Firebase Auth.';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'This domain is not authorized for Firebase Auth. Add it under Firebase Auth → Settings → Authorized domains.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const verifyOTP = async (
  otp: string
): Promise<{ success: boolean; error?: string; user?: any }> => {
  if (!confirmationResult) {
    return { success: false, error: 'No OTP request found. Please request a new OTP.' };
  }

  try {
    const result = await confirmationResult.confirm(otp);
    return { success: true, user: result.user };
  } catch (error: any) {
    let errorMessage = 'Failed to verify OTP. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-verification-code':
        errorMessage = 'Invalid OTP. Please check and try again.';
        break;
      case 'auth/code-expired':
        errorMessage = 'OTP has expired. Please request a new one.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const signOut = async (): Promise<void> => {
  await auth.signOut();
  confirmationResult = null;
};

// Google Sign-In
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async (): Promise<{ success: boolean; error?: string; user?: any }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in with Google. Please try again.';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in popup was closed. Please try again.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign-in was cancelled. Please try again.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with this email using a different sign-in method.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};
