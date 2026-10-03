import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  RotateCcw,
  Sliders,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenOnboarding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onOpenOnboarding
}) => {
  const { activeTab, setActiveTab, profile, semesters, resetAllData } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    {
      id: 'gpa' as const,
      label: 'Quản lý GPA',
      shortLabel: 'GPA',
      icon: GraduationCap,
      description: 'Hệ 4.0 & Mục tiêu Aim'
    },
    {
      id: 'drl' as const,
      label: 'Điểm rèn luyện',
      shortLabel: 'ĐRL',
      icon: Award,
      description: '5 tiêu chí & Minh chứng'
    },
    {
      id: 'schedule' as const,
      label: 'Thời khóa biểu',
      shortLabel: 'Lịch',
      icon: Calendar,
      description: 'Gap Time Optimizer'
    },
    {
      id: 'forum' as const,
      label: 'Diễn đàn UEH',
      shortLabel: 'Diễn đàn',
      icon: MessageSquare,
      description: 'Học thuật & Đội thi'
    }
  ];

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại dữ liệu về trạng thái ban đầu?')) {
      resetAllData();
      setShowProfileMenu(false);
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Header & Brand */}
      <div>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-slate-100`}>
          <div
            onClick={() => setActiveTab('gpa')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-slate-800 transition-all duration-300">
              <GraduationCap className="w-5 h-5 text-[#49C8D6]" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                  UEH Tracker
                </h1>
                <p className="text-[10px] text-slate-400 font-normal">
                  Cổng học tập sinh viên
                </p>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title={isCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                title={isCollapsed ? `${item.label} (${item.description})` : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                } rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#49C8D6]' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />

                {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <div className="leading-tight font-semibold">{item.label}</div>
                    <div
                      className={`text-[10px] font-normal leading-tight mt-0.5 ${
                        isActive ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Active indicator dot when collapsed */}
                {isCollapsed && isActive && (
                  <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-[#49C8D6]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-3 border-t border-slate-100 relative">
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'p-2.5'
          } rounded-xl hover:bg-slate-100 cursor-pointer transition-colors group`}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-xs shrink-0 group-hover:scale-105 transition-transform">
            {profile.name ? profile.name.charAt(0) : 'U'}
          </div>

          {!isCollapsed && (
            <div className="ml-2.5 min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.cohort} • {profile.faculty.split(' ')[0]}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Popup */}
        {showProfileMenu && (
          <div
            className={`absolute ${
              isCollapsed ? 'left-full bottom-2 ml-2' : 'left-3 right-3 bottom-full mb-2'
            } w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50`}
          >
            <div className="px-3.5 py-2 border-b border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Hồ sơ sinh viên</p>
              <p className="text-xs font-semibold text-slate-900 truncate">{profile.name}</p>
              <p className="text-[11px] text-slate-500 font-mono">MSSV: {profile.studentId}</p>
            </div>

            <div className="p-1 space-y-0.5">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenOnboarding();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Cập nhật mục tiêu & ngành
              </button>

              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg transition-colors text-left"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                Đặt lại dữ liệu mẫu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#49C8D6]" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">UEH Tracker</span>
          </div>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold"
        >
          {profile.name ? profile.name.charAt(0) : 'U'}
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Fixed Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <NavContent />
      </aside>
    </>
  );
};
