import React, { useState } from 'react';
import { signInWithGoogle } from '../lib/authService';
import { Person } from '../types';
import {
  Camera,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
  Zap,
  Globe,
  Share2
} from 'lucide-react';

interface GoogleSignInScreenProps {
  onSuccess: (person?: Person) => void;
  onBack: () => void;
  onSwitchToEmail: () => void;
}

export const GoogleSignInScreen: React.FC<GoogleSignInScreenProps> = ({
  onSuccess,
  onBack,
  onSwitchToEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const person = await signInWithGoogle();
      onSuccess(person);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(
        err.message ||
          'Failed to sign in with Google. If popups are blocked by your browser, please allow popups and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <button
          onClick={onSwitchToEmail}
          className="text-xs font-medium text-amber-800 hover:text-amber-900 underline"
        >
          Use email & password instead
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Visual Hero */}
        <div className="md:col-span-5 bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-lg">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight font-['Newsreader',serif]">
                  Abubakar
                </h1>
                <p className="text-xs text-amber-200/80 font-medium">
                  Weekly Photo Journal
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl font-serif leading-snug">
                One-tap Sign In with Google.
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Connect your Google Account to instantly publish moments, sync weekly photo rolls across devices, and react to stories.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-stone-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant profile photo & name sync</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pre-verified Google security</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero password friction</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 mt-6 text-[11px] text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Secured with Firebase Google Identity</span>
          </div>
        </div>

        {/* Right Side: Google Login Action Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center items-center text-center">
          <div className="max-w-sm w-full space-y-6">
            {/* Google Logo Brand Circle */}
            <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-stone-900 font-['Newsreader',serif]">
                Sign in with Google
              </h2>
              <p className="text-xs text-stone-500">
                Click below to select your Google Account and sign in to Abubakar.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Big Google Sign In Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-500/50 text-stone-900 text-sm font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-stone-400">
                By continuing, you agree to share your name and email with the Abubakar community journal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
