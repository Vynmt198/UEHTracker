import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AddBlockModal } from './AddBlockModal';
import { GapFinderModal } from './GapFinderModal';
import { DAY_NAMES, minutesToTime, timeToMinutes } from '../../utils/scheduleMatcher';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  User,
  Award
} from 'lucide-react';

export const ScheduleDashboard: React.FC = () => {
  const {
    scheduleBlocks,
    addScheduleBlock,
    deleteScheduleBlock,
    validGapTimes
  } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(2); // Default Thứ Ba
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGapModal, setShowGapModal] = useState(false);

  // Filter blocks and gaps for the active day
  const dayBlocks = scheduleBlocks
    .filter((b) => b.dayOfWeek === selectedDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const dayGaps = validGapTimes.filter((g) => g.dayOfWeek === selectedDay);

  // Group events and gaps into a unified timeline
  const timelineItems: Array<
    | { type: 'block'; data: (typeof dayBlocks)[0] }
    | { type: 'gap'; data: (typeof dayGaps)[0] }
  > = [];

  dayBlocks.forEach((b) => timelineItems.push({ type: 'block', data: b }));
  dayGaps.forEach((g) => timelineItems.push({ type: 'gap', data: g }));

  timelineItems.sort((a, b) => {
    const timeA = a.type === 'block' ? timeToMinutes(a.data.startTime) : timeToMinutes(a.data.startTime);
    const timeB = b.type === 'block' ? timeToMinutes(b.data.startTime) : timeToMinutes(b.data.startTime);
    return timeA - timeB;
  });

  const getBlockTypeBadge = (type: string) => {
    switch (type) {
      case 'class':
        return { label: 'Lịch học chính khóa', bg: 'bg-cyan-50 border-cyan-200 text-[#007D8C]' };
      case 'activity':
        return { label: 'Hoạt động ĐRL UEH', bg: 'bg-amber-50 border-amber-200 text-amber-800' };
      case 'part_time':
        return { label: 'Làm thêm / Thực tập', bg: 'bg-purple-50 border-purple-200 text-purple-800' };
      default:
        return { label: 'Việc riêng / Tự học', bg: 'bg-slate-100 border-slate-200 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Gap Action */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#E8FAFC] text-[#007D8C] border border-cyan-200 uppercase">
              Smart Schedule System
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {validGapTimes.length} Gap Time hợp lệ (&ge; 60p)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Thời khóa biểu cá nhân & Tối ưu Gap Time
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Thuật toán tự động quét khoảng cách giữa các ca học/sự kiện bận. Bấm nút dưới đây để tìm hoạt động UEH lấp đầy thời gian trống hiệu quả nhất.
          </p>
        </div>

        {/* Core Prompt Action: [Tìm hoạt động để lấp Gap Time] */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm khối bận
          </button>

          <button
            onClick={() => setShowGapModal(true)}
            disabled={validGapTimes.length === 0}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition-all ${
              validGapTimes.length > 0
                ? 'bg-linear-to-r from-[#FF7A00] to-[#EA580C] hover:opacity-95 text-white shadow-orange-500/25 ring-2 ring-orange-400/20 animate-pulse'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Tìm hoạt động để lấp Gap Time</span>
          </button>
        </div>
      </div>

      {/* Weekday Selector Tabs (Thứ 2 đến Chủ Nhật) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const isSelected = selectedDay === day;
          const blocksCount = scheduleBlocks.filter((b) => b.dayOfWeek === day).length;
          const gapsCount = validGapTimes.filter((g) => g.dayOfWeek === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[120px] p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-[#29B3C2] bg-[#E8FAFC] text-[#007D8C] shadow-xs ring-1 ring-[#49C8D6]'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div className="text-xs font-bold">{DAY_NAMES[day]}</div>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-slate-500">{blocksCount} sự kiện</span>
                {gapsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800">
                    {gapsCount} gap
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Lịch biểu {DAY_NAMES[selectedDay]}
            </h3>
            <p className="text-xs text-slate-500">
              Có {dayBlocks.length} khối bận và {dayGaps.length} khoảng trống hợp lệ (&ge; 60 phút).
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#007D8C] bg-[#E8FAFC] hover:bg-cyan-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm lịch cho ngày này
          </button>
        </div>

        {timelineItems.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Chưa có lịch trình cho ngày này</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Cả ngày của bạn đang hoàn toàn trống. Bạn có thể thêm các ca học hoặc tìm các hoạt động diễn ra vào ngày này.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#29B3C2] hover:bg-[#209aa8] shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" /> Thêm sự kiện đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {timelineItems.map((item, idx) => {
              if (item.type === 'block') {
                const block = item.data;
                const badge = getBlockTypeBadge(block.type);

                return (
                  <div
                    key={`b-${block.id}-${idx}`}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${badge.bg}`}
                        >
                          {badge.label}
                        </span>

                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#29B3C2]" />
                          {block.startTime} - {block.endTime}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>

                      {block.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span>{block.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => deleteScheduleBlock(block.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Xóa sự kiện này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              } else {
                // Gap Time Slot
                const gap = item.data;

                return (
                  <div
                    key={`g-${gap.id}-${idx}`}
                    className="p-4 rounded-2xl border-2 border-dashed border-cyan-300 bg-linear-to-r from-[#E8FAFC]/70 to-cyan-50/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#29B3C2] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#29B3C2] text-white uppercase tracking-wider">
                            Valid Gap Time (&ge; 60p)
                          </span>
                          <span className="text-xs font-black text-[#007D8C]">
                            {gap.durationMinutes} phút trống
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 mt-1">
                          Khoảng trống từ {gap.startTime} đến {gap.endTime}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Khung giờ lý tưởng để tham gia hội thảo, NCKH hoặc phong trào rèn luyện UEH.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setShowGapModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#007D8C] bg-white border border-cyan-200 hover:bg-cyan-50 transition-colors shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#29B3C2]" />
                        Tìm hoạt động lấp chỗ này
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddBlockModal
          isOpen={showAddModal}
          defaultDay={selectedDay}
          onClose={() => setShowAddModal(false)}
          onAdd={addScheduleBlock}
        />
      )}

      {showGapModal && (
        <GapFinderModal
          isOpen={showGapModal}
          onClose={() => setShowGapModal(false)}
        />
      )}
    </div>
  );
};
