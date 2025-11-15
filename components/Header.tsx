import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, PlusIcon, UserIcon, LogOutIcon, BellIcon, MenuIcon } from './icons';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onSubmitIdeaClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onSubmitIdeaClick, 
  onProfileClick, 
  onLogout, 
  searchQuery, 
  onSearchChange,
  onToggleSidebar,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 -ml-2 rounded-md text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            {/* Left: Search Bar */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="Search Ideas or Users"
                aria-label="Search Ideas or Users"
              />
            </div>
          </div>


          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onSubmitIdeaClick}
              className="inline-flex items-center justify-center flex-shrink-0 sm:px-4 px-2.5 h-9 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all transform hover:scale-105"
              aria-label="Submit new idea"
            >
              <span className="hidden sm:block">Submit Idea</span>
              <PlusIcon className="sm:hidden h-5 w-5" />
            </button>
            
            <div className="relative" ref={notificationsMenuRef}>
              <button
                onClick={() => setIsNotificationsMenuOpen(prev => !prev)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                aria-label="View notifications"
              >
                <BellIcon className="w-5 h-5" />
              </button>
              {isNotificationsMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 text-sm font-semibold text-white border-b border-slate-700">Notifications</div>
                    <div className="py-2">
                        <div className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50">Ken W. commented on your idea.</div>
                        <div className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50">Samantha B. liked your idea.</div>
                        <div className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50">New co-founder request received.</div>
                    </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                className="flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                aria-label="View profile"
              >
                <img 
                  className="h-9 w-9 rounded-full object-cover border-2 border-slate-700 hover:border-cyan-400 transition"
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50 animate-fade-in-up">
                    <button
                        onClick={() => { onProfileClick(); setIsProfileMenuOpen(false); }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    >
                        <UserIcon className="w-4 h-4 mr-2" />
                        My Profile
                    </button>
                    <button
                        onClick={() => { onLogout(); setIsProfileMenuOpen(false); }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.1s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;