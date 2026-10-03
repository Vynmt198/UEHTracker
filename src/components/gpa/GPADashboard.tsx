import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateGPAStats, evaluateScholarship, convertScore10ToUEH } from '../../utils/gpaCalculator';
import { CourseGradeModal } from './CourseGradeModal';
import { SemesterModal } from './SemesterModal';
import { CourseAddModal } from './CourseAddModal';
import { AdaptiveAimBanner } from './AdaptiveAimBanner';
import { Course, CourseStatus, ScoreComponent } from '../../types';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Award,
  TrendingUp,
  Edit3,
  Trash2,
  Calendar
} from 'lucide-react';

export const GPADashboard: React.FC = () => {
  const {
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

  // Active semester & courses
  const currentSemester = semesters.find((s) => s.id === selectedSemesterId) || semesters[0];
  const semesterCourses = courses.filter((c) => c.semesterId === currentSemester?.id);

  // Overall & Semester stats
  const overallStats = calculateGPAStats(courses);
  const semesterStats = calculateGPAStats(semesterCourses);
  const drlProgress = getDRLProgress();
  const scholarship = evaluateScholarship(overallStats.actualGPA4, drlProgress.totalDRL);

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

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards - 60-30-10 & Flattened */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GPA Thực tế Hệ 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              GPA Tích lũy (Hệ 4)
            </span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900">
              {overallStats.actualGPA4 > 0 ? overallStats.actualGPA4.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-500">/ 4.00</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-normal">
            Hệ 10: <span className="text-slate-800 font-medium">{overallStats.actualScore10.toFixed(2)}</span> • {overallStats.completedCredits} TC hoàn thành
          </p>
        </div>

        {/* Card 2: GPA Dự kiến (Projected GPA) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              GPA Dự kiến (Aim)
            </span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#49C8D6]">
              {overallStats.projectedGPA4.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ 4.00</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-normal">
            Kỳ vọng theo {overallStats.totalPlannedCredits} tín chỉ kế hoạch
          </p>
        </div>

        {/* Card 3: Tiến độ Tín chỉ */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Tín chỉ tích lũy
            </span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900">
              {overallStats.completedCredits}
            </span>
            <span className="text-xs text-slate-500">/ 125 TC</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#49C8D6] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (overallStats.completedCredits / 125) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-normal">
            Đã hoàn thành {overallStats.completedCoursesCount}/{overallStats.totalCourses} học phần
          </p>
        </div>

        {/* Card 4: Học bổng UEH */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Học bổng UEH
            </span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-slate-900">{scholarship.tier}</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              ĐRL: {drlProgress.totalDRL}đ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate font-normal" title={scholarship.description}>
            {scholarship.description}
          </p>
        </div>
      </div>

      {/* Adaptive Aim Feedback Banner */}
      <AdaptiveAimBanner courses={semesterCourses} onUpdateAim={handleUpdateAim} />

      {/* Semester Management Header & Tabs (Flattened, no nested cards) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              Quản lý Học kỳ & Bảng điểm
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Định dạng <span className="font-mono text-slate-700">Năm X - HK1 / HK2</span> • Thang điểm chuẩn UEH
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowSemesterModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm học kỳ
            </button>

            <button
              onClick={() => setShowCourseAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6] transition-colors shadow-xs ml-auto sm:ml-0"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm học phần
            </button>
          </div>
        </div>

        {/* Semester tabs bar */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 scrollbar-none">
          {semesters.map((sem) => {
            const isSelected = sem.id === currentSemester?.id;
            const semCourses = courses.filter((c) => c.semesterId === sem.id);
            const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

            return (
              <div
                key={sem.id}
                onClick={() => setSelectedSemesterId(sem.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs cursor-pointer shrink-0 transition-colors flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>
                  {sem.name} <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>({sem.academicYear})</span>
                </span>
                <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  • {semCredits} TC
                </span>

                {semesters.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Xác nhận xóa học kỳ ${sem.name}? Toàn bộ môn học trong kỳ này sẽ bị xóa.`)) {
                        deleteSemester(sem.id);
                      }
                    }}
                    className={`p-0.5 rounded transition-colors ${
                      isSelected ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-red-500'
                    }`}
                    title="Xóa học kỳ này"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Semester Stats Inline Strip */}
        {currentSemester && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 py-1">
            <div className="flex items-center gap-4">
              <span>
                GPA Học kỳ: <strong className="text-slate-900 font-semibold">{semesterStats.actualGPA4 > 0 ? semesterStats.actualGPA4.toFixed(2) : '--'}</strong> (Hệ 4)
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Hệ 10: <strong className="text-slate-900 font-semibold">{semesterStats.actualScore10 > 0 ? semesterStats.actualScore10.toFixed(2) : '--'}</strong>
              </span>
            </div>
            <div className="text-slate-500 font-normal">
              Đã hoàn thành {semesterStats.completedCredits} / {semesterStats.totalPlannedCredits} TC kế hoạch
            </div>
          </div>
        )}

        {/* Courses Table - Clean & Flat */}
        {semesterCourses.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-xl border border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Chưa có học phần nào trong học kỳ này</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
              Thêm môn học và thiết lập bảng đầu điểm để tính toán GPA tự động.
            </p>
            <button
              onClick={() => setShowCourseAddModal(true)}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm học phần
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium">
                    <th className="py-2.5 px-3">Tên học phần</th>
                    <th className="py-2.5 px-2 text-center">Tín chỉ</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3">Đầu điểm thành phần</th>
                    <th className="py-2.5 px-2 text-center">Aim</th>
                    <th className="py-2.5 px-2 text-center">Điểm 10</th>
                    <th className="py-2.5 px-2 text-center">Quy đổi</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {semesterCourses.map((course) => {
                    const uehGrade = convertScore10ToUEH(course.finalScore10);

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Name */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">{course.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            {course.components?.length || 0} thành phần đánh giá
                          </div>
                        </td>

                        {/* Credits */}
                        <td className="py-3 px-2 text-center">
                          <span className="font-medium text-slate-700">{course.credits} TC</span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleStatus(course)}
                            title="Click để đổi nhanh trạng thái"
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                              course.status === 'Đã hoàn thành'
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : course.status === 'Đang học'
                                ? 'bg-slate-50 text-slate-700 border-slate-200'
                                : 'bg-white text-slate-500 border-slate-200'
                            }`}
                          >
                            {course.status}
                          </button>
                        </td>

                        {/* Components Preview */}
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {course.components?.map((comp) => (
                              <span
                                key={comp.id}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-[10px] text-slate-600 border border-slate-200"
                              >
                                <span className="truncate max-w-[65px]">{comp.name}:</span>
                                <span className="font-medium text-slate-800">
                                  {comp.isAbsent ? 'Vắng' : comp.score !== null ? comp.score : '--'}
                                </span>
                                <span className="text-slate-400 font-normal">({comp.weight}%)</span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Aim */}
                        <td className="py-3 px-2 text-center">
                          <span className="font-semibold text-slate-800">
                            {course.aimScore10 ? course.aimScore10.toFixed(1) : '8.0'}
                          </span>
                        </td>

                        {/* Score 10 */}
                        <td className="py-3 px-2 text-center">
                          <span className="text-xs font-semibold text-slate-900">
                            {course.finalScore10 !== null && course.finalScore10 !== undefined
                              ? course.finalScore10.toFixed(1)
                              : '--'}
                          </span>
                        </td>

                        {/* UEH Grade (Letter + 4.0) */}
                        <td className="py-3 px-2 text-center">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="text-xs font-semibold text-slate-900">
                                {uehGrade.letter}
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                {uehGrade.gpa4.toFixed(1)} / 4.0
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveGradeModalCourse(course)}
                              className="px-2 py-1 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
                              title="Quản lý và tính toán điểm thành phần"
                            >
                              Đầu điểm
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Xác nhận xóa môn học ${course.name}?`)) {
                                  deleteCourse(course.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                              title="Xóa môn học này"
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
