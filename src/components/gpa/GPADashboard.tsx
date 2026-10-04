import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateGPAStats,
  calculateRequiredGPA,
  evaluateScholarship,
  convertScore10ToUEH
} from '../../utils/gpaCalculator';
import { CourseGradeModal } from './CourseGradeModal';
import { SemesterModal } from './SemesterModal';
import { CourseAddModal } from './CourseAddModal';
import { AdaptiveAimBanner } from './AdaptiveAimBanner';
import { SmartPlanner } from '../planner/SmartPlanner';
import { Mascot } from '../common/Mascot';
import { Course, CourseStatus, ScoreComponent } from '../../types';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  Sliders,
  Trash2,
  Calendar,
  ChevronRight,
  Quote
} from 'lucide-react';

export const GPADashboard: React.FC = () => {
  const {
    profile,
    updateProfile,
    semesters,
    selectedSemesterId,
    setSelectedSemesterId,
    addSemester,
    deleteSemester,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getDRLProgress
  } = useApp();

  const [activeGradeModalCourse, setActiveGradeModalCourse] = useState<Course | null>(null);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showCourseAddModal, setShowCourseAddModal] = useState(false);
  const [isEditingTargetGPA, setIsEditingTargetGPA] = useState(false);
  const [tempTargetGPA, setTempTargetGPA] = useState<string>(
    (profile.targetGPA || 3.6).toString()
  );

  // Active semester & courses
  const currentSemester = semesters.find((s) => s.id === selectedSemesterId) || semesters[0];
  const semesterCourses = courses.filter((c) => c.semesterId === currentSemester?.id);

  // Overall & Semester stats
  const overallStats = calculateGPAStats(courses);
  const semesterStats = calculateGPAStats(semesterCourses);
  const drlProgress = getDRLProgress();
  const scholarship = evaluateScholarship(overallStats.actualGPA4, drlProgress.totalDRL);

  const targetGPA = profile.targetGPA || 3.6;
  const totalGradCredits = profile.totalGraduationCredits || 125;

  // GPA cần giữ calculation
  const reqGPAInfo = calculateRequiredGPA(
    overallStats.completedCredits,
    overallStats.actualGPA4,
    targetGPA,
    totalGradCredits
  );

  const handleSaveComponents = (courseId: string, updatedComponents: ScoreComponent[]) => {
    updateCourse(courseId, { components: updatedComponents });
  };

  const handleUpdateAim = (courseId: string, newAim: number) => {
    updateCourse(courseId, { aimScore10: newAim });
  };

  const handleToggleStatus = (course: Course) => {
    const nextStatusMap: Record<CourseStatus, CourseStatus> = {
      'Chưa học': 'Đang học',
      'Đang học': 'Đã hoàn thành',
      'Đã hoàn thành': 'Chưa học'
    };
    updateCourse(course.id, { status: nextStatusMap[course.status] });
  };

  const handleSaveTargetGPA = () => {
    const parsed = parseFloat(tempTargetGPA);
    if (!isNaN(parsed) && parsed >= 1.0 && parsed <= 4.0) {
      updateProfile({ targetGPA: Math.round(parsed * 100) / 100 });
      setIsEditingTargetGPA(false);
    } else {
      alert('Vui lòng nhập GPA mục tiêu hợp lệ từ 1.0 đến 4.0!');
    }
  };

  return (
    <div className="space-y-5">
      {/* 3 Box chỉ số KPI - Scan-First Minimalist Tool */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: GPA Tích lũy (Hệ 4) */}
        <div className="interactive-card-accent group cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
              GPA TÍCH LŨY
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#49C8D6]/40 group-hover:bg-[#49C8D6]/10 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-[#49C8D6] group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 group-hover:text-[#49C8D6] transition-colors duration-300 tracking-tight">
              {overallStats.actualGPA4 > 0 ? overallStats.actualGPA4.toFixed(2) : '--'}
            </span>
            <span className="text-xs text-slate-400">/ 4.00</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              HỆ 10: <strong className="text-slate-800 font-semibold">{overallStats.actualScore10 > 0 ? overallStats.actualScore10.toFixed(2) : '--'}</strong>
            </span>
            <span>
              CẦN GIỮ: <strong className="text-slate-800 font-semibold">{reqGPAInfo.requiredGPA !== null ? reqGPAInfo.requiredGPA.toFixed(2) : '--'}</strong>
            </span>
          </div>
        </div>

        {/* Card 2: Tiến độ Tín chỉ */}
        <div className="interactive-card-accent group cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
              TÍN CHỈ TÍCH LŨY
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#49C8D6]/40 group-hover:bg-[#49C8D6]/10 flex items-center justify-center transition-all duration-300 group-hover:-rotate-6">
              <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#49C8D6] group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 group-hover:text-[#49C8D6] transition-colors duration-300 tracking-tight">
              {overallStats.completedCredits}
            </span>
            <span className="text-xs text-slate-400">/ {totalGradCredits} TC</span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 group-hover:h-2 rounded-full mt-2.5 overflow-hidden transition-all duration-300">
            <div
              className="bg-[#49C8D6] h-full rounded-full transition-all duration-500 group-hover:brightness-105"
              style={{ width: `${Math.min(100, (overallStats.completedCredits / totalGradCredits) * 100)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              CÒN LẠI: <strong className="text-slate-800 font-semibold">{reqGPAInfo.remainingCredits} TC</strong>
            </span>
            <span className="text-slate-400">
              {Math.round((overallStats.completedCredits / totalGradCredits) * 100)}%
            </span>
          </div>
        </div>

        {/* Card 3: Học bổng UEH */}
        <div className="interactive-card-accent group cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
              HỌC BỔNG DỰ KIẾN
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#49C8D6]/40 group-hover:bg-[#49C8D6]/10 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <Award className="w-4 h-4 text-slate-400 group-hover:text-[#49C8D6] group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 group-hover:text-[#49C8D6] transition-colors duration-300 tracking-tight">
              {scholarship.tier}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              ĐRL {drlProgress.totalDRL}đ
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="truncate" title={scholarship.description}>
              {scholarship.description}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tích hợp Module Trung tâm: 🧠 SMART PLANNER */}
      <SmartPlanner />

      {/* Adaptive Aim Notification Banner (±0.3 rule) kèm [Đổi chiến lược] */}
      <AdaptiveAimBanner courses={semesterCourses} onUpdateAim={handleUpdateAim} />

      {/* 4. Cấu trúc Học kỳ & Bảng điểm động có micro-animations */}
      {semesters.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs py-12 px-4 flex flex-col items-center justify-center text-center">
          <Mascot pose="puzzled" size="lg" />
          <h3 className="mt-4 font-semibold text-slate-800 text-base">Chưa có học kỳ nào được tạo</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Bấm nút "+ Nhập học kỳ mới" ở góc trên bên phải để Kipo bắt đầu tính toán GPA cho bạn nhé!
          </p>
          <button
            onClick={() => setShowSemesterModal(true)}
            className="btn-ueh mt-4 text-xs font-semibold px-4 py-2"
          >
            <div className="svg-wrapper"><Plus className="w-4 h-4" /></div>
            <span>Nhập học kỳ mới</span>
          </button>
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-colors">
        {/* Header: Selector Học kỳ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Danh mục học kỳ UEH
            </span>
            <div className="flex items-center gap-2 mt-1 overflow-x-auto max-w-full pb-1">
              {semesters.map((sem) => {
                const isSelected = sem.id === currentSemester?.id;
                const semCourses = courses.filter((c) => c.semesterId === sem.id);
                const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

                return (
                  <div
                    key={sem.id}
                    onClick={() => setSelectedSemesterId(sem.id)}
                    /* Thẻ chọn học kỳ nâng nhẹ khi hover kèm hiệu ứng co giãn êm ái */
                    className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer shrink-0 transition-all duration-200 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white font-medium shadow-xs scale-102'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-xs'
                    }`}
                  >
                    <span>{sem.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      ({sem.academicYear} • {semCredits} TC)
                    </span>

                    {semesters.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Xóa học kỳ ${sem.name}?`)) {
                            deleteSemester(sem.id);
                          }
                        }}
                        className={`p-0.5 rounded transition-colors ${
                          isSelected ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-red-500'
                        }`}
                        title="Xóa kỳ này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => setShowSemesterModal(true)}
                className="btn-interactive-outline text-xs shrink-0"
                title="Tạo học kỳ mới: Năm X - HK1/HK2 kèm Niên khóa"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm kỳ</span>
              </button>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => setShowCourseAddModal(true)}
            className="btn-interactive-primary text-xs shrink-0 self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm môn học</span>
          </button>
        </div>

        {/* Học kỳ Thông tin chi tiết */}
        {currentSemester && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-slate-900">{currentSemester.name}</span>
              <span className="text-slate-300">•</span>
              <span>NIÊN KHÓA: <strong className="text-slate-700 font-medium">{currentSemester.academicYear}</strong></span>
              <span className="text-slate-300">•</span>
              <span>GPA KỲ: <strong className="text-slate-900 font-semibold">{semesterStats.actualGPA4 > 0 ? semesterStats.actualGPA4.toFixed(2) : '--'}</strong></span>
              <span className="text-slate-300">•</span>
              <span>{semesterStats.totalPlannedCredits} TÍN CHỈ</span>
            </div>
          </div>
        )}

        {semesterCourses.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <Mascot pose="puzzled" size="md" />
            <p className="mt-3 text-xs font-medium text-slate-700">Chưa có môn học nào trong {currentSemester?.name}</p>
            <button
              onClick={() => setShowCourseAddModal(true)}
              className="btn-ueh mt-3 text-xs font-medium px-3.5 py-1.5"
            >
              <div className="svg-wrapper"><Plus className="w-3.5 h-3.5" /></div>
              <span>Thêm môn học ngay</span>
            </button>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-4">MÔN HỌC</th>
                    <th className="py-2.5 px-3 text-center w-20">TÍN CHỈ</th>
                    <th className="py-2.5 px-3 text-center w-24">TRẠNG THÁI</th>
                    <th className="py-2.5 px-3 text-center w-24">MỤC TIÊU</th>
                    <th className="py-2.5 px-3 text-center w-20">HỆ 10</th>
                    <th className="py-2.5 px-3 text-center w-20">ĐIỂM CHỮ</th>
                    <th className="py-2.5 px-3 text-center w-20">HỆ 4</th>
                    <th className="py-2.5 px-4 text-right w-28">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {semesterCourses.map((course, idx) => {
                    const uehGrade = convertScore10ToUEH(course.finalScore10);
                    const isFailing =
                      course.finalScore10 !== null &&
                      course.finalScore10 !== undefined &&
                      course.finalScore10 < 5.0;

                    return (
                      <tr
                        key={course.id}
                        /* Hàng môn học có hiệu ứng hover mượt mà và vạch phát sáng cạnh trái */
                        className="group hover:bg-slate-50/80 transition-all duration-200 relative"
                      >
                        {/* STT */}
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Tên môn học kèm Vạch phát sáng cạnh trái (Active Indicator Glow) */}
                        <td className="py-3 px-4 relative">
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-transparent group-hover:bg-[#49C8D6] transition-all duration-200 rounded-r" />
                          <button
                            onClick={() => setActiveGradeModalCourse(course)}
                            /* Tên môn học trượt nhẹ và chuyển màu nhấn khi hover */
                            className="text-left font-semibold text-slate-900 group-hover:text-[#49C8D6] group-hover:translate-x-1 transition-all duration-200"
                            title="Bấm để xem & nhập đầu điểm thành phần"
                          >
                            {course.name}
                          </button>
                        </td>

                        {/* Số TC */}
                        <td className="py-3 px-3 text-center text-slate-600">
                          {course.credits} TC
                        </td>

                        {/* Trạng thái (Rút gọn Đã hoàn thành -> Hoàn thành) */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(course)}
                            title="Bấm để đổi trạng thái"
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-200 hover:scale-105 active:scale-95 ${
                              course.status === 'Đã hoàn thành'
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : course.status === 'Đang học'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            {course.status === 'Đã hoàn thành' ? 'Hoàn thành' : course.status}
                          </button>
                        </td>

                        {/* Mục tiêu (Aim) */}
                        <td className="py-3.5 px-3 text-center font-medium text-slate-600">
                          {course.aimScore10 ? course.aimScore10.toFixed(1) : '8.0'}
                        </td>

                        {/* Hệ 10 */}
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                            <span className={isFailing ? 'text-amber-700 font-bold' : ''}>
                              {course.finalScore10.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        {/* Điểm chữ */}
                        <td className="py-3.5 px-3 text-center">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                            <span className={`font-semibold ${uehGrade.colorClass}`}>
                              {uehGrade.letter}
                            </span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        {/* Hệ 4 */}
                        <td className="py-3.5 px-3 text-center">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                            <span className="font-semibold text-slate-900 group-hover:text-[#007D8C] transition-colors">
                              {uehGrade.gpa4.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        {/* Thao tác (Nút Nhập điểm tự chuyển đổi sang màu #49C8D6 chữ trắng kèm scale) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveGradeModalCourse(course)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:!bg-[#49C8D6] hover:!text-white hover:!border-[#49C8D6] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              Nhập điểm
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Xác nhận xóa môn ${course.name}?`)) {
                                  deleteCourse(course.id);
                                }
                              }}
                              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                              title="Xóa môn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Modals */}
      {activeGradeModalCourse && (
        <CourseGradeModal
          course={activeGradeModalCourse}
          isOpen={!!activeGradeModalCourse}
          onClose={() => setActiveGradeModalCourse(null)}
          onSave={(comps) => handleSaveComponents(activeGradeModalCourse.id, comps)}
        />
      )}

      {showSemesterModal && (
        <SemesterModal
          isOpen={showSemesterModal}
          onClose={() => setShowSemesterModal(false)}
          onAdd={addSemester}
        />
      )}

      {showCourseAddModal && currentSemester && (
        <CourseAddModal
          isOpen={showCourseAddModal}
          semesterId={currentSemester.id}
          onClose={() => setShowCourseAddModal(false)}
          onAdd={addCourse}
        />
      )}
    </div>
  );
};
