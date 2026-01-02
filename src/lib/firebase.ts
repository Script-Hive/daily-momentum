import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

// Firebase configuration - Replace these with your Firebase project credentials
// These are client-side keys and are safe to expose (security is handled by Firebase)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
