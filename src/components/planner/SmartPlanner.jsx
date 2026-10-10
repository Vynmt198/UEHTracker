import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateGPAStats, convertScore10ToUEH, evaluateScholarship } from '../../utils/gpaCalculator';
import { X } from 'lucide-react';
import { UEH_FACULTIES } from '../../data/uehFaculties';

export const SmartPlanner = ({ isMainView = false }) => {
  const { 
    profile, 
    courses, 
    updateCourse, 
    allActivities, 
    registeredActivityIds, 
    toggleActivityRegistration, 
    getDRLProgress, 
    setActiveTab, 
    selectedSemesterId 
  } = useApp();

  // 3 Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState(() => {
    return localStorage.getItem('ueh_tracker_planner_subtab') || 'gpa';
  });

  useEffect(() => {
    localStorage.setItem('ueh_tracker_planner_subtab', activeSubTab);
  }, [activeSubTab]);

  // Modal Aim adjustment
  const [editingAimCourse, setEditingAimCourse] = useState(null);
  const [tempAimScore, setTempAimScore] = useState(8.0);

  // Bộ lọc lịch rảnh cho ĐRL
  const [selectedDay, setSelectedDay] = useState(0); // 0 = all, 1 = T2 ... 7 = CN
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [onlyDeficitActivities, setOnlyDeficitActivities] = useState(true);

  // Bộ lọc định hướng
  const [selectedGoal, setSelectedGoal] = useState('scientific_research');
  const [facultyFilter, setFacultyFilter] = useState('Tất cả');

  // GPA & DRL Calculations
  const overallStats = calculateGPAStats(courses);
  const drlProgress = getDRLProgress();
  const targetGPA = profile.targetGPA || 3.60;
  const targetDRL = profile.targetDRL || 85;

  const currentGPA = overallStats.actualGPA4 > 0 ? overallStats.actualGPA4 : 3.42;
  const currentDRL = drlProgress.totalDRL > 0 ? drlProgress.totalDRL : 72;

  const isGpaOnTrack = currentGPA >= targetGPA;
  const gpaDeficit = Math.max(0, targetGPA - currentGPA);

  const isDrlOnTrack = currentDRL >= targetDRL;
  const drlDeficit = Math.max(0, targetDRL - currentDRL);

  const scholarship = evaluateScholarship(currentGPA, currentDRL);

  // ---------------------------------------------------------------------------
  // 1. TÍNH TOÁN ĐIỂM THI CUỐI KỲ CẦN ĐẠT CHO TỪNG MÔN
  // ---------------------------------------------------------------------------
  const currentSemesterCourses = useMemo(() => {
    const inProgress = courses.filter((c) => c.status === 'Đang học');
    if (inProgress.length > 0) return inProgress;
    const semCourses = courses.filter((c) => c.semesterId === selectedSemesterId);
    return semCourses.length > 0 ? semCourses : courses;
  }, [courses, selectedSemesterId]);

  const examTargetAnalysis = useMemo(() => {
    return currentSemesterCourses.map((course) => {
      const components = course.components || [];
      const graded = components.filter((comp) => comp.score !== null && comp.score !== undefined && !isNaN(comp.score));
      const gradedWeight = graded.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
      const gradedWeightedScore = graded.reduce((sum, c) => sum + (c.score || 0) * ((Number(c.weight) || 0) / 100), 0);
      const remainingWeight = Math.max(0, 100 - gradedWeight);
      const aimScore = course.aimScore10 || 8.0;

      let requiredFinalScore = null;
      let status = 'safe';
      let message = '';

      if (remainingWeight > 0) {
        const pointsNeeded = aimScore - gradedWeightedScore;
        const required = Math.round((pointsNeeded / (remainingWeight / 100)) * 10) / 10;
        requiredFinalScore = required;

        if (required > 10.0) {
          status = 'impossible';
          message = `Cần ${required.toFixed(1)} điểm (> 10.0) để đạt mục tiêu ${aimScore.toFixed(1)}. Điểm quá trình hiện tại chưa đủ cao, nên hạ mục tiêu xuống 1 bậc.`;
        } else if (required <= 0) {
          status = 'safe';
          message = `Điểm quá trình đã đủ an toàn để đạt mục tiêu ${aimScore.toFixed(1)} (chỉ cần không vắng thi).`;
        } else if (required >= 8.5) {
          status = 'at_risk';
          message = `Cần tối thiểu ${required.toFixed(1)} điểm thi cuối kỳ (${remainingWeight}%). Cần ưu tiên ôn tập môn này.`;
        } else if (required >= 7.0) {
          status = 'moderate';
          message = `Cần ${required.toFixed(1)} điểm thi cuối kỳ (${remainingWeight}%). Nằm trong khả năng nếu ôn tập đều.`;
        } else {
          status = 'safe';
          message = `Cần ${required.toFixed(1)} điểm thi cuối kỳ (${remainingWeight}%). Đang ở ngưỡng an toàn.`;
        }
      } else {
        status = 'completed';
        const finalScore = course.finalScore10 ?? gradedWeightedScore;
        message = `Đã hoàn tất điểm học phần: ${finalScore.toFixed(1)}/10.`;
      }

      const currentProcessScore = gradedWeight > 0 ? Math.round((gradedWeightedScore / (gradedWeight / 100)) * 10) / 10 : null;

      return {
        course,
        aimScore,
        gradedWeight,
        remainingWeight,
        currentProcessScore,
        requiredFinalScore,
        status,
        message,
        urgencyScore: status === 'impossible' 
          ? 100 
          : status === 'at_risk' 
            ? 80 + (requiredFinalScore || 0) 
            : status === 'moderate'
              ? 50 + (requiredFinalScore || 0)
              : (requiredFinalScore || 0)
      };
    });
  }, [currentSemesterCourses]);

  const sortedExamTargets = useMemo(() => {
    return [...examTargetAnalysis].sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [examTargetAnalysis]);

  const handleOpenAimModal = (course) => {
    setEditingAimCourse(course);
    setTempAimScore(course.aimScore10 || 8.0);
  };

  const handleSaveAimScore = () => {
    if (editingAimCourse) {
      updateCourse(editingAimCourse.id, { aimScore10: tempAimScore });
      setEditingAimCourse(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 2. BẮT BỆNH THÂM HỤT ĐRL & LỌC THEO LỊCH RẢNH
  // ---------------------------------------------------------------------------
  const criteriaList = drlProgress.criteriaList;
  const deficitMap = drlProgress.deficitMap || {};

  const missingCriteriaIds = useMemo(() => {
    return Object.entries(deficitMap)
      .filter(([_, def]) => def > 0)
      .map(([id]) => id);
  }, [deficitMap]);

  const filteredGapActivities = useMemo(() => {
    return allActivities.filter((act) => {
      if (onlyDeficitActivities && missingCriteriaIds.length > 0) {
        const matchesMissing = act.allocations.some((alloc) =>
          missingCriteriaIds.some((catId) => alloc.criterionCode.startsWith(catId))
        );
        if (!matchesMissing) return false;
      }
      if (selectedDay !== 0 && act.dayOfWeek !== selectedDay) {
        return false;
      }
      if (selectedTimeSlot !== 'all') {
        const [startHour] = act.startTime.split(':').map(Number);
        if (selectedTimeSlot === 'morning' && (startHour < 7 || startHour >= 12)) return false;
        if (selectedTimeSlot === 'afternoon' && (startHour < 12 || startHour >= 17)) return false;
        if (selectedTimeSlot === 'evening' && startHour < 17) return false;
      }
      return true;
    });
  }, [allActivities, onlyDeficitActivities, missingCriteriaIds, selectedDay, selectedTimeSlot]);

  // ---------------------------------------------------------------------------
  // 3. ĐỊNH HƯỚNG NCKH & NGHỀ NGHIỆP THEO KHOA
  // ---------------------------------------------------------------------------
  const studentFaculty = profile.faculty || 'Công nghệ thông tin kinh doanh';

  const careerGrowthActivities = useMemo(() => {
    const list = allActivities.filter((a) => {
      const matchesGoal = a.goalCategory === selectedGoal;
      const cleanFac = facultyFilter.replace(/^(Khoa|Viện)\s+/i, '').toLowerCase();
      const matchesFaculty = facultyFilter === 'Tất cả' ||
        a.facultyTarget === 'Tất cả' ||
        a.facultyTarget.toLowerCase().includes(cleanFac) ||
        a.organizer.toLowerCase().includes(cleanFac);
      return matchesGoal && matchesFaculty;
    });

    const cleanStudent = studentFaculty.replace(/^(Khoa|Viện)\s+/i, '').toLowerCase();
    return [...list].sort((a, b) => {
      const aMatches = a.facultyTarget.toLowerCase().includes(cleanStudent) || a.organizer.toLowerCase().includes(cleanStudent);
      const bMatches = b.facultyTarget.toLowerCase().includes(cleanStudent) || b.organizer.toLowerCase().includes(cleanStudent);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }, [allActivities, selectedGoal, facultyFilter, studentFaculty]);

  // Lời khuyên hành động tuần này
  const top1PriorityText = useMemo(() => {
    const urgentSubject = sortedExamTargets.find(c => c.status === 'at_risk' || c.status === 'impossible');
    const topDeficitId = missingCriteriaIds[0];
    const topDeficitCat = criteriaList.find(c => c.id.toString() === topDeficitId);
    const topDeficitPoints = deficitMap[topDeficitId] || 0;

    if (urgentSubject && topDeficitPoints > 0) {
      return `Tập trung ôn thi môn ${urgentSubject.course.name} (cần ${urgentSubject.requiredFinalScore?.toFixed(1) || '8.0'} điểm) và tham gia hoạt động bổ sung cho ${topDeficitCat?.shortName || 'ĐRL'} (đang thiếu ${topDeficitPoints} điểm).`;
    }
    if (urgentSubject) {
      return `Dồn sức ôn thi môn ${urgentSubject.course.name} (cần đạt ${urgentSubject.requiredFinalScore?.toFixed(1)} điểm) để giữ mục tiêu GPA ${targetGPA.toFixed(2)}.`;
    }
    if (topDeficitPoints > 0) {
      return `Đăng ký hoạt động rèn luyện bổ sung cho ${topDeficitCat?.shortName || 'Mục còn thiếu'} để bù ${topDeficitPoints} điểm ĐRL.`;
    }
    return `Cả GPA và ĐRL đều đang bám sát tiến độ. Tiếp tục duy trì để đạt chỉ tiêu học kỳ.`;
  }, [sortedExamTargets, missingCriteriaIds, criteriaList, deficitMap, targetGPA]);

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* 1. BẢNG TỔNG QUAN TIẾN ĐỘ HỌC BỔNG (GPA + ĐRL)                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        {/* Header Title + Profile Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              UEH SMART PLANNER
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              Kế hoạch học tập & rèn luyện
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-600">
            <span>Hồ sơ:</span>
            <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {profile.cohort || 'K49'} • {profile.major || profile.faculty || 'CNTT'}
            </span>
          </div>
        </div>

        {/* 3 Cột: GPA - ĐRL - Tiêu chuẩn học bổng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
          {/* Cột 1: GPA */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  GPA Tích lũy (Hệ 4)
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  isGpaOnTrack 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isGpaOnTrack ? 'Đạt chuẩn' : `Thiếu +${gpaDeficit.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  {currentGPA.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ Mục tiêu {targetGPA.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-[#0B2545] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((currentGPA / targetGPA) * 100))}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2.5">
              {isGpaOnTrack ? 'Điểm GPA đang đủ điều kiện xét học bổng.' : `Cần tăng thêm ${gpaDeficit.toFixed(2)} điểm để chạm mốc.`}
            </p>
          </div>

          {/* Cột 2: Điểm Rèn Luyện */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Điểm rèn luyện
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  isDrlOnTrack 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isDrlOnTrack ? 'Đạt chuẩn' : `Thiếu ${drlDeficit}đ`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  {currentDRL}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ Mục tiêu {targetDRL}đ</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-[#0B2545] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((currentDRL / targetDRL) * 100))}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2.5">
              {isDrlOnTrack ? 'ĐRL đã hoàn thành chỉ tiêu kỳ này.' : `Thiếu ${drlDeficit} điểm để đạt mức rèn luyện mục tiêu.`}
            </p>
          </div>

          {/* Cột 3: Tiêu chuẩn học bổng */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tiêu chuẩn học bổng
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${scholarship.badgeBg}`}>
                  {scholarship.tier}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-slate-900">
                  Mục tiêu: {profile.scholarshipTierTarget || 'Xuất sắc'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Yêu cầu: GPA ≥ {profile.scholarshipTierTarget === 'Xuất sắc' ? '3.6' : '3.2'} • ĐRL ≥ {profile.scholarshipTierTarget === 'Xuất sắc' ? '90' : '80'}
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                {isGpaOnTrack && isDrlOnTrack ? 'Đủ điều kiện xét duyệt' : 'Chưa đủ điều kiện'}
              </span>
              <span className="font-semibold text-slate-900">
                {isGpaOnTrack && isDrlOnTrack ? 'Duy trì' : 'Cần bứt phá'}
              </span>
            </div>
          </div>
        </div>

        {/* Khung lời khuyên hành động */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Ưu tiên tuần này
            </span>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
              {top1PriorityText}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button 
              onClick={() => setActiveSubTab('gpa')} 
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Xem điểm thi
            </button>
            <button 
              onClick={() => setActiveSubTab('drl')} 
              className="text-xs px-3 py-1.5 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-semibold transition-colors"
            >
              Bù điểm ĐRL
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TABS SELECTOR                                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2.5">
        {[
          { id: 'gpa', label: 'Dự báo điểm thi cuối kỳ' },
          { id: 'drl', label: 'Bù điểm rèn luyện theo lịch rảnh' },
          { id: 'growth', label: 'Định hướng NCKH & Nghề nghiệp' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: DỰ BÁO ĐIỂM THI CUỐI KỲ CẦN ĐẠT (GPA)                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'gpa' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Điểm thi kết thúc học phần cần đạt
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tính toán điểm thi tối thiểu dựa trên điểm quá trình hiện tại để đạt mục tiêu môn học
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('gpa')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors self-start sm:self-auto"
              >
                Mở bảng điểm đầy đủ
              </button>
            </div>

            {sortedExamTargets.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                Chưa có môn học nào trong học kỳ hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedExamTargets.map(({ course, aimScore, currentProcessScore, requiredFinalScore, remainingWeight, status, message }) => {
                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Course Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900">{course.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {course.credits} tín chỉ • {course.status}
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 border ${
                            status === 'impossible'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : status === 'at_risk'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : status === 'moderate'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {status === 'impossible' && 'Quá tải mục tiêu'}
                            {status === 'at_risk' && 'Cần ưu tiên ôn tập'}
                            {status === 'moderate' && 'Vừa sức'}
                            {status === 'safe' && 'An toàn'}
                            {status === 'completed' && 'Đã hoàn tất'}
                          </span>
                        </div>

                        {/* 3 Cột điểm */}
                        <div className="grid grid-cols-3 gap-2 mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              Quá trình
                            </span>
                            <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                              {currentProcessScore !== null ? `${currentProcessScore}/10` : 'Chưa có'}
                            </span>
                          </div>

                          <div className="border-x border-slate-200">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              Mục tiêu
                            </span>
                            <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                              {aimScore.toFixed(1)}/10
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              Cần thi cuối kỳ
                            </span>
                            <span className={`text-sm font-bold font-mono mt-0.5 block ${
                              requiredFinalScore > 10.0
                                ? 'text-rose-600'
                                : requiredFinalScore >= 8.5
                                  ? 'text-amber-700'
                                  : 'text-emerald-700'
                            }`}>
                              {requiredFinalScore !== null 
                                ? (requiredFinalScore > 10.0 ? `> 10.0đ` : `${requiredFinalScore.toFixed(1)}đ`) 
                                : 'Đã xong'}
                            </span>
                          </div>
                        </div>

                        {/* Lời khuyên */}
                        <div className={`mt-3 p-2.5 rounded-lg text-xs leading-relaxed border ${
                          status === 'impossible'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : status === 'at_risk'
                              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        }`}>
                          <strong>Ghi chú: </strong>
                          {message}
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleOpenAimModal(course)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
                        >
                          Đổi mục tiêu môn
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('gpa')}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          Nhập điểm thành phần
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: BÙ ĐIỂM RÈN LUYỆN THEO LỊCH RẢNH (DRL)                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'drl' && (
        <div className="space-y-4">
          {/* Tình trạng 5 Tiêu chí ĐRL */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Tình trạng 5 tiêu chí ĐRL
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tổng ĐRL hiện tại: <strong className="text-slate-800">{currentDRL}/100đ</strong> • Mục tiêu:{' '}
                  <strong className="text-slate-800">{targetDRL}đ</strong> ({isDrlOnTrack ? 'Đã đạt chỉ tiêu' : `Còn thiếu ${drlDeficit}đ`})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('drl')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors self-start sm:self-auto"
              >
                Mở bảng tiêu chí ĐRL
              </button>
            </div>

            {/* 5 Hộp tiêu chí */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {criteriaList.map((crit) => {
                const deficit = deficitMap[crit.id.toString()] || 0;
                const isMax = crit.currentPoints >= crit.maxPoints;
                const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));

                return (
                  <div
                    key={crit.id}
                    className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                      deficit > 0
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                          Mục {crit.id}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isMax
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isMax ? 'Đã đủ' : `Thiếu ${deficit}đ`}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-2 line-clamp-1" title={crit.name}>
                        {crit.shortName}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-slate-800 font-mono">
                          {crit.currentPoints} <span className="text-[10px] text-slate-400 font-normal">/ {crit.maxPoints}đ</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isMax ? 'bg-emerald-600' : 'bg-slate-700'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lọc hoạt động theo lịch rảnh */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Lọc hoạt động theo lịch rảnh
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn ngày và buổi rảnh để tìm hoạt động bù đúng mục tiêu chí còn thiếu
              </p>
            </div>

            {/* Điều khiển bộ lọc */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Ngày rảnh
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-400"
                  >
                    <option value={0}>Tất cả các ngày</option>
                    <option value={1}>Thứ 2</option>
                    <option value={2}>Thứ 3</option>
                    <option value={3}>Thứ 4</option>
                    <option value={4}>Thứ 5</option>
                    <option value={5}>Thứ 6</option>
                    <option value={6}>Thứ 7</option>
                    <option value={7}>Chủ Nhật</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Buổi trong ngày
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-400"
                  >
                    <option value="all">Tất cả các buổi</option>
                    <option value="morning">Sáng (07:30 - 11:30)</option>
                    <option value="afternoon">Chiều (13:30 - 17:00)</option>
                    <option value="evening">Tối (18:00 - 21:00)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyDeficitActivities}
                    onChange={(e) => setOnlyDeficitActivities(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-0"
                  />
                  <span className="text-xs text-slate-700">
                    Chỉ hiện hoạt động bù đúng mục còn thiếu ({missingCriteriaIds.map(id => `Mục ${id}`).join(', ') || 'Đã đủ'})
                  </span>
                </label>

                <span className="text-xs text-slate-500">
                  Khớp: <strong className="text-slate-900">{filteredGapActivities.length}</strong> hoạt động
                </span>
              </div>
            </div>

            {/* Danh sách hoạt động */}
            <div className="mt-4">
              {filteredGapActivities.length === 0 ? (
                <div className="p-8 text-center border border-slate-200 rounded-lg bg-slate-50/50 text-xs text-slate-500">
                  Không tìm thấy hoạt động nào phù hợp với bộ lọc ngày và giờ này.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                  {filteredGapActivities.slice(0, 8).map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const dayName = act.dayOfWeek === 1 ? 'Thứ 2' : act.dayOfWeek === 2 ? 'Thứ 3' : act.dayOfWeek === 3 ? 'Thứ 4' : act.dayOfWeek === 4 ? 'Thứ 5' : act.dayOfWeek === 5 ? 'Thứ 6' : act.dayOfWeek === 6 ? 'Thứ 7' : 'Chủ Nhật';

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-slate-500 bg-slate-100 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                              {act.code}
                            </span>
                            <span className="font-bold text-slate-900">{act.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              +{act.totalPoints}đ ĐRL
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                            <span>{act.organizer}</span>
                            <span>•</span>
                            <span>{dayName} ({act.startTime} - {act.endTime})</span>
                            <span>•</span>
                            <span>{act.location.split('-')[0]}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {act.allocations.map((alloc, idx) => (
                              <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                Bù vào: Mục {alloc.criterionCode} (+{alloc.points}đ)
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => toggleActivityRegistration(act.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              isRegistered
                                ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: ĐỊNH HƯỚNG NCKH & NGHỀ NGHIỆP                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'growth' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Định hướng NCKH & Nghề nghiệp
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khoa/Viện của bạn: <strong className="text-slate-900">{studentFaculty}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-slate-400 max-w-[240px]"
                >
                  <option value="Tất cả">Tất cả Khoa / Viện</option>
                  {UEH_FACULTIES.map((fac) => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4 Nhóm định hướng */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'scientific_research', label: 'Nghiên cứu khoa học' },
                { id: 'career', label: 'Nghề nghiệp & Doanh nghiệp' },
                { id: 'soft_skills', label: 'Kỹ năng mềm' },
                { id: 'networking', label: 'Hoạt động xã hội' }
              ].map((pill) => {
                const isSelected = selectedGoal === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setSelectedGoal(pill.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Danh sách hoạt động */}
            <div className="mt-3">
              {careerGrowthActivities.length === 0 ? (
                <div className="p-8 text-center border border-slate-200 rounded-lg bg-slate-50/50 text-xs text-slate-500">
                  Không tìm thấy hoạt động nào trong nhóm này.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                  {careerGrowthActivities.slice(0, 8).map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const isFacultyMatch = act.facultyTarget.toLowerCase().includes(studentFaculty.toLowerCase()) ||
                      act.organizer.toLowerCase().includes(studentFaculty.toLowerCase());

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-slate-500 bg-slate-100 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                              {act.code}
                            </span>
                            <span className="font-bold text-slate-900">{act.title}</span>
                            {isFacultyMatch && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                                Đúng chuyên ngành
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-600 bg-slate-50 border border-slate-200">
                              {act.facultyTarget}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                            <span>{act.organizer}</span>
                            <span>•</span>
                            <span>{act.date} ({act.startTime} - {act.endTime})</span>
                            <span>•</span>
                            <span>{act.location}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-slate-500">
                            {act.tags.map((t, idx) => (
                              <span key={idx} className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            +{act.totalPoints}đ
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleActivityRegistration(act.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              isRegistered
                                ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: ĐIỀU CHỈNH MỤC TIÊU MÔN HỌC                                      */}
      {/* ========================================================================= */}
      {editingAimCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Điều chỉnh mục tiêu môn học
                </span>
                <h3 className="text-base font-bold text-slate-900">{editingAimCourse.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAimCourse(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Mục tiêu điểm hệ 10:</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {tempAimScore.toFixed(1)}/10
                </span>
              </div>

              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={tempAimScore}
                onChange={(e) => setTempAimScore(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5.0 (C)</span>
                <span>7.0 (B)</span>
                <span>8.0 (B+)</span>
                <span>8.5 (A)</span>
                <span>10.0 (A+)</span>
              </div>
            </div>

            {/* Xem trước tính toán */}
            {(() => {
              const comps = editingAimCourse.components || [];
              const graded = comps.filter((c) => c.score !== null && c.score !== undefined && !isNaN(c.score));
              const gradedWeight = graded.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
              const gradedScore = graded.reduce((sum, c) => sum + (c.score || 0) * ((Number(c.weight) || 0) / 100), 0);
              const remainingWeight = Math.max(0, 100 - gradedWeight);
              let reqFinal = null;
              if (remainingWeight > 0) {
                reqFinal = Math.round(((tempAimScore - gradedScore) / (remainingWeight / 100)) * 10) / 10;
              }
              const gradeInfo = convertScore10ToUEH(tempAimScore);

              return (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Quy đổi hệ 4:</span>
                    <strong className="text-slate-900">
                      {gradeInfo.letter} ({gradeInfo.gpa4.toFixed(1)} / 4.0) - {gradeInfo.description}
                    </strong>
                  </div>

                  {remainingWeight > 0 && reqFinal !== null && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Cần thi cuối kỳ ({remainingWeight}%):</span>
                      <strong className={`font-mono text-sm ${
                        reqFinal > 10.0
                          ? 'text-rose-600'
                          : reqFinal >= 8.5
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                      }`}>
                        {reqFinal > 10.0 ? `${reqFinal.toFixed(1)}đ (Quá tải, nên hạ mục tiêu)` : `${reqFinal.toFixed(1)}đ`}
                      </strong>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAimCourse(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAimScore}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Lưu mục tiêu mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
