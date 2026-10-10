import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, Sparkles, LogIn } from 'lucide-react';
import { forumApi } from '../../services/api';
import { CommentItem } from './CommentItem';

export const CommentTree = ({
  postId,
  comments = [],
  onCommentAdded,
  currentUser,
  onRequireAuth,
}) => {
  const [rootContent, setRootContent] = useState('');
  const [isSubmittingRoot, setIsSubmittingRoot] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Total comment count calculation including nested replies
  const countAllComments = (list) => {
    let count = 0;
    for (const c of list) {
      count += 1;
      if (c.replies && c.replies.length > 0) {
        count += countAllComments(c.replies);
      }
    }
    return count;
  };

  const totalCount = countAllComments(comments);

  const handleSubmitRootComment = async (e) => {
    e.preventDefault();
    if (!rootContent.trim()) return;

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setIsSubmittingRoot(true);
    setErrorMsg('');
    try {
      const res = await forumApi.addComment(postId, {
        content: rootContent.trim(),
      });
      const newComment = res.data || res;
      setRootContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi gửi bình luận');
    } finally {
      setIsSubmittingRoot(false);
    }
  };

  const handleReplyComment = async ({ parentId, content }) => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setSubmittingReplyId(parentId);
    setErrorMsg('');
    try {
      const res = await forumApi.addComment(postId, {
        parentId,
        content,
      });
      const newReply = res.data || res;
      if (onCommentAdded) {
        onCommentAdded(newReply, parentId);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi gửi phản hồi');
    } finally {
      setSubmittingReplyId(null);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#49C8D6]" />
          <h3 className="text-sm font-semibold text-slate-900">
            Thảo luận & Bình luận ({totalCount})
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Cây phản hồi đa cấp
        </span>
      </div>

      {/* Root Comment Form */}
      <form onSubmit={handleSubmitRootComment} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {currentUser?.profile?.fullName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              value={rootContent}
              onChange={(e) => setRootContent(e.target.value)}
              placeholder={
                currentUser 
                  ? 'Viết bình luận, chia sẻ góc nhìn hoặc giải đáp thắc mắc...'
                  : 'Đăng nhập tài khoản để cùng thảo luận...'
              }
              rows={3}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent placeholder:text-slate-400"
            />

            {errorMsg && (
              <p className="text-xs text-rose-600">{errorMsg}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              {!currentUser ? (
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0284c7] hover:underline font-medium"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Đăng nhập để bình luận
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Phép tắc ứng xử: Tôn trọng & hỗ trợ cộng đồng UEH
                </span>
              )}

              <button
                type="submit"
                disabled={!rootContent.trim() || isSubmittingRoot}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmittingRoot ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Gửi bình luận</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <MessageSquare className="w-7 h-7 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            Chưa có bình luận nào cho bài viết này.
          </p>
          <p className="text-[11px] text-slate-400">
            Hãy là người đầu tiên để lại ý kiến hoặc chia sẻ kinh nghiệm!
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              onReply={handleReplyComment}
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

export default CommentTree;
