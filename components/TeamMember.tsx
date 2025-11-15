
import React from 'react';
import { User } from '../types';

interface TeamMemberProps {
    user: User;
    size?: 'sm' | 'md' | 'lg';
}

const TeamMember: React.FC<TeamMemberProps> = ({ user, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
    };

    return (
        <div className="flex items-center space-x-3 group">
            <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className={`${sizeClasses[size]} rounded-full border-2 border-slate-600 group-hover:border-cyan-400 transition-colors`}
            />
            <div>
                <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                <p className="text-xs text-slate-400">{user.title}</p>
            </div>
        </div>
    );
};

export default TeamMember;
