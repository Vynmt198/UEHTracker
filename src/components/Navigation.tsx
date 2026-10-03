import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navigation: React.FC<{ onOpenOnboarding: () => void }> = ({ onOpenOnboarding }) => {
  const { activeTab, setActiveTab, profile, semesters, resetAllData } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại dữ liệu về trạng thái ban đầu?')) {
      resetAllData();
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('gpa')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-[#29B3C2] to-[#49C8D6] flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                  UEH <span className="text-[#29B3C2]">Tracker</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8FAFC] text-[#008899] border border-cyan-200 uppercase tracking-wider">
                  FOR UEHER
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                GPA • Điểm Rèn Luyện • Smart Schedule
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('gpa')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'gpa'
                  ? 'bg-[#E8FAFC] text-[#007D8C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#29B3C2]" />
              <span>GPA</span>
            </button>

            <button
              onClick={() => setActiveTab('drl')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'drl'
                  ? 'bg-[#E8FAFC] text-[#007D8C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-[#29B3C2]" />
              <span>Điểm rèn luyện</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'schedule'
                  ? 'bg-[#E8FAFC] text-[#007D8C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#29B3C2]" />
              <span className="hidden sm:inline">Smart Schedule</span>
              <span className="sm:hidden">Lịch</span>
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                activeTab === 'forum'
                  ? 'bg-[#E8FAFC] text-[#007D8C]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Diễn đàn</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                Sắp có
              </span>
            </button>
          </nav>

          {/* Right: Mock Auth & Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#49C8D6] to-[#004B87] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {profile.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {profile.name}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {profile.cohort} • {profile.faculty.split(' ')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Tài khoản sinh viên UEH</p>
                  <p className="text-sm font-bold text-slate-800">{profile.name}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
                    <User className="w-3 h-3 text-[#29B3C2]" />
                    MSSV: {profile.studentId}
                  </div>
                </div>

                <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Khóa & Ngành:</span>
                    <span className="font-semibold text-slate-700">{profile.cohort} - {profile.major}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số HK quản lý:</span>
                    <span className="font-semibold text-slate-700">{semesters.length} học kỳ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mục tiêu:</span>
                    <span className="font-semibold text-[#007D8C]">{profile.scholarshipTierTarget || 'Học bổng'}</span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onOpenOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#E8FAFC] hover:text-[#007D8C] rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#29B3C2]" />
                    Cập nhật Onboarding & Mục tiêu
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    Đặt lại toàn bộ dữ liệu mẫu
                  </button>

                  <button
                    onClick={() => {
                      alert('Đã đăng xuất phiên làm việc UEH Tracker.');
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
