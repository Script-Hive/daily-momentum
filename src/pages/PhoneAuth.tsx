import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, CheckCircle2, ArrowLeft, Loader2, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { cn } from '@/lib/utils';

// Country codes for the dropdown
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
];

export default function PhoneAuth() {
  const {
    user,
    loading,
    step,
    phoneNumber,
    error,
    sending,
    verifying,
    resendCooldown,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
    handleSignOut,
    resetToPhone,
  } = usePhoneAuth();

  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    // Focus first OTP input when entering OTP step
    if (step === 'otp') {
      document.getElementById('otp-0')?.focus();
    }
  }, [step]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullNumber = `${countryCode}${phone.replace(/\D/g, '')}`;
    handleSendOTP(fullNumber);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtpDigits = [...otpDigits];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtpDigits[index + i] = digit;
        }
      });
      setOtpDigits(newOtpDigits);
      
      // Focus next empty or last input
      const nextIndex = Math.min(index + digits.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      
      // Auto-submit if complete
      if (newOtpDigits.every(d => d !== '')) {
        handleVerifyOTP(newOtpDigits.join(''));
      }
    } else {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value.replace(/\D/g, '');
      setOtpDigits(newOtpDigits);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
      
      // Auto-submit if complete
      if (newOtpDigits.every(d => d !== '')) {
        handleVerifyOTP(newOtpDigits.join(''));
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* reCAPTCHA container - invisible */}
      <div id="recaptcha-container"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {/* Phone Number Step */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                    <Phone className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Welcome</CardTitle>
                  <CardDescription>
                    Enter your phone number to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-12 px-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary"
                        >
                          {COUNTRY_CODES.map(({ code, country, flag }) => (
                            <option key={code} value={code}>
                              {flag} {code}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 h-12 text-lg"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 text-lg gradient-primary text-primary-foreground"
                      disabled={sending || !phone}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-2">
                  <button
                    onClick={resetToPhone}
                    className="absolute left-4 top-4 p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Verify OTP</CardTitle>
                  <CardDescription>
                    Enter the 6-digit code sent to<br />
                    <span className="font-medium text-foreground">{phoneNumber}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* OTP Input */}
                    <div className="flex justify-center gap-2">
                      {otpDigits.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={cn(
                            "w-12 h-14 text-center text-2xl font-bold",
                            error && "border-destructive"
                          )}
                        />
                      ))}
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      onClick={() => handleVerifyOTP(otpDigits.join(''))}
                      className="w-full h-12 text-lg gradient-primary text-primary-foreground"
                      disabled={verifying || otpDigits.some(d => !d)}
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify'
                      )}
                    </Button>

                    {/* Resend OTP */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Didn't receive the code?
                      </p>
                      <Button
                        variant="ghost"
                        onClick={handleResendOTP}
                        disabled={resendCooldown > 0}
                        className="gap-2"
                      >
                        <RefreshCw className={cn("w-4 h-4", resendCooldown > 0 && "animate-spin")} />
                        {resendCooldown > 0 
                          ? `Resend in ${resendCooldown}s` 
                          : 'Resend OTP'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Success Step */}
          {step === 'success' && user && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </motion.div>
                  <CardTitle className="text-2xl">Welcome!</CardTitle>
                  <CardDescription>
                    You're successfully logged in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <p className="text-sm text-muted-foreground">Logged in as</p>
                    <p className="text-lg font-semibold">{user.phoneNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      className="gradient-primary text-primary-foreground"
                    >
                      Go to App
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
