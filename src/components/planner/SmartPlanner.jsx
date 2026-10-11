import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateGPAStats, convertScore10ToUEH, evaluateScholarship } from '../../utils/gpaCalculator';
import { 
  X, 
  Target, 
  Sparkles, 
  Sliders, 
  Edit3, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Compass, 
  BookOpen,
  Award,
  Trophy,
  Calendar,
  AlertTriangle
} from 'lucide-react';
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

  // Xác định điểm thực tế hoặc dự kiến, không dùng số giả lập 3.42 / 72
  const hasGradedCourses = (overallStats.completedCredits > 0 || courses.some(c => c.finalScore10 !== null && c.finalScore10 !== undefined));
  const currentGPA = hasGradedCourses ? overallStats.actualGPA4 : (overallStats.projectedGPA4 || 0.0);
  const currentDRL = drlProgress.totalDRL || 0;

  const isGpaOnTrack = currentGPA >= targetGPA;
  const gpaDeficit = Math.max(0, Math.round((targetGPA - currentGPA) * 100) / 100);

  const isDrlOnTrack = currentDRL >= targetDRL;
  const drlDeficit = Math.max(0, targetDRL - currentDRL);

  // Quy chế UEH: Có môn điểm F (< 4.0) thì bị loại khỏi học bổng kỳ đó
  const hasFailedCourse = courses.some(c => (c.finalScore10 !== null && c.finalScore10 < 4.0) || c.gradeLetter === 'F');
  const scholarship = evaluateScholarship(currentGPA, currentDRL, { hasFailedCourse });

  // Tiêu chuẩn học bổng theo mục tiêu cá nhân đã chọn
  const targetScholarshipTier = profile.scholarshipTierTarget || 'Xuất sắc';
  const tierMinGPA = targetScholarshipTier === 'Xuất sắc' ? 3.6 : targetScholarshipTier === 'Khá' ? 2.5 : 3.2;
  const tierMinDRL = targetScholarshipTier === 'Xuất sắc' ? 90 : targetScholarshipTier === 'Khá' ? 70 : 80;
  const isScholarshipEligible = !hasFailedCourse && currentGPA >= tierMinGPA && currentDRL >= tierMinDRL;

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
        const finalScore = course.finalScore10 ?? gradedWeightedScore;
        const isFailing = finalScore < 5.0 || course.gradeLetter === 'F';
        if (isFailing) {
          status = 'failed';
          message = `Học phần không đạt (${finalScore.toFixed(1)}/10). Cần đăng ký học lại/học cải thiện.`;
        } else if (finalScore < aimScore) {
          status = 'under_aim';
          message = `Đã hoàn tất điểm: ${finalScore.toFixed(1)}/10 (thấp hơn mục tiêu ${aimScore.toFixed(1)}đ).`;
        } else {
          status = 'completed';
          message = `Đã hoàn tất điểm học phần: ${finalScore.toFixed(1)}/10 (đạt mục tiêu).`;
        }
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
          : status === 'failed'
            ? 95
            : status === 'at_risk' 
              ? 80 + (requiredFinalScore || 0) 
              : status === 'under_aim'
                ? 60
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

  // Lời khuyên hành động & Cảnh báo tiến độ tuần này
  const priorityInfo = useMemo(() => {
    const urgentSubject = sortedExamTargets.find(c => c.status === 'at_risk' || c.status === 'impossible');
    const failingCourse = courses.find(c => (c.finalScore10 !== null && c.finalScore10 !== undefined && c.finalScore10 < 5.0) || c.gradeLetter === 'F');
    const lowestCourse = [...courses].filter(c => c.finalScore10 !== null && c.finalScore10 !== undefined).sort((a, b) => (a.finalScore10 || 0) - (b.finalScore10 || 0))[0];

    const topDeficitId = missingCriteriaIds[0];
    const topDeficitCat = criteriaList.find(c => c.id.toString() === topDeficitId);
    const topDeficitPoints = deficitMap[topDeficitId] || drlDeficit || 0;
    const isDrlDeficit = !isDrlOnTrack || topDeficitPoints > 0;
    const isGpaDeficit = !isGpaOnTrack || gpaDeficit > 0;

    // CASE 0: CHƯA CÓ MÔN HỌC NÀO ĐƯỢC NHẬP
    if (courses.length === 0) {
      return {
        type: 'info',
        title: 'BẮT ĐẦU: CHƯA CÓ DỮ LIỆU MÔN HỌC',
        badge: 'Chưa có môn học',
        text: 'Bạn chưa thêm môn học nào trong học kỳ này. Hãy vào Quản lý GPA để thêm các học phần và điểm quá trình để Smart Planner tính toán kế hoạch ôn thi và rèn luyện chính xác nhất!',
        actionGpaHighlight: true,
        actionDrlHighlight: false,
      };
    }

    // CASE 0B: CẢNH BÁO QUY CHẾ HỌC BỔNG UEH - CÓ HỌC PHẦN BỊ ĐIỂM F
    if (hasFailedCourse) {
      const failedList = courses
        .filter(c => (c.finalScore10 !== null && c.finalScore10 !== undefined && c.finalScore10 < 4.0) || c.gradeLetter === 'F')
        .map(c => c.name);
      return {
        type: 'critical',
        title: 'CẢNH BÁO QUY CHẾ: CÓ HỌC PHẦN BỊ ĐIỂM F',
        badge: 'Quy chế học bổng UEH',
        text: `Theo quy chế UEH, học kỳ có môn bị điểm F (${failedList.join(', ') || 'dưới 4.0'}) sẽ không đủ điều kiện xét học bổng khuyến khích học tập dù GPA/ĐRL cao. Bạn cần ưu tiên đăng ký học lại/học cải thiện môn này.`,
        actionGpaHighlight: true,
        actionDrlHighlight: false,
      };
    }

    // CASE 1: CẢ GPA VÀ ĐRL ĐỀU CHƯA ĐẠT (Ví dụ GPA 1.32 / Mục tiêu 3.80 & ĐRL 65 / Mục tiêu 85)
    if (isGpaDeficit && isDrlDeficit) {
      let gpaDetails = '';
      if (urgentSubject) {
        gpaDetails = `GPA đang thiếu ${gpaDeficit.toFixed(2)} điểm (cần dồn sức ôn thi môn ${urgentSubject.course.name} - mục tiêu ${urgentSubject.requiredFinalScore?.toFixed(1) || '8.0'}đ)`;
      } else if (failingCourse) {
        gpaDetails = `GPA đang thiếu ${gpaDeficit.toFixed(2)} điểm (có môn ${failingCourse.name} dưới 5.0 cần học cải thiện/học lại)`;
      } else if (lowestCourse) {
        gpaDetails = `GPA hiện tại ${currentGPA.toFixed(2)}/${targetGPA.toFixed(2)} (thiếu ${gpaDeficit.toFixed(2)} điểm, ưu tiên gỡ điểm môn ${lowestCourse.name})`;
      } else {
        gpaDetails = `GPA hiện tại ${currentGPA.toFixed(2)}/${targetGPA.toFixed(2)} (thiếu ${gpaDeficit.toFixed(2)} điểm so với mục tiêu)`;
      }

      const drlDetails = `và ĐRL đang thiếu ${topDeficitPoints} điểm (${topDeficitCat?.shortName || 'mục còn thiếu'})`;

      return {
        type: 'critical',
        title: 'CẢNH BÁO TIẾN ĐỘ: GPA & ĐRL CHƯA ĐẠT',
        badge: `Thiếu ${gpaDeficit.toFixed(2)} GPA • Thiếu ${topDeficitPoints}đ ĐRL`,
        text: `${gpaDetails} ${drlDetails}. Cần ưu tiên kế hoạch gỡ điểm GPA và đăng ký hoạt động rèn luyện để đủ chuẩn xét học bổng.`,
        actionGpaHighlight: true,
        actionDrlHighlight: false,
      };
    }

    // CASE 2: CHỈ GPA CHƯA ĐẠT MỤC TIÊU (ĐRL ĐÃ ĐẠT)
    if (isGpaDeficit && !isDrlDeficit) {
      let gpaDetails = '';
      if (urgentSubject) {
        gpaDetails = `GPA đang thiếu ${gpaDeficit.toFixed(2)} điểm so với mục tiêu ${targetGPA.toFixed(2)}. Cần dồn toàn lực ôn thi môn ${urgentSubject.course.name} (cần đạt tối thiểu ${urgentSubject.requiredFinalScore?.toFixed(1)} điểm) để nâng GPA.`;
      } else if (failingCourse) {
        gpaDetails = `GPA đang thiếu ${gpaDeficit.toFixed(2)} điểm (môn ${failingCourse.name} dưới 5.0). Cần lập kế hoạch học lại/học cải thiện môn này để kéo GPA chạm mốc ${targetGPA.toFixed(2)}.`;
      } else if (lowestCourse) {
        gpaDetails = `GPA hiện tại ${currentGPA.toFixed(2)} đang thiếu ${gpaDeficit.toFixed(2)} điểm so với mục tiêu ${targetGPA.toFixed(2)}. Cần tối ưu điểm số môn ${lowestCourse.name} và các học phần kỳ này.`;
      } else {
        gpaDetails = `GPA hiện tại ${currentGPA.toFixed(2)}/${targetGPA.toFixed(2)} (thiếu ${gpaDeficit.toFixed(2)} điểm). Hãy kiểm tra dự báo điểm thi và phân bổ thời gian ôn tập để đạt mục tiêu.`;
      }

      return {
        type: 'gpa_warning',
        title: 'CẢNH BÁO: GPA CHƯA ĐẠT MỤC TIÊU',
        badge: `Thiếu ${gpaDeficit.toFixed(2)} GPA`,
        text: `ĐRL đã hoàn thành chuẩn (${currentDRL}đ), nhưng ${gpaDetails}`,
        actionGpaHighlight: true,
        actionDrlHighlight: false,
      };
    }

    // CASE 3: CHỈ ĐRL CHƯA ĐẠT (GPA ĐÃ ĐẠT)
    if (!isGpaDeficit && isDrlDeficit) {
      return {
        type: 'drl_warning',
        title: 'ƯU TIÊN TUẦN NÀY: BÙ ĐIỂM ĐRL',
        badge: `Thiếu ${topDeficitPoints}đ ĐRL`,
        text: `GPA đã đạt chuẩn (${currentGPA.toFixed(2)}/${targetGPA.toFixed(2)}). Hãy đăng ký hoạt động rèn luyện bổ sung cho ${topDeficitCat?.shortName || 'Mục còn thiếu'} để bù ${topDeficitPoints} điểm ĐRL.`,
        actionGpaHighlight: false,
        actionDrlHighlight: true,
      };
    }

    // CASE 4: CẢ GPA VÀ ĐRL ĐỀU ĐẠT CHUẨN
    return {
      type: 'success',
      title: 'TIẾN ĐỘ TUẦN NÀY: ĐẠT MỤC TIÊU',
      badge: 'Đạt chuẩn học bổng',
      text: `Cả GPA (${currentGPA.toFixed(2)}) và ĐRL (${currentDRL}đ) đều đang bám sát tiến độ xuất sắc. Tiếp tục duy trì để đạt chỉ tiêu học bổng ${scholarship.tier}.`,
      actionGpaHighlight: false,
      actionDrlHighlight: false,
    };
  }, [
    isGpaOnTrack,
    gpaDeficit,
    isDrlOnTrack,
    drlDeficit,
    currentGPA,
    targetGPA,
    currentDRL,
    targetDRL,
    sortedExamTargets,
    courses,
    missingCriteriaIds,
    criteriaList,
    deficitMap,
    scholarship.tier,
    hasFailedCourse,
  ]);

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* 1. BẢNG TỔNG QUAN TIẾN ĐỘ HỌC BỔNG (GPA + ĐRL)                            */}
      {/* ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card hover:border-[#49C8D6]/60 transition-all duration-200 relative overflow-hidden group">
        {/* Background Soft Glows */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-36 h-36 bg-[#F2A900]/10 rounded-full blur-xl pointer-events-none" />

        {/* Header Title */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0B2545] text-[#49C8D6] shadow-2xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B2545]">
                UEH SMART PLANNER
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#0B2545] tracking-tight">
                Kế hoạch học tập & rèn luyện
              </h1>
            </div>
          </div>
        </div>

        {/* 3 Cột: GPA - ĐRL - Tiêu chuẩn học bổng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 relative z-10">
          {/* Cột 1: GPA */}
          <div className="interactive-card-accent group p-4 rounded-xl border border-slate-200/90 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#49C8D6]" />
                  GPA Tích lũy (Hệ 4)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isGpaOnTrack 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-[#FEF7E6] text-[#B27B00] border-[#F2A900]/50'
                }`}>
                  {isGpaOnTrack ? 'Đạt chuẩn' : `Thiếu +${gpaDeficit.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-[#0B2545] group-hover:text-[#49C8D6] transition-colors font-mono tracking-tight">
                  {currentGPA.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">/ Mục tiêu {targetGPA.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#49C8D6] to-[#0B2545] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((currentGPA / targetGPA) * 100))}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2.5 font-medium">
              {isGpaOnTrack ? 'Điểm GPA đang đủ điều kiện xét học bổng.' : `Cần tăng thêm ${gpaDeficit.toFixed(2)} điểm để chạm mốc.`}
            </p>
          </div>

          {/* Cột 2: Điểm Rèn Luyện */}
          <div className="interactive-card-accent group p-4 rounded-xl border border-slate-200/90 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F2A900]" />
                  Điểm rèn luyện
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isDrlOnTrack 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-[#FEF7E6] text-[#B27B00] border-[#F2A900]/50'
                }`}>
                  {isDrlOnTrack ? 'Đạt chuẩn' : `Thiếu ${drlDeficit}đ`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-[#0B2545] group-hover:text-[#F2A900] transition-colors font-mono tracking-tight">
                  {currentDRL}
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">/ Mục tiêu {targetDRL}đ</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#F2A900] to-[#FFBF24] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((currentDRL / targetDRL) * 100))}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2.5 font-medium">
              {isDrlOnTrack ? 'ĐRL đã hoàn thành chỉ tiêu kỳ này.' : `Thiếu ${drlDeficit} điểm để đạt mức rèn luyện mục tiêu.`}
            </p>
          </div>

          {/* Cột 3: Tiêu chuẩn học bổng */}
          <div className="interactive-card-accent group p-4 rounded-xl border border-slate-200/90 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#F2A900]" />
                  Tiêu chuẩn học bổng
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/50 shadow-2xs">
                  {scholarship.tier}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-extrabold text-[#0B2545]">
                  Mục tiêu: {targetScholarshipTier}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                  Yêu cầu: GPA ≥ {tierMinGPA.toFixed(1)} • ĐRL ≥ {tierMinDRL}
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {hasFailedCourse ? 'Bị loại do có môn F' : (isScholarshipEligible ? 'Đủ điều kiện xét duyệt' : 'Chưa đủ điều kiện')}
              </span>
              <span className={`font-bold ${hasFailedCourse ? 'text-rose-700' : isScholarshipEligible ? 'text-emerald-700' : 'text-amber-800'}`}>
                {hasFailedCourse ? 'Quy chế F' : (isScholarshipEligible ? 'Đạt chuẩn' : 'Cần bứt phá')}
              </span>
            </div>
          </div>
        </div>

        {/* Khung lời khuyên hành động & Cảnh báo tiến độ */}
        <div className={`mt-4 p-4 rounded-2xl border shadow-card text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden z-10 ${
          priorityInfo.type === 'critical'
            ? 'bg-gradient-to-r from-[#0B2545] via-[#1a2d48] to-[#0B2545] border-amber-400/50'
            : priorityInfo.type === 'gpa_warning'
            ? 'bg-gradient-to-r from-[#0B2545] via-[#163155] to-[#0B2545] border-amber-400/40'
            : priorityInfo.type === 'drl_warning'
            ? 'bg-gradient-to-r from-[#0B2545] via-[#132E59] to-[#0B2545] border-[#F2A900]/40'
            : 'bg-gradient-to-r from-[#0B2545] via-[#132E59] to-[#0B2545] border-[#49C8D6]/30'
        }`}>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#49C8D6]/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold">
                {priorityInfo.type === 'critical' || priorityInfo.type === 'gpa_warning' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : priorityInfo.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                )}
                <span className={
                  priorityInfo.type === 'critical' || priorityInfo.type === 'gpa_warning'
                    ? 'text-amber-300'
                    : priorityInfo.type === 'success'
                    ? 'text-emerald-300'
                    : 'text-[#49C8D6]'
                }>
                  {priorityInfo.title}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                priorityInfo.type === 'critical' || priorityInfo.type === 'gpa_warning'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : priorityInfo.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#F2A900]/20 text-[#FFBF24] border-[#F2A900]/40'
              }`}>
                {priorityInfo.badge}
              </span>
            </div>
            <p className="text-xs text-slate-100 mt-1.5 leading-relaxed font-medium">
              {priorityInfo.text}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 relative z-10">
            <button 
              onClick={() => setActiveSubTab('gpa')} 
              className={`text-xs font-bold px-3.5 py-1.5 shadow-xs ${
                priorityInfo.actionGpaHighlight
                  ? 'btn-interactive-gold'
                  : 'btn-interactive bg-white/15 hover:bg-white/25 text-white border border-white/25'
              }`}
            >
              <Target className={`w-3.5 h-3.5 ${priorityInfo.actionGpaHighlight ? 'text-slate-900' : 'text-[#49C8D6]'}`} />
              <span>{priorityInfo.actionGpaHighlight ? 'Kế hoạch gỡ GPA' : 'Xem điểm thi'}</span>
            </button>
            <button 
              onClick={() => setActiveSubTab('drl')} 
              className={`text-xs font-bold px-3.5 py-1.5 shadow-xs ${
                priorityInfo.actionDrlHighlight
                  ? 'btn-interactive-gold'
                  : 'btn-interactive bg-white/15 hover:bg-white/25 text-white border border-white/25'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${priorityInfo.actionDrlHighlight ? 'text-slate-900' : 'text-[#F2A900]'}`} />
              <span>Bù điểm ĐRL</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TABS SELECTOR                                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2.5">
        {[
          { id: 'gpa', label: 'Dự báo điểm thi cuối kỳ', icon: Target },
          { id: 'drl', label: 'Bù điểm rèn luyện theo lịch rảnh', icon: Clock },
          { id: 'growth', label: 'Định hướng NCKH & Nghề nghiệp', icon: Compass }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? 'btn-interactive-navy shadow-xs text-white'
                  : 'btn-interactive-outline text-slate-600 hover:text-[#0B2545]'
              }`}
            >
              <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#49C8D6]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: DỰ BÁO ĐIỂM THI CUỐI KỲ CẦN ĐẠT (GPA)                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'gpa' && (
        <div className="space-y-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 relative overflow-hidden group">
            {/* Ambient soft glow */}
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#49C8D6] shadow-2xs">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#0B2545] uppercase tracking-wide">
                    Điểm thi kết thúc học phần cần đạt
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tính toán điểm thi tối thiểu dựa trên điểm quá trình hiện tại để đạt mục tiêu môn học
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('gpa')}
                className="btn-interactive-outline text-xs self-start sm:self-auto font-bold"
              >
                <span>Mở bảng điểm đầy đủ</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B2545]" />
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
                      className="group relative bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-card hover:border-[#49C8D6]/70 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-3 overflow-hidden"
                    >
                      {/* Left Accent Bar on Hover */}
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-transparent group-hover:bg-[#49C8D6] rounded-r transition-colors duration-200" />

                      <div>
                        {/* Course Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#0B2545] transition-colors">{course.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5 font-medium">
                              {course.credits} tín chỉ • <span className="text-[#0B2545] font-semibold">{course.status}</span>
                            </div>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                            status === 'impossible' || status === 'failed'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : status === 'at_risk' || status === 'under_aim'
                                ? 'bg-[#FEF7E6] text-[#B27B00] border-[#F2A900]/50'
                                : status === 'moderate'
                                  ? 'bg-[#E0F7FA] text-[#087F8C] border-[#49C8D6]/40'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {status === 'impossible' && 'Quá tải mục tiêu'}
                            {status === 'failed' && 'Rớt môn (< 5.0)'}
                            {status === 'at_risk' && 'Cần ưu tiên ôn tập'}
                            {status === 'under_aim' && 'Dưới mục tiêu môn'}
                            {status === 'moderate' && 'Vừa sức'}
                            {status === 'safe' && 'An toàn'}
                            {status === 'completed' && 'Đã hoàn tất'}
                          </span>
                        </div>

                        {/* 3 Cột điểm */}
                        <div className="grid grid-cols-3 gap-2 mt-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-center">
                          <div>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                              Quá trình
                            </span>
                            <span className="text-sm font-black text-[#0B2545] font-mono mt-0.5 block">
                              {currentProcessScore !== null ? `${currentProcessScore}/10` : 'Chưa có'}
                            </span>
                          </div>

                          <div className="border-x border-slate-200">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                              Mục tiêu
                            </span>
                            <span className="text-sm font-black text-[#B27B00] font-mono mt-0.5 block">
                              {aimScore.toFixed(1)}/10
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                              Cần thi cuối kỳ
                            </span>
                            <span className={`text-sm font-black font-mono mt-0.5 block ${
                              status === 'failed' || (requiredFinalScore !== null && requiredFinalScore > 10.0)
                                ? 'text-rose-600'
                                : status === 'under_aim' || (requiredFinalScore !== null && requiredFinalScore >= 8.5)
                                  ? 'text-[#B27B00]'
                                  : 'text-emerald-700'
                            }`}>
                              {requiredFinalScore !== null 
                                ? (requiredFinalScore > 10.0 ? `> 10.0đ` : `${requiredFinalScore.toFixed(1)}đ`) 
                                : status === 'failed'
                                  ? 'Không đạt'
                                  : status === 'under_aim'
                                    ? 'Dưới mục tiêu'
                                    : 'Đã xong'}
                            </span>
                          </div>
                        </div>

                        {/* Lời khuyên */}
                        <div className={`mt-3 p-2.5 rounded-xl text-xs leading-relaxed border ${
                          status === 'impossible' || status === 'failed'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : status === 'at_risk' || status === 'under_aim'
                              ? 'bg-[#FEF7E6]/70 border-[#F2A900]/40 text-[#8F6300]'
                              : 'bg-[#E0F7FA]/40 border-[#49C8D6]/30 text-[#0c727d]'
                        }`}>
                          <strong className="font-bold">Ghi chú: </strong>
                          {message}
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleOpenAimModal(course)}
                          className="btn-interactive-outline text-xs px-3 py-1.5 font-bold"
                        >
                          <Sliders className="w-3.5 h-3.5 text-slate-500" />
                          <span>Đổi mục tiêu môn</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('gpa')}
                          className="btn-interactive-gold text-xs px-3 py-1.5 font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-900" />
                          <span>Nhập điểm thành phần</span>
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
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-card p-5 relative overflow-hidden group">
            {/* Ambient soft glow */}
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#49C8D6] shadow-2xs">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#0B2545] uppercase tracking-wide">
                    Tình trạng 5 tiêu chí ĐRL
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tổng ĐRL hiện tại: <strong className="text-[#0B2545] font-bold">{currentDRL}/100đ</strong> • Mục tiêu:{' '}
                    <strong className="text-[#B27B00] font-bold">{targetDRL}đ</strong> ({isDrlOnTrack ? 'Đã đạt chỉ tiêu' : `Còn thiếu ${drlDeficit}đ`})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('drl')}
                className="btn-interactive-outline text-xs self-start sm:self-auto font-bold"
              >
                <span>Mở bảng tiêu chí ĐRL</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B2545]" />
              </button>
            </div>

            {/* 5 Hộp tiêu chí */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {criteriaList.map((crit) => {
                const deficit = deficitMap[crit.id.toString()] || 0;
                const isMax = crit.currentPoints >= crit.maxPoints;
                const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));

                return (
                  <div
                    key={crit.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      deficit > 0
                        ? 'border-[#F2A900]/40 bg-[#FEF7E6]/40 hover:border-[#F2A900]/80 shadow-2xs'
                        : 'border-[#49C8D6]/30 bg-[#E0F7FA]/20 hover:border-[#49C8D6]/70 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded bg-[#0B2545]/10 text-[#0B2545]">
                          Mục {crit.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isMax
                            ? 'bg-[#E0F7FA] text-[#087F8C] border border-[#49C8D6]/40'
                            : 'bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/50'
                        }`}>
                          {isMax ? 'Đã đủ' : `Thiếu ${deficit}đ`}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#0B2545] mt-2 line-clamp-1" title={crit.name}>
                        {crit.shortName}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-black text-[#0B2545] font-mono">
                          {crit.currentPoints} <span className="text-[10px] text-slate-400 font-normal">/ {crit.maxPoints}đ</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isMax 
                              ? 'bg-gradient-to-r from-[#49C8D6] to-[#0B2545]' 
                              : 'bg-gradient-to-r from-[#F2A900] to-[#FFBF24]'
                          }`}
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
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-card p-5 relative overflow-hidden group">
            {/* Ambient soft glow */}
            <div className="absolute left-1/3 -bottom-10 w-36 h-36 bg-[#F2A900]/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#F2A900] shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0B2545] uppercase tracking-wide">
                    Lọc hoạt động theo lịch rảnh
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn ngày và buổi rảnh để tìm hoạt động bù đúng mục tiêu chí còn thiếu
                  </p>
                </div>
              </div>
            </div>

            {/* Điều khiển bộ lọc */}
            <div className="relative z-10 p-3.5 rounded-xl bg-[#0B2545]/[0.02] border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#0B2545] uppercase tracking-wider block mb-1">
                    Ngày rảnh
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6]"
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
                  <label className="text-[11px] font-bold text-[#0B2545] uppercase tracking-wider block mb-1">
                    Buổi trong ngày
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6]"
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
                    className="w-4 h-4 rounded text-[#0B2545] border-slate-300 focus:ring-[#49C8D6] accent-[#0B2545]"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Chỉ hiện hoạt động bù đúng mục còn thiếu ({missingCriteriaIds.map(id => `Mục ${id}`).join(', ') || 'Đã đủ'})
                  </span>
                </label>

                <span className="text-xs text-slate-500">
                  Khớp: <strong className="text-[#0B2545] font-bold">{filteredGapActivities.length}</strong> hoạt động
                </span>
              </div>
            </div>

            {/* Danh sách hoạt động */}
            <div className="relative z-10 mt-4">
              {filteredGapActivities.length === 0 ? (
                <div className="p-8 text-center border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-500">
                  Không tìm thấy hoạt động nào phù hợp với bộ lọc ngày và giờ này.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {filteredGapActivities.slice(0, 8).map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const dayName = act.dayOfWeek === 1 ? 'Thứ 2' : act.dayOfWeek === 2 ? 'Thứ 3' : act.dayOfWeek === 3 ? 'Thứ 4' : act.dayOfWeek === 4 ? 'Thứ 5' : act.dayOfWeek === 5 ? 'Thứ 6' : act.dayOfWeek === 6 ? 'Thứ 7' : 'Chủ Nhật';

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-[#087F8C] bg-[#E0F7FA] font-mono px-1.5 py-0.5 rounded border border-[#49C8D6]/30 font-bold">
                              {act.code}
                            </span>
                            <span className="font-bold text-[#0B2545]">{act.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/40">
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
                                Bù vào: <strong className="text-[#0B2545] font-bold">Mục {alloc.criterionCode}</strong> (+{alloc.points}đ)
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => toggleActivityRegistration(act.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                              isRegistered
                                ? 'btn-interactive-outline text-[#087F8C] border-[#49C8D6]/60 bg-[#E0F7FA]/30'
                                : 'btn-interactive-navy'
                            }`}
                          >
                            {isRegistered ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#087F8C]" />
                                <span>Đã đăng ký</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-white" />
                                <span>Đăng ký tham gia</span>
                              </>
                            )}
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
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4 relative overflow-hidden group">
            {/* Ambient soft glow */}
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#49C8D6] shadow-2xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#0B2545] uppercase tracking-wide">
                    Định hướng NCKH & Nghề nghiệp
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Khoa/Viện của bạn: <strong className="text-[#0B2545] font-bold">{studentFaculty}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6] max-w-[240px]"
                >
                  <option value="Tất cả">Tất cả Khoa / Viện</option>
                  {UEH_FACULTIES.map((fac) => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4 Nhóm định hướng */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? 'btn-interactive-navy shadow-xs text-white'
                        : 'btn-interactive-outline text-slate-700'
                    }`}
                  >
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Danh sách hoạt động */}
            <div className="relative z-10 mt-3">
              {careerGrowthActivities.length === 0 ? (
                <div className="p-8 text-center border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-500">
                  Không tìm thấy hoạt động nào trong nhóm này.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {careerGrowthActivities.slice(0, 8).map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const isFacultyMatch = act.facultyTarget.toLowerCase().includes(studentFaculty.toLowerCase()) ||
                      act.organizer.toLowerCase().includes(studentFaculty.toLowerCase());

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-[#087F8C] bg-[#E0F7FA] font-mono px-1.5 py-0.5 rounded border border-[#49C8D6]/30 font-bold">
                              {act.code}
                            </span>
                            <span className="font-bold text-[#0B2545]">{act.title}</span>
                            {isFacultyMatch && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/40">
                                Đúng chuyên ngành
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#0B2545] bg-[#0B2545]/5 border border-[#0B2545]/10">
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
                              <span key={idx} className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/40">
                            +{act.totalPoints}đ
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleActivityRegistration(act.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                              isRegistered
                                ? 'btn-interactive-outline text-[#087F8C] border-[#49C8D6]/60 bg-[#E0F7FA]/30'
                                : 'btn-interactive-navy'
                            }`}
                          >
                            {isRegistered ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#087F8C]" />
                                <span>Đã đăng ký</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-white" />
                                <span>Đăng ký tham gia</span>
                              </>
                            )}
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Ambient soft glow */}
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#F2A900] shadow-2xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B2545]">
                    Điều chỉnh mục tiêu môn học
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{editingAimCourse.name}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAimCourse(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Input */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B2545]">Mục tiêu điểm hệ 10:</span>
                <span className="text-base font-black text-[#B27B00] font-mono">
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
                className="w-full accent-[#49C8D6] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                <span>5.0 (C)</span>
                <span>7.0 (B)</span>
                <span>8.0 (B+)</span>
                <span>8.5 (A)</span>
                <span>10.0 (A+)</span>
              </div>

              {/* Quick suggestion buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Gợi ý mốc:</span>
                {[
                  { val: 7.0, label: '7.0 (Khá)' },
                  { val: 8.0, label: '8.0 (Giỏi)' },
                  { val: 8.5, label: '8.5 (A)' },
                  { val: 9.0, label: '9.0 (A+)' }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setTempAimScore(preset.val)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      tempAimScore === preset.val
                        ? 'bg-[#0B2545] text-[#49C8D6] shadow-2xs border border-[#0B2545]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
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
                <div className="relative z-10 p-3.5 rounded-xl bg-[#0B2545]/[0.02] border border-slate-200/90 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Quy đổi hệ 4:</span>
                    <strong className="text-[#0B2545] font-bold">
                      {gradeInfo.letter} ({gradeInfo.gpa4.toFixed(1)} / 4.0) - {gradeInfo.description}
                    </strong>
                  </div>

                  {remainingWeight > 0 && reqFinal !== null && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Cần thi cuối kỳ ({remainingWeight}%):</span>
                      <strong className={`font-mono text-sm font-bold ${
                        reqFinal > 10.0
                          ? 'text-rose-600'
                          : reqFinal >= 8.5
                            ? 'text-[#B27B00]'
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
            <div className="relative z-10 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAimCourse(null)}
                className="btn-interactive-outline text-xs px-3.5 py-1.5 font-medium"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAimScore}
                className="btn-ueh text-xs font-semibold px-4 py-1.5"
              >
                <div className="svg-wrapper">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Lưu mục tiêu mới</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
