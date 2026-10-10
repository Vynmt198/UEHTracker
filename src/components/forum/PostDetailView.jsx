import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  MessageSquare, 
  Tag, 
  Calendar, 
  User, 
  Loader2, 
  Share2, 
  Bookmark,
  Check
} from 'lucide-react';
import { forumApi } from '../../services/api';
import { FORUM_CATEGORIES, formatRelativeTime } from './forumConstants';
import { CommentTree } from './CommentTree';

export const PostDetailView = ({
  postId,
  onBack,
  currentUser,
  onRequireAuth,
  onPostUpdated,
}) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await forumApi.getPostDetail(postId);
        const data = res.data || res;
        if (isMounted) {
          setPost(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Không thể tải chi tiết bài viết');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleVote = async (type) => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (isVoting || !post) return;

    setIsVoting(true);
    try {
      const res = await forumApi.votePost(post.id, type);
      const voteData = res.data || res;
      setPost((prev) => ({
        ...prev,
        upvotesCount: voteData.upvotesCount,
        downvotesCount: voteData.downvotesCount,
        userVote: voteData.userVote,
      }));
      if (onPostUpdated) {
        onPostUpdated({
          id: post.id,
          upvotesCount: voteData.upvotesCount,
          downvotesCount: voteData.downvotesCount,
          userVote: voteData.userVote,
        });
      }
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentAdded = (newComment, parentId) => {
    setPost((prev) => {
      if (!prev) return prev;
      if (!parentId) {
        // Root comment added
        return {
          ...prev,
          comments: [newComment, ...(prev.comments || [])],
        };
      }

      // Helper to insert reply recursively into tree
      const insertReply = (list) => {
        return list.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              replies: [...(item.replies || []), newComment],
            };
          }
          if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: insertReply(item.replies),
            };
          }
          return item;
        });
      };

      return {
        ...prev,
        comments: insertReply(prev.comments || []),
      };
    });

    if (onPostUpdated) {
      onPostUpdated({
        id: postId,
        commentIncrement: true,
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#49C8D6] mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Đang tải bài viết và luồng thảo luận...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
        <p className="text-sm text-rose-600 font-medium">{error || 'Bài viết không tồn tại'}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại diễn đàn</span>
        </button>
      </div>
    );
  }

  const categoryConfig = FORUM_CATEGORIES.find((c) => c.id === post.category) || FORUM_CATEGORIES[0];
  const authorName = post.author?.profile?.fullName || post.author?.email?.split('@')[0] || 'Sinh viên UEH';
  const authorCohort = post.author?.profile?.cohort || '';
  const authorMajor = post.author?.profile?.major || '';
  const netScore = (post.upvotesCount || 0) - (post.downvotesCount || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors text-xs flex items-center gap-1"
            title="Sao chép liên kết bài viết"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">{copied ? 'Đã chép' : 'Chia sẻ'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Post Main Section */}
        <div className="flex items-start gap-4">
          {/* Vertical Vote Box */}
          <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5 shrink-0 select-none">
            <button
              onClick={() => handleVote('UPVOTE')}
              disabled={isVoting}
              className={`p-1.5 rounded-lg transition-colors ${
                post.userVote === 'UPVOTE'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-200/70'
              }`}
              title="Đồng tình (Upvote)"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <span className={`text-xs font-bold py-1 ${
              netScore > 0 ? 'text-emerald-700' : netScore < 0 ? 'text-rose-600' : 'text-slate-700'
            }`}>
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
            <button
              onClick={() => handleVote('DOWNVOTE')}
              disabled={isVoting}
              className={`p-1.5 rounded-lg transition-colors ${
                post.userVote === 'DOWNVOTE'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-slate-200/70'
              }`}
              title="Không đồng tình (Downvote)"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>

          {/* Post Content Header & Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${categoryConfig.badgeClass}`}>
                {categoryConfig.shortLabel || categoryConfig.label}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatRelativeTime(post.createdAt)}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.viewsCount || 0} lượt xem
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {post.title}
            </h1>

            {/* Author Card */}
            <div className="flex items-center gap-2.5 pt-1 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800">{authorName}</span>
                  {authorCohort && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      {authorCohort}
                    </span>
                  )}
                </div>
                {authorMajor && (
                  <p className="text-[10px] text-slate-500">{authorMajor}</p>
                )}
              </div>
            </div>

            {/* Post Full Body */}
            <div className="pt-2 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
              {post.content}
            </div>

            {/* Tags Pills */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 pt-3 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono hover:bg-slate-200/80 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Multi-level Discussion Tree */}
        <CommentTree
          postId={post.id}
          comments={post.comments || []}
          onCommentAdded={handleCommentAdded}
          currentUser={currentUser}
          onRequireAuth={onRequireAuth}
        />
      </div>
    </div>
  );
};

export default PostDetailView;
