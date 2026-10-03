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
  Sparkles,
  Plus,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  Calendar,
  AlertCircle
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
      {/* Top Banner: Welcome & Executive Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GPA Thực tế Hệ 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">GPA Tích lũy (Hệ 4)</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8FAFC] text-[#008899] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {overallStats.actualGPA4 > 0 ? overallStats.actualGPA4.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 4.00</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <span>Hệ 10:</span>
            <strong className="text-slate-700">{overallStats.actualScore10.toFixed(2)}</strong>
            <span>• {overallStats.completedCredits} TC hoàn thành</span>
          </p>
        </div>

        {/* Card 2: GPA Dự kiến (Projected GPA) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100/30 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#007D8C]">
              GPA Dự kiến (Aim)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#29B3C2]">
              {overallStats.projectedGPA4.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 4.00</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Phóng chiếu cùng {overallStats.totalPlannedCredits} tín chỉ kế hoạch
          </p>
        </div>

        {/* Card 3: Tiến độ Tín chỉ */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tín chỉ học tập</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {overallStats.completedCredits}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 125 TC</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#29B3C2] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (overallStats.completedCredits / 125) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Đã hoàn thành {overallStats.completedCoursesCount}/{overallStats.totalCourses} học phần
          </p>
        </div>

        {/* Card 4: Học bổng Khuyến khích UEH */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Học bổng UEH</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">{scholarship.tier}</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${scholarship.badgeBg}`}
            >
              ĐRL: {drlProgress.totalDRL}đ
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate font-medium" title={scholarship.description}>
            {scholarship.description}
          </p>
        </div>
      </div>

      {/* Adaptive Aim Feedback Banner */}
      <AdaptiveAimBanner courses={semesterCourses} onUpdateAim={handleUpdateAim} />

      {/* Semester Management Header & Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#29B3C2]" />
              Quản lý Học kỳ & Bảng điểm chi tiết
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tạo học kỳ theo format <code className="font-mono text-[#007D8C]">Năm X - HK1 / HK2</code>, quản trị đầu điểm động và quy đổi UEH.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowSemesterModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm học kỳ
            </button>

            <button
              onClick={() => setShowCourseAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#29B3C2] hover:bg-[#209aa8] shadow-md shadow-cyan-500/20 transition-all ml-auto sm:ml-0"
            >
              <Plus className="w-4 h-4" /> Thêm học phần
            </button>
          </div>
        </div>

        {/* Semester selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {semesters.map((sem) => {
            const isSelected = sem.id === currentSemester?.id;
            const semCourses = courses.filter((c) => c.semesterId === sem.id);
            const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

            return (
              <div
                key={sem.id}
                onClick={() => setSelectedSemesterId(sem.id)}
                className={`px-4 py-2.5 rounded-2xl border cursor-pointer shrink-0 transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#29B3C2] bg-[#E8FAFC] text-[#007D8C] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{sem.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({sem.academicYear})</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {semCourses.length} môn • {semCredits} tín chỉ
                  </div>
                </div>

                {semesters.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Xác nhận xóa học kỳ ${sem.name}? Toàn bộ môn học trong kỳ này sẽ bị xóa.`)) {
                        deleteSemester(sem.id);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors"
                    title="Xóa học kỳ này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Semester Summary Row */}
        {currentSemester && (
          <div className="bg-slate-50/80 rounded-2xl p-4 mb-4 border border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-700">Thống kê {currentSemester.name}:</span>
              <span className="text-slate-600">
                GPA Học kỳ (Hệ 4):{' '}
                <strong className="text-[#007D8C] font-black text-sm">
                  {semesterStats.actualGPA4 > 0 ? semesterStats.actualGPA4.toFixed(2) : '--'}
                </strong>
              </span>
              <span className="text-slate-600">
                Hệ 10:{' '}
                <strong className="text-slate-800 font-bold">
                  {semesterStats.actualScore10 > 0 ? semesterStats.actualScore10.toFixed(2) : '--'}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span>Hoàn thành: {semesterStats.completedCredits} TC</span>
              <span>•</span>
              <span>Tổng kế hoạch: {semesterStats.totalPlannedCredits} TC</span>
            </div>
          </div>
        )}

        {/* Courses Table / List */}
        {semesterCourses.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Chưa có học phần nào trong học kỳ này</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Bắt đầu bằng việc thêm môn học và cấu hình bảng đầu điểm để hệ thống tính toán GPA tự động.
            </p>
            <button
              onClick={() => setShowCourseAddModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#29B3C2] hover:bg-[#209aa8] shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" /> Thêm học phần đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Tên học phần</th>
                  <th className="py-3 px-2 text-center">Tín chỉ</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3">Cột điểm thành phần & Trọng số</th>
                  <th className="py-3 px-2 text-center">Aim (10)</th>
                  <th className="py-3 px-2 text-center">Tổng kết (10)</th>
                  <th className="py-3 px-2 text-center">Quy đổi UEH</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {semesterCourses.map((course) => {
                  const uehGrade = convertScore10ToUEH(course.finalScore10);

                  return (
                    <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800 text-sm">{course.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {course.components?.length || 0} đầu điểm đánh giá
                        </div>
                      </td>

                      {/* Credits */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 font-bold text-slate-700">
                          {course.credits} TC
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleStatus(course)}
                          title="Click để đổi nhanh trạng thái"
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            course.status === 'Đã hoàn thành'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : course.status === 'Đang học'
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {course.status}
                        </button>
                      </td>

                      {/* Components Preview */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {course.components?.map((comp) => (
                            <span
                              key={comp.id}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium border border-slate-200/60"
                              title={`${comp.name}: ${comp.score !== null ? comp.score : 'Chưa có'} (${comp.weight}%)`}
                            >
                              <span className="truncate max-w-[70px]">{comp.name}:</span>
                              <strong className={comp.score !== null ? 'text-slate-800' : 'text-slate-400'}>
                                {comp.isAbsent ? 'Vắng' : comp.score !== null ? comp.score : '--'}
                              </strong>
                              <span className="text-[9px] text-slate-400">({comp.weight}%)</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Aim */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="font-extrabold text-[#007D8C]">
                          {course.aimScore10 ? course.aimScore10.toFixed(1) : '8.0'}
                        </span>
                      </td>

                      {/* Score 10 */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="text-sm font-black text-slate-800">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined
                            ? course.finalScore10.toFixed(1)
                            : '--'}
                        </span>
                      </td>

                      {/* UEH Grade (Letter + 4.0) */}
                      <td className="py-3.5 px-2 text-center">
                        {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                          <div className="inline-flex flex-col items-center">
                            <span className={`text-xs font-black ${uehGrade.colorClass}`}>
                              {uehGrade.letter}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {uehGrade.gpa4.toFixed(1)} / 4.0
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-bold">--</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveGradeModalCourse(course)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#007D8C] bg-[#E8FAFC] hover:bg-cyan-100 transition-colors"
                            title="Quản lý và tính toán điểm thành phần"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Đầu điểm</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Xác nhận xóa môn học ${course.name}?`)) {
                                deleteCourse(course.id);
                              }
                            }}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
