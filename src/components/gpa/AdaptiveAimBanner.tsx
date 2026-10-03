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
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  // Evaluate all courses that have scores and aims
  const feedbacks: AdaptiveAimFeedback[] = [];
  courses.forEach((c) => {
    const fb = evaluateAdaptiveAim(c);
    if (fb && !dismissed[fb.courseId]) {
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
      <div className="space-y-2 mb-4">
        {feedbacks.map((fb) => (
          <div
            key={fb.courseId}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#49C8D6] shrink-0" />
              <span className="font-medium text-slate-900 shrink-0">{fb.courseName}:</span>
              <span className="text-slate-600 truncate">{fb.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onUpdateAim(fb.courseId, fb.suggestedAim)}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#49C8D6] hover:bg-[#3db8c6] text-white transition-colors"
              >
                Cập nhật Aim {fb.suggestedAim}
              </button>

              <button
                onClick={() => setDismissed((prev) => ({ ...prev, [fb.courseId]: true }))}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                title="Bỏ qua"
              >
                <X className="w-3.5 h-3.5" />
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
