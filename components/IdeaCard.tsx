
import React from 'react';
import { Idea, User } from '../types';
import { HeartIcon, MessageSquareIcon, Share2Icon, UsersIcon, EyeIcon } from './icons';
import TeamMember from './TeamMember';

interface IdeaCardProps {
  idea: Idea;
  currentUser: User;
  onSelect: (idea: Idea) => void;
  onLikeIdea: (ideaId: string) => void;
  onViewProfile: (user: User) => void;
  onShare: (ideaId: string, title: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, currentUser, onSelect, onLikeIdea, onViewProfile, onShare }) => {
  const isLiked = currentUser && idea.likedBy.includes(currentUser.id);
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeIdea(idea.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(idea.id, idea.title);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProfile(idea.author);
  };

  return (
    <div 
      onClick={() => onSelect(idea)}
      className="bg-slate-800/50 rounded-lg shadow-lg overflow-hidden border border-slate-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors flex-1">{idea.title}</h3>
            <div className="flex flex-col items-end flex-shrink-0 gap-2">
                {idea.isForSale && (
                    <div className="text-xs font-semibold bg-purple-500 text-white px-2 py-1 rounded-full">
                        ${idea.price}
                    </div>
                )}
                {idea.isSeekingCoFounder && (
                    <div className="flex items-center text-xs font-semibold bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        <UsersIcon className="w-3 h-3 mr-1.5" />
                        Seeking Co-founder
                    </div>
                )}
            </div>
        </div>
        <p className="mt-2 text-slate-400 text-sm leading-relaxed">{idea.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {idea.tags.map(tag => (
            <span key={tag} className="text-xs font-medium bg-slate-700 text-cyan-300 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 bg-slate-800/70 border-t border-slate-700 flex justify-between items-center">
        <div className="inline-block" onClick={handleProfileClick}>
            <TeamMember user={idea.author} size="sm" />
        </div>
        <div className="flex items-center space-x-4 text-slate-400">
          <div title="Views" className="flex items-center space-x-1 p-1">
            <EyeIcon className="w-4 h-4" />
            <span className="text-xs">{idea.views || 0}</span>
          </div>
          <button title="Likes" onClick={handleLikeClick} className={`flex items-center space-x-1 transition-colors p-1 ${isLiked ? 'text-red-500' : 'hover:text-white'}`}>
            <HeartIcon className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{idea.likes}</span>
          </button>
          <div title="Comments" className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer p-1">
            <MessageSquareIcon className="w-4 h-4" />
            <span className="text-xs">{idea.comments.length}</span>
          </div>
          <button title="Shares" onClick={handleShareClick} className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer p-1">
            <Share2Icon className="w-4 h-4" />
            <span className="text-xs">{idea.shares || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;