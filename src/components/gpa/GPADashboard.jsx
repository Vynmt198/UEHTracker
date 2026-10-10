import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateGPAStats, calculateRequiredGPA, convertScore10ToUEH } from '../../utils/gpaCalculator';
import { CourseGradeModal } from './CourseGradeModal';
import { SemesterModal } from './SemesterModal';
import { CourseAddModal } from './CourseAddModal';
import { Mascot } from '../common/Mascot';
import { GraduationCap, Plus, BookOpen, Target, Edit3, X, Trash2, ChevronRight } from 'lucide-react';
export const GPADashboard = () => {
    const { profile, updateProfile, semesters, selectedSemesterId, setSelectedSemesterId, addSemester, deleteSemester, courses, addCourse, updateCourse, deleteCourse } = useApp();
    const [activeGradeModalCourse, setActiveGradeModalCourse] = useState(null);
    const [showSemesterModal, setShowSemesterModal] = useState(false);
    const [showCourseAddModal, setShowCourseAddModal] = useState(false);
    // Target GPA management (persisted in localStorage with key 'user_target_gpa')
    const [targetGPA, setTargetGPA] = useState(() => {
        const saved = localStorage.getItem('user_target_gpa');
        if (saved !== null && saved !== '') {
            const val = parseFloat(saved);
            return !isNaN(val) ? val : null;
        }
        return profile.targetGPA ?? null;
    });
    const [isEditingTargetGPA, setIsEditingTargetGPA] = useState(false);
    const [tempTargetGPA, setTempTargetGPA] = useState(targetGPA !== null ? targetGPA.toFixed(2) : '3.60');
    // Active semester & courses
    const currentSemester = semesters.find((s) => s.id === selectedSemesterId) || semesters[0];
    const semesterCourses = courses.filter((c) => c.semesterId === currentSemester?.id);
    // Overall & Semester stats
    const overallStats = calculateGPAStats(courses);
    const semesterStats = calculateGPAStats(semesterCourses);
    const totalGradCredits = profile.totalGraduationCredits || 125;
    // GPA cần giữ calculation
    const reqGPAInfo = calculateRequiredGPA(overallStats.completedCredits, overallStats.actualGPA4, targetGPA ?? 3.6, totalGradCredits);
    const handleSaveComponents = (courseId, updatedComponents) => {
        updateCourse(courseId, { components: updatedComponents });
    };
    const handleUpdateAim = (courseId, newAim) => {
        updateCourse(courseId, { aimScore10: newAim });
    };
    const handleToggleStatus = (course) => {
        const nextStatusMap = {
            'Chưa học': 'Đang học',
            'Đang học': 'Đã hoàn thành',
            'Đã hoàn thành': 'Chưa học'
        };
        updateCourse(course.id, { status: nextStatusMap[course.status] });
    };
    const handleSaveTargetGPA = () => {
        const parsed = parseFloat(tempTargetGPA);
        if (!isNaN(parsed) && parsed >= 0.0 && parsed <= 4.0) {
            const rounded = Math.round(parsed * 100) / 100;
            setTargetGPA(rounded);
            localStorage.setItem('user_target_gpa', rounded.toString());
            updateProfile({ targetGPA: rounded });
            setIsEditingTargetGPA(false);
        }
        else {
            alert('Vui lòng nhập GPA mục tiêu hợp lệ từ 0.00 đến 4.00!');
        }
    };
    const handleClearTargetGPA = () => {
        setTargetGPA(null);
        localStorage.removeItem('user_target_gpa');
        updateProfile({ targetGPA: undefined });
        setIsEditingTargetGPA(false);
        setTempTargetGPA('3.60');
    };
    return (<div className="space-y-5">
      {/* 3 Box chỉ số KPI chuẩn hóa thuần túy số liệu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: GPA TÍCH LŨY */}
        <div className="interactive-card-accent group cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
              GPA TÍCH LŨY
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#49C8D6]/40 group-hover:bg-[#49C8D6]/10 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-[#49C8D6] group-hover:scale-110 transition-all duration-300"/>
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
              Hệ 10: <strong className="text-slate-800 font-semibold">{overallStats.actualScore10 > 0 ? overallStats.actualScore10.toFixed(2) : '--'}</strong>
            </span>
            <span>
              GPA cần giữ: <strong className="text-slate-800 font-semibold">{reqGPAInfo.requiredGPA !== null && targetGPA !== null ? reqGPAInfo.requiredGPA.toFixed(2) : '--'}</strong>
            </span>
          </div>
        </div>

        {/* Card 2: TÍN CHỈ TÍCH LŨY */}
        <div className="interactive-card-accent group cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
              TÍN CHỈ TÍCH LŨY
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#49C8D6]/40 group-hover:bg-[#49C8D6]/10 flex items-center justify-center transition-all duration-300 group-hover:-rotate-6">
              <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#49C8D6] group-hover:scale-110 transition-all duration-300"/>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 group-hover:text-[#49C8D6] transition-colors duration-300 tracking-tight">
              {overallStats.completedCredits}
            </span>
            <span className="text-xs text-slate-400">/ {totalGradCredits} TC</span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 group-hover:h-2 rounded-full mt-2.5 overflow-hidden transition-all duration-300">
            <div className="bg-[#49C8D6] h-full rounded-full transition-all duration-500 group-hover:brightness-105" style={{ width: `${Math.min(100, (overallStats.completedCredits / totalGradCredits) * 100)}%` }}/>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Còn lại: <strong className="text-slate-800 font-semibold">{reqGPAInfo.remainingCredits} TC</strong>
            </span>
            <span>
              Tỉ lệ hoàn thành: <strong className="text-slate-800 font-semibold">{Math.round((overallStats.completedCredits / totalGradCredits) * 100)}%</strong>
            </span>
          </div>
        </div>

        {/* Card 3: GPA MỤC TIÊU (Editable) */}
        <div className="interactive-card-accent group">
          {isEditingTargetGPA ? (<div className="flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#49C8D6]"/>
                  GPA MỤC TIÊU
                </span>
                <button type="button" onClick={() => setIsEditingTargetGPA(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </div>

              <div className="flex items-center gap-2 my-1">
                <input type="number" min="0.00" max="4.00" step="0.05" value={tempTargetGPA} onChange={(e) => setTempTargetGPA(e.target.value)} className="w-24 px-2.5 py-1 text-lg font-bold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6]" placeholder="3.80" autoFocus/>
                <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  <button type="button" onClick={handleSaveTargetGPA} className="px-3 py-1 text-xs font-semibold bg-[#49C8D6] text-white rounded-lg hover:bg-[#3db8c6] shadow-xs transition-colors">
                    Lưu
                  </button>
                  <button type="button" onClick={() => setIsEditingTargetGPA(false)} className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    Hủy
                  </button>
                </div>
              </div>

              <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Gợi ý:</span>
                  <button type="button" onClick={() => setTempTargetGPA('3.20')} className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[10px] transition-colors">
                    3.20
                  </button>
                  <button type="button" onClick={() => setTempTargetGPA('3.60')} className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[10px] transition-colors">
                    3.60
                  </button>
                  <button type="button" onClick={() => setTempTargetGPA('3.80')} className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[10px] transition-colors">
                    3.80
                  </button>
                </div>
                {targetGPA !== null && (<button type="button" onClick={handleClearTargetGPA} className="text-red-500 hover:underline text-[10px] font-medium">
                    Bỏ mục tiêu
                  </button>)}
              </div>
            </div>) : (<div className="cursor-pointer" onClick={() => {
                setTempTargetGPA(targetGPA !== null ? targetGPA.toFixed(2) : '3.60');
                setIsEditingTargetGPA(true);
            }}>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#49C8D6] transition-colors"/>
                  GPA MỤC TIÊU
                </span>
                {targetGPA !== null ? (<button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setTempTargetGPA(targetGPA.toFixed(2));
                    setIsEditingTargetGPA(true);
                }} className="text-[11px] font-medium text-slate-400 hover:text-[#007D8C] transition-colors flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-slate-50" title="Chỉnh sửa GPA mục tiêu">
                    <Edit3 className="w-3.5 h-3.5"/>
                    <span>Chỉnh sửa</span>
                  </button>) : (<button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setTempTargetGPA('3.60');
                    setIsEditingTargetGPA(true);
                }} className="text-[11px] font-semibold text-[#007D8C] hover:text-[#49C8D6] transition-colors flex items-center gap-1 py-0.5 px-1.5 rounded bg-cyan-50 border border-cyan-100 hover:bg-cyan-100">
                    <Plus className="w-3 h-3"/>
                    <span>Đặt mục tiêu</span>
                  </button>)}
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-slate-800 group-hover:text-[#49C8D6] transition-colors duration-300 tracking-tight">
                  {targetGPA !== null ? targetGPA.toFixed(2) : '--'}
                </span>
                <span className="text-xs text-slate-400">/ 4.00</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                {targetGPA !== null ? (overallStats.actualGPA4 > 0 ? ((() => {
                const diff = Math.round((targetGPA - overallStats.actualGPA4) * 100) / 100;
                if (diff > 0) {
                    return (<span className="text-amber-600 font-semibold">
                            Cần nâng +{diff.toFixed(2)}đ
                          </span>);
                }
                else if (diff === 0) {
                    return (<span className="text-emerald-600 font-semibold">
                            Đạt mục tiêu (Cần giữ)
                          </span>);
                }
                else {
                    return (<span className="text-emerald-600 font-semibold">
                            Vượt mục tiêu +{Math.abs(diff).toFixed(2)}đ
                          </span>);
                }
            })()) : (<span className="text-slate-500 font-medium">Mục tiêu phấn đấu</span>)) : (<span className="text-slate-400 italic">Chưa đặt mục tiêu cá nhân</span>)}
                <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
              </div>
            </div>)}
        </div>
      </div>

           {/* 4. Tổng quan các học kỳ dạng lưới (Grid 2-3 cột) & Bảng điểm chi tiết */}
      {semesters.length === 0 ? (<div className="bg-white rounded-xl border border-slate-200 shadow-xs py-12 px-4 flex flex-col items-center justify-center text-center">
          <Mascot pose="puzzled" size="lg"/>
          <h3 className="mt-4 font-semibold text-slate-800 text-base">Chưa có học kỳ nào được tạo</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Bấm nút "+ Nhập học kỳ mới" ở góc trên bên phải để Kipo bắt đầu tính toán GPA cho bạn nhé!
          </p>
          <button onClick={() => setShowSemesterModal(true)} className="btn-ueh mt-4 text-xs font-semibold px-4 py-2">
            <div className="svg-wrapper"><Plus className="w-4 h-4"/></div>
            <span>Nhập học kỳ mới</span>
          </button>
        </div>) : (<div className="space-y-4">
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Học kỳ</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {semesters.length} kỳ
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowSemesterModal(true)} className="btn-interactive-outline text-xs">
                <Plus className="w-3.5 h-3.5"/>
                <span>Thêm học kỳ</span>
              </button>
              <button onClick={() => setShowCourseAddModal(true)} className="btn-interactive-primary text-xs">
                <Plus className="w-3.5 h-3.5"/>
                <span>Thêm môn học</span>
              </button>
            </div>
          </div>

          {/* Grid 2 hoặc 3 cột hiển thị từng học kỳ với 3 chỉ số then chốt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {semesters.map((sem) => {
                const isSelected = sem.id === currentSemester?.id;
                const semCourses = courses.filter((c) => c.semesterId === sem.id);
                const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
                const semStats = calculateGPAStats(semCourses);
                const isCompleted = semCourses.length > 0 && semCourses.every((c) => c.status === 'Đã hoàn thành');
                const statusLabel = isCompleted ? 'Đã xong' : 'Đang học';
                return (<div key={sem.id} onClick={() => setSelectedSemesterId(sem.id)} className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${isSelected
                        ? 'bg-white border-[#49C8D6] shadow-xs ring-2 ring-[#49C8D6]/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'}`}>
                  <div>
                    {/* Header Thẻ: Tên kỳ, Niên khóa & Badge Trạng thái */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {sem.name}
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#49C8D6]" />}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-normal">{sem.academicYear}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isCompleted
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-cyan-50 text-[#007D8C] border-cyan-200'}`}>
                          {statusLabel}
                        </span>

                        {semesters.length > 1 && (<button onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Xóa học kỳ ${sem.name}?`)) {
                                deleteSemester(sem.id);
                            }
                        }} className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors" title="Xóa kỳ này">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>)}
                      </div>
                    </div>

                    {/* Chỉ số: Số môn & GPA Học kỳ */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-medium text-slate-400 block">Môn học</span>
                        <div className="text-xs font-bold text-slate-800">
                          {semCourses.length} môn <span className="text-slate-400 font-normal">({semCredits} TC)</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-medium text-slate-400 block">GPA kỳ</span>
                        <div className="text-xs font-bold text-slate-900">
                          {semStats.actualGPA4 > 0 ? (
                            <span className="text-sm font-bold text-slate-900">{semStats.actualGPA4.toFixed(2)}</span>
                          ) : (
                            <span className="text-slate-400 font-normal">--</span>
                          )}
                          <span className="text-[10px] text-slate-400 font-normal"> / 4.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>);
            })}
          </div>

          {/* Bảng chi tiết điểm từng môn của học kỳ đang chọn */}
          {currentSemester && (<div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-colors">
              {/* Header chi tiết học kỳ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-bold text-slate-900 text-sm">{currentSemester.name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{currentSemester.academicYear}</span>
                  <span className="text-slate-300">•</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    GPA: {semesterStats.actualGPA4 > 0 ? semesterStats.actualGPA4.toFixed(2) : '--'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    {semesterStats.totalPlannedCredits} tín chỉ
                  </span>
                </div>

                <button onClick={() => setShowCourseAddModal(true)} className="btn-interactive-primary text-xs shrink-0 self-end sm:self-auto">
                  <Plus className="w-3.5 h-3.5"/>
                  <span>Thêm môn học</span>
                </button>
              </div>

              {semesterCourses.length === 0 ? (<div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
                  <Mascot pose="puzzled" size="md"/>
                  <p className="mt-3 text-xs font-medium text-slate-700">Chưa có môn học nào trong {currentSemester?.name}</p>
                  <button onClick={() => setShowCourseAddModal(true)} className="btn-ueh mt-3 text-xs font-medium px-3.5 py-1.5">
                    <div className="svg-wrapper"><Plus className="w-3.5 h-3.5"/></div>
                    <span>Thêm môn học ngay</span>
                  </button>
                </div>) : (<div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs min-w-[720px]">
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
                        const isFailing = course.finalScore10 !== null &&
                            course.finalScore10 !== undefined &&
                            course.finalScore10 < 5.0;
                        return (<tr key={course.id} 
                        /* Hàng môn học có hiệu ứng hover mượt mà và vạch phát sáng cạnh trái */
                        className="group hover:bg-slate-50/80 transition-all duration-200 relative">
                        {/* STT */}
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Tên môn học kèm Vạch phát sáng cạnh trái (Active Indicator Glow) */}
                        <td className="py-3 px-4 relative">
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-transparent group-hover:bg-[#49C8D6] transition-all duration-200 rounded-r"/>
                          <button onClick={() => setActiveGradeModalCourse(course)} 
                        /* Tên môn học trượt nhẹ và chuyển màu nhấn khi hover */
                        className="text-left font-semibold text-slate-900 group-hover:text-[#49C8D6] group-hover:translate-x-1 transition-all duration-200" title="Bấm để xem & nhập đầu điểm thành phần">
                            {course.name}
                          </button>
                        </td>

                        {/* Số TC */}
                        <td className="py-3 px-3 text-center text-slate-600">
                          {course.credits} TC
                        </td>

                        {/* Trạng thái (Rút gọn Đã hoàn thành -> Hoàn thành) */}
                        <td className="py-3 px-3 text-center">
                          <button onClick={() => handleToggleStatus(course)} title="Bấm để đổi trạng thái" className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-200 hover:scale-105 active:scale-95 ${course.status === 'Đã hoàn thành'
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : course.status === 'Đang học'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-white text-slate-400 border-slate-200'}`}>
                            {course.status === 'Đã hoàn thành' ? 'Hoàn thành' : course.status}
                          </button>
                        </td>

                        {/* Mục tiêu (Aim) */}
                        <td className="py-3.5 px-3 text-center font-medium text-slate-600">
                          {course.aimScore10 ? course.aimScore10.toFixed(1) : '8.0'}
                        </td>

                        {/* Hệ 10 */}
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (<span className={isFailing ? 'text-amber-700 font-bold' : ''}>
                              {course.finalScore10.toFixed(1)}
                            </span>) : (<span className="text-slate-300">--</span>)}
                        </td>

                        {/* Điểm chữ */}
                        <td className="py-3.5 px-3 text-center">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (<span className={`font-semibold ${uehGrade.colorClass}`}>
                              {uehGrade.letter}
                            </span>) : (<span className="text-slate-300">--</span>)}
                        </td>

                        {/* Hệ 4 */}
                        <td className="py-3.5 px-3 text-center">
                          {course.finalScore10 !== null && course.finalScore10 !== undefined ? (<span className="font-semibold text-slate-900 group-hover:text-[#007D8C] transition-colors">
                              {uehGrade.gpa4.toFixed(1)}
                            </span>) : (<span className="text-slate-300">--</span>)}
                        </td>

                        {/* Thao tác (Nút Nhập điểm tự chuyển đổi sang màu #49C8D6 chữ trắng kèm scale) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setActiveGradeModalCourse(course)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:!bg-[#49C8D6] hover:!text-white hover:!border-[#49C8D6] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200">
                              Nhập điểm
                            </button>

                            <button onClick={() => {
                                if (window.confirm(`Xác nhận xóa môn ${course.name}?`)) {
                                    deleteCourse(course.id);
                                }
                            }} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" title="Xóa môn">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </td>
                      </tr>);
                    })}
                </tbody>
                </table>
              </div>
            </div>)}
        </div>)}
    </div>)}

      {/* Modals */}
      {activeGradeModalCourse && (<CourseGradeModal course={activeGradeModalCourse} isOpen={!!activeGradeModalCourse} onClose={() => setActiveGradeModalCourse(null)} onSave={(comps) => handleSaveComponents(activeGradeModalCourse.id, comps)}/>)}

      {showSemesterModal && (<SemesterModal isOpen={showSemesterModal} onClose={() => setShowSemesterModal(false)} onAdd={addSemester}/>)}

      {showCourseAddModal && currentSemester && (<CourseAddModal isOpen={showCourseAddModal} semesterId={currentSemester.id} onClose={() => setShowCourseAddModal(false)} onAdd={addCourse}/>)}
    </div>);
};
