import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Users, 
  Loader2, 
  RefreshCw, 
  X,
  Tag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { forumApi } from '../../services/api';
import { FORUM_CATEGORIES, SORT_OPTIONS } from './forumConstants';
import { PostCard } from './PostCard';
import { PostDetailView } from './PostDetailView';
import { CreatePostModal } from './CreatePostModal';
import { CloudSyncModal } from './../common/CloudSyncModal';

export const ForumModule = () => {
  const { user } = useApp();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Query
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Views & Modals
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch posts from backend
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 8,
        sortBy,
      };

      if (activeCategory !== 'ALL') {
        params.category = activeCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (selectedTag) {
        params.tag = selectedTag;
      }

      const res = await forumApi.getPosts(params);
      const data = res.data || res;
      setPosts(data.posts || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalPosts(data.pagination.total || 0);
      }
    } catch (err) {
      console.error('Error fetching forum posts:', err);
      setError(err.message || 'Lỗi khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, activeCategory, searchQuery, selectedTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle vote directly from feed card
  const handleVoteFromFeed = async (postId, type) => {
    try {
      const res = await forumApi.votePost(postId, type);
      const voteData = res.data || res;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          return {
            ...p,
            upvotesCount: voteData.upvotesCount,
            downvotesCount: voteData.downvotesCount,
            userVote: voteData.userVote,
          };
        })
      );
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // Sync post update from detail view back to feed
  const handlePostUpdated = (updated) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== updated.id) return p;
        const newCommentsCount = updated.commentIncrement
          ? (p._count?.comments || 0) + 1
          : p._count?.comments;
        return {
          ...p,
          ...(updated.upvotesCount !== undefined && { upvotesCount: updated.upvotesCount }),
          ...(updated.downvotesCount !== undefined && { downvotesCount: updated.downvotesCount }),
          ...(updated.userVote !== undefined && { userVote: updated.userVote }),
          ...(updated.commentIncrement && {
            _count: { comments: newCommentsCount },
          }),
        };
      })
    );
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setTotalPosts((prev) => prev + 1);
  };

  const popularTags = ['HocBongUEH', 'K49', 'KinhTeLuong', 'NCKH', 'ViMo', 'Eureka2026', 'DangKyMonHoc'];

  // Detail View Mode
  if (selectedPostId) {
    return (
      <div className="space-y-6">
        <PostDetailView
          postId={selectedPostId}
          onBack={() => setSelectedPostId(null)}
          currentUser={user}
          onRequireAuth={() => setShowAuthModal(true)}
          onPostUpdated={handlePostUpdated}
        />
        <CloudSyncModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#49C8D6]/20 text-[#49C8D6] border border-[#49C8D6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cộng đồng Thảo luận Sinh viên UEH</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Diễn đàn Học thuật & Đời sống UEH
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Không gian trao đổi kinh nghiệm học tập, bí quyết săn học bổng Khuyến khích, 
            review môn học & giảng viên, cùng kết nối bạn đồng hành NCKH.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (!user) setShowAuthModal(true);
                else setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#49C8D6] hover:bg-[#3ab5c3] text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng bài viết mới</span>
            </button>

            <button
              onClick={fetchPosts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors"
              title="Làm mới bài viết"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-[#49C8D6]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Controls & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Top search & Sort row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm bài viết, tài liệu, môn học, giảng viên..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {FORUM_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Active Tag Filter Indicator */}
        {selectedTag && (
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
            <span>Đang lọc theo thẻ:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#49C8D6]/10 text-[#0284c7] font-semibold rounded-lg border border-[#49C8D6]/30">
              #{selectedTag}
              <button
                onClick={() => setSelectedTag('')}
                className="hover:text-rose-600 font-bold ml-1"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Posts Feed Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {loading && posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#49C8D6] mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Đang nạp bài viết từ Neon Cloud...</p>
            </div>
          ) : error && posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3">
              <p className="text-xs text-rose-600 font-medium">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">Không tìm thấy bài viết nào</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không có bài viết phù hợp với chuyên mục hoặc từ khóa tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc tạo bài viết mới!
              </p>
              <button
                onClick={() => {
                  if (!user) setShowAuthModal(true);
                  else setShowCreateModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tạo bài viết đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onSelect={(id) => setSelectedPostId(id)}
                  currentUser={user}
                  onRequireAuth={() => setShowAuthModal(true)}
                  onVote={handleVoteFromFeed}
                />
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 px-2">
                  <span className="text-xs text-slate-500">
                    Trang {page} / {totalPages} ({totalPosts} bài viết)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages || loading}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Information & Hot Tags (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Popular Tags */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Chủ đề nổi bật</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag === selectedTag ? '' : tag);
                    setPage(1);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-colors ${
                    selectedTag === tag
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Community Standards */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Quy chế sinh viên văn minh</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#49C8D6] font-bold">•</span>
                <span>Chia sẻ thông tin học thuật chính xác, mang tính xây dựng.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#49C8D6] font-bold">•</span>
                <span>Tôn trọng ý kiến khác biệt và bảo vệ quyền sở hữu trí tuệ/tài liệu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#49C8D6] font-bold">•</span>
                <span>Tuyệt đối không đăng nội dung quấy rối hoặc gian lận thi cử.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Quick Stats */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#49C8D6]" />
              <h4 className="text-xs font-semibold text-slate-800">Cộng đồng UEH Tracker</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hệ thống kết nối trực tiếp với cơ sở dữ liệu Neon Serverless Postgres. Mọi thảo luận và bài viết được lưu trữ và sao lưu an toàn trên đám mây.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
        currentUser={user}
        onRequireAuth={() => setShowAuthModal(true)}
      />

      <CloudSyncModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default ForumModule;
