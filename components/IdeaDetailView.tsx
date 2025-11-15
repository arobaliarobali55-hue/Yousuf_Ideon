import React from 'react';
import { Idea, User, Comment } from '../types';
import { XIcon, UsersIcon, HeartIcon, Share2Icon, EyeIcon } from './icons';
import TeamMember from './TeamMember';
import CommentSection from './CommentSection';

interface IdeaDetailViewProps {
  idea: Idea | null;
  currentUser: User;
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onAddComment: (ideaId: string, text: string, parentId: string | null) => void;
  onEditComment: (ideaId: string, commentId: string, text: string) => void;
  onDeleteComment: (ideaId: string, commentId: string) => void;
  onLikeComment: (ideaId: string, commentId: string) => void;
  onLikeIdea: (ideaId: string) => void;
  onShare: (ideaId: string, title: string) => void;
}

const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({ 
  idea, 
  currentUser,
  onClose, 
  onViewProfile, 
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onLikeIdea,
  onShare,
}) => {
  if (!idea) return null;

  const isLiked = currentUser && idea.likedBy.includes(currentUser.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-start flex-shrink-0">
            <div className='flex-1'>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">{idea.title}</h2>
                <div className="mt-2 cursor-pointer" onClick={() => onViewProfile(idea.author)}>
                    <TeamMember user={idea.author} />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div title="Views" className="flex items-center space-x-2 rounded-full px-3 py-1.5 bg-slate-700/50 text-slate-300">
                    <EyeIcon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{idea.views || 0}</span>
                </div>
                <button title="Likes" onClick={() => onLikeIdea(idea.id)} className={`flex items-center space-x-2 rounded-full px-3 py-1.5 transition-colors ${isLiked ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
                    <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-semibold text-sm">{idea.likes}</span>
                </button>
                 <button title="Shares" onClick={() => onShare(idea.id, idea.title)} className="flex items-center space-x-2 rounded-full px-3 py-1.5 bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors">
                    <Share2Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{idea.shares || 0}</span>
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300">
                <h4 className="font-semibold text-slate-200">Description</h4>
                <p>{idea.description}</p>
            </div>

            <div className="mt-6 prose prose-invert prose-sm md:prose-base max-w-none text-slate-300">
                <h4 className="font-semibold text-slate-200">Target Audience</h4>
                <p>{idea.market}</p>
            </div>
            
            <div className="mt-6">
                <h4 className="font-semibold text-slate-200 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                    {idea.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
            
            <div className="mt-6">
                <h4 className="font-semibold text-slate-200 mb-3 flex items-center"><UsersIcon className="w-5 h-5 mr-2" /> Current Team</h4>
                <div className="flex flex-wrap gap-4">
                    {idea.team.map(member => (
                        <div key={member.id} className="cursor-pointer" onClick={() => onViewProfile(member)}>
                            <TeamMember user={member} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-400 mb-3">Seeking Co-founders with skills in:</h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {idea.lookingFor.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
            </div>

            <div className="mt-8">
              <CommentSection 
                ideaId={idea.id}
                comments={idea.comments}
                currentUser={currentUser}
                onAddComment={onAddComment}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
                onLikeComment={onLikeComment}
                onViewProfile={onViewProfile}
              />
            </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex-shrink-0 flex justify-end">
            {idea.isForSale && (
                <button 
                    onClick={() => alert(`Purchase process for "${idea.title}" would begin here.`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                    Buy Idea for ${idea.price}
                </button>
            )}
            {!idea.isForSale && (
                <button 
                    onClick={() => alert(`You've requested to join the team for "${idea.title}"!`)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                    Join Team
                </button>
            )}
        </div>

      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        .prose {
          --tw-prose-body: theme(colors.slate[300]);
          --tw-prose-headings: theme(colors.white);
          --tw-prose-lead: theme(colors.slate[400]);
          --tw-prose-links: theme(colors.cyan[400]);
          --tw-prose-bold: theme(colors.white);
          --tw-prose-counters: theme(colors.slate[400]);
          --tw-prose-bullets: theme(colors.slate[600]);
          --tw-prose-hr: theme(colors.slate[700]);
          --tw-prose-quotes: theme(colors.slate[100]);
          --tw-prose-quote-borders: theme(colors.slate[700]);
          --tw-prose-captions: theme(colors.slate[400]);
          --tw-prose-code: theme(colors.cyan[300]);
          --tw-prose-pre-code: theme(colors.cyan[300]);
          --tw-prose-pre-bg: theme(colors.slate[900]);
          --tw-prose-th-borders: theme(colors.slate[600]);
          --tw-prose-td-borders: theme(colors.slate[700]);
        }
      `}</style>
    </div>
  );
};

export default IdeaDetailView;