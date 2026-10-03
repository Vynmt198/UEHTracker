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
  Sliders,
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('gpa')}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#49C8D6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  UEH Tracker
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  UEHer
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-normal">
                GPA • Điểm Rèn Luyện • Smart Schedule
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('gpa')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'gpa'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span>GPA</span>
            </button>

            <button
              onClick={() => setActiveTab('drl')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'drl'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-slate-500" />
              <span>Điểm rèn luyện</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Smart Schedule</span>
              <span className="sm:hidden">Lịch</span>
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'forum'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Diễn đàn</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
                Sắp có
              </span>
            </button>
          </nav>

          {/* Right: Mock Auth & Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-medium text-xs">
                {profile.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {profile.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {profile.cohort} • {profile.faculty.split(' ')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-sm border border-slate-200 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-[11px] text-slate-500">Tài khoản sinh viên UEH</p>
                  <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600 border border-slate-200">
                    <User className="w-3 h-3 text-slate-500" />
                    MSSV: {profile.studentId}
                  </div>
                </div>

                <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khóa & Ngành:</span>
                    <span className="font-medium text-slate-900">{profile.cohort} - {profile.major}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số HK quản lý:</span>
                    <span className="font-medium text-slate-900">{semesters.length} học kỳ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mục tiêu:</span>
                    <span className="font-medium text-slate-900">{profile.scholarshipTierTarget || 'Học bổng'}</span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onOpenOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-slate-500" />
                    Cập nhật Onboarding & Mục tiêu
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    Đặt lại toàn bộ dữ liệu mẫu
                  </button>

                  <button
                    onClick={() => {
                      alert('Đã đăng xuất phiên làm việc UEH Tracker.');
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
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
