import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Tag, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  LogIn, 
  BookOpen, 
  HelpCircle,
  Award,
  Layers
} from 'lucide-react';
import { forumApi } from '../../services/api';
import { FORUM_CATEGORIES } from './forumConstants';

export const CreatePostModal = ({
  isOpen,
  onClose,
  onPostCreated,
  currentUser,
  onRequireAuth,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GOC_HOC_TAP');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['UEH', 'K49']);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await forumApi.createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
      });
      const newPost = res.data || res;
      setTitle('');
      setContent('');
      setTags(['UEH', 'K49']);
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tạo bài viết');
    } finally {
      setSubmitting(false);
    }
  };

  const categoriesOptions = FORUM_CATEGORIES.filter((c) => c.id !== 'ALL');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#49C8D6]/20 text-[#49C8D6] rounded-xl border border-[#49C8D6]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight">Tạo bài viết thảo luận mới</h3>
              <p className="text-[11px] text-slate-300">Chia sẻ kiến thức, kinh nghiệm & kết nối cộng đồng UEH</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Guest Warning */}
          {!currentUser && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Bạn cần đăng nhập tài khoản để có thể đăng bài trên diễn đàn.</span>
              </div>
              <button
                type="button"
                onClick={onRequireAuth}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shrink-0 transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Chuyên mục thảo luận <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categoriesOptions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium ${
                    category === cat.id
                      ? `${cat.badgeClass} ring-2 ring-slate-900 shadow-2xs`
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block font-semibold">{cat.shortLabel || cat.label}</span>
                  <span className="block text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.description || cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề bài viết <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Kinh nghiệm săn học bổng loại Xuất sắc kỳ này..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nội dung chi tiết <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Trình bày chi tiết chia sẻ, bí quyết môn học, thông tin đề thi hoặc thắc mắc của bạn..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gắn thẻ (Tags)
            </label>
            <div className="flex items-center gap-1.5 flex-wrap p-2 border border-slate-200 rounded-xl bg-slate-50/50">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-mono"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Nhập tag rồi ấn Enter..."
                className="flex-1 min-w-[120px] text-xs bg-transparent border-none p-1 focus:outline-hidden placeholder:text-slate-400"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Gõ tag (ví dụ: HocBong, K49, ViMo) rồi nhấn phím Enter để thêm.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Đăng bài ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
