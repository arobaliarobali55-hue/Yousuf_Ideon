import React from 'react';
import { HomeIcon, UsersIcon, LightbulbIcon, HeartIcon, MessageCircleIcon, SettingsIcon, XIcon, LayoutGridIcon } from './icons';

type ViewType = 'explore' | 'my-dashboard' | 'cofounder' | 'my-ideas' | 'liked-ideas' | 'messages' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmitIdeaClick: () => void;
}

const NAV_ITEMS = [
  { view: 'explore', label: 'Explore', icon: HomeIcon },
  { view: 'my-dashboard', label: 'My Dashboard', icon: LayoutGridIcon },
  { view: 'cofounder', label: 'Find Co-Founder', icon: UsersIcon },
  { view: 'my-ideas', label: 'My Ideas', icon: LightbulbIcon },
  { view: 'liked-ideas', label: 'Liked Ideas', icon: HeartIcon },
  { view: 'messages', label: 'Messages', icon: MessageCircleIcon },
  { view: 'settings', label: 'Settings', icon: SettingsIcon },
] as const;


const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen, onClose, onSubmitIdeaClick }) => {

  const navLinkClasses = (view: ViewType) => `
    flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group
    ${ activeView === view
        ? 'bg-cyan-500/10 text-cyan-300 shadow-inner'
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }
  `;
  
  const iconClasses = (view: ViewType) => `
    w-5 h-5 mr-3 transition-colors duration-200
    ${ activeView === view
        ? 'text-cyan-400'
        : 'text-slate-500 group-hover:text-slate-300'
    }
  `;

  return (
    <aside className={`w-64 flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col p-4 transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 lg:static lg:translate-x-0`}>
      <div className="flex items-center justify-between flex-shrink-0 mb-8 px-2">
        <div className="flex items-center space-x-2">
            <LightbulbIcon className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Ideon
            </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white" aria-label="Close sidebar">
            <XIcon className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(item => (
          <button key={item.view} onClick={() => onNavigate(item.view)} className={navLinkClasses(item.view)}>
            <item.icon className={iconClasses(item.view)} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex-shrink-0">
         <div className="bg-slate-700/50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-300 font-semibold">Ready to Innovate?</p>
            <p className="text-xs text-slate-400 mt-1 mb-3">Share your next big idea with the world.</p>
            <button 
              onClick={() => {
                onSubmitIdeaClick();
                onClose();
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm py-2 px-4 rounded-lg transition-all transform hover:scale-105"
            >
                Submit Idea
            </button>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;