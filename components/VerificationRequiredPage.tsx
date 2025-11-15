import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { LightbulbIcon } from './icons';

interface VerificationRequiredPageProps {
  email: string;
  users: User[];
  onResend: (email: string) => Promise<void>;
  onVerify: (email: string, code: string) => Promise<void>;
}

const VerificationRequiredPage: React.FC<VerificationRequiredPageProps> = ({ email, users, onResend, onVerify }) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = users.find(u => u.email === email);
  const verificationCodeForDemo = user?.verificationCode || '';

  const handleResendClick = async () => {
    setIsResending(true);
    setError(null);
    try {
        await onResend(email);
    } finally {
        setIsResending(false);
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
        setError("Please enter a 6-digit code.");
        return;
    }
    setIsVerifying(true);
    setError(null);
    try {
        await onVerify(email, code);
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setIsVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
        <div className="flex items-center space-x-3 mb-8">
            <LightbulbIcon className="w-12 h-12 text-cyan-400" />
            <span className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Ideon
            </span>
        </div>
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
            <p className="text-slate-300 mb-6">
                We've sent a 6-digit verification code to <strong>{email}</strong>. The code expires in 10 minutes.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
                 <div>
                    <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">Verification Code</label>
                    <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 6) setCode(val);
                        }}
                        maxLength={6}
                        required
                        className="w-full text-center text-3xl tracking-[1em] font-bold bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3"
                        placeholder="123456"
                        autoComplete="one-time-code"
                     />
                 </div>

                 <div className="min-h-[20px]">
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                 </div>

                <button
                    type="submit"
                    disabled={isVerifying || code.length !== 6}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isVerifying ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>
            
            <div className="bg-slate-900 p-4 rounded-md my-6">
                <p className="text-xs text-slate-400 mb-2">For demo purposes, your code is:</p>
                <p className="text-2xl font-mono tracking-widest text-cyan-400">
                    {verificationCodeForDemo}
                </p>
            </div>

            <p className="text-sm text-slate-400">
                Didn't receive the email?{' '}
                <button 
                    onClick={handleResendClick} 
                    disabled={isResending}
                    className="font-medium text-cyan-400 hover:text-cyan-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isResending ? 'Sending...' : 'Resend Code'}
                </button>
            </p>
        </div>
    </div>
  );
};

export default VerificationRequiredPage;