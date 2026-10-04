import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AddBlockModal } from './AddBlockModal';
import { GapFinderModal } from './GapFinderModal';
import { DAY_NAMES, timeToMinutes } from '../../utils/scheduleMatcher';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2
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
    const timeA = timeToMinutes(a.data.startTime);
    const timeB = timeToMinutes(b.data.startTime);
    return timeA - timeB;
  });

  const getBlockTypeBadge = (type: string) => {
    switch (type) {
      case 'class':
        return 'Lịch học chính khóa';
      case 'activity':
        return 'Hoạt động ĐRL UEH';
      case 'part_time':
        return 'Làm thêm / Thực tập';
      default:
        return 'Việc riêng / Tự học';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner & Gap Action - Interactive Card Accent */}
      <div className="interactive-card-accent !p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            THỜI KHÓA BIỂU & GAP TIME
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-base font-bold text-slate-900">
              Lịch cá nhân tuần này
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {validGapTimes.length} khoảng trống (&ge;60p)
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-interactive-outline flex-1 sm:flex-none text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch</span>
          </button>

          <button
            onClick={() => setShowGapModal(true)}
            disabled={validGapTimes.length === 0}
            className={`flex-1 sm:flex-none ${
              validGapTimes.length > 0
                ? 'btn-interactive-primary'
                : 'px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tối ưu Gap Time</span>
          </button>
        </div>
      </div>

      {/* Weekday Selector Tabs (Thứ 2 đến Chủ Nhật) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const isSelected = selectedDay === day;
          const blocksCount = scheduleBlocks.filter((b) => b.dayOfWeek === day).length;
          const gapsCount = validGapTimes.filter((g) => g.dayOfWeek === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`min-w-[105px] py-1.5 px-3 rounded-lg text-left transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white font-medium shadow-xs scale-102'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 text-slate-700'
              }`}
            >
              <div className="text-xs font-medium">{DAY_NAMES[day]}</div>
              <div className="flex items-center justify-between text-[10px] mt-0.5">
                <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                  {blocksCount} sự kiện
                </span>
                {gapsCount > 0 && (
                  <span className={`px-1 rounded text-[9px] ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                    {gapsCount} gap
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Timeline - Flat & Clean Tactile Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Lịch biểu {DAY_NAMES[selectedDay]}
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              {dayBlocks.length} sự kiện • {dayGaps.length} khoảng trống hợp lệ (&ge;60 phút)
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-interactive-outline text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch</span>
          </button>
        </div>

        {timelineItems.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-lg border border-slate-200">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Chưa có lịch trình cho ngày này</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
              Ngày của bạn đang hoàn toàn trống. Bạn có thể thêm các ca học hoặc đăng ký các hoạt động.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-ueh mt-3.5 text-xs font-medium px-3 py-1.5"
            >
              <div className="svg-wrapper"><Plus className="w-3.5 h-3.5" /></div>
              <span>Thêm sự kiện đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {timelineItems.map((item, idx) => {
              if (item.type === 'block') {
                const block = item.data;
                const typeLabel = getBlockTypeBadge(block.type);

                return (
                  <div
                    key={`b-${block.id}-${idx}`}
                    className="p-3 rounded-xl border border-slate-200/90 bg-cyan-50/50 border-l-4 border-l-[#49C8D6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:brightness-95 hover:shadow-sm cursor-pointer transition-all duration-200"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200">
                          {typeLabel}
                        </span>

                        <span className="text-xs font-semibold text-slate-900 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-[#007D8C]" />
                          {block.startTime} - {block.endTime}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{block.title}</h4>

                      {block.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{block.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => deleteScheduleBlock(block.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        title="Xóa sự kiện này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              } else {
                // Gap Time Slot - Flat dashed minimal
                const gap = item.data;

                return (
                  <div
                    key={`g-${gap.id}-${idx}`}
                    className="p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-200/70 text-slate-500 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>

                      <div className="text-xs font-medium text-slate-700">
                        <span className="font-semibold text-slate-900">{gap.startTime} - {gap.endTime}</span>
                        <span className="text-[11px] text-slate-400 font-mono ml-2">({gap.durationMinutes}p trống)</span>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setShowGapModal(true)}
                        className="px-3 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all opacity-85 group-hover:opacity-100 shadow-xs flex items-center gap-1.5"
                      >
                        + Tìm hoạt động lấp {gap.durationMinutes}p trống
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
