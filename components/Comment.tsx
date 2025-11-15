
import React, { useState } from 'react';
import { Comment as CommentType, User } from '../types';
import { ThumbsUpIcon, CornerDownRightIcon } from './icons';
import { formatDistanceToNow } from 'date-fns';


interface CommentProps {
  ideaId: string;
  comment: CommentType;
  replies: CommentType[];
  repliesMap: Map<string, CommentType[]>;
  currentUser: User;
  onAddComment: (ideaId: string, text: string, parentId: string | null) => void;
  onEditComment: (ideaId: string, commentId: string, text: string) => void;
  onDeleteComment: (ideaId: string, commentId: string) => void;
  onLikeComment: (ideaId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
  depth: number;
}

const Comment: React.FC<CommentProps> = ({
  ideaId,
  comment,
  replies,
  repliesMap,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onViewProfile,
  depth,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');

  const isAuthor = currentUser.id === comment.user.id;
  const isLiked = comment.likedBy.includes(currentUser.id);
  
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEditComment(ideaId, comment.id, editText);
      setIsEditing(false);
    }
  };
  
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onAddComment(ideaId, replyText, comment.id);
      setIsReplying(false);
      setReplyText('');
    }
  };

  return (
    <div className="flex space-x-3">
        <img
            src={comment.user.avatarUrl}
            alt={comment.user.name}
            className="w-8 h-8 rounded-full mt-1 flex-shrink-0 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => onViewProfile(comment.user)}
        />
        <div className="flex-grow">
            <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm text-slate-200">
                        <span className="cursor-pointer hover:text-white" onClick={() => onViewProfile(comment.user)}>
                        {comment.user.name}
                        </span>
                        <span className="text-xs text-slate-500 ml-2 font-normal">{timeAgo}</span>
                    </p>
                    {isAuthor && !isEditing && (
                        <div className="relative group">
                             <button className="text-slate-400 hover:text-white">...</button>
                             <div className="absolute right-0 top-full mt-1 w-28 bg-slate-800 border border-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                                 <button onClick={() => setIsEditing(true)} className="block w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700">Edit</button>
                                 <button onClick={() => onDeleteComment(ideaId, comment.id)} className="block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-slate-700">Delete</button>
                             </div>
                        </div>
                    )}
                </div>

                {!isEditing ? (
                    <p className="text-sm text-slate-300 mt-1">{comment.text}</p>
                ) : (
                    <form onSubmit={handleEditSubmit} className="mt-2">
                        <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2} className="block w-full bg-slate-600 border-slate-500 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white text-sm"></textarea>
                        <div className="flex justify-end space-x-2 mt-2">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs font-semibold bg-slate-600 hover:bg-slate-500 rounded-md">Cancel</button>
                            <button type="submit" className="px-3 py-1 text-xs font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md">Save</button>
                        </div>
                    </form>
                )}
            </div>
            
            {/* Actions */}
            {!isEditing && (
                <div className="flex items-center space-x-4 mt-1.5 px-2">
                    <button onClick={() => onLikeComment(ideaId, comment.id)} className={`flex items-center space-x-1 text-xs font-semibold transition-colors ${isLiked ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>
                        <ThumbsUpIcon className="w-4 h-4" />
                        <span>{comment.likes > 0 ? comment.likes : ''}</span>
                    </button>
                    <button onClick={() => setIsReplying(!isReplying)} className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                        <CornerDownRightIcon className="w-4 h-4" />
                        <span>Reply</span>
                    </button>
                </div>
            )}

            {/* Reply Form */}
            {isReplying && (
                 <form onSubmit={handleReplySubmit} className="flex space-x-3 mt-3">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-grow">
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2} placeholder={`Replying to ${comment.user.name}...`} className="block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white text-sm"></textarea>
                        <div className="flex justify-end space-x-2 mt-2">
                             <button type="button" onClick={() => setIsReplying(false)} className="px-3 py-1 text-xs font-semibold bg-slate-600 hover:bg-slate-500 rounded-md">Cancel</button>
                             <button type="submit" className="px-3 py-1 text-xs font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md">Reply</button>
                        </div>
                    </div>
                </form>
            )}

            {/* Render Replies */}
            {replies.length > 0 && (
                <div className="mt-4 space-y-4 pl-6 border-l-2 border-slate-700/50">
                    {replies.map(reply => (
                        <Comment
                            key={reply.id}
                            ideaId={ideaId}
                            comment={reply}
                            replies={repliesMap.get(reply.id) || []}
                            repliesMap={repliesMap}
                            currentUser={currentUser}
                            onAddComment={onAddComment}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
                            onLikeComment={onLikeComment}
                            onViewProfile={onViewProfile}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default Comment;
