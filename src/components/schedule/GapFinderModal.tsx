import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchingStrategy } from '../../types';
import { matchActivitiesWithGaps, DAY_NAMES } from '../../utils/scheduleMatcher';
import {
  Sparkles,
  Target,
  Layers,
  Clock,
  MapPin,
  Check,
  X,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GapFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GapFinderModal: React.FC<GapFinderModalProps> = ({ isOpen, onClose }) => {
  const {
    allActivities,
    validGapTimes,
    scheduleBlocks,
    profile,
    getDRLProgress,
    registeredActivityIds,
    toggleActivityRegistration
  } = useApp();

  const [strategy, setStrategy] = useState<MatchingStrategy>('balanced');
  const { deficitMap } = getDRLProgress();

  if (!isOpen) return null;

  const matchedActivities = matchActivitiesWithGaps(
    allActivities,
    validGapTimes,
    scheduleBlocks,
    profile,
    deficitMap,
    strategy
  );

  const handleRegisterAndAdd = (activityId: string) => {
    toggleActivityRegistration(activityId);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Flat Clean */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Gap Time Engine
              </span>
              <span className="text-xs text-slate-500 font-normal">
                • {validGapTimes.length} khoảng trống hợp lệ (&ge;60p)
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-900 mt-0.5">
              Khớp hoạt động lấp Gap Time cá nhân
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strategy Selector - Minimal & Flat */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-2">
            Chọn tiêu chí ưu tiên:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStrategy('faculty')}
              className={`p-2.5 rounded-lg text-left border transition-colors ${
                strategy === 'faculty'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Compass className="w-3.5 h-3.5" />
                Chuyên môn Khoa
              </div>
              <p className={`text-[10px] mt-0.5 font-normal truncate ${strategy === 'faculty' ? 'text-slate-300' : 'text-slate-500'}`}>
                Ưu tiên {profile.faculty.split(' ')[0]}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrategy('drl_deficit')}
              className={`p-2.5 rounded-lg text-left border transition-colors ${
                strategy === 'drl_deficit'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Target className="w-3.5 h-3.5" />
                Tối ưu ĐRL
              </div>
              <p className={`text-[10px] mt-0.5 font-normal truncate ${strategy === 'drl_deficit' ? 'text-slate-300' : 'text-slate-500'}`}>
                Bù tiêu chí thiếu điểm nhất
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrategy('balanced')}
              className={`p-2.5 rounded-lg text-left border transition-colors ${
                strategy === 'balanced'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Layers className="w-3.5 h-3.5" />
                Kết hợp cân bằng
              </div>
              <p className={`text-[10px] mt-0.5 font-normal truncate ${strategy === 'balanced' ? 'text-slate-300' : 'text-slate-500'}`}>
                Cân đối chuyên môn & ĐRL
              </p>
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>
              Tìm thấy <strong className="text-slate-800">{matchedActivities.length}</strong> hoạt động phù hợp khung giờ trống:
            </span>
          </div>

          {matchedActivities.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-lg border border-slate-200">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Chưa tìm thấy hoạt động khớp với Gap Time</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-normal">
                Các khoảng trống trên 60 phút của bạn chưa trùng khung giờ của các hoạt động mở trong tuần này.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {matchedActivities.map((item) => {
                const act = item.activity;
                const isRegistered = registeredActivityIds.includes(act.id);

                return (
                  <div
                    key={act.id}
                    className={`p-4 rounded-lg border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                      isRegistered
                        ? 'border-slate-400 bg-slate-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          Điểm match: {item.matchScore} pts
                        </span>

                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                          {act.facultyTarget}
                        </span>

                        <span className="text-xs font-semibold text-slate-800">
                          +{act.totalPoints}đ ĐRL
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{act.title}</h4>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-normal">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {DAY_NAMES[act.dayOfWeek]} ({act.startTime} - {act.endTime})
                          </span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[200px]">{act.location}</span>
                        </div>
                      </div>

                      {/* Reasons */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.reasons.map((r, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-50 text-slate-600 border border-slate-200 font-normal"
                          >
                            <Check className="w-3 h-3 text-slate-500" />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleRegisterAndAdd(act.id)}
                        className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                          isRegistered
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-[#49C8D6] hover:bg-[#3db8c6] text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isRegistered ? 'Đã thêm vào lịch' : 'Thêm vào Lịch & Đăng ký'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-normal">* Tự động đồng bộ vào Thời khóa biểu và Điểm rèn luyện</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
