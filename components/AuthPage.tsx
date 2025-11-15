import React, { useState, useRef } from 'react';
import { User } from '../types';
import { LightbulbIcon, CameraIcon } from './icons';

type SignUpData = Omit<User, 'id' | 'title' | 'bio' | 'emailVerified' | 'verificationCode' | 'verificationCodeExpires'>;

interface AuthPageProps {
    onLogin: (emailOrUsername: string, password: string) => Promise<void>;
    onSignUp: (newUserData: SignUpData) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login state
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // SignUp state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string>('https://picsum.photos/seed/default/256/256');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const clearFormState = () => {
        setError(null);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearFormState();
        setIsLoading(true);
        try {
            await onLogin(emailOrUsername, password);
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signUpPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (signUpPassword.length < 8) {
             setError("Password must be at least 8 characters long.");
            return;
        }
        clearFormState();
        setIsLoading(true);
        try {
            await onSignUp({ name, email, phone, password: signUpPassword, avatarUrl });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        const imageToDataUrl = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const img = new Image();
                    img.src = reader.result as string;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 256, MAX_HEIGHT = 256;
                        let { width, height } = img;
                        if (width > height) {
                            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                        } else {
                            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return reject(new Error('Could not get canvas context'));
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.9));
                    };
                    img.onerror = (err) => reject(err);
                };
                reader.onerror = (err) => reject(err);
            });
        };

        imageToDataUrl(file).then(setAvatarUrl).catch(err => console.error("Image processing error:", err));
    };

    const toggleMode = () => {
        clearFormState();
        setEmailOrUsername('');
        setPassword('');
        setName('');
        setEmail('');
        setPhone('');
        setSignUpPassword('');
        setConfirmPassword('');
        setMode(prev => prev === 'login' ? 'signup' : 'login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
             <div className="flex items-center space-x-3 mb-8">
                <LightbulbIcon className="w-12 h-12 text-cyan-400" />
                <span className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                  Ideon
                </span>
            </div>
            
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                {mode === 'login' ? (
                    <>
                        <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome Back!</h2>
                        <p className="text-center text-slate-400 mb-6">Log in to continue your journey.</p>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-slate-300">Email or Username</label>
                                <input type="text" id="emailOrUsername" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} required placeholder="Enter your email or username" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                            <div className="min-h-[20px] pt-1">
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            </div>
                             <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                                {isLoading ? 'Logging In...' : 'Log In'}
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-slate-400">
                           Don't have an account?{' '}
                           <button onClick={toggleMode} className="font-medium text-cyan-400 hover:text-cyan-300">Sign up</button>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white text-center mb-1">Create Your Account</h2>
                        <p className="text-center text-slate-400 mb-6">Join the hub of innovation.</p>
                        <form onSubmit={handleSignUpSubmit} className="space-y-3">
                            <div className="flex flex-col items-center">
                                 <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
                                <div className="relative">
                                    <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-600 object-cover"/>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                                    <button type="button" onClick={handlePhotoUploadClick} className="absolute bottom-0 right-0 bg-slate-700 hover:bg-slate-600 rounded-full p-2 border-2 border-slate-800" aria-label="Upload profile photo">
                                        <CameraIcon className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                             <div>
                                <label htmlFor="signup-name" className="block text-sm font-medium text-slate-300">Username</label>
                                <input id="signup-name" type="text" placeholder="Choose a unique username" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                            <div>
                                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-300">Email</label>
                                <input id="signup-email" type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                             <div>
                                <label htmlFor="signup-phone" className="block text-sm font-medium text-slate-300">Phone Number</label>
                                <input id="signup-phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                             <div>
                                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-300">Password</label>
                                <input id="signup-password" type="password" placeholder="Create a strong password (min. 8 characters)" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                             <div>
                                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-300">Confirm Password</label>
                                <input id="signup-confirm-password" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
                            </div>
                            
                            <div className="min-h-[20px] pt-1">
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>
                         <p className="mt-6 text-center text-sm text-slate-400">
                           Already have an account?{' '}
                           <button onClick={toggleMode} className="font-medium text-cyan-400 hover:text-cyan-300">Log in</button>
                        </p>
                    </>
                )}
            </div>
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #334155 inset !important;
                    -webkit-text-fill-color: #fff !important;
                    caret-color: #fff;
                }
            `}</style>
        </div>
    );
};

export default AuthPage;