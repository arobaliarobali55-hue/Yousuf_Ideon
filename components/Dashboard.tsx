import React from 'react';
import { Idea, User } from '../types';
import { LightbulbIcon, HeartIcon, Share2Icon, EyeIcon } from './icons';

interface DashboardProps {
    ideas: Idea[];
    currentUser: User;
    onSelectIdea: (idea: Idea) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-slate-800 p-6 rounded-lg flex items-start space-x-4 border border-slate-700">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ ideas, currentUser, onSelectIdea }) => {
    const userIdeas = ideas.filter(idea => idea.author.id === currentUser.id);

    const totalLikes = userIdeas.reduce((sum, idea) => sum + idea.likes, 0);
    const totalShares = userIdeas.reduce((sum, idea) => sum + (idea.shares || 0), 0);
    const totalViews = userIdeas.reduce((sum, idea) => sum + (idea.views || 0), 0);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<LightbulbIcon className="w-6 h-6 text-white"/>} label="Total Ideas" value={userIdeas.length} color="bg-cyan-500/50" />
                <StatCard icon={<HeartIcon className="w-6 h-6 text-white"/>} label="Total Likes" value={totalLikes} color="bg-red-500/50" />
                <StatCard icon={<EyeIcon className="w-6 h-6 text-white"/>} label="Total Views" value={totalViews} color="bg-blue-500/50" />
                <StatCard icon={<Share2Icon className="w-6 h-6 text-white"/>} label="Total Shares" value={totalShares} color="bg-green-500/50" />
            </div>

            {/* My Ideas List */}
            <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Your Ideas</h2>
                <div className="space-y-6">
                    {userIdeas.length > 0 ? userIdeas.map(idea => (
                        <div key={idea.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-100">{idea.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{idea.summary}</p>
                                </div>
                                <button onClick={() => onSelectIdea(idea)} className="mt-4 sm:mt-0 flex-shrink-0 px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                                    View Details
                                </button>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-2 rounded-md hover:bg-slate-700/50 cursor-pointer" title="Click to view who viewed">
                                    <p className="text-xl font-bold text-cyan-400">{idea.views || 0}</p>
                                    <p className="text-xs text-slate-400">Views</p>
                                </div>
                                <div className="p-2 rounded-md hover:bg-slate-700/50 cursor-pointer" title="Click to view who liked">
                                    <p className="text-xl font-bold text-red-400">{idea.likes}</p>
                                    <p className="text-xs text-slate-400">Likes</p>
                                </div>
                                <div className="p-2 rounded-md hover:bg-slate-700/50 cursor-pointer" title="Click to view who shared">
                                    <p className="text-xl font-bold text-green-400">{idea.shares || 0}</p>
                                    <p className="text-xs text-slate-400">Shares</p>
                                </div>
                                <div className="p-2 rounded-md hover:bg-slate-700/50 cursor-pointer" title="Click to view comments">
                                    <p className="text-xl font-bold text-purple-400">{idea.comments.length}</p>
                                    <p className="text-xs text-slate-400">Comments</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                         <div className="text-center py-16 bg-slate-800/50 rounded-lg">
                            <h2 className="text-2xl font-semibold text-slate-300">You haven't submitted any ideas yet.</h2>
                            <p className="text-slate-400 mt-2">Click "Submit Idea" to share your first concept!</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
