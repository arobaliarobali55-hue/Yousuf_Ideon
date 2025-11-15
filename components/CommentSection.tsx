import React, { useState, useMemo } from 'react';
import { Comment as CommentType, User } from '../types';
import Comment from './Comment';
import { MessageSquareIcon } from './icons';

interface CommentSectionProps {
  ideaId: string;
  comments: CommentType[];
  currentUser: User;
  onAddComment: (ideaId: string, text: string, parentId: string | null) => void;
  onEditComment: (ideaId: string, commentId: string, text: string) => void;
  onDeleteComment: (ideaId: string, commentId: string) => void;
  onLikeComment: (ideaId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  ideaId,
  comments,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onViewProfile,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(ideaId, newComment, null);
      setNewComment('');
    }
  };

  const { topLevelComments, repliesMap } = useMemo(() => {
    const topLevel: CommentType[] = [];
    const replies = new Map<string, CommentType[]>();

    comments.forEach(comment => {
      if (comment.parentId) {
        if (!replies.has(comment.parentId)) {
          replies.set(comment.parentId, []);
        }
        replies.get(comment.parentId)!.push(comment);
      } else {
        topLevel.push(comment);
      }
    });

    topLevel.sort((a, b) => b.createdAt - a.createdAt);
    replies.forEach(replyList => replyList.sort((a, b) => a.createdAt - b.createdAt));

    return { topLevelComments: topLevel, repliesMap: replies };
  }, [comments]);

  return (
    <div>
      <h4 className="font-semibold text-slate-200 mb-4 flex items-center">
        <MessageSquareIcon className="w-5 h-5 mr-2" />
        Discussion ({comments.length})
      </h4>

      {/* Add new comment form */}
      <form onSubmit={handleAddComment} className="flex space-x-3 mb-6">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-grow">
          <label htmlFor="new-comment" className="sr-only">Add a Comment</label>
          <textarea
            id="new-comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            rows={2}
            className="block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white text-sm"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Comment
            </button>
          </div>
        </div>
      </form>

      {/* Display comments */}
      <div className="space-y-4">
        {topLevelComments.map(comment => (
          <Comment
            key={comment.id}
            ideaId={ideaId}
            comment={comment}
            replies={repliesMap.get(comment.id) || []}
            repliesMap={repliesMap}
            currentUser={currentUser}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
            onViewProfile={onViewProfile}
            depth={0}
          />
        ))}
        {comments.length === 0 && (
             <p className="text-slate-400 text-sm text-center py-4">Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;