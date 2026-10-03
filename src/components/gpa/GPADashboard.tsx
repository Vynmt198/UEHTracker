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
      {/* 3 Clear Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: GPA Tích lũy */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
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
            Điểm hệ 10: <span className="text-slate-800 font-medium">{overallStats.actualScore10.toFixed(2)}</span>
          </p>
        </div>

        {/* Card 2: Tiến độ Tín chỉ */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
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
        </div>

        {/* Card 3: Học bổng UEH */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Học bổng dự kiến
            </span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-slate-900">{scholarship.tier}</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              ĐRL: {drlProgress.totalDRL}đ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate font-normal">
            {scholarship.description}
          </p>
        </div>
      </div>

      {/* Adaptive Aim Notification (Compact & Dismissible) */}
      <AdaptiveAimBanner courses={semesterCourses} onUpdateAim={handleUpdateAim} />

      {/* Semester Management & Courses Table */}
      <div className="space-y-3 pt-2">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Semester Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {semesters.map((sem) => {
              const isSelected = sem.id === currentSemester?.id;
              const semCourses = courses.filter((c) => c.semesterId === sem.id);
              const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

              return (
                <div
                  key={sem.id}
                  onClick={() => setSelectedSemesterId(sem.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer shrink-0 transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{sem.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    ({semCredits} TC)
                  </span>

                  {semesters.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Xóa học kỳ ${sem.name}?`)) {
                          deleteSemester(sem.id);
                        }
                      }}
                      className={`p-0.5 rounded ${
                        isSelected ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-red-500'
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shrink-0"
              title="Thêm học kỳ mới"
            >
              + Thêm kỳ
            </button>
          </div>

          {/* Action button */}
          <button
            onClick={() => setShowCourseAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6] transition-colors shadow-xs shrink-0 self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm môn học
          </button>
        </div>

        {/* Semester Quick Summary */}
        {currentSemester && (
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 py-1">
            <div className="flex items-center gap-3">
              <span>
                GPA kỳ này: <strong className="text-slate-900 font-semibold">{semesterStats.actualGPA4 > 0 ? semesterStats.actualGPA4.toFixed(2) : '--'}</strong> (Hệ 4)
              </span>
              <span>•</span>
              <span>
                Điểm hệ 10: <strong className="text-slate-900 font-semibold">{semesterStats.actualScore10 > 0 ? semesterStats.actualScore10.toFixed(2) : '--'}</strong>
              </span>
              <span>•</span>
              <span>{semesterStats.totalPlannedCredits} Tín chỉ</span>
            </div>
          </div>
        )}

        {/* Clean, Readable Courses Table */}
        {semesterCourses.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-xl border border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Chưa có môn học trong học kỳ này</p>
            <button
              onClick={() => setShowCourseAddModal(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6]"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm môn học
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium">
                    <th className="py-2.5 px-4">Tên môn học</th>
                    <th className="py-2.5 px-3 text-center">Tín chỉ</th>
                    <th className="py-2.5 px-3 text-center">Trạng thái</th>
                    <th className="py-2.5 px-3 text-center">Mục tiêu (Aim)</th>
                    <th className="py-2.5 px-3 text-center">Điểm hệ 10</th>
                    <th className="py-2.5 px-3 text-center">Quy đổi</th>
                    <th className="py-2.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {semesterCourses.map((course) => {
                    const uehGrade = convertScore10ToUEH(course.finalScore10);

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Course Name */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setActiveGradeModalCourse(course)}
                            className="text-left font-semibold text-slate-900 hover:text-[#49C8D6] transition-colors"
                          >
                            {course.name}
                          </button>
                        </td>

                        {/* Credits */}
                        <td className="py-3 px-3 text-center text-slate-600 font-normal">
                          {course.credits} TC
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(course)}
                            title="Bấm để đổi trạng thái"
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                              course.status === 'Đã hoàn thành'
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : course.status === 'Đang học'
                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            {course.status}
                          </button>
                        </td>

                        {/* Aim */}
                        <td className="py-3 px-3 text-center font-medium text-slate-700">
                          {course.aimScore10 ? course.aimScore10.toFixed(1) : '8.0'}
                        </td>

                        {/* Score 10 */}
                        <td className="py-3 px-3 text-center font-semibold text-slate-900">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined
                            ? course.finalScore10.toFixed(1)
                            : '--'}
                        </td>

                        {/* Converted Grade */}
                        <td className="py-3 px-3 text-center">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                            <span className="font-semibold text-slate-900">
                              {uehGrade.letter}{' '}
                              <span className="text-slate-500 text-[11px] font-normal">({uehGrade.gpa4.toFixed(1)})</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActiveGradeModalCourse(course)}
                              className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              Nhập điểm
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Xác nhận xóa môn ${course.name}?`)) {
                                  deleteCourse(course.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 rounded"
                              title="Xóa môn này"
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
