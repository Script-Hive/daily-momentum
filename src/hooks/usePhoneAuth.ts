import { useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged, RecaptchaVerifier } from 'firebase/auth';
import { auth, setupRecaptcha, sendOTP, verifyOTP, signOut, signInWithGoogle } from '@/lib/firebase';

export type AuthStep = 'phone' | 'otp' | 'success';

export function usePhoneAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setStep('success');
      }
    });

    return () => unsubscribe();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const initRecaptcha = useCallback((containerId: string) => {
    if (!recaptchaVerifier) {
      const verifier = setupRecaptcha(containerId);
      setRecaptchaVerifier(verifier);
      return verifier;
    }
    return recaptchaVerifier;
  }, [recaptchaVerifier]);

  const handleSendOTP = async (phone: string) => {
    setError(null);
    setSending(true);

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      setSending(false);
      return;
    }

    try {
      const verifier = initRecaptcha('recaptcha-container');
      const result = await sendOTP(phone, verifier);
      
      if (result.success) {
        setPhoneNumber(phone);
        setStep('otp');
        setResendCooldown(60);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    setError(null);
    setVerifying(true);

    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setVerifying(false);
      return;
    }

    try {
      const result = await verifyOTP(otpCode);
      
      if (result.success) {
        setStep('success');
        // Store user phone in localStorage for persistence
        if (result.user) {
          localStorage.setItem('streakly-phone-user', JSON.stringify({
            phoneNumber: result.user.phoneNumber,
            uid: result.user.uid,
            lastLogin: new Date().toISOString()
          }));
        }
      } else {
        setError(result.error || 'Failed to verify OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    // Reset recaptcha for resend
    setRecaptchaVerifier(null);
    await handleSendOTP(phoneNumber);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setError(null);
    setRecaptchaVerifier(null);
    localStorage.removeItem('streakly-phone-user');
  };

  const resetToPhone = () => {
    setStep('phone');
    setOtp('');
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        setStep('success');
        if (result.user) {
          localStorage.setItem('streakly-phone-user', JSON.stringify({
            email: result.user.email,
            displayName: result.user.displayName,
            uid: result.user.uid,
            lastLogin: new Date().toISOString()
          }));
        }
      } else {
        setError(result.error || 'Failed to sign in with Google');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    user,
    loading,
    step,
    phoneNumber,
    otp,
    error,
    sending,
    verifying,
    googleLoading,
    resendCooldown,
    setOtp,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
    handleSignOut,
    handleGoogleSignIn,
    resetToPhone,
    initRecaptcha,
  };
}
