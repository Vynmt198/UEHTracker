import React from 'react';
import { MessageSquare, Sparkles, Users, Award, BookOpen, Share2 } from 'lucide-react';

export const ForumPlaceholder: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs text-center max-w-3xl mx-auto space-y-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Tính năng đang hoàn thiện • Sắp ra mắt
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Diễn đàn Cộng đồng Sinh viên UEH
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Không gian trao đổi học thuật, kinh nghiệm săn học bổng khuyến khích, review giảng viên, và tìm bạn đồng hành cùng tham gia các hoạt động ĐRL tại các cơ sở UEH.
        </p>
      </div>

      {/* Feature teasers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-100 text-[#007D8C] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Kho tài liệu & Đề thi UEH</h4>
          <p className="text-[11px] text-slate-500">
            Tổng hợp ngân hàng đề thi trắc nghiệm, bài tập lớn và tài liệu ôn tập các học phần đại cương.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Cẩm nang Săn Học bổng</h4>
          <p className="text-[11px] text-slate-500">
            Bí quyết giữ vững GPA 3.6+ và ĐRL 90+ từ các thủ khoa khóa K46, K47, K48.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Tìm Đội thi & Hoạt động</h4>
          <p className="text-[11px] text-slate-500">
            Kết nối đồng đội tham gia các cuộc thi học thuật UEH500, Marketing Arena, Eureka...
          </p>
        </div>
      </div>
    </div>
  );
};
