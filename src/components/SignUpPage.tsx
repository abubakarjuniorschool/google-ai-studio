import React, { useState } from 'react';
import { registerWithEmail, signInWithGoogle } from '../lib/authService';
import { Person } from '../types';
import {
  Camera,
  ArrowLeft,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SignUpPageProps {
  onSuccess: (person?: Person) => void;
  onBack: () => void;
  onOpenGoogleSignIn?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onBack,
  onOpenGoogleSignIn,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const person = await registerWithEmail(email, password, name, bio);
      onSuccess(person);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const person = await signInWithGoogle();
      onSuccess(person);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {onOpenGoogleSignIn && (
          <button
            onClick={onOpenGoogleSignIn}
            className="text-xs font-medium text-amber-800 hover:text-amber-900 underline"
          >
            Switch to Google Sign In Screen
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Hero Brand */}
        <div className="md:col-span-5 bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
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
                Join the weekly candid story.
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Publish your own weekly rolls, tag moods, record audio notes, and preserve memories with the community.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-stone-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Upload high-resolution photo rolls</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Real-time Firestore cloud synchronization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email-verified secure author profiles</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 mt-6 text-[11px] text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Secure Firebase Authentication</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-stone-900 font-['Newsreader',serif]">
                Create Your Account
              </h2>
              <p className="text-xs text-stone-500">
                Join in seconds to begin submitting weekly highlights.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Quick Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Sign up with Google</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-stone-400">
              <div className="flex-1 h-px bg-stone-200" />
              <span>or email</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abubakar Al-Mansoor"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Bio <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Street photographer & candid storyteller"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-semibold shadow-md transition-all active:scale-98 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account & Sending Verification...' : 'Sign Up & Verify Email'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
