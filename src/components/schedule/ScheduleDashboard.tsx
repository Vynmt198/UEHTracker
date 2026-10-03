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
    <div className="space-y-6">
      {/* Header Banner & Gap Action - Flat & Clean */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Smart Schedule
            </span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {validGapTimes.length} Gap Time (&ge;60p)
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
            Thời khóa biểu cá nhân & Tối ưu Gap Time
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5 max-w-xl">
            Tự động phát hiện các khoảng trống từ 60 phút trở lên để đề xuất hoạt động phù hợp.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm lịch
          </button>

          <button
            onClick={() => setShowGapModal(true)}
            disabled={validGapTimes.length === 0}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-xs ${
              validGapTimes.length > 0
                ? 'bg-[#49C8D6] hover:bg-[#3db8c6] text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tìm hoạt động lấp Gap Time</span>
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
              className={`min-w-[105px] py-1.5 px-3 rounded-lg text-left transition-colors shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
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

      {/* Daily Timeline - Flat & Clean */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
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
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Plus className="w-3 h-3" /> Thêm lịch
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
              className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm sự kiện đầu tiên
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
                    className="p-3.5 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {typeLabel}
                        </span>

                        <span className="text-xs font-medium text-slate-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {block.startTime} - {block.endTime}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-medium text-slate-900">{block.title}</h4>

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
                    className="p-3.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900">
                            Khoảng trống: {gap.startTime} - {gap.endTime}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            ({gap.durationMinutes} phút trống)
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                          Thời gian thích hợp để tham gia hoạt động rèn luyện hoặc tự học.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setShowGapModal(true)}
                        className="px-2.5 py-1 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
                      >
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
