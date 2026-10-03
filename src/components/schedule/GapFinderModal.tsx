import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchingStrategy, MatchedActivity } from '../../types';
import { matchActivitiesWithGaps, DAY_NAMES } from '../../utils/scheduleMatcher';
import {
  Sparkles,
  Target,
  Award,
  Layers,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
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

  // Run matching engine
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#29B3C2] via-[#49C8D6] to-[#008899] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider">
              Smart Schedule • Gap Time Engine
            </span>
            <span className="text-white/80 text-xs font-semibold">
              {validGapTimes.length} khoảng trống hợp lệ (&ge;60 phút)
            </span>
          </div>

          <h2 className="text-2xl font-black">Khớp hoạt động lấp Gap Time cá nhân</h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Hệ thống phân tích khoảng trống trong lịch biểu của bạn và tự động xếp hạng hoạt động UEH tối ưu nhất.
          </p>

          {/* 3 Matching Strategy Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
            <button
              type="button"
              onClick={() => setStrategy('faculty')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                strategy === 'faculty'
                  ? 'bg-white text-slate-900 border-white shadow-md'
                  : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-extrabold">
                <Compass className={`w-4 h-4 ${strategy === 'faculty' ? 'text-[#008899]' : 'text-white'}`} />
                Option 1: Chuyên môn
              </div>
              <p className={`text-[10px] mt-1 line-clamp-2 ${strategy === 'faculty' ? 'text-slate-600' : 'text-white/80'}`}>
                Ưu tiên match Khoa: {profile.faculty.split(' ')[0]}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrategy('drl_deficit')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                strategy === 'drl_deficit'
                  ? 'bg-white text-slate-900 border-white shadow-md'
                  : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-extrabold">
                <Target className={`w-4 h-4 ${strategy === 'drl_deficit' ? 'text-[#008899]' : 'text-white'}`} />
                Option 2: Tối ưu ĐRL
              </div>
              <p className={`text-[10px] mt-1 line-clamp-2 ${strategy === 'drl_deficit' ? 'text-slate-600' : 'text-white/80'}`}>
                Bù đắp tiêu chí bạn đang thiếu điểm nhất
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrategy('balanced')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                strategy === 'balanced'
                  ? 'bg-white text-slate-900 border-white shadow-md'
                  : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-extrabold">
                <Layers className={`w-4 h-4 ${strategy === 'balanced' ? 'text-[#008899]' : 'text-white'}`} />
                Option 3: Kết hợp (Đề xuất)
              </div>
              <p className={`text-[10px] mt-1 line-clamp-2 ${strategy === 'balanced' ? 'text-slate-600' : 'text-white/80'}`}>
                Cân đối giữa ngành học và số điểm ĐRL thiếu
              </p>
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>
              Tìm thấy <strong className="text-slate-800">{matchedActivities.length}</strong> hoạt động phù hợp hoàn hảo với khoảng trống:
            </span>
            <span className="font-semibold text-[#007D8C]">
              Tiêu chí ưu tiên: {strategy === 'faculty' ? 'Chuyên môn' : strategy === 'drl_deficit' ? 'Bù tiêu chí thiếu' : 'Cân bằng'}
            </span>
          </div>

          {matchedActivities.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Chưa tìm thấy hoạt động khớp với Gap Time</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Hiện tại các khoảng trống trên 60 phút của bạn chưa trùng khung giờ mở đăng ký của các hoạt động trong tuần này.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {matchedActivities.map((item) => {
                const act = item.activity;
                const isRegistered = registeredActivityIds.includes(act.id);

                return (
                  <div
                    key={act.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isRegistered
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200/80 bg-white hover:border-[#29B3C2] hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                          Match Score: {item.matchScore} pts
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8FAFC] text-[#007D8C]">
                          {act.facultyTarget}
                        </span>

                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          +{act.totalPoints}đ ĐRL
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900">{act.title}</h4>

                      {/* Matching Slot & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5 text-[#007D8C] font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#29B3C2]" />
                          <span>
                            Lấp Gap: {DAY_NAMES[act.dayOfWeek]} ({act.startTime} - {act.endTime})
                          </span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span className="truncate max-w-[220px]">{act.location}</span>
                        </div>
                      </div>

                      {/* Why it matched */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.reasons.map((r, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#29B3C2]" />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleRegisterAndAdd(act.id)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                          isRegistered
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[#29B3C2] text-white hover:bg-[#209aa8] shadow-cyan-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>* Hoạt động khi chọn sẽ tự động đồng bộ vào Thời khóa biểu và Bảng điểm rèn luyện</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
