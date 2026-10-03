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

  const [expandedCriteria, setExpandedCriteria] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  const [showManualModal, setShowManualModal] = useState(false);

  const { totalDRL, rank, criteriaList, cappedCriteriaCount } = getDRLProgress();

  const toggleExpand = (id: number) => {
    setExpandedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Flat Scorecard & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-semibold">{totalDRL}</span>
              <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Điểm Rèn Luyện UEH
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Xếp loại: {rank}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-lg font-normal">
                Hệ thống 5 tiêu chí chuẩn hóa theo Quy chế Đánh giá Kết quả Rèn luyện Sinh viên UEH.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowManualModal(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Ghi nhận điểm (+/-)
            </button>

            <button
              onClick={onSwitchToActivities}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6] transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Danh sách Hoạt động
            </button>
          </div>
        </div>

        {/* Global Progress Bar (10% rule on fill) */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-medium mb-1.5">
            <span className="text-slate-600">Tiến độ tích lũy</span>
            <span className="text-slate-900 font-semibold">{totalDRL} / 100 điểm ({totalDRL}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#49C8D6] transition-all duration-300"
              style={{ width: `${Math.min(100, totalDRL)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-normal mt-1.5">
            <span>Kém (&lt;35)</span>
            <span>Yếu (35-49)</span>
            <span>TB (50-64)</span>
            <span>Khá (65-79)</span>
            <span>Tốt (80-89)</span>
            <span className="text-slate-700 font-medium">Xuất sắc (&ge;90)</span>
          </div>
        </div>

        {/* Capped Warning Alert - Neutral & Flat */}
        {cappedCriteriaCount > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">
                Thông báo giới hạn trần: Có {cappedCriteriaCount} mục tiêu chí đã đạt điểm tối đa
              </p>
              <p className="mt-0.5 text-slate-600 text-[11px] font-normal leading-relaxed">
                Quy chế UEH không cộng dồn vượt quá trần quy định. Bạn không nên đăng ký thêm hoạt động thuộc các tiêu chí đã chạm trần để tránh lãng phí thời gian.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5 Main Criteria Tree - Flat & Divided, No Nested Cards */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {criteriaList.map((crit) => {
          const isExpanded = !!expandedCriteria[crit.id];
          const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));

          return (
            <div key={crit.id} className="transition-colors">
              {/* Header Row */}
              <div
                onClick={() => toggleExpand(crit.id)}
                className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0">
                    {crit.id}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900 text-sm">
                        {crit.title}
                      </h3>
                      {crit.isCapped && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Đạt trần {crit.maxPoints}/{crit.maxPoints}đ
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-normal">
                      <span className="text-slate-900 font-medium">{crit.currentPoints}</span> / {crit.maxPoints} điểm
                      {crit.excessPoints > 0 && (
                        <span className="text-slate-400 ml-1.5">
                          (Thặng dư +{crit.excessPoints}đ không cộng dồn)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-44">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-normal text-slate-500 mb-1">
                      <span>{percent}%</span>
                      <span>Thiếu: {Math.max(0, crit.maxPoints - crit.currentPoints)}đ</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#49C8D6] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <button className="text-slate-400 p-0.5 rounded hover:text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sub-Criteria Rows (Flat border list, no nested cards) */}
              {isExpanded && (
                <div className="bg-slate-50/50 px-4 sm:px-6 py-3 border-t border-slate-100 divide-y divide-slate-100">
                  {crit.subCriteriaProgress.map((sub) => (
                    <div
                      key={sub.code}
                      className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-slate-600 border border-slate-200">
                            {sub.code}
                          </span>
                          <span className="text-xs font-medium text-slate-800">{sub.title}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full bg-[#49C8D6]"
                            style={{
                              width: `${Math.min(100, (sub.currentPoints / sub.maxPoints) * 100)}%`
                            }}
                          />
                        </div>

                        <div className="text-xs font-medium text-slate-900 w-16 text-right">
                          {sub.currentPoints} <span className="text-slate-400 text-[10px]">/{sub.maxPoints}đ</span>
                        </div>

                        <span className="text-[11px] text-slate-400 w-16 text-right font-normal">
                          {sub.isCapped ? 'Đạt trần' : `Thiếu ${(sub.maxPoints - sub.currentPoints).toFixed(1)}đ`}
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
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-500" />
            Lịch sử điều chỉnh điểm rèn luyện
          </h3>

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
