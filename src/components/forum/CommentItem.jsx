import React, { useState } from 'react';
import { MessageCircle, CornerDownRight, Send, User, Loader2 } from 'lucide-react';
import { formatRelativeTime } from './forumConstants';

export const CommentItem = ({
  comment,
  depth = 0,
  onReply,
  onRequireAuth,
  currentUser,
  submittingReplyId,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const authorName = comment.author?.profile?.fullName || comment.author?.email?.split('@')[0] || 'Sinh viên UEH';
  const authorCohort = comment.author?.profile?.cohort || '';
  const authorMajor = comment.author?.profile?.major || '';
  const isSubmittingThis = submittingReplyId === comment.id;

  const handleOpenReply = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    setShowReplyBox(!showReplyBox);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await onReply({
      parentId: comment.id,
      content: replyText.trim(),
    });

    setReplyText('');
    setShowReplyBox(false);
  };

  // Limit visual indentation padding beyond depth 4 to prevent overflow on mobile screens
  const indentClass = depth === 0 ? '' : 'border-l-2 border-slate-200/90 pl-3 sm:pl-4 mt-3';

  return (
    <div className={`group/comment text-left ${indentClass}`}>
      <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-3 sm:p-3.5 transition-colors">
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-900">{authorName}</span>
              {authorCohort && (
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                  {authorCohort}
                </span>
              )}
              {authorMajor && depth === 0 && (
                <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[140px]">
                  • {authorMajor}
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Comment Content */}
        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pl-8">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-3 mt-2 pl-8">
          <button
            onClick={handleOpenReply}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#49C8D6] transition-colors"
          >
            <CornerDownRight className="w-3 h-3" />
            <span>Trả lời</span>
          </button>
        </div>

        {/* Reply Input Box */}
        {showReplyBox && (
          <form onSubmit={handleSendReply} className="mt-3 pl-8 animate-in fade-in duration-150">
            <div className="space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Phản hồi cho ${authorName}...`}
                rows={2}
                autoFocus
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent placeholder:text-slate-400"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmittingThis}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmittingThis ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>Gửi phản hồi</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Recursive Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2.5">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onRequireAuth={onRequireAuth}
              currentUser={currentUser}
              submittingReplyId={submittingReplyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
