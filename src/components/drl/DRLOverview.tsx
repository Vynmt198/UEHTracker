import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualAdjustmentModal } from './ManualAdjustmentModal';
import {
  Award,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';

export const DRLOverview: React.FC<{ onSwitchToActivities: () => void }> = ({
  onSwitchToActivities
}) => {
  const { getDRLProgress, manualAdjustments, addManualAdjustment, deleteManualAdjustment } =
    useApp();

  const [expandedCriteria, setExpandedCriteria] = useState<Record<number, boolean>>({});

  const [showManualModal, setShowManualModal] = useState(false);

  const { totalDRL, rank, criteriaList } = getDRLProgress();

  const toggleExpand = (id: number) => {
    setExpandedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Flat Scorecard & Actions */}
      <div className="interactive-card-accent !p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-bold tracking-tight">{totalDRL}</span>
              <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                ĐIỂM RÈN LUYỆN
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-base font-bold text-slate-900">
                  Học kỳ hiện tại
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {rank}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowManualModal(true)}
              className="btn-interactive-outline flex-1 lg:flex-none text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi nhận điểm (+/-)</span>
            </button>

            <button
              onClick={onSwitchToActivities}
              className="btn-interactive-primary flex-1 lg:flex-none text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Danh sách Hoạt động</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              TIẾN ĐỘ TÍCH LŨY
            </span>
            <span className="text-slate-900 font-semibold">{totalDRL} / 100 điểm ({totalDRL}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#49C8D6] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, totalDRL)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
            <span>Kém (&lt;35)</span>
            <span>Yếu (35-49)</span>
            <span>TB (50-64)</span>
            <span>Khá (65-79)</span>
            <span>Tốt (80-89)</span>
            <span className="text-slate-700 font-semibold">Xuất sắc (&ge;90)</span>
          </div>
        </div>
      </div>

      {/* 5 Main Criteria - 5 Interactive Cards with Hover Elevation */}
      <div className="space-y-3">
        {criteriaList.map((crit) => {
          const isExpanded = !!expandedCriteria[crit.id];
          const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));

          return (
            <div key={crit.id} className="interactive-card !p-0 overflow-hidden">
              {/* Header Row - Clean 4-column Scannable Progress Bar */}
              <div
                onClick={() => toggleExpand(crit.id)}
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Col 1: Tên ngắn */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    {crit.id}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-sm truncate">
                    {crit.title.replace(/^Mục\s*\d+:\s*/i, '')}
                  </h3>
                </div>

                {/* Col 2: Thanh tiến độ siêu mỏng (h-2 bg-slate-100, bar màu #49C8D6) */}
                <div className="w-full md:w-56 shrink-0 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#49C8D6] transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Col 3: Tỉ lệ điểm: 15/25đ */}
                <div className="text-xs font-semibold text-slate-900 w-20 text-left md:text-right shrink-0 font-mono">
                  {crit.currentPoints}/{crit.maxPoints}đ
                </div>

                {/* Col 4: Khi đạt trần: Badge nhỏ bo tròn "Đạt trần" */}
                <div className="w-24 flex items-center justify-end gap-2 shrink-0">
                  {crit.isCapped ? (
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium border border-slate-200">
                      Đạt trần
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">
                      -{Math.max(0, crit.maxPoints - crit.currentPoints)}đ
                    </span>
                  )}

                  <span className="text-slate-400 p-0.5 hover:text-slate-700 transition-transform duration-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {/* Sub-Criteria Progressive Detail Rows */}
              {isExpanded && (
                <div className="bg-slate-50/60 px-4 sm:px-6 py-2.5 border-t border-slate-100 divide-y divide-slate-100 animate-in fade-in duration-150">
                  {crit.subCriteriaProgress.map((sub) => (
                    <div
                      key={sub.code}
                      className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white text-slate-600 border border-slate-200">
                            {sub.code}
                          </span>
                          <span className="text-xs font-medium text-slate-800 truncate">{sub.title}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full bg-[#49C8D6]"
                            style={{
                              width: `${Math.min(100, (sub.currentPoints / sub.maxPoints) * 100)}%`
                            }}
                          />
                        </div>

                        <div className="text-xs font-medium text-slate-900 w-14 text-right">
                          {sub.currentPoints} <span className="text-slate-400 text-[10px]">/{sub.maxPoints}đ</span>
                        </div>

                        <span className="text-[10px] text-slate-500 w-16 text-right font-mono">
                          {sub.isCapped ? (
                            <span className="text-emerald-700 font-medium">Đạt trần</span>
                          ) : (
                            `-${(sub.maxPoints - sub.currentPoints).toFixed(1)}đ`
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Adjustments History - Flat & Minimal */}
      {manualAdjustments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              LỊCH SỬ ĐIỀU CHỈNH ĐIỂM
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {manualAdjustments.map((adj) => (
              <div
                key={adj.id}
                className="p-3 bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-slate-800">{adj.reason}</span>
                  <span className="text-slate-400 text-[11px] ml-2">
                    (Mục {adj.criterionId} • {adj.date})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold text-xs ${
                      adj.points >= 0 ? 'text-slate-900' : 'text-red-600'
                    }`}
                  >
                    {adj.points > 0 ? `+${adj.points}` : adj.points} điểm
                  </span>

                  <button
                    onClick={() => deleteManualAdjustment(adj.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                    title="Xóa bản ghi này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Modal */}
      {showManualModal && (
        <ManualAdjustmentModal
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          onAdd={addManualAdjustment}
        />
      )}
    </div>
  );
};
