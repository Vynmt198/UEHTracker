import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualAdjustmentModal } from './ManualAdjustmentModal';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  ShieldCheck
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

  const { totalDRL, rank, criteriaList, cappedCriteriaCount, deficitMap } = getDRLProgress();

  const toggleExpand = (id: number) => {
    setExpandedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRankBadgeClass = (r: string) => {
    switch (r) {
      case 'Xuất sắc':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Tốt':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Khá':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'Trung bình':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Scoreboard & Cap Warning */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-tr from-[#29B3C2] to-[#49C8D6] text-white flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <span className="text-2xl sm:text-3xl font-black">{totalDRL}</span>
              <span className="text-[10px] font-bold text-white/80 uppercase">/ 100 Điểm</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Điểm Rèn Luyện UEH
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${getRankBadgeClass(
                    rank
                  )}`}
                >
                  Xếp loại: {rank}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-lg">
                Hệ thống 5 tiêu chí chuẩn hóa theo Quy chế Đánh giá Kết quả Rèn luyện Sinh viên Đại học Kinh tế TP. Hồ Chí Minh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowManualModal(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Ghi nhận điểm (+/-)
            </button>

            <button
              onClick={onSwitchToActivities}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#29B3C2] hover:bg-[#209aa8] shadow-md shadow-cyan-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Danh sách Hoạt động UEH
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-600">Tiến độ tích lũy tổng thể</span>
            <span className="text-[#007D8C] font-black">{totalDRL} / 100 điểm ({totalDRL}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#29B3C2] to-[#49C8D6] transition-all duration-700"
              style={{ width: `${Math.min(100, totalDRL)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5">
            <span>Kém (&lt;35)</span>
            <span>Yếu (35-49)</span>
            <span>Trung bình (50-64)</span>
            <span>Khá (65-79)</span>
            <span>Tốt (80-89)</span>
            <span className="text-amber-600 font-bold">Xuất sắc (&ge;90)</span>
          </div>
        </div>

        {/* Capped Warning Alert (Giới hạn trần - Point Cap Warning) */}
        {cappedCriteriaCount > 0 && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Cảnh báo giới hạn trần: Có {cappedCriteriaCount} mục tiêu chí đã đạt điểm tối đa!
              </p>
              <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">
                Quy chế UEH không cộng dồn vượt quá trần quy định. Bạn không nên đăng ký thêm hoạt động thuộc các tiêu chí đã chạm trần để tránh lãng phí thời gian, hãy tập trung vào các mục còn thiếu điểm dưới đây.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5 Main Criteria Tree & Hierarchy */}
      <div className="space-y-4">
        {criteriaList.map((crit) => {
          const isExpanded = !!expandedCriteria[crit.id];
          const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));

          return (
            <div
              key={crit.id}
              className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                crit.isCapped ? 'border-amber-300/80 shadow-xs' : 'border-slate-200/80 shadow-xs'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(crit.id)}
                className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      crit.isCapped
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#E8FAFC] text-[#007D8C]'
                    }`}
                  >
                    {crit.id}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                        {crit.title}
                      </h3>
                      {crit.isCapped && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                          Đã chạm trần ({crit.maxPoints}/{crit.maxPoints}đ)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Đạt <strong className="text-slate-800">{crit.currentPoints}</strong> / {crit.maxPoints} điểm tối đa
                      {crit.excessPoints > 0 && (
                        <span className="text-amber-600 font-semibold ml-1.5">
                          (Thặng dư +{crit.excessPoints}đ không được tính)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-48">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>{percent}%</span>
                      <span>Còn thiếu: {Math.max(0, crit.maxPoints - crit.currentPoints)}đ</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          crit.isCapped ? 'bg-amber-500' : 'bg-[#29B3C2]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <button className="text-slate-400 p-1 rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sub-Criteria Breakdown */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Các tiêu chí thành phần chi tiết:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {crit.subCriteriaProgress.map((sub) => (
                      <div
                        key={sub.code}
                        className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-600 font-mono">
                              Mã {sub.code}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mt-1">{sub.title}</h5>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-sm font-black ${
                                sub.isCapped ? 'text-amber-600' : 'text-[#007D8C]'
                              }`}
                            >
                              {sub.currentPoints}
                            </span>
                            <span className="text-xs font-bold text-slate-400">/{sub.maxPoints}đ</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.isCapped ? 'bg-amber-500' : 'bg-[#29B3C2]'
                            }`}
                            style={{
                              width: `${Math.min(100, (sub.currentPoints / sub.maxPoints) * 100)}%`
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">
                            Điểm tích lũy: {sub.rawPoints}đ
                          </span>
                          {sub.isCapped ? (
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-500" /> Đạt trần
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium">
                              Còn thiếu: {(sub.maxPoints - sub.currentPoints).toFixed(1)}đ
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Adjustments History */}
      {manualAdjustments.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#29B3C2]" />
            Lịch sử điều chỉnh điểm rèn luyện thủ công
          </h3>

          <div className="space-y-2">
            {manualAdjustments.map((adj) => (
              <div
                key={adj.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{adj.reason}</span>
                  <span className="text-slate-400 text-[11px] ml-2">
                    (Mục {adj.criterionId} • Ngày {adj.date})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-black text-sm ${
                      adj.points >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {adj.points > 0 ? `+${adj.points}` : adj.points} điểm
                  </span>

                  <button
                    onClick={() => deleteManualAdjustment(adj.id)}
                    className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors"
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
