import React, { useMemo } from 'react';
import { Idea, User } from '../types';
import { LightbulbIcon, UsersIcon } from './icons';

interface RightSidebarProps {
  ideas: Idea[];
  users: User[];
  currentUser: User;
  onSelectIdea: (idea: Idea) => void;
  onViewProfile: (user: User) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ ideas, users, currentUser, onSelectIdea, onViewProfile }) => {

  const trendingIdeas = useMemo(() => {
    const calculateScore = (idea: Idea) => idea.likes + idea.comments.length * 2;
    return [...ideas]
      .sort((a, b) => calculateScore(b) - calculateScore(a))
      .slice(0, 5);
  }, [ideas]);

  const suggestedUsers = useMemo(() => {
    return users
      .filter(user => user.id !== currentUser.id)
      .sort(() => 0.5 - Math.random()) // Shuffle users
      .slice(0, 4);
  }, [users, currentUser]);

  return (
    <aside className="w-80 flex-shrink-0 bg-slate-900 border-l border-slate-700 p-6 hidden lg:block overflow-y-auto">
      {/* Trending Ideas */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center mb-4">
          <LightbulbIcon className="w-4 h-4 mr-2 text-cyan-400" />
          Trending Ideas
        </h3>
        <div className="space-y-3">
          {trendingIdeas.map(idea => (
            <div 
              key={idea.id} 
              className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => onSelectIdea(idea)}
            >
              <p className="text-sm font-bold text-slate-200 truncate">{idea.title}</p>
              <p className="text-xs text-slate-400 mt-1">by {idea.author.name} &middot; {idea.likes} likes</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center mb-4">
          <UsersIcon className="w-4 h-4 mr-2 text-cyan-400" />
          Who to Follow
        </h3>
        <div className="space-y-4">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => onViewProfile(user)}
              >
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.title}</p>
                </div>
              </div>
              <button className="px-3 py-1 text-xs font-semibold text-cyan-300 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
       <div className="mt-10 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 p-4 rounded-lg border border-slate-700">
          <h4 className="font-bold text-white">Ideon Pitch Day!</h4>
          <p className="text-sm text-slate-300 mt-2">
            Join us next month for our virtual pitch day. Top ideas will be presented to a panel of VCs.
          </p>
          <button className="mt-3 text-sm font-semibold text-cyan-300 hover:text-white transition-colors">Learn More &rarr;</button>
       </div>
    </aside>
  );
};

export default RightSidebar;