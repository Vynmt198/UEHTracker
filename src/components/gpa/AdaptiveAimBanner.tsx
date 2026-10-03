import React, { useState } from 'react';
import { Course } from '../../types';
import { evaluateAdaptiveAim, AdaptiveAimFeedback } from '../../utils/gpaCalculator';
import { TrendingUp, AlertCircle, Sliders, Check, X } from 'lucide-react';

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
            className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                {fb.status === 'upgrade' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    Adaptive Aim
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{fb.title}</h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">{fb.message}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-normal">
                  <span>Aim: {fb.currentAim.toFixed(1)}</span>
                  <span>•</span>
                  <span>Điểm thực: {fb.actualScore.toFixed(1)}</span>
                  <span>•</span>
                  <span className="text-slate-800 font-medium">
                    Đề xuất: {fb.suggestedAim.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onUpdateAim(fb.courseId, fb.suggestedAim)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#49C8D6] hover:bg-[#3db8c6] text-white transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Áp dụng Aim {fb.suggestedAim}
              </button>

              <button
                onClick={() => handleOpenStrategy(fb.courseId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Đổi chiến lược
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Strategy Adjustment Modal - Flat & Minimal */}
      {strategyModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Điều chỉnh Aim học phần</h3>
              </div>
              <button
                onClick={() => setStrategyModalCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500">Môn học</p>
              <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                {strategyModalCourse.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {strategyModalCourse.credits} tín chỉ • Aim hiện tại: {strategyModalCourse.aimScore10 || 8.0}
              </p>
            </div>

            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Mục tiêu Aim mới:</span>
                <span className="text-xl font-semibold text-slate-900">{customAim.toFixed(1)}</span>
              </div>

              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={customAim}
                onChange={(e) => setCustomAim(parseFloat(e.target.value))}
                className="w-full accent-[#49C8D6] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5.0 (TB)</span>
                <span>7.0 (Khá)</span>
                <span>8.5 (Giỏi)</span>
                <span>10.0 (Xuất sắc)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Hạ Aim sẽ giúp giảm áp lực và dồn sức cho các môn chuyên ngành khác. Nâng Aim sẽ trực tiếp cải thiện chỉ số GPA Dự kiến cho kỳ xét học bổng.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStrategyModalCourse(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyAim}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#49C8D6] hover:bg-[#3db8c6] text-white shadow-xs"
              >
                Lưu mục tiêu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
