import React from 'react';
import { Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface EmailVerificationNoticeProps {
  email: string;
  onOpenVerificationModal: () => void;
}

export const EmailVerificationNotice: React.FC<EmailVerificationNoticeProps> = ({
  email,
  onOpenVerificationModal,
}) => {
  return (
    <div className="bg-amber-500/10 border-t border-b border-amber-500/20 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-950 font-medium">
          <Mail className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            Please verify your email address (
            <span className="font-semibold">{email}</span>) to unlock full journal publishing features.
          </span>
        </div>
        <button
          onClick={onOpenVerificationModal}
          className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 underline shrink-0 transition-colors"
        >
          <span>Verify Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
