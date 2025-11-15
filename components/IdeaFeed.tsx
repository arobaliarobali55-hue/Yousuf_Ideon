
import React from 'react';
import { Idea, User } from '../types';
import IdeaCard from './IdeaCard';

type FilterType = 'all' | 'new' | 'trending' | 'most-liked' | 'most-shared';

interface IdeaFeedProps {
  ideas: Idea[];
  currentUser: User;
  onSelectIdea: (idea: Idea) => void;
  onLikeIdea: (ideaId: string) => void;
  onViewProfile: (user: User) => void;
  onShareIdea: (ideaId: string, title: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  title: string;
  subtitle: string;
}

const FILTERS: { key: FilterType, label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'trending', label: 'Trending' },
    { key: 'most-liked', label: 'Most Liked' },
    { key: 'most-shared', label: 'Most Shared' },
];

const IdeaFeed: React.FC<IdeaFeedProps> = ({ ideas, currentUser, onSelectIdea, onLikeIdea, onViewProfile, onShareIdea, activeFilter, onFilterChange, title, subtitle }) => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-4 tracking-tight">{title}</h1>
        <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
            {subtitle}
        </p>

        <div className="flex justify-center mb-8">
            <div className="bg-slate-800 p-1 rounded-full flex space-x-1 shadow-inner overflow-x-auto">
                {FILTERS.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => onFilterChange(filter.key)}
                        className={`px-4 sm:px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                            activeFilter === filter.key
                                ? 'bg-cyan-500 text-white shadow'
                                : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
      
      {ideas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} currentUser={currentUser} onSelect={onSelectIdea} onLikeIdea={onLikeIdea} onViewProfile={onViewProfile} onShare={onShareIdea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-slate-300">No Ideas Found</h2>
          <p className="text-slate-400 mt-2">Try adjusting your search query or filter to find what you're looking for.</p>
        </div>
      )}
    </main>
  );
};

export default IdeaFeed;