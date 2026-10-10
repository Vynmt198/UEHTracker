import React from 'react';
import { MessageSquare, Sparkles, Users, Award, BookOpen } from 'lucide-react';
export const ForumPlaceholder = () => {
    return (<div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
      <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
        <MessageSquare className="w-7 h-7"/>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-slate-500"/>
          Tính năng đang hoàn thiện • Sắp ra mắt
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Diễn đàn Cộng đồng Sinh viên UEH
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Không gian trao đổi học thuật, kinh nghiệm săn học bổng khuyến khích, review môn học và kết nối bạn đồng hành UEH.
        </p>
      </div>

      {/* Feature teasers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4"/>
          </div>
          <h4 className="text-xs font-semibold text-slate-800">Kho tài liệu & Đề thi</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Ngân hàng câu hỏi trắc nghiệm, bài tập lớn và tài liệu ôn tập các học phần đại cương.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
            <Award className="w-4 h-4"/>
          </div>
          <h4 className="text-xs font-semibold text-slate-800">Cẩm nang Học bổng</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Bí quyết duy trì GPA 3.6+ và ĐRL 90+ từ các thủ khoa UEH.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
            <Users className="w-4 h-4"/>
          </div>
          <h4 className="text-xs font-semibold text-slate-800">Tìm Đội thi & Hoạt động</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Kết nối đồng đội tham gia các cuộc thi UEH500, Marketing Arena, NCKH Eureka...
          </p>
        </div>
      </div>
    </div>);
};
