import React, { useState } from 'react';
import { resendVerificationEmail, reloadCurrentUser } from '../lib/authService';
import { Mail, CheckCircle2, RefreshCw, AlertCircle, Sparkles, X, ShieldCheck } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerified: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerified,
}) => {
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResend = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setResending(true);
    try {
      await resendVerificationEmail();
      setStatusMessage(`A fresh verification email was sent to ${email || 'your inbox'}.`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setChecking(true);
    try {
      const user = await reloadCurrentUser();
      if (user && user.emailVerified) {
        setStatusMessage('Your email is successfully verified!');
        setTimeout(() => {
          onVerified();
          onClose();
        }, 1200);
      } else {
        setErrorMessage(
          'Email not yet verified. Please click the link inside the email and check back here.'
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error checking verification status.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center shadow-xs">
            <Mail className="w-7 h-7 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 font-['Newsreader',serif]">
              Verify Your Email
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              We sent a verification link to{' '}
              <span className="font-semibold text-stone-800">{email || 'your email'}</span>.
            </p>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-xs text-stone-600 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Why verify?</span>
          </div>
          <p className="leading-relaxed">
            Verifying your email secures your Abubakar journal identity, enables photo roll sharing, and unlocks community reactions.
          </p>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking Status...' : "I've Verified My Email"}</span>
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          >
            {resending ? 'Sending Email...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </div>
  );
};
