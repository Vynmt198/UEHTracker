import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateGPAStats, convertScore10ToUEH, evaluateScholarship } from '../../utils/gpaCalculator';
import { Calendar, Clock, MapPin, ArrowRight, Filter, Sliders, X } from 'lucide-react';
import { Mascot } from '../common/Mascot';
import { IconAcademicCap } from '../common/EduIcons';
import { UEH_FACULTIES } from '../../data/uehFaculties';
export const SmartPlanner = ({ isMainView = false }) => {
    const { profile, courses, updateCourse, allActivities, registeredActivityIds, toggleActivityRegistration, getDRLProgress, setActiveTab, selectedSemesterId } = useApp();
    // 3 Sub-tabs State: GPA Planner, DRL Strategy, Career & Growth
    const [activeSubTab, setActiveSubTab] = useState(() => {
        return localStorage.getItem('ueh_tracker_planner_subtab') || 'gpa';
    });
    useEffect(() => {
        localStorage.setItem('ueh_tracker_planner_subtab', activeSubTab);
    }, [activeSubTab]);
    // Tab 1 state: Course selected for Aim adjustment modal
    const [editingAimCourse, setEditingAimCourse] = useState(null);
    const [tempAimScore, setTempAimScore] = useState(8.0);
    // Tab 2 state: Smart Gap Finder
    const [selectedDay, setSelectedDay] = useState(0); // 0 = all, 1 = Thứ 2, ..., 7 = Chủ Nhật
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
    const [onlyDeficitActivities, setOnlyDeficitActivities] = useState(true);
    // Tab 3 state: Career & Growth
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
    // TAB 1 LOGIC: BOTTLENECK COURSES & ADAPTIVE AIM
    // ---------------------------------------------------------------------------
    const currentSemesterCourses = useMemo(() => {
        // Priority: courses in selectedSemesterId or courses marked 'Đang học'
        const inProgress = courses.filter((c) => c.status === 'Đang học');
        if (inProgress.length > 0)
            return inProgress;
        const semCourses = courses.filter((c) => c.semesterId === selectedSemesterId);
        return semCourses.length > 0 ? semCourses : courses;
    }, [courses, selectedSemesterId]);
    const bottleneckAnalysis = useMemo(() => {
        return currentSemesterCourses.map((course) => {
            const components = course.components || [];
            const graded = components.filter((comp) => comp.score !== null && comp.score !== undefined && !isNaN(comp.score));
            const ungraded = components.filter((comp) => comp.score === null || comp.score === undefined || isNaN(comp.score));
            const gradedWeight = graded.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
            const gradedWeightedScore = graded.reduce((sum, c) => sum + (c.score || 0) * ((Number(c.weight) || 0) / 100), 0);
            const remainingWeight = Math.max(0, 100 - gradedWeight);
            const aimScore = course.aimScore10 || 8.0;
            let requiredFinalScore = null;
            let status = 'safe';
            let message = '';
            if (remainingWeight > 0) {
                // Points needed in remaining weight to reach aimScore
                const pointsNeeded = aimScore - gradedWeightedScore;
                const required = Math.round((pointsNeeded / (remainingWeight / 100)) * 10) / 10;
                requiredFinalScore = required;
                if (required > 10.0) {
                    status = 'impossible';
                    message = `Cần ${required.toFixed(1)}đ (> 10.0), điểm quá trình hiện tại khó bảo toàn Aim ${aimScore.toFixed(1)}. Đề xuất hạ Aim.`;
                }
                else if (required <= 0) {
                    status = 'safe';
                    message = `Điểm quá trình đã an toàn (chỉ cần không vắng thi để bảo toàn Aim ${aimScore.toFixed(1)}).`;
                }
                else if (required >= 7.5) {
                    status = 'at_risk';
                    message = `Cần tối thiểu ${required.toFixed(1)} điểm thi kết thúc học phần để bảo toàn mục tiêu Aim ${aimScore.toFixed(1)}.`;
                }
                else {
                    status = 'safe';
                    message = `Cần ${required.toFixed(1)} điểm thi kết thúc học phần để đạt Aim ${aimScore.toFixed(1)}.`;
                }
            }
            else {
                status = 'completed';
                const finalScore = course.finalScore10 ?? gradedWeightedScore;
                message = `Đã hoàn tất điểm học phần: ${finalScore.toFixed(1)}/10.`;
            }
            // Current average process score (normalized to 10)
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
                        : (requiredFinalScore || 0)
            };
        });
    }, [currentSemesterCourses]);
    // Bottleneck subjects sorted by urgency
    const sortedBottlenecks = useMemo(() => {
        return [...bottleneckAnalysis].sort((a, b) => b.urgencyScore - a.urgencyScore);
    }, [bottleneckAnalysis]);
    const topBottlenecks = sortedBottlenecks.slice(0, 2);
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
    // TAB 2 LOGIC: DRL GAP AUDIT & SMART GAP FINDER
    // ---------------------------------------------------------------------------
    const criteriaList = drlProgress.criteriaList;
    const deficitMap = drlProgress.deficitMap || {};
    // Sort criteria by highest deficit
    const sortedDeficitCriteria = useMemo(() => {
        return [...criteriaList].sort((a, b) => {
            const defA = deficitMap[a.id.toString()] || 0;
            const defB = deficitMap[b.id.toString()] || 0;
            return defB - defA;
        });
    }, [criteriaList, deficitMap]);
    // List of criteria IDs that still have deficits
    const missingCriteriaIds = useMemo(() => {
        return Object.entries(deficitMap)
            .filter(([_, def]) => def > 0)
            .map(([id]) => id);
    }, [deficitMap]);
    // Filter activities matching deficit criteria AND selected day & time slot
    const filteredGapActivities = useMemo(() => {
        return allActivities.filter((act) => {
            // 1. Deficit check
            if (onlyDeficitActivities && missingCriteriaIds.length > 0) {
                const matchesMissing = act.allocations.some((alloc) => missingCriteriaIds.some((catId) => alloc.criterionCode.startsWith(catId)));
                if (!matchesMissing)
                    return false;
            }
            // 2. Day check
            if (selectedDay !== 0 && act.dayOfWeek !== selectedDay) {
                return false;
            }
            // 3. Time slot check
            if (selectedTimeSlot !== 'all') {
                const [startHour] = act.startTime.split(':').map(Number);
                if (selectedTimeSlot === 'morning' && (startHour < 7 || startHour >= 12))
                    return false;
                if (selectedTimeSlot === 'afternoon' && (startHour < 12 || startHour >= 17))
                    return false;
                if (selectedTimeSlot === 'evening' && startHour < 17)
                    return false;
            }
            return true;
        });
    }, [allActivities, onlyDeficitActivities, missingCriteriaIds, selectedDay, selectedTimeSlot]);
    // ---------------------------------------------------------------------------
    // TAB 3 LOGIC: CAREER & GROWTH (PROFILE-DRIVEN)
    // ---------------------------------------------------------------------------
    const studentFaculty = profile.faculty || 'Công nghệ thông tin kinh doanh';
    const careerGrowthActivities = useMemo(() => {
        const list = allActivities.filter((a) => {
            // Goal filter
            const matchesGoal = a.goalCategory === selectedGoal;
            // Faculty filter
            const cleanFac = facultyFilter.replace(/^(Khoa|Viện)\s+/i, '').toLowerCase();
            const matchesFaculty = facultyFilter === 'Tất cả' ||
                a.facultyTarget === 'Tất cả' ||
                a.facultyTarget.toLowerCase().includes(cleanFac) ||
                a.organizer.toLowerCase().includes(cleanFac);
            return matchesGoal && matchesFaculty;
        });
        // Profile-driven boost: activities matching student's faculty get priority
        const cleanStudent = studentFaculty.replace(/^(Khoa|Viện)\s+/i, '').toLowerCase();
        return [...list].sort((a, b) => {
            const aMatches = a.facultyTarget.toLowerCase().includes(cleanStudent) ||
                a.organizer.toLowerCase().includes(cleanStudent);
            const bMatches = b.facultyTarget.toLowerCase().includes(cleanStudent) ||
                b.organizer.toLowerCase().includes(cleanStudent);
            if (aMatches && !bMatches)
                return -1;
            if (!aMatches && bMatches)
                return 1;
            return 0;
        });
    }, [allActivities, selectedGoal, facultyFilter, studentFaculty]);
    // ---------------------------------------------------------------------------
    // FOOTER WIDGET: TOP 1 PRIORITY & REMINDER SYNTHESIS
    // ---------------------------------------------------------------------------
    const top1PriorityText = useMemo(() => {
        const urgentSubject = topBottlenecks[0];
        const topDeficitCat = sortedDeficitCriteria[0];
        const topDeficitPoints = deficitMap[topDeficitCat?.id.toString()] || 0;
        if (urgentSubject && topDeficitPoints > 0) {
            return `Tập trung ôn tập môn ${urgentSubject.course.name} (cần thi đạt ${urgentSubject.requiredFinalScore ? urgentSubject.requiredFinalScore.toFixed(1) : '8.0'}đ) và đăng ký hoạt động thuộc ${topDeficitCat.shortName} để bù thâm hụt ${topDeficitPoints}đ.`;
        }
        if (urgentSubject) {
            return `Dồn sức cho kỳ thi kết thúc học phần môn ${urgentSubject.course.name} để bảo toàn mục tiêu GPA ${targetGPA.toFixed(2)}.`;
        }
        if (topDeficitPoints > 0) {
            return `Đăng ký hoạt động rèn luyện bổ sung cho ${topDeficitCat.shortName} để hoàn tất chỉ tiêu ĐRL kỳ này.`;
        }
        return `Phong độ học tập và rèn luyện đang rất tốt. Hãy duy trì và tham gia thêm các hoạt động Định hướng cá nhân để gia tăng trải nghiệm.`;
    }, [topBottlenecks, sortedDeficitCriteria, deficitMap, targetGPA]);
    const registeredCount = registeredActivityIds.length;
    return (<div className="space-y-5">
      {/* ========================================================================= */}
      {/* 1. HEADER & SUB-NAVIGATION BAR */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <IconAcademicCap className="w-5 h-5 text-[#49C8D6]"/>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                UEH SMART PLANNER
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Lộ trình học tập & rèn luyện
              </h1>
            </div>
          </div>

          {/* Clean SaaS Status Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium">Hồ sơ:</span>
            <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {profile.cohort} • {profile.faculty}
            </span>
          </div>
        </div>

        {/* 3 Sub-Tabs Pill Selector (Strictly text-only / clean dot, NO EMOJI) */}
        <div className="pt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'gpa', label: 'Kế hoạch GPA' },
            { id: 'drl', label: 'Chiến lược ĐRL' },
            { id: 'growth', label: 'Định hướng cá nhân' }
        ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (<button key={tab.id} type="button" onClick={() => setActiveSubTab(tab.id)} className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#49C8D6]' : 'bg-slate-400'}`}/>
                <span>{tab.label}</span>
              </button>);
        })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TAB 1: KẾ HOẠCH GPA (GPA PLANNER) */}
      {/* ========================================================================= */}
      {activeSubTab === 'gpa' && (<div className="space-y-4">
          {/* Diagnostic Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* GPA Actual vs Target Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  GPA THỰC TẾ VS MỤC TIÊU
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1.5 ${isGpaOnTrack
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isGpaOnTrack ? 'bg-emerald-500' : 'bg-amber-500'}`}/>
                  {isGpaOnTrack ? 'Đang đúng lộ trình' : `Cần cải thiện +${gpaDeficit.toFixed(2)}đ`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {currentGPA.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ {targetGPA.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#49C8D6] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((currentGPA / targetGPA) * 100))}%` }}/>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {isGpaOnTrack
                ? 'Đã đạt chỉ tiêu điểm số xét học bổng'
                : `Cần nâng thêm ${gpaDeficit.toFixed(2)} điểm hệ 4`}
              </p>
            </div>

            {/* Projected GPA Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  GPA DỰ KIẾN KỲ NÀY
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Dựa trên Aim
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {overallStats.projectedGPA4 > 0 ? overallStats.projectedGPA4.toFixed(2) : targetGPA.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 4.00</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Nếu hoàn thành đúng Aim của các môn đang học kỳ này.
              </p>
            </div>

            {/* Scholarship Assessment Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  TIÊU CHUẨN HỌC BỔNG UEH
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${scholarship.badgeBg}`}>
                  {scholarship.tier}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-slate-900">
                  Mục tiêu: Học bổng {profile.scholarshipTierTarget || 'Xuất sắc'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {scholarship.description}
                </p>
              </div>
            </div>
          </div>

          {/* Mascot Guidance Banner - Pure White with #49C8D6 left border */}
          <div className="p-4 bg-white border border-slate-200/80 border-l-4 border-l-[#49C8D6] rounded-2xl shadow-xs flex items-center gap-4">
            <Mascot pose="inspect" size="md"/>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                {isGpaOnTrack
                ? 'GPA đang trong ngưỡng an toàn mục tiêu'
                : 'Kipo đã phân tích và tìm thấy điểm nghẽn học phần!'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {isGpaOnTrack
                ? 'Tiếp tục duy trì tiến độ thi cuối kỳ để bảo toàn điểm số. Kiểm tra danh sách môn học bên dưới để tối ưu hóa điểm số.'
                : 'Hãy xem kỹ các môn học cần giải cứu bên dưới để tập trung kéo điểm thi kết thúc học phần.'}
              </p>
            </div>
          </div>

          {/* Bottleneck Subjects Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Môn học cần giải cứu & Điều chỉnh Aim
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động tính toán điểm thi kết thúc học phần tối thiểu để bảo toàn mục tiêu
                </p>
              </div>
              <button type="button" onClick={() => setActiveTab('gpa')} className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors">
                <span>Xem toàn bộ bảng điểm</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </div>

            {sortedBottlenecks.length === 0 ? (<div className="text-center py-8 text-xs text-slate-500">
                Chưa có dữ liệu môn học trong học kỳ hiện tại.
              </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedBottlenecks.map(({ course, aimScore, currentProcessScore, requiredFinalScore, status, message }) => {
                    return (<div key={course.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900">{course.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {course.credits} tín chỉ • Trạng thái: {course.status}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${status === 'impossible'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : status === 'at_risk'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {status === 'impossible' && 'Điểm nghẽn nghiêm trọng'}
                            {status === 'at_risk' && 'Cần ưu tiên ôn tập'}
                            {status === 'safe' && 'Đang an toàn'}
                            {status === 'completed' && 'Đã hoàn tất'}
                          </span>
                        </div>

                        {/* Process and Aim badges */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                              ĐIỂM QUÁ TRÌNH
                            </span>
                            <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                              {currentProcessScore !== null ? `${currentProcessScore}/10` : 'Chưa nhập'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                              AIM MỤC TIÊU
                            </span>
                            <span className="text-sm font-bold text-[#007D8C] font-mono mt-0.5 block">
                              {aimScore.toFixed(1)}/10 ({convertScore10ToUEH(aimScore).letter})
                            </span>
                          </div>
                        </div>

                        {/* Proposal Box */}
                        <div className={`mt-3 p-2.5 rounded-lg text-xs leading-relaxed border ${status === 'impossible'
                            ? 'bg-red-50/80 border-red-200 text-red-800'
                            : status === 'at_risk'
                                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'}`}>
                          <strong>Đề xuất Kipo: </strong>
                          {message}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button type="button" onClick={() => handleOpenAimModal(course)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs">
                          <Sliders className="w-3.5 h-3.5 text-slate-500"/>
                          <span>Chỉnh lại Aim môn học</span>
                        </button>

                        <button type="button" onClick={() => setActiveTab('gpa')} className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                          Nhập điểm thành phần
                        </button>
                      </div>
                    </div>);
                })}
              </div>)}
          </div>
        </div>)}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB 2: CHIẾN LƯỢC ĐRL (DRL STRATEGY & GAP AUDIT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'drl' && (<div className="space-y-4">
          {/* Mascot Guidance Banner */}
          <div className="p-4 bg-white border border-slate-200/80 border-l-4 border-l-[#49C8D6] rounded-2xl shadow-xs flex items-center gap-4">
            <Mascot pose="proud" size="md"/>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Chiến lược rèn luyện thông minh: Tránh thừa điểm, bù đúng thâm hụt
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                ĐRL UEH tính trên 5 mục lớn với mức sàn 50 điểm khởi đầu. Hãy kiểm tra các mục còn thiếu điểm bên dưới và lọc hoạt động theo thời gian rảnh của bạn.
              </p>
            </div>
          </div>

          {/* Gap Audit Cards (5 Main Criteria) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Khối Kiểm tra Thâm hụt (Gap Audit 5 Tiêu chí)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tổng điểm hiện có: <strong className="text-slate-800">{currentDRL}/100đ</strong> • Mục tiêu:{' '}
                  <strong className="text-[#007D8C]">{targetDRL}đ</strong> ({isDrlOnTrack ? 'Đạt chuẩn' : `Còn thiếu ${drlDeficit}đ`})
                </p>
              </div>
              <button type="button" onClick={() => setActiveTab('drl')} className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors">
                <span>Xem cây tiêu chí ĐRL</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {criteriaList.map((crit) => {
                const deficit = deficitMap[crit.id.toString()] || 0;
                const isMax = crit.currentPoints >= crit.maxPoints;
                const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));
                return (<div key={crit.id} className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${deficit > 0
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-slate-200 bg-slate-50/50'}`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          Mục {crit.id}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isMax
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {isMax ? 'Đã tối đa' : `Thiếu ${deficit}đ`}
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
                        <span className="text-[10px] text-slate-500 font-mono">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${isMax ? 'bg-emerald-500' : 'bg-[#49C8D6]'}`} style={{ width: `${percent}%` }}/>
                      </div>
                    </div>
                  </div>);
            })}
            </div>
          </div>

          {/* Smart Gap Finder Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Bộ lọc Lấp Thời Gian Rảnh (Smart Gap Finder)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn ngày và khung giờ rảnh trong tuần để tìm hoạt động bù đúng tiêu chí ĐRL đang thâm hụt
              </p>
            </div>

            {/* Filter Controls Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Select Day */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Chọn ngày rảnh trong tuần
                  </label>
                  <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-400">
                    <option value={0}>Tất cả các ngày trong tuần</option>
                    <option value={1}>Thứ 2</option>
                    <option value={2}>Thứ 3</option>
                    <option value={3}>Thứ 4</option>
                    <option value={4}>Thứ 5</option>
                    <option value={5}>Thứ 6</option>
                    <option value={6}>Thứ 7</option>
                    <option value={7}>Chủ Nhật</option>
                  </select>
                </div>

                {/* Select Time Slot */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Khung giờ rảnh
                  </label>
                  <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-400">
                    <option value="all">Tất cả khung giờ (Sáng / Chiều / Tối)</option>
                    <option value="morning">Ca sáng (07:30 - 11:30)</option>
                    <option value="afternoon">Ca chiều (13:30 - 17:00)</option>
                    <option value="evening">Ca tối (18:00 - 21:00)</option>
                  </select>
                </div>
              </div>

              {/* Toggle Deficit Only */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={onlyDeficitActivities} onChange={(e) => setOnlyDeficitActivities(e.target.checked)} className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-0"/>
                  <span className="text-xs text-slate-700 font-medium">
                    Chỉ hiển thị hoạt động bù đúng tiêu chí ĐRL đang thiếu ({missingCriteriaIds.map((id) => `Mục ${id}`).join(', ') || 'Đã đầy'})
                  </span>
                </label>

                <span className="text-xs text-slate-500 font-medium">
                  Khớp: <strong className="text-slate-900">{filteredGapActivities.length}</strong> hoạt động
                </span>
              </div>
            </div>

            {/* Activities Results */}
            <div className="mt-4">
              {filteredGapActivities.length === 0 ? (<div className="p-8 text-center border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-500">
                  Không tìm thấy hoạt động nào phù hợp với bộ lọc ngày và giờ rảnh đã chọn. Hãy thử chuyển sang "Tất cả các ngày" hoặc "Tất cả khung giờ".
                </div>) : (<div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {filteredGapActivities.slice(0, 6).map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const dayName = act.dayOfWeek === 1
                        ? 'Thứ 2'
                        : act.dayOfWeek === 2
                            ? 'Thứ 3'
                            : act.dayOfWeek === 3
                                ? 'Thứ 4'
                                : act.dayOfWeek === 4
                                    ? 'Thứ 5'
                                    : act.dayOfWeek === 5
                                        ? 'Thứ 6'
                                        : act.dayOfWeek === 6
                                            ? 'Thứ 7'
                                            : 'Chủ Nhật';
                    return (<div key={act.id} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-slate-500 bg-slate-100 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                              {act.code}
                            </span>
                            <span className="font-semibold text-slate-900">{act.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              +{act.totalPoints}đ ĐRL
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                            <span>{act.organizer}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400"/>
                              {dayName} ({act.startTime} - {act.endTime})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400"/>
                              {act.location.split('-')[0]}
                            </span>
                          </div>

                          {/* Allocations Breakdown */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {act.allocations.map((alloc, idx) => (<span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                Phân bổ: Mục {alloc.criterionCode} (+{alloc.points}đ)
                              </span>))}
                          </div>
                        </div>

                        <div className="shrink-0 self-end sm:self-center">
                          <button type="button" onClick={() => toggleActivityRegistration(act.id)} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isRegistered
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            : 'bg-[#007D8C] text-white hover:bg-[#006b77] shadow-xs'}`}>
                            {isRegistered ? 'Đã đăng ký' : 'Đăng ký ngay'}
                          </button>
                        </div>
                      </div>);
                })}
                </div>)}
            </div>
          </div>
        </div>)}

      {/* ========================================================================= */}
      {/* 4. SUB-TAB 3: ĐỊNH HƯỚNG CÁ NHÂN (CAREER & GROWTH) */}
      {/* ========================================================================= */}
      {activeSubTab === 'growth' && (<div className="space-y-4">
          {/* Mascot Guidance Banner */}
          <div className="p-4 bg-white border border-slate-200/80 border-l-4 border-l-[#49C8D6] rounded-2xl shadow-xs flex items-center gap-4">
            <Mascot pose="proud" size="md"/>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Định hướng cá nhân: Phát triển toàn diện kỹ năng & chuyên môn
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Dành cho sinh viên khi GPA & ĐRL đã ổn thỏa hoặc muốn mở rộng cơ hội việc làm, nghiên cứu khoa học và kết nối doanh nghiệp.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            {/* Header and Faculty Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Khám phá 4 nhóm định hướng phát triển
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khoa/Viện của bạn: <strong className="text-slate-800">{studentFaculty}</strong> (Tự động ưu tiên hoạt động đúng ngành)
                </p>
              </div>

              {/* Faculty Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400"/>
                <select value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:outline-none focus:border-slate-400 max-w-[240px]">
                  <option value="Tất cả">Tất cả Khoa / Viện</option>
                  {UEH_FACULTIES.map((fac) => (<option key={fac} value={fac}>
                      {fac}
                    </option>))}
                </select>
              </div>
            </div>

            {/* 4 Orientation Pill Selectors (Strictly text-only / clean dot, NO EMOJI) */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'scientific_research', label: 'Nghiên cứu khoa học' },
                { id: 'career', label: 'Nghề nghiệp & Doanh nghiệp' },
                { id: 'soft_skills', label: 'Kỹ năng mềm' },
                { id: 'networking', label: 'Networking & Hoạt động xã hội' }
            ].map((pill) => {
                const isSelected = selectedGoal === pill.id;
                return (<button key={pill.id} type="button" onClick={() => setSelectedGoal(pill.id)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#49C8D6]' : 'bg-slate-400'}`}/>
                    <span>{pill.label}</span>
                  </button>);
            })}
            </div>

            {/* Activities List */}
            <div className="mt-3">
              {careerGrowthActivities.length === 0 ? (<div className="p-8 text-center border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-500">
                  Không tìm thấy hoạt động nào trong nhóm này cho bộ lọc Khoa đã chọn. Hãy chọn "Tất cả Khoa / Viện".
                </div>) : (<div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {careerGrowthActivities.slice(0, 8).map((act) => {
                    const isRegistered = registeredActivityIds.includes(act.id);
                    const isFacultyMatch = act.facultyTarget.toLowerCase().includes(studentFaculty.toLowerCase()) ||
                        act.organizer.toLowerCase().includes(studentFaculty.toLowerCase());
                    return (<div key={act.id} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-slate-500 bg-slate-100 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                              {act.code}
                            </span>
                            <span className="font-semibold text-slate-900">{act.title}</span>
                            {isFacultyMatch && (<span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                                Phù hợp ngành của bạn
                              </span>)}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              {act.facultyTarget}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                            <span>{act.organizer}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400"/>
                              {act.date} ({act.startTime} - {act.endTime})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400"/>
                              {act.location}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-slate-500">
                            {act.tags.map((t, idx) => (<span key={idx} className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                                #{t}
                              </span>))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            +{act.totalPoints}đ
                          </span>
                          <button type="button" onClick={() => toggleActivityRegistration(act.id)} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isRegistered
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'}`}>
                            {isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                          </button>
                        </div>
                      </div>);
                })}
                </div>)}
            </div>
          </div>
        </div>)}

      {/* ========================================================================= */}
      {/* 5. COMMON FOOTER WIDGET: TOP 1 PRIORITY & DEADLINE REMINDER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Card 1: Top 1 Priority */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#007D8C] shrink-0 mt-1.5"/>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ƯU TIÊN SỐ 1 TUẦN NÀY
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {top1PriorityText}
            </p>
          </div>
        </div>

        {/* Card 2: Deadline Reminder */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5"/>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              NHẮC NHỞ HẠN CHÓT & TIẾN ĐỘ
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {registeredCount > 0
            ? `Bạn đang có ${registeredCount} hoạt động đã đăng ký. Hãy kiểm tra thời gian và địa điểm tham gia để hoàn thành điểm danh.`
            : 'Chưa có hoạt động nào được đăng ký tuần này. Hãy chọn các hoạt động thuộc Mục 2 hoặc Mục 3 để bù thâm hụt rèn luyện.'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH LẠI AIM MÔN HỌC (ADAPTIVE AIM) */}
      {/* ========================================================================= */}
      {editingAimCourse && (<div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  ĐIỀU CHỈNH AIM MỤC TIÊU
                </span>
                <h3 className="text-base font-bold text-slate-900">{editingAimCourse.name}</h3>
              </div>
              <button type="button" onClick={() => setEditingAimCourse(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Slider Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Aim điểm hệ 10:</span>
                <span className="text-lg font-bold text-[#007D8C] font-mono">
                  {tempAimScore.toFixed(1)}/10
                </span>
              </div>

              <input type="range" min="5.0" max="10.0" step="0.1" value={tempAimScore} onChange={(e) => setTempAimScore(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#007D8C]"/>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5.0 (C)</span>
                <span>7.0 (B)</span>
                <span>8.0 (B+)</span>
                <span>8.5 (A)</span>
                <span>10.0 (A+)</span>
              </div>
            </div>

            {/* Live Recalculation Preview */}
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
                return (<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Quy đổi hệ 4:</span>
                    <strong className="text-slate-800">
                      {gradeInfo.letter} ({gradeInfo.gpa4.toFixed(1)} / 4.0) - {gradeInfo.description}
                    </strong>
                  </div>

                  {remainingWeight > 0 && reqFinal !== null && (<div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Cần thi cuối kỳ ({remainingWeight}%):</span>
                      <strong className={`font-mono text-sm ${reqFinal > 10.0
                            ? 'text-red-600'
                            : reqFinal >= 7.5
                                ? 'text-amber-600'
                                : 'text-emerald-600'}`}>
                        {reqFinal > 10.0 ? `${reqFinal.toFixed(1)}đ (Quá tải)` : `${reqFinal.toFixed(1)}đ`}
                      </strong>
                    </div>)}
                </div>);
            })()}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setEditingAimCourse(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Hủy
              </button>
              <button type="button" onClick={handleSaveAimScore} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs">
                Lưu mục tiêu mới
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
