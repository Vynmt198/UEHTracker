import React, { useState } from 'react';
import { Course } from '../../types';
import { evaluateAdaptiveAim, AdaptiveAimFeedback } from '../../utils/gpaCalculator';
import { Sparkles, TrendingUp, AlertCircle, Sliders, CheckCircle, X } from 'lucide-react';

interface AdaptiveAimBannerProps {
  courses: Course[];
  onUpdateAim: (courseId: string, newAim: number) => void;
}

export const AdaptiveAimBanner: React.FC<AdaptiveAimBannerProps> = ({ courses, onUpdateAim }) => {
  const [strategyModalCourse, setStrategyModalCourse] = useState<Course | null>(null);
  const [customAim, setCustomAim] = useState<number>(8.0);

  // Evaluate all courses that have scores and aims
  const feedbacks: AdaptiveAimFeedback[] = [];
  courses.forEach((c) => {
    const fb = evaluateAdaptiveAim(c);
    if (fb && fb.status !== 'on_track') {
      feedbacks.push(fb);
    }
  });

  if (feedbacks.length === 0) return null;

  const handleOpenStrategy = (courseId: string) => {
    const found = courses.find((c) => c.id === courseId);
    if (found) {
      setStrategyModalCourse(found);
      setCustomAim(found.aimScore10 || 8.0);
    }
  };

  const handleApplyAim = () => {
    if (strategyModalCourse) {
      onUpdateAim(strategyModalCourse.id, customAim);
      setStrategyModalCourse(null);
    }
  };

  return (
    <>
      <div className="space-y-3 mb-6">
        {feedbacks.map((fb) => (
          <div
            key={fb.courseId}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              fb.status === 'upgrade'
                ? 'bg-linear-to-r from-emerald-50 to-[#E8FAFC] border-emerald-200 text-slate-800'
                : 'bg-linear-to-r from-amber-50 to-orange-50 border-amber-200 text-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  fb.status === 'upgrade'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-amber-500 text-white shadow-xs'
                }`}
              >
                {fb.status === 'upgrade' ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      fb.status === 'upgrade'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Adaptive Aim • AI Rule Engine
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{fb.title}</h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{fb.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                  <span className="text-slate-500">Aim hiện tại: {fb.currentAim.toFixed(1)}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Điểm thực tế: {fb.actualScore.toFixed(1)}</span>
                  <span className="text-slate-400">•</span>
                  <span
                    className={
                      fb.status === 'upgrade' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'
                    }
                  >
                    Gợi ý điều chỉnh: {fb.suggestedAim.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onUpdateAim(fb.courseId, fb.suggestedAim)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  fb.status === 'upgrade'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Áp dụng Aim {fb.suggestedAim}
              </button>

              <button
                onClick={() => handleOpenStrategy(fb.courseId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Đổi chiến lược
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Strategy Adjustment Modal */}
      {strategyModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#29B3C2]" />
                <h3 className="font-bold text-slate-800 text-base">Đổi chiến lược Aim</h3>
              </div>
              <button
                onClick={() => setStrategyModalCourse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Học phần</p>
              <h4 className="text-base font-extrabold text-slate-800 mt-0.5">
                {strategyModalCourse.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Số tín chỉ: {strategyModalCourse.credits} • Hiện đang đặt: {strategyModalCourse.aimScore10 || 8.0}
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Mục tiêu Aim mới:</span>
                <span className="text-2xl font-black text-[#29B3C2]">{customAim.toFixed(1)}</span>
              </div>

              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={customAim}
                onChange={(e) => setCustomAim(parseFloat(e.target.value))}
                className="w-full accent-[#29B3C2] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>5.0 (Trung bình)</span>
                <span>7.0 (Khá)</span>
                <span>8.5 (Giỏi)</span>
                <span>10.0 (Xuất sắc)</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed bg-cyan-50/50 p-3 rounded-xl border border-cyan-100">
              <span className="font-bold text-[#007D8C]">Lưu ý chiến lược: </span>
              Hạ Aim sẽ giúp giảm áp lực và dồn sức cho các môn chuyên ngành tín chỉ cao. Nâng Aim sẽ trực tiếp cải thiện chỉ số GPA Dự kiến cho kỳ xét học bổng.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStrategyModalCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyAim}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#29B3C2] hover:bg-[#209aa8] text-white shadow-md shadow-cyan-500/20"
              >
                Cập nhật chiến lược
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
