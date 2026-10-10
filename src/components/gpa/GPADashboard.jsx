import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateGPAStats, calculateRequiredGPA, convertScore10ToUEH } from '../../utils/gpaCalculator';
import { CourseGradeModal } from './CourseGradeModal';
import { SemesterModal } from './SemesterModal';
import { CourseAddModal } from './CourseAddModal';
import { Mascot } from '../common/Mascot';
import { GraduationCap, Plus, BookOpen, Target, Edit3, X, Trash2, TrendingUp, Award } from 'lucide-react';
import { 
    IconAcademicCap, 
    IconGPABook, 
    IconDRLMedal, 
    IconTrophy, 
    IconEditPen, 
    IconMilestone, 
    IconTargetAim, 
    IconCheckShield, 
    IconProgressRing, 
    IconQuoteMark, 
    IconCompass, 
    IconCareerBag, 
    IconSkillSpark 
} from '../common/EduIcons';

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

    // Required GPA calculation
    const reqGPAInfo = calculateRequiredGPA(overallStats.completedCredits, overallStats.actualGPA4, targetGPA ?? 3.6, totalGradCredits);

    // Dynamic Title Badge based on GPA
    const getGPABadge = (gpa) => {
        if (!gpa || gpa <= 0) return { label: 'Khởi đầu học kỳ', icon: IconAcademicCap, color: 'bg-slate-100 text-slate-700 border-slate-200' };
        if (gpa >= 3.6) return { label: 'Học bổng Xuất sắc UEH', icon: IconTrophy, color: 'bg-[#FEF7E6] text-[#B27B00] border-[#F2A900]/50 shadow-xs' };
        if (gpa >= 3.2) return { label: 'Hạng Học lực Giỏi', icon: IconSkillSpark, color: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs' };
        if (gpa >= 2.5) return { label: 'Tiến độ Vững vàng', icon: IconCheckShield, color: 'bg-cyan-50 text-[#0c727d] border-cyan-200' };
        return { label: 'Cần Bứt phá Điểm số', icon: IconTargetAim, color: 'bg-amber-50 text-amber-800 border-amber-200' };
    };

    const gpaBadge = getGPABadge(overallStats.actualGPA4);
    const GPABadgeIcon = gpaBadge.icon;

    // Motivational quote (Professional, inspiring academic tone)
    const getMotivationalQuote = () => {
        const firstName = profile.name ? profile.name.trim().split(' ').pop() : 'bạn';
        if (overallStats.actualGPA4 >= 3.6) {
            return `Phong độ học tập xuất sắc lắm ${firstName}! Tiêu chuẩn học bổng UEH đang duy trì rất vững chắc.`;
        }
        if (targetGPA !== null && overallStats.actualGPA4 > 0) {
            const gap = targetGPA - overallStats.actualGPA4;
            if (gap > 0) {
                return `Còn ${gap.toFixed(2)} điểm nữa để chạm mốc mục tiêu ${targetGPA.toFixed(2)}. Tiếp tục bứt phá nhé ${firstName}!`;
            }
            return `Tuyệt vời! Bạn đã vượt mục tiêu đề ra cho chặng này. Giữ vững nhịp độ này nhé ${firstName}!`;
        }
        return `Kế hoạch học tập rõ ràng là chìa khóa thành công. Chúc ${firstName} một kỳ học đạt kết quả cao nhất!`;
    };

    // Calculate Sparkline points across all semesters
    const semesterGPAs = semesters.map((s) => {
        const sCourses = courses.filter((c) => c.semesterId === s.id);
        const sStats = calculateGPAStats(sCourses);
        return { name: s.name, gpa: sStats.actualGPA4 };
    });

    // Milestone SVG icon suite map
    const milestoneIconList = [IconGPABook, IconAcademicCap, IconTargetAim, IconCompass, IconCareerBag, IconTrophy, IconCheckShield];

    const handleSaveComponents = (courseId, updatedComponents) => {
        updateCourse(courseId, { components: updatedComponents });
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
        } else {
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

    // Circular Progress percentage (out of 4.0)
    const progressPercent = Math.min(100, Math.max(0, (overallStats.actualGPA4 / 4.0) * 100));
    const strokeDashoffset = 283 - (283 * progressPercent) / 100;

    return (
        <div className="space-y-6">
            {/* 1. BẢNG ĐIỀU KHIỂN THÀNH TÍCH (GAMIFIED HERO DASHBOARD) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Hero Card Lớn: GPA TÍCH LŨY + VÒNG TIẾN TRÌNH + SPARKLINE (7 cols) */}
                <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card hover:border-[#49C8D6]/60 transition-all duration-200 relative overflow-hidden group">
                    {/* Background Soft Glows */}
                    <div className="absolute -right-12 -top-12 w-44 h-44 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute left-1/3 -bottom-10 w-36 h-36 bg-[#F2A900]/10 rounded-full blur-xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Top: Header & Dynamic Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#49C8D6] shadow-2xs">
                                    <Award className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B2545]">
                                        BẢNG ĐIỀU KHIỂN THÀNH TÍCH UEH
                                    </span>
                                    <span className="block text-[10px] text-slate-400 font-medium">
                                        Quy chuẩn thang điểm 4.0 & Hệ 10
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Achievement Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${gpaBadge.color}`}>
                                <GPABadgeIcon className="w-3.5 h-3.5 shrink-0" />
                                {gpaBadge.label}
                            </span>
                        </div>

                        {/* Middle: Circular Progress Ring & Numbers & Sparkline */}
                        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            {/* Circular Progress Ring */}
                            <div className="relative flex items-center justify-center shrink-0">
                                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Background Track */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="transparent"
                                        stroke="#E2E8F0"
                                        strokeWidth="8"
                                    />
                                    {/* Gradient Definition */}
                                    <defs>
                                        <linearGradient id="uehGpaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#49C8D6" />
                                            <stop offset="100%" stopColor="#F2A900" />
                                        </linearGradient>
                                    </defs>
                                    {/* Progress Arc */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="transparent"
                                        stroke="url(#uehGpaGradient)"
                                        strokeWidth="8"
                                        strokeDasharray="283"
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-700 ease-out"
                                    />
                                </svg>

                                {/* Center Value */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight leading-none">
                                        {overallStats.actualGPA4 > 0 ? overallStats.actualGPA4.toFixed(2) : '--'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">/ 4.00</span>
                                </div>
                            </div>

                            {/* Details & Sparkline Chart */}
                            <div className="flex-1 w-full space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <span className="text-[10px] font-semibold text-slate-500 block">Hệ 10 Quy Đổi</span>
                                        <span className="text-base font-bold text-[#0B2545]">
                                            {overallStats.actualScore10 > 0 ? overallStats.actualScore10.toFixed(2) : '--'}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <span className="text-[10px] font-semibold text-slate-500 block">GPA Cần Giữ</span>
                                        <span className="text-base font-bold text-[#F2A900]">
                                            {reqGPAInfo.requiredGPA !== null && targetGPA !== null ? reqGPAInfo.requiredGPA.toFixed(2) : '--'}
                                        </span>
                                    </div>
                                </div>

                                {/* Sparkline Xu hướng GPA qua các kỳ */}
                                <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-1.5">
                                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                                            <TrendingUp className="w-3 h-3 text-[#49C8D6]" />
                                            Xu hướng tăng trưởng ({semesters.length} kỳ)
                                        </span>
                                        <span className="text-slate-400">
                                            {overallStats.completedCredits} TC hoàn thành
                                        </span>
                                    </div>

                                    {/* Mini SVG Sparkline */}
                                    <div className="h-8 w-full flex items-end gap-1.5 pt-1">
                                        {semesterGPAs.map((item, idx) => {
                                            const heightPct = item.gpa > 0 ? Math.max(15, (item.gpa / 4.0) * 100) : 10;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group/bar" title={`${item.name}: ${item.gpa > 0 ? item.gpa.toFixed(2) : '--'}`}>
                                                    <div 
                                                        className="w-full rounded-t transition-all duration-300 group-hover/bar:brightness-110"
                                                        style={{ 
                                                            height: `${heightPct}%`, 
                                                            background: item.gpa >= 3.6 ? '#F2A900' : item.gpa >= 3.0 ? '#49C8D6' : '#94A3B8'
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Student Cheer Quote with Custom Quote Icon */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                            <IconQuoteMark className="w-4 h-4 text-[#49C8D6] shrink-0" />
                            <span className="truncate italic">"{getMotivationalQuote()}"</span>
                        </div>
                    </div>
                </div>

                {/* Sub Cards (5 cols): Tín chỉ & Mục tiêu */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* Card Tín chỉ tích lũy */}
                    <div className="interactive-card-accent group cursor-pointer flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between text-slate-500 mb-2">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 group-hover:text-[#0B2545] transition-colors">
                                    TÍN CHỈ TÍCH LŨY (HÀNH TRÌNH)
                                </span>
                                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-[#49C8D6]/40 group-hover:bg-cyan-50/50 flex items-center justify-center transition-all duration-300">
                                    <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#49C8D6] transition-colors"/>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-extrabold text-[#0B2545] group-hover:text-[#49C8D6] transition-colors duration-300 tracking-tight">
                                    {overallStats.completedCredits}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">/ {totalGradCredits} TC</span>
                            </div>

                            {/* Progress bar gradient */}
                            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-[#49C8D6] to-[#0B2545] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (overallStats.completedCredits / totalGradCredits) * 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                            <span>
                                Còn lại: <strong className="text-[#0B2545] font-bold">{reqGPAInfo.remainingCredits} TC</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700">
                                {Math.round((overallStats.completedCredits / totalGradCredits) * 100)}% hoàn thành
                            </span>
                        </div>
                    </div>

                    {/* Card GPA Mục tiêu (Editable) */}
                    <div className="interactive-card-accent group flex-1 flex flex-col justify-between">
                        {isEditingTargetGPA ? (
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                        <Target className="w-3.5 h-3.5 text-[#F2A900]"/>
                                        GPA MỤC TIÊU PHẤN ĐẤU
                                    </span>
                                    <button type="button" onClick={() => setIsEditingTargetGPA(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors">
                                        <X className="w-3.5 h-3.5"/>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 my-1">
                                    <input 
                                        type="number" 
                                        min="0.00" 
                                        max="4.00" 
                                        step="0.05" 
                                        value={tempTargetGPA} 
                                        onChange={(e) => setTempTargetGPA(e.target.value)} 
                                        className="w-24 px-2.5 py-1 text-lg font-bold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6]" 
                                        placeholder="3.80" 
                                        autoFocus
                                    />
                                    <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        <button type="button" onClick={handleSaveTargetGPA} className="btn-interactive-gold text-xs px-3 py-1 font-bold">
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
                                        {['3.20', '3.60', '3.80'].map((val) => (
                                            <button key={val} type="button" onClick={() => setTempTargetGPA(val)} className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-colors">
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                    {targetGPA !== null && (
                                        <button type="button" onClick={handleClearTargetGPA} className="text-red-500 hover:underline text-[10px] font-medium">
                                            Bỏ mục tiêu
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="cursor-pointer" onClick={() => {
                                setTempTargetGPA(targetGPA !== null ? targetGPA.toFixed(2) : '3.60');
                                setIsEditingTargetGPA(true);
                            }}>
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 group-hover:text-[#0B2545] transition-colors flex items-center gap-1.5">
                                        <Target className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F2A900] transition-colors"/>
                                        MỤC TIÊU PHẤN ĐẤU
                                    </span>
                                    {targetGPA !== null ? (
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            setTempTargetGPA(targetGPA.toFixed(2));
                                            setIsEditingTargetGPA(true);
                                        }} className="text-[11px] font-semibold text-slate-500 hover:text-[#0B2545] transition-colors flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-slate-100">
                                            <Edit3 className="w-3.5 h-3.5"/>
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    ) : (
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            setTempTargetGPA('3.60');
                                            setIsEditingTargetGPA(true);
                                        }} className="text-[11px] font-bold text-slate-900 bg-[#F2A900] hover:bg-[#FFBF24] transition-colors flex items-center gap-1 py-0.5 px-2 rounded-lg shadow-2xs">
                                            <Plus className="w-3 h-3"/>
                                            <span>Đặt mục tiêu</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-3xl font-extrabold text-[#0B2545] group-hover:text-[#F2A900] transition-colors duration-300 tracking-tight">
                                        {targetGPA !== null ? targetGPA.toFixed(2) : '--'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                                    {targetGPA !== null ? (
                                        overallStats.actualGPA4 > 0 ? (
                                            (() => {
                                                const diff = Math.round((targetGPA - overallStats.actualGPA4) * 100) / 100;
                                                if (diff > 0) {
                                                    return <span className="text-amber-600 font-bold">Cần nâng +{diff.toFixed(2)}đ</span>;
                                                } else if (diff === 0) {
                                                    return <span className="text-emerald-600 font-bold">Đạt mục tiêu (Cần giữ)</span>;
                                                } else {
                                                    return <span className="text-emerald-600 font-bold">Vượt mục tiêu +{Math.abs(diff).toFixed(2)}đ</span>;
                                                }
                                            })()
                                        ) : (
                                            <span className="text-slate-500 font-medium">Mục tiêu cá nhân</span>
                                        )
                                    ) : (
                                        <span className="text-slate-400 italic">Chưa đặt mục tiêu cá nhân</span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-normal">Tùy biến</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. LỘ TRÌNH ĐÀO TẠO & HỌC KỲ (MILESTONE CARDS VỚI TIMELINE) */}
            {semesters.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card py-12 px-4 flex flex-col items-center justify-center text-center">
                    <Mascot pose="puzzled" size="lg"/>
                    <h3 className="mt-4 font-bold text-slate-800 text-base">Chưa có học kỳ nào được tạo</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        Bấm nút "+ Thêm học kỳ" để bắt đầu theo dõi hành trình học thuật tại UEH nhé!
                    </p>
                    <button onClick={() => setShowSemesterModal(true)} className="btn-interactive-gold mt-4 text-xs font-bold px-4 py-2">
                        <Plus className="w-4 h-4"/>
                        <span>Nhập học kỳ mới</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Header & Quick Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-extrabold text-[#0B2545] flex items-center gap-2">
                                <span>Cột mốc hành trình học kỳ</span>
                            </h2>
                            <span className="text-xs font-bold text-[#0B2545] bg-[#E0F7FA] px-2.5 py-0.5 rounded-full border border-[#49C8D6]/40">
                                {semesters.length} cột mốc
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowSemesterModal(true)} className="btn-interactive-outline text-xs">
                                <Plus className="w-3.5 h-3.5 text-[#0B2545]"/>
                                <span>Thêm học kỳ</span>
                            </button>
                            <button onClick={() => setShowCourseAddModal(true)} className="btn-interactive-gold text-xs">
                                <Plus className="w-3.5 h-3.5 text-slate-900"/>
                                <span>Thêm môn học</span>
                            </button>
                        </div>
                    </div>

                    {/* Timeline Milestone Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 relative">
                        {semesters.map((sem, sIdx) => {
                            const isSelected = sem.id === currentSemester?.id;
                            const semCourses = courses.filter((c) => c.semesterId === sem.id);
                            const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
                            const sStats = calculateGPAStats(semCourses);
                            const isCompleted = semCourses.length > 0 && semCourses.every((c) => c.status === 'Đã hoàn thành');
                            
                            // Custom status tags for students
                            const statusLabel = isCompleted ? 'Hoàn thành' : isSelected ? 'Đang học' : 'Kế hoạch';
                            const SeasonIcon = milestoneIconList[sIdx % milestoneIconList.length];

                            return (
                                <div 
                                    key={sem.id} 
                                    onClick={() => setSelectedSemesterId(sem.id)} 
                                    className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-white border-[#49C8D6] shadow-card ring-2 ring-[#49C8D6]/30 -translate-y-0.5'
                                            : 'bg-white/90 border-slate-200/90 hover:border-slate-300 hover:shadow-2xs hover:-translate-y-0.5'
                                    }`}
                                >
                                    <div>
                                        {/* Header Thẻ: Biểu tượng học thuật + Tên kỳ & Trạng thái chuẩn */}
                                        <div className="flex items-start justify-between gap-2 mb-2.5">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-[#0B2545] shrink-0">
                                                    <SeasonIcon className="w-4 h-4 text-[#0B2545]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-[#0B2545] text-sm flex items-center gap-1.5 truncate">
                                                        {sem.name}
                                                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#49C8D6] shadow-cyan-glow" />}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400 font-medium truncate">{sem.academicYear}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                                    isCompleted
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                        : isSelected
                                                        ? 'bg-[#E0F7FA] text-[#087F8C] border-[#49C8D6]/40'
                                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                    {isCompleted ? (
                                                        <IconCheckShield className="w-3 h-3 text-emerald-600 shrink-0" />
                                                    ) : isSelected ? (
                                                        <IconProgressRing className="w-3 h-3 text-[#087F8C] shrink-0" />
                                                    ) : (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                                    )}
                                                    <span>{statusLabel}</span>
                                                </span>

                                                {semesters.length > 1 && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm(`Xóa học kỳ ${sem.name}?`)) {
                                                                deleteSemester(sem.id);
                                                            }
                                                        }} 
                                                        className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors" 
                                                        title="Xóa kỳ này"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5"/>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Chỉ số cột mốc: Môn học, Tín chỉ & GPA */}
                                        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                                            <div>
                                                <span className="text-[10px] font-semibold text-slate-400 block">Số môn & Tín chỉ</span>
                                                <div className="text-xs font-bold text-slate-800">
                                                    {semCourses.length} môn <span className="text-slate-400 font-normal">({semCredits} TC)</span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-[10px] font-semibold text-slate-400 block">GPA kỳ</span>
                                                <div className="text-xs font-extrabold text-[#0B2545]">
                                                    {sStats.actualGPA4 > 0 ? (
                                                        <span className="text-sm font-extrabold text-[#0B2545]">{sStats.actualGPA4.toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-slate-400 font-normal">--</span>
                                                    )}
                                                    <span className="text-[10px] text-slate-400 font-normal"> / 4.0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 3. BẢNG ĐIỂM CHI TIẾT (PLAYLIST / TASK ROW CARDS) */}
                    {currentSemester && (
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
                            {/* Header chi tiết học kỳ */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <div className="flex items-center gap-1.5 font-extrabold text-[#0B2545] text-sm sm:text-base">
                                        <span>{currentSemester.name}</span>
                                        <span className="text-slate-300 font-normal">•</span>
                                        <span className="text-slate-500 text-xs font-semibold">{currentSemester.academicYear}</span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#E0F7FA] text-[#087F8C] font-bold text-[11px] border border-[#49C8D6]/30">
                                        GPA: {semesterStats.actualGPA4 > 0 ? semesterStats.actualGPA4.toFixed(2) : '--'}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                        {semesterStats.totalPlannedCredits} tín chỉ
                                    </span>
                                </div>

                                <button onClick={() => setShowCourseAddModal(true)} className="btn-interactive-gold text-xs shrink-0 self-end sm:self-auto font-bold">
                                    <Plus className="w-3.5 h-3.5"/>
                                    <span>Thêm môn học</span>
                                </button>
                            </div>

                            {semesterCourses.length === 0 ? (
                                <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
                                    <Mascot pose="puzzled" size="md"/>
                                    <p className="mt-3 text-xs font-semibold text-slate-700">Chưa có môn học nào trong {currentSemester?.name}</p>
                                    <button onClick={() => setShowCourseAddModal(true)} className="btn-interactive-primary mt-3 text-xs font-bold px-3.5 py-1.5">
                                        <Plus className="w-3.5 h-3.5"/>
                                        <span>Thêm môn học ngay</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {semesterCourses.map((course, idx) => {
                                        const uehGrade = convertScore10ToUEH(course.finalScore10);
                                        const isFailing = course.finalScore10 !== null && course.finalScore10 !== undefined && course.finalScore10 < 5.0;
                                        
                                        // Grade letter badge colors
                                        const getGradeColor = (letter) => {
                                            if (!letter) return 'bg-slate-100 text-slate-400 border-slate-200';
                                            if (letter.startsWith('A')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                            if (letter.startsWith('B')) return 'bg-sky-100 text-[#0B2545] border-sky-300';
                                            if (letter.startsWith('C')) return 'bg-amber-100 text-amber-800 border-amber-300';
                                            return 'bg-rose-100 text-rose-800 border-rose-300';
                                        };

                                        return (
                                            <div 
                                                key={course.id}
                                                className="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 shadow-2xs hover:shadow-card hover:border-[#49C8D6]/70 hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                            >
                                                {/* Left Accent Bar on Hover */}
                                                <div className="absolute left-0 top-2 bottom-2 w-1 bg-transparent group-hover:bg-[#49C8D6] rounded-r transition-colors duration-200" />

                                                {/* Cột 1: STT & Tên môn học */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                                                        {idx + 1}
                                                    </span>

                                                    <div className="min-w-0">
                                                        <button 
                                                            onClick={() => setActiveGradeModalCourse(course)} 
                                                            className="text-left font-bold text-slate-900 group-hover:text-[#0B2545] group-hover:translate-x-0.5 transition-all duration-200 block truncate text-sm"
                                                            title="Bấm để xem & nhập đầu điểm thành phần"
                                                        >
                                                            {course.name}
                                                        </button>
                                                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                                            <span className="font-semibold text-slate-600">{course.credits} Tín chỉ</span>
                                                            <span>•</span>
                                                            <span>Mục tiêu: {course.aimScore10 ? course.aimScore10.toFixed(1) : '8.0'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Cột 2: Trạng thái môn & Điểm chữ tròn & Điểm số & Thao tác */}
                                                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                                    {/* Trạng thái Chip */}
                                                    <button 
                                                        onClick={() => handleToggleStatus(course)} 
                                                        title="Bấm để đổi trạng thái" 
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                            course.status === 'Đã hoàn thành'
                                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                                : course.status === 'Đang học'
                                                                ? 'bg-cyan-50 text-[#087F8C] border-cyan-200'
                                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                        }`}
                                                    >
                                                        {course.status === 'Đã hoàn thành' ? 'Hoàn thành' : course.status === 'Đang học' ? 'Đang học' : 'Chưa học'}
                                                    </button>

                                                    {/* Điểm chữ Tag tròn nổi bật */}
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs shadow-2xs ${getGradeColor(uehGrade.letter)}`}>
                                                        {uehGrade.letter || '--'}
                                                    </div>

                                                    {/* Hệ 10 & Hệ 4 */}
                                                    <div className="text-right min-w-[70px]">
                                                        <div className="text-xs font-bold text-slate-900">
                                                            {course.finalScore10 !== null && course.finalScore10 !== undefined ? (
                                                                <span className={isFailing ? 'text-amber-700 font-extrabold' : ''}>
                                                                    {course.finalScore10.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">/10</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-300">--</span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-medium">
                                                            Hệ 4: <strong className="text-[#0B2545]">{course.finalScore10 !== null && course.finalScore10 !== undefined ? uehGrade.gpa4.toFixed(1) : '--'}</strong>
                                                        </div>
                                                    </div>

                                                    {/* Cột Thao tác: Nút Nhập điểm với IconEditPen + Thùng rác */}
                                                    <div className="flex items-center gap-1.5 ml-1">
                                                        <button 
                                                            onClick={() => setActiveGradeModalCourse(course)} 
                                                            className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/90 hover:bg-[#49C8D6] hover:text-white hover:border-[#49C8D6] hover:shadow-xs hover:scale-105 active:scale-95 transition-all duration-200"
                                                            title="Nhập điểm thành phần"
                                                        >
                                                            <IconEditPen className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-white transition-colors" />
                                                            <span>Điểm</span>
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
                                                            <Trash2 className="w-3.5 h-3.5"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
