import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Eye, 
  Tag, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { FORUM_CATEGORIES, formatRelativeTime } from './forumConstants';

export const PostCard = ({
  post,
  onSelect,
  currentUser,
  onRequireAuth,
  onVote,
}) => {
  const [isVoting, setIsVoting] = useState(false);

  const categoryConfig = FORUM_CATEGORIES.find((c) => c.id === post.category) || FORUM_CATEGORIES[0];
  const authorName = post.author?.profile?.fullName || post.author?.email?.split('@')[0] || 'Sinh viên UEH';
  const authorCohort = post.author?.profile?.cohort || '';
  const authorMajor = post.author?.profile?.major || '';
  const netScore = (post.upvotesCount || 0) - (post.downvotesCount || 0);
  const commentCount = post._count?.comments ?? (post.comments?.length || 0);

  const handleVoteClick = async (e, type) => {
    e.stopPropagation();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    try {
      await onVote(post.id, type);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div 
      onClick={() => onSelect(post.id)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex items-start gap-3 sm:gap-4 text-left"
    >
      {/* Upvote / Downvote Vertical Box */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="flex flex-col items-center bg-slate-50 border border-slate-200/80 rounded-xl p-1 shrink-0 select-none"
      >
        <button
          onClick={(e) => handleVoteClick(e, 'UPVOTE')}
          disabled={isVoting}
          className={`p-1.5 rounded-lg transition-colors ${
            post.userVote === 'UPVOTE'
              ? 'bg-emerald-500 text-white shadow-2xs'
              : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-200/70'
          }`}
          title="Đồng tình (Upvote)"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
        <span className={`text-[11px] font-bold py-0.5 ${
          netScore > 0 ? 'text-emerald-700' : netScore < 0 ? 'text-rose-600' : 'text-slate-600'
        }`}>
          {netScore > 0 ? `+${netScore}` : netScore}
        </span>
        <button
          onClick={(e) => handleVoteClick(e, 'DOWNVOTE')}
          disabled={isVoting}
          className={`p-1.5 rounded-lg transition-colors ${
            post.userVote === 'DOWNVOTE'
              ? 'bg-rose-500 text-white shadow-2xs'
              : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200/70'
          }`}
          title="Không đồng tình (Downvote)"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Info */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Category & Time Meta */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className={`px-2 py-0.5 rounded-md font-semibold border ${categoryConfig.badgeClass}`}>
            {categoryConfig.shortLabel || categoryConfig.label}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatRelativeTime(post.createdAt)}
          </span>
          {authorCohort && (
            <span className="text-slate-500 font-medium bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
              {authorCohort}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#0284c7] transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {post.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="text-[10px] text-slate-400">+{post.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer info: Author & counters */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-slate-700 truncate max-w-[120px] sm:max-w-[180px]">
              {authorName}
            </span>
            {authorMajor && (
              <span className="hidden md:inline text-[10px] text-slate-400 truncate max-w-[120px]">
                • {authorMajor}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              {commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.viewsCount || 0}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
