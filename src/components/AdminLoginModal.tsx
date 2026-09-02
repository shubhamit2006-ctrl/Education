import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, AUTHORIZED_ADMIN_EMAIL, isAuthorizedAdminEmail } from '../lib/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user && isAuthorizedAdminEmail(user.email)) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        const attemptedEmail = user?.email || 'Unknown';
        await signOut(auth);
        setIsLoading(false);
        setErrorMsg(
          `Access Denied: The Google account (${attemptedEmail}) is not authorized. Only ${AUTHORIZED_ADMIN_EMAIL} has administrator access.`
        );
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please complete the Google Sign-In prompt to proceed.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setErrorMsg(error.message || 'Failed to authenticate with Google. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#EA580C] to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-slate-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mb-3 text-amber-300">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">Admin Portal Authentication</h3>
          <p className="text-xs text-orange-100 mt-1">
            Restricted Access • Secure Google Sign-In powered by Firebase Authentication.
          </p>
        </div>

        {/* Auth Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-orange-950">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
              <span>Authorized Administrator Only:</span>
            </div>
            <p className="text-xs text-slate-600">
              Only the registered administrator account is authorized to view leads, edit content, and export enquiries:
            </p>
            <div className="font-mono text-xs font-bold text-[#EA580C] bg-white px-3 py-2 rounded-xl border border-orange-200 break-all select-all">
              {AUTHORIZED_ADMIN_EMAIL}
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <span className="text-xs font-semibold text-slate-600">Verifying administrator credentials...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Firebase Security Rules Enforced
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
