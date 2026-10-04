import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualAdjustmentModal, cleanCriterionTitle } from './ManualAdjustmentModal';
import { SemesterModal } from '../gpa/SemesterModal';
import { DrlCriteriaTree } from './DrlCriteriaTree';
import {
  Award,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const DRLOverview: React.FC<{ onSwitchToActivities: () => void }> = ({
  onSwitchToActivities
}) => {
  const {
    semesters,
    addSemester,
    currentDrlSemesterId,
    setCurrentDrlSemesterId,
    getDRLProgress,
    getAllSemestersDRL,
    manualAdjustments,
    addManualAdjustment,
    deleteManualAdjustment
  } = useApp();

  const [showManualModal, setShowManualModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);

  const { totalDRL, rank, criteriaList } = getDRLProgress(currentDrlSemesterId);
  const allSemestersProgress = getAllSemestersDRL();

  const currentSemester =
    semesters.find((s) => s.id === currentDrlSemesterId) || semesters[0];

  // Calculate delta progression compared to previous semester
  const currentIndex = allSemestersProgress.findIndex(
    (s) => s.semesterId === currentDrlSemesterId
  );
  const prevSemester =
    currentIndex > 0 ? allSemestersProgress[currentIndex - 1] : null;
  const delta = prevSemester ? totalDRL - prevSemester.totalDRL : null;

  const getRankBadgeClass = (r: string) => {
    switch (r) {
      case 'Xuất sắc':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tốt':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Khá':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Trung bình':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Yếu':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Bộ chọn Học kỳ (Horizontal Tab Selector) đồng bộ GPA & ĐRL */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1 font-medium pl-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Học kỳ:</span>
          </div>

          {semesters.map((sem) => {
            const isSelected = sem.id === currentDrlSemesterId;
            const semProg = allSemestersProgress.find((p) => p.semesterId === sem.id);
            const score = semProg ? semProg.totalDRL : 50;

            return (
              <button
                key={sem.id}
                onClick={() => setCurrentDrlSemesterId(sem.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{sem.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isSelected
                      ? 'bg-slate-800 text-[#49C8D6]'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {score}đ
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowSemesterModal(true)}
          className="btn-interactive-outline text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5 whitespace-nowrap"
          title="Tạo học kỳ mới: Năm X - HK1/HK2 kèm Niên khóa"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm kỳ mới</span>
        </button>
      </div>

      {/* 2. Top Grid: Main Scorecard & Semester Comparison Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Main Scorecard for Selected Semester (Col 1-7 or 8) */}
        <div className="lg:col-span-7 xl:col-span-8 interactive-card-accent !p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-2xl font-bold tracking-tight">{totalDRL}</span>
                  <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    ĐIỂM RÈN LUYỆN
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">
                      {currentSemester?.name || 'Học kỳ hiện tại'}
                    </h2>
                    {currentSemester?.academicYear && (
                      <span className="text-xs text-slate-500 font-normal">
                        ({currentSemester.academicYear})
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRankBadgeClass(
                        rank
                      )}`}
                    >
                      {rank}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowManualModal(true)}
                  className="btn-interactive-outline flex-1 sm:flex-none text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ghi nhận (+/-)</span>
                </button>

                <button
                  onClick={onSwitchToActivities}
                  className="btn-interactive-primary flex-1 sm:flex-none text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hoạt động</span>
                </button>
              </div>
            </div>

            {/* Base 50 points explanation badge */}
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>
                <strong>Điểm sàn UEH:</strong> Sẵn <strong>50đ</strong> đầu mỗi kỳ (M1: 15đ • M2: 10đ • M3: 5đ • M4: 10đ • M5: 10đ). Xếp loại tối thiểu là <strong>Trung bình</strong>.
              </span>
            </div>
          </div>

          {/* Global Progress Bar with 6 UEH Milestones */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                TIẾN ĐỘ TÍCH LŨY
              </span>
              <span className="text-slate-900 font-semibold font-mono">
                {totalDRL} / 100 điểm ({totalDRL}%)
              </span>
            </div>

            {/* Bar Container */}
            <div className="relative w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              {/* Threshold tick lines at 35%, 50%, 65%, 80%, 90% */}
              <div className="absolute inset-0 pointer-events-none flex justify-between z-10 opacity-30">
                <div style={{ left: '35%' }} className="absolute h-full w-[1px] bg-slate-400" />
                <div style={{ left: '50%' }} className="absolute h-full w-[1px] bg-slate-400" />
                <div style={{ left: '65%' }} className="absolute h-full w-[1px] bg-slate-400" />
                <div style={{ left: '80%' }} className="absolute h-full w-[1px] bg-slate-400" />
                <div style={{ left: '90%' }} className="absolute h-full w-[1px] bg-slate-400" />
              </div>

              <div
                className="h-full rounded-full bg-[#49C8D6] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, totalDRL)}%` }}
              />
            </div>

            {/* 6 Clearly spaced milestones */}
            <div className="grid grid-cols-6 text-[10px] text-slate-400 font-mono mt-1.5 text-center">
              <span className={rank === 'Kém' ? 'text-rose-600 font-bold' : ''}>
                Kém (&lt;35)
              </span>
              <span className={rank === 'Yếu' ? 'text-orange-600 font-bold' : ''}>
                Yếu (35-49)
              </span>
              <span className={rank === 'Trung bình' ? 'text-amber-600 font-bold' : ''}>
                TB (50-64)
              </span>
              <span className={rank === 'Khá' ? 'text-blue-600 font-bold' : ''}>
                Khá (65-79)
              </span>
              <span className={rank === 'Tốt' ? 'text-cyan-700 font-bold' : ''}>
                Tốt (80-89)
              </span>
              <span
                className={`text-right ${
                  rank === 'Xuất sắc' ? 'text-emerald-600 font-bold' : 'text-slate-600 font-medium'
                }`}
              >
                Xuất sắc (&ge;90)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Semester Comparison Card (Col 8-12 or 9-12) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-600" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  BIẾN ĐỘNG QUA CÁC HỌC KỲ
                </span>
              </div>

              {delta !== null ? (
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    delta > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : delta < 0
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {delta > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : delta < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span>
                    Biến động: {delta > 0 ? `+${delta}đ` : `${delta}đ`}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-mono">
                  Kỳ đầu tiên
                </span>
              )}
            </div>

            {/* Progression Text Summary */}
            <div className="mt-3 text-xs text-slate-600">
              {prevSemester ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-800">
                    {prevSemester.name}: <strong>{prevSemester.totalDRL}đ</strong> ({prevSemester.rank})
                  </span>
                  <span className="text-slate-400">➔</span>
                  <span className="font-semibold text-slate-900">
                    {currentSemester?.name}: <strong>{totalDRL}đ</strong> ({rank})
                  </span>
                </div>
              ) : (
                <p className="text-slate-500">
                  Đang xem kỳ khởi đầu: <strong>{currentSemester?.name}</strong> đạt <strong>{totalDRL}đ ({rank})</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Mini Bar Chart / Sparkline */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              BIỂU ĐỒ SO SÁNH ({allSemestersProgress.length} HỌC KỲ)
            </div>

            <div className="flex items-end gap-3 h-20 px-1">
              {allSemestersProgress.map((sem) => {
                const isSelected = sem.semesterId === currentDrlSemesterId;
                const heightPercent = Math.max(20, Math.min(100, sem.totalDRL));

                return (
                  <button
                    key={sem.semesterId}
                    onClick={() => setCurrentDrlSemesterId(sem.semesterId)}
                    className="flex-1 flex flex-col items-center justify-end h-full group focus:outline-none"
                    title={`${sem.name}: ${sem.totalDRL}đ (${sem.rank})`}
                  >
                    <span
                      className={`text-[10px] font-mono mb-1 font-semibold transition-colors ${
                        isSelected ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    >
                      {sem.totalDRL}
                    </span>

                    <div className="w-full max-w-[36px] bg-slate-100 rounded-t-md overflow-hidden flex items-end h-14">
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#49C8D6] shadow-xs'
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span
                      className={`text-[10px] mt-1.5 truncate max-w-full font-medium ${
                        isSelected
                          ? 'text-slate-900 font-semibold'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {sem.name.replace(/Năm\s*\d+\s*-\s*/i, '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cây tiêu chí đánh giá ĐRL chuẩn quy chế UEH (5 Mục lớn & đầy đủ mục con cấp 2, 3) */}
      <DrlCriteriaTree criteriaList={criteriaList} />

      {/* 4. Manual Adjustments History - Flat & Minimal */}
      {manualAdjustments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              LỊCH SỬ ĐIỀU CHỈNH ĐIỂM (HỌC KỲ HIỆN TẠI)
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {manualAdjustments.map((adj) => (
              <div
                key={adj.id}
                className="p-3 bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900">{adj.reason}</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-slate-500 text-[11px]">
                    {adj.subCriterionId && (
                      <span className="font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {adj.subCriterionId}
                      </span>
                    )}
                    <span>
                      {adj.subCriterionName ? cleanCriterionTitle(adj.subCriterionName, adj.subCriterionId) : `Mục ${adj.criterionId}`} • {adj.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold text-xs font-mono ${
                      adj.points >= 0 ? 'text-slate-900' : 'text-red-600'
                    }`}
                  >
                    {adj.points > 0 ? `+${adj.points}` : adj.points} điểm
                  </span>

                  <button
                    onClick={() => deleteManualAdjustment(adj.id, currentDrlSemesterId)}
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

      {/* 5. Modals */}
      {showManualModal && (
        <ManualAdjustmentModal
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          onAdd={(adj) => addManualAdjustment(adj, currentDrlSemesterId)}
        />
      )}

      {showSemesterModal && (
        <SemesterModal
          isOpen={showSemesterModal}
          onClose={() => setShowSemesterModal(false)}
          onAdd={addSemester}
        />
      )}
    </div>
  );
};
