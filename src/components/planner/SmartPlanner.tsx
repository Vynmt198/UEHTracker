import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UEHActivity } from '../../types';
import { calculateGPAStats } from '../../utils/gpaCalculator';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Award,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  TrendingUp,
  Compass,
  Briefcase,
  Brain,
  Users,
  Check,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { Mascot } from '../common/Mascot';
import {
  IconAcademicCap,
  IconCoffeeBoost,
  IconResearchLab,
  IconCareerBag,
  IconSkillSpark,
  IconNetworkFist,
  IconScheduleAlert,
  IconScheduleCalendar
} from '../common/EduIcons';

type PlannerSimulatedState = 'auto' | 'freshman' | 'in_progress' | 'achieved';
type SelfDevelopmentGoal = 'scientific_research' | 'career' | 'soft_skills' | 'networking';

interface SmartPlannerProps {
  isMainView?: boolean;
}

export const SmartPlanner: React.FC<SmartPlannerProps> = ({ isMainView = false }) => {
  const {
    profile,
    courses,
    allActivities,
    registeredActivityIds,
    toggleActivityRegistration,
    getDRLProgress,
    setActiveTab,
    scheduleBlocks,
    checkActivityScheduleConflict,
    addActivityToSchedule
  } = useApp();

  const [simulatedState, setSimulatedState] = useState<PlannerSimulatedState>('auto');
  const [selectedGoal, setSelectedGoal] = useState<SelfDevelopmentGoal>('scientific_research');
  const [facultyFilter, setFacultyFilter] = useState<string>(profile.faculty || 'Tất cả');
  const [scheduleFeedback, setScheduleFeedback] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const handleAddToSchedule = (activity: UEHActivity) => {
    const result = addActivityToSchedule(activity);
    setScheduleFeedback({
      message: result.message,
      type: result.success ? 'success' : 'warning'
    });
    setTimeout(() => setScheduleFeedback(null), 3500);
  };

  const renderScheduleButton = (act: UEHActivity) => {
    const isScheduled = scheduleBlocks.some((b) => b.activityId === act.id);
    const conflict = checkActivityScheduleConflict(act);

    if (conflict.hasConflict && !isScheduled) {
      return (
        <div
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 select-none shrink-0"
          title={`Trùng lịch với: ${conflict.conflictingBlock?.title} (${conflict.conflictingBlock?.startTime}-${conflict.conflictingBlock?.endTime})`}
        >
          <IconScheduleAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Trùng lịch</span>
        </div>
      );
    }

    if (isScheduled) {
      return (
        <div
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 select-none shrink-0"
          title="Đã lưu trong Thời khóa biểu của bạn"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Đã vào TKB</span>
        </div>
      );
    }

    return (
      <button
        onClick={() => handleAddToSchedule(act)}
        className="btn-interactive-outline shrink-0"
        title={`Thứ ${act.dayOfWeek === 7 ? 'CN' : act.dayOfWeek + 1} (${act.startTime} - ${act.endTime})`}
      >
        <IconScheduleCalendar className="w-3.5 h-3.5 text-[#007D8C] shrink-0" />
        <span>Thêm vào TKB</span>
      </button>
    );
  };

  // Real data calculations
  const overallStats = calculateGPAStats(courses);
  const drlProgress = getDRLProgress();

  const targetGPA = profile.targetGPA || 3.60;
  const targetDRL = profile.targetDRL || 85;

  // Real user state detection
  const actualState: 'freshman' | 'in_progress' | 'achieved' = useMemo(() => {
    // Trạng thái 1: Freshman / Chưa có dữ liệu điểm hoàn thành
    if (overallStats.completedCoursesCount === 0 || overallStats.actualGPA4 === 0) {
      return 'freshman';
    }
    // Trạng thái 3: Đã đạt mục tiêu
    if (overallStats.actualGPA4 >= targetGPA && drlProgress.totalDRL >= targetDRL) {
      return 'achieved';
    }
    // Trạng thái 2: Đang cố gắng
    return 'in_progress';
  }, [overallStats, drlProgress, targetGPA, targetDRL]);

  // Effective state based on simulation toggle or auto
  const effectiveState = simulatedState === 'auto' ? actualState : simulatedState;

  // Identify course dragging GPA down (lowest score or score < aimScore10)
  const draggingCourse = useMemo(() => {
    const scoredCourses = courses.filter(
      (c) => c.finalScore10 !== null && c.finalScore10 !== undefined
    );
    if (scoredCourses.length === 0) {
      return (
        courses.find((c) => c.status === 'Đang học') || {
          name: 'Toán ứng dụng trong Kinh tế',
          finalScore10: 6.8,
          aimScore10: 8.5
        }
      );
    }
    // sort by finalScore10 ascending
    const sorted = [...scoredCourses].sort(
      (a, b) => (a.finalScore10 ?? 10) - (b.finalScore10 ?? 10)
    );
    return sorted[0];
  }, [courses]);

  // Deficit in DRL
  const drlDeficit = Math.max(0, targetDRL - (effectiveState === 'freshman' ? 35 : drlProgress.totalDRL));

  // Activities recommendations for State 1 (Freshman)
  const freshmanActivities = useMemo(() => {
    return allActivities
      .filter(
        (a) =>
          a.audienceCategory === 'freshman' ||
          a.tags.some((t) => t.includes('Tân sinh viên') || t.includes('Năm nhất'))
      )
      .slice(0, 4);
  }, [allActivities]);

  // Activities recommendations for State 2 (Deficit filling)
  const deficitActivities = useMemo(() => {
    const sortedDeficitCats = Object.entries(drlProgress.deficitMap)
      .filter(([_, def]) => def > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const primaryMissingCat = sortedDeficitCats[0] || '2';

    return allActivities
      .filter((a) => {
        const matchesMissing = a.allocations.some((alloc) =>
          alloc.criterionCode.startsWith(primaryMissingCat)
        );
        return matchesMissing && !registeredActivityIds.includes(a.id);
      })
      .slice(0, 4);
  }, [allActivities, drlProgress.deficitMap, registeredActivityIds]);

  // Activities recommendations for State 3 (Self development: 4 groups)
  const selfDevActivities = useMemo(() => {
    return allActivities
      .filter((a) => {
        const matchesGoal = a.goalCategory === selectedGoal;
        const matchesFaculty =
          facultyFilter === 'Tất cả' ||
          a.facultyTarget === 'Tất cả' ||
          a.facultyTarget.toLowerCase().includes(facultyFilter.toLowerCase());
        return matchesGoal && matchesFaculty;
      })
      .slice(0, 5);
  }, [allActivities, selectedGoal, facultyFilter]);

  return (
    <div className="space-y-4">
      {/* High-level Status Diagnostic (Only in Main Academic Advisor View) */}
      {isMainView && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* GPA Diagnostic */}
          <div className="interactive-card-accent flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                GPA HIỆN TẠI VS MỤC TIÊU
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center ${
                overallStats.actualGPA4 >= targetGPA
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <span className={`pulse-badge-dot ${overallStats.actualGPA4 >= targetGPA ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {overallStats.actualGPA4 >= targetGPA ? 'Đạt chuẩn' : 'Cần cải thiện'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {overallStats.actualGPA4 > 0 ? overallStats.actualGPA4.toFixed(2) : '3.42'}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {targetGPA.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {overallStats.actualGPA4 >= targetGPA
                ? 'Đã đạt chuẩn mục tiêu học bổng'
                : `Cần nâng +${Math.max(0, targetGPA - (overallStats.actualGPA4 || 3.42)).toFixed(2)}đ`}
            </p>
          </div>

          {/* DRL Diagnostic */}
          <div className="interactive-card-accent flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                ĐRL HIỆN TẠI VS MỤC TIÊU
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center ${
                drlProgress.totalDRL >= targetDRL
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <span className={`pulse-badge-dot ${drlProgress.totalDRL >= targetDRL ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {drlProgress.totalDRL >= targetDRL ? 'Đạt chuẩn' : `Còn ${Math.max(0, targetDRL - (drlProgress.totalDRL || 72))}đ`}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {drlProgress.totalDRL > 0 ? drlProgress.totalDRL : 72}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {targetDRL}đ</span>
            </div>
            {/* Mini progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-[#49C8D6] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((drlProgress.totalDRL || 72) / targetDRL) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {drlProgress.totalDRL >= targetDRL
                ? 'Đã đạt chuẩn rèn luyện mong muốn'
                : `Còn thiếu ${Math.max(0, targetDRL - (drlProgress.totalDRL || 72))} điểm`}
            </p>
          </div>

          {/* Profile & Schedule Helper Diagnostic */}
          <div className="interactive-card-accent flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                HỒ SƠ CỐ VẤN
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1 truncate max-w-[150px]">
                {profile.faculty}
              </div>
              <div className="text-[11px] text-slate-500">{profile.cohort} • {profile.major}</div>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-[#49C8D6] hover:text-white border border-slate-200 transition-all shrink-0 shadow-xs"
            >
              Mở TKB
            </button>
          </div>
        </div>
      )}

      {/* Schedule Action Toast Notification */}
      {scheduleFeedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between border ${
            scheduleFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          } animate-in fade-in duration-200`}
        >
          <span>{scheduleFeedback.message}</span>
          <button
            onClick={() => setScheduleFeedback(null)}
            className="p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Smart Planner Main Container - Clean SaaS Minimalist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-slate-300 transition-colors">
        {/* Header & Simulator Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconAcademicCap className="w-5 h-5 text-[#49C8D6]" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                SMART PLANNER
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Lộ trình học tập & rèn luyện
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  {effectiveState === 'freshman' && 'Tân sinh viên'}
                  {effectiveState === 'in_progress' && 'Đang cố gắng'}
                  {effectiveState === 'achieved' && 'Đã đạt mục tiêu'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Scenario Switcher (Utilitarian & Scannable) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs overflow-x-auto self-start lg:self-auto">
            <button
              onClick={() => setSimulatedState('auto')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                simulatedState === 'auto'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconCoffeeBoost className="w-3.5 h-3.5 text-[#49C8D6]" />
              <span>Tự động</span>
            </button>
            <button
              onClick={() => setSimulatedState('freshman')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                simulatedState === 'freshman'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Tân sinh viên
            </button>
            <button
              onClick={() => setSimulatedState('in_progress')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                simulatedState === 'in_progress'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Đang cố gắng
            </button>
            <button
              onClick={() => setSimulatedState('achieved')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                simulatedState === 'achieved'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Đã đạt mục tiêu
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TRẠNG THÁI 1: FRESHMAN / CHƯA CÓ DỮ LIỆU ĐIỂM */}
        {/* ========================================================================= */}
        {effectiveState === 'freshman' && (
          <div className="pt-4 space-y-4">
            {/* Kipo Mascot Guidance */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
              <Mascot pose="puzzled" size="md" />
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Chào mừng bạn đến với UEH!</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Chưa đủ dữ liệu học phần để dự báo GPA. Hãy hoàn thành các môn học đầu tiên và tham gia hoạt động hội nhập để Kipo đồng hành cùng bạn nhé!
                </p>
              </div>
            </div>

            {/* Metric Status Line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* GPA Box */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    THEO DÕI GPA
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    Chưa có điểm môn học
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhập điểm học phần đầu tiên để hệ thống bắt đầu phân tích.
                  </p>
                </div>
              </div>

              {/* DRL Box */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#007D8C]">
                  <Award className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      ĐIỂM RÈN LUYỆN TÂN SINH VIÊN
                    </span>
                    <span className="text-xs font-bold text-amber-600">Thiếu 50đ</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    35 <span className="text-xs text-slate-400 font-normal">/ 85 điểm mục tiêu (Mức sàn 35đ)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-[#49C8D6] h-full rounded-full" style={{ width: `${(35 / 85) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section: Freshman Activities */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-slate-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Khám phá hoạt động dành riêng cho tân sinh viên / sinh viên năm nhất
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('drl')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  Xem tất cả hoạt động <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Flat list of activities */}
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                {freshmanActivities.map((act) => {
                  const isRegistered = registeredActivityIds.includes(act.id);
                  const conflict = checkActivityScheduleConflict(act);
                  const isScheduled = scheduleBlocks.some((b) => b.activityId === act.id);
                  const isConflict = conflict.hasConflict && !isScheduled;

                  return (
                    <div
                      key={act.id}
                      className="p-3 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 bg-slate-50 font-mono px-1.5 py-0.5 rounded border border-slate-100">
                            {act.code}
                          </span>
                          <span className="font-semibold text-slate-900 hover:text-slate-950">
                            {act.title}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                          <span>{act.organizer}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {act.startTime} - {act.endTime}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {act.location.split('-')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-xs">
                          +{act.totalPoints}đ
                        </span>
                        {renderScheduleButton(act)}
                        <button
                          onClick={() => toggleActivityRegistration(act.id)}
                          className={`${isRegistered ? 'btn-interactive-outline' : 'btn-interactive-primary'} ${
                            isConflict && !isRegistered ? 'opacity-70 hover:opacity-100 transition-opacity' : ''
                          }`}
                          title={isConflict && !isRegistered ? 'Hoạt động này trùng với giờ học của bạn, cân nhắc sắp xếp lại TKB' : undefined}
                        >
                          <span>{isRegistered ? 'Đã đăng ký' : 'Đăng ký ngay'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TRẠNG THÁI 2: ĐANG CỐ GẮNG (VD: GPA 3.42/3.60, ĐRL 72/85) */}
        {/* ========================================================================= */}
        {effectiveState === 'in_progress' && (
          <div className="pt-4 space-y-4">
            {/* Kipo Mascot Inspect Guidance */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
              <Mascot pose="inspect" size="md" />
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Kipo đã tìm thấy 2 điểm nghẽn cần ưu tiên!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  1 môn đang kéo GPA xuống và bạn còn thiếu {drlDeficit > 0 ? drlDeficit : 13} điểm ĐRL để đạt chuẩn.
                </p>
              </div>
            </div>

            {/* Khối Ưu tiên (Priority List) - Flat & Scannable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Thẻ 01: Cải thiện GPA */}
              <div className="interactive-card !p-4 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px]">01</span>
                    CẢI THIỆN GPA → Môn: {draggingCourse.name}
                  </span>
                  <button
                    onClick={() => setActiveTab('gpa')}
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                  >
                    Bảng điểm <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Cần tối thiểu 8.0 điểm thi kết thúc học phần để duy trì chuẩn xét học bổng {targetGPA.toFixed(2)}.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-amber-700 font-semibold font-mono">
                    Điểm hiện tại: {draggingCourse.finalScore10 ? `${draggingCourse.finalScore10}/10` : 'Đang học'}
                  </span>
                  <button
                    onClick={() => setActiveTab('gpa')}
                    className="btn-ueh px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    <span>Nhập điểm chi tiết</span>
                  </button>
                </div>
              </div>

              {/* Thẻ 02: Bổ sung ĐRL */}
              <div className="interactive-card !p-4 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px]">02</span>
                    BỔ SUNG ĐRL → Cần thêm {drlDeficit > 0 ? drlDeficit : 13}đ ở Mục 2 & Mục 3
                  </span>
                  <button
                    onClick={() => setActiveTab('drl')}
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                  >
                    5 tiêu chí <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Hệ thống đã chọn lọc các hoạt động bù đúng tiêu chí khuyết bên dưới để đạt mục tiêu {targetDRL}đ.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-amber-700 font-semibold font-mono">
                    Hiện có: {drlProgress.totalDRL > 0 ? drlProgress.totalDRL : 72}/{targetDRL}đ
                  </span>
                  <button
                    onClick={() => setActiveTab('drl')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shadow-xs"
                  >
                    Xem cây tiêu chí
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended Activities List for Deficit */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                Hoạt động đề xuất bù điểm cho tiêu chí còn thiếu
              </h3>

              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                {deficitActivities.map((act) => {
                  const isRegistered = registeredActivityIds.includes(act.id);
                  const conflict = checkActivityScheduleConflict(act);
                  const isScheduled = scheduleBlocks.some((b) => b.activityId === act.id);
                  const isConflict = conflict.hasConflict && !isScheduled;

                  return (
                    <div
                      key={act.id}
                      className="p-3 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 bg-slate-50 font-mono px-1.5 py-0.5 rounded border border-slate-100">
                            {act.code}
                          </span>
                          <span className="font-semibold text-slate-900">{act.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-800 border border-cyan-100">
                            {act.activityType === 'chuyen_mon' ? 'Chuyên môn' : 'Trải nghiệm VH-XH'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                          <span>{act.organizer}</span>
                          <span>•</span>
                          <span>Phân bổ: {act.allocations.map((a) => `${a.criterionCode} (+${a.points}đ)`).join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-xs">
                          +{act.totalPoints}đ
                        </span>
                        {renderScheduleButton(act)}
                        <button
                          onClick={() => toggleActivityRegistration(act.id)}
                          className={`${isRegistered ? 'btn-interactive-outline' : 'btn-interactive-primary'} ${
                            isConflict && !isRegistered ? 'opacity-70 hover:opacity-100 transition-opacity' : ''
                          }`}
                          title={isConflict && !isRegistered ? 'Hoạt động này trùng với giờ học của bạn, cân nhắc sắp xếp lại TKB' : undefined}
                        >
                          <span>{isRegistered ? 'Đã đăng ký' : 'Đăng ký ngay'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TRẠNG THÁI 3: ĐÃ ĐẠT MỤC TIÊU */}
        {/* ========================================================================= */}
        {effectiveState === 'achieved' && (
          <div className="pt-4 space-y-4">
            {/* Kipo Mascot Proud Announcement - Pure White with #49C8D6 left border */}
            <div className="p-5 bg-white border border-slate-200/80 border-l-4 border-l-[#49C8D6] rounded-2xl shadow-xs flex items-center gap-4">
              <Mascot pose="proud" size="md" />
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#49C8D6]/15 text-[#0c727d]">
                  Mục tiêu hoàn thành
                </span>
                <h4 className="font-semibold text-slate-800 text-sm mt-1">Xuất sắc! Bạn đã đạt toàn bộ chỉ tiêu kỳ này</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  GPA và ĐRL đều an toàn. Kipo gợi ý bạn khám phá thêm các hoạt động Nghiên cứu & Doanh nghiệp bên dưới.
                </p>
              </div>
            </div>

            {/* Unlocked Section: Phát triển bản thân (4 nhóm mục tiêu) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    PHÁT TRIỂN BẢN THÂN & NGHỀ NGHIỆP
                  </h3>
                </div>

                {/* Khoa/Viện Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={facultyFilter}
                    onChange={(e) => setFacultyFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:border-slate-400"
                  >
                    <option value="Tất cả">Tất cả Khoa / Viện</option>
                    <option value="Công nghệ thông tin">Khoa CNTT Kinh doanh</option>
                    <option value="Marketing">Khoa KDQT - Marketing</option>
                    <option value="Tài chính">Khoa Tài chính - Ngân hàng</option>
                    <option value="Kế toán">Khoa Kế toán - Kiểm toán</option>
                    <option value="Kinh tế">Khoa Kinh tế - Quản trị</option>
                    <option value="Luật">Khoa Luật</option>
                  </select>
                </div>
              </div>

              {/* 4 Playful Sticker Pill Buttons for Self Development Goals */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'scientific_research', label: 'Nghiên cứu', icon: IconResearchLab },
                  { id: 'career', label: 'Nghề nghiệp', icon: IconCareerBag },
                  { id: 'soft_skills', label: 'Kỹ năng', icon: IconSkillSpark },
                  { id: 'networking', label: 'Networking', icon: IconNetworkFist }
                ].map((pill) => {
                  const Icon = pill.icon;
                  const isSelected = selectedGoal === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setSelectedGoal(pill.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#49C8D6] text-white shadow-xs font-semibold scale-102'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Goal-oriented activities list */}
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white mt-2">
                {selfDevActivities.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Không có hoạt động nào trong danh mục này cho Khoa đã chọn. Hãy chọn "Tất cả Khoa / Viện".
                  </div>
                ) : (
                  selfDevActivities.map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const conflict = checkActivityScheduleConflict(act);
                    const isScheduled = scheduleBlocks.some((b) => b.activityId === act.id);
                    const isConflict = conflict.hasConflict && !isScheduled;

                    return (
                      <div
                        key={act.id}
                        className="p-3 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 bg-slate-50 font-mono px-1.5 py-0.5 rounded border border-slate-100">
                              {act.code}
                            </span>
                            <span className="font-semibold text-slate-900">{act.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              {act.facultyTarget}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                            <span>{act.organizer}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {act.location}
                            </span>
                            <span>•</span>
                            <span>{act.tags.join(', ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-xs">
                            +{act.totalPoints}đ
                          </span>
                          {renderScheduleButton(act)}
                          <button
                            onClick={() => toggleActivityRegistration(act.id)}
                            className={`${isRegistered ? 'btn-interactive-outline' : 'btn-interactive-primary'} ${
                              isConflict && !isRegistered ? 'opacity-70 hover:opacity-100 transition-opacity' : ''
                            }`}
                            title={isConflict && !isRegistered ? 'Hoạt động này trùng với giờ học của bạn, cân nhắc sắp xếp lại TKB' : undefined}
                          >
                            <span>{isRegistered ? 'Đã đăng ký' : 'Tham gia'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
