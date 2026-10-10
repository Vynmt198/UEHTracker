import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Menu, X, RotateCcw, Sliders, Cloud, GraduationCap, BookOpen, Award, MessageSquare } from 'lucide-react';
import { CloudSyncModal } from './common/CloudSyncModal';
export const Sidebar = ({ isCollapsed, onToggleCollapse, onOpenOnboarding }) => {
    const { activeTab, setActiveTab, profile, semesters, resetAllData, user, syncStatus, isSyncing, autoSyncState } = useApp();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCloudSync, setShowCloudSync] = useState(false);
    const navItems = [
        {
            id: 'planner',
            label: 'Smart Planner',
            shortLabel: 'Planner',
            icon: GraduationCap
        },
        {
            id: 'gpa',
            label: 'Quản lý GPA',
            shortLabel: 'GPA',
            icon: BookOpen
        },
        {
            id: 'drl',
            label: 'Điểm rèn luyện',
            shortLabel: 'ĐRL',
            icon: Award
        },
        {
            id: 'forum',
            label: 'Diễn đàn UEH',
            shortLabel: 'Diễn đàn',
            icon: MessageSquare,
            badge: 'Mới'
        }
    ];
    const handleReset = () => {
        if (window.confirm('Bạn có chắc muốn đặt lại dữ liệu về trạng thái ban đầu?')) {
            resetAllData();
            setShowProfileMenu(false);
        }
    };
    const NavContent = () => (<div className="flex flex-col h-full justify-between select-none">
      {/* Top Header & Brand */}
      <div>
        <div className={`relative overflow-hidden flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between p-4'} border-b border-slate-100`}>
          {/* Subtle UEH Diagonal Accent Lines in Header Background */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-[#49C8D6]/10 via-[#0B2545]/5 to-transparent rounded-full pointer-events-none" />
          
          <div onClick={() => setActiveTab('planner')} className="flex items-center gap-2.5 cursor-pointer group z-10">
            {/* Logo with UEH Border Glow */}
            <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-[#49C8D6] via-[#0B2545] to-[#F2A900] shadow-2xs group-hover:shadow-cyan-glow transition-all">
              <img src="/logo.png" alt="UEH Tracker Logo" className="w-8 h-8 rounded-[10px] bg-white object-contain p-0.5 group-hover:scale-105 transition-transform shrink-0"/>
            </div>
            {!isCollapsed && (<div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#0B2545] text-sm tracking-tight block">UEH Tracker</span>
                  <span className="text-[9px] px-1 py-0.2 rounded font-extrabold bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/40">PRO</span>
                </div>
                <span className="block text-[10px] text-[#49C8D6] font-bold tracking-wider">TECH-ACADEMY</span>
              </div>)}
          </div>

          {/* Desktop Toggle Button */}
          <button onClick={onToggleCollapse} className="hidden md:flex p-1.5 text-slate-400 hover:text-[#0B2545] hover:bg-slate-100/80 rounded-xl transition-colors z-10" title={isCollapsed ? 'Mở rộng thanh điều hướng (Expanded)' : 'Thu gọn thanh điều hướng (Collapsed)'}>
            {isCollapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
          </button>
        </div>

        {/* Student Mini Profile Card (Header thu nhỏ với Badge K49 / Khoa) */}
        {!isCollapsed && (
          <div className="px-3 pt-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-50 to-[#E0F7FA]/30 border border-slate-200/80 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-[10px] text-slate-500 font-medium truncate">Sinh viên UEH</p>
                <p className="text-xs font-bold text-[#0B2545] truncate">{profile.name || 'UEH Student'}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-extrabold bg-[#F2A900] text-slate-950 shadow-2xs">
                  {profile.cohort || 'K49'}
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-[#0B2545] text-[#49C8D6] border border-[#132E59]">
                  {profile.faculty ? profile.faculty.split(' ')[0] : 'CNTT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (<button key={item.id} onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                }} title={isCollapsed ? item.label : undefined} className={`w-full flex items-center h-10.5 ${isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive
                    ? 'bg-gradient-to-r from-[#0B2545] via-[#102a4e] to-[#0B2545] text-white shadow-card border border-[#49C8D6]/30'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-[#0B2545]'}`}>
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-115 ${isActive ? 'text-[#49C8D6] drop-shadow-sm' : 'text-slate-500 group-hover:text-[#0B2545]'}`}/>

                {!isCollapsed && (<>
                    <span className="truncate whitespace-nowrap font-semibold">{item.label}</span>
                    {item.badge && (<span className="ml-auto text-[9.5px] px-1.5 py-0.5 rounded-md bg-[#FEF7E6] text-[#B27B00] border border-[#F2A900]/40 font-bold shrink-0">
                        {item.badge}
                      </span>)}
                  </>)}

                {/* Active indicator dot when collapsed */}
                {isCollapsed && isActive && (<span className="absolute right-1.5 top-1.5 w-2 h-2 rounded-full bg-[#49C8D6] shadow-cyan-glow"/>)}

                {/* Floating Tooltip when collapsed */}
                {isCollapsed && (<div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0B2545] text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5 border border-[#49C8D6]/30">
                    <span className="font-bold text-white">{item.label}</span>
                    {item.badge && (<span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F2A900] text-slate-950 font-bold">
                        {item.badge}
                      </span>)}
                  </div>)}
              </button>);
        })}
        </nav>
      </div>

      {/* Neon Cloud Sync Button */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => setShowCloudSync(true)}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
          } rounded-xl text-xs font-semibold transition-all duration-200 border ${
            user 
              ? 'bg-gradient-to-r from-emerald-50/80 to-[#E0F7FA]/50 hover:from-emerald-100/80 hover:to-[#E0F7FA]/80 text-[#0B2545] border-emerald-200 shadow-2xs' 
              : 'bg-gradient-to-r from-slate-50 to-cyan-50/60 hover:from-cyan-50 hover:to-indigo-50/60 text-slate-800 border-slate-200/90 shadow-2xs'
          }`}
          title={isCollapsed ? (user ? 'Neon Cloud: Đã kết nối' : 'Đồng bộ Neon Cloud') : undefined}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Cloud className={`w-4 h-4 shrink-0 ${
              user 
                ? autoSyncState === 'saving' || autoSyncState === 'pending'
                  ? 'text-sky-500 animate-pulse'
                  : 'text-emerald-600' 
                : 'text-[#49C8D6]'
            } ${isSyncing ? 'animate-bounce' : ''}`} />
            {!isCollapsed && (
              <div className="text-left truncate">
                <span className="block font-bold text-[#0B2545] leading-tight truncate">
                  {user ? 'Neon Cloud' : 'Đồng bộ Cloud'}
                </span>
                <span className="block text-[10px] text-slate-500 leading-tight truncate">
                  {user 
                    ? autoSyncState === 'saving'
                      ? 'Đang tự động lưu...'
                      : autoSyncState === 'saved'
                      ? 'Đã tự động lưu'
                      : 'Đã kết nối • Auto-sync'
                    : 'Đăng nhập / Backup'}
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              user 
                ? autoSyncState === 'saving'
                  ? 'bg-sky-400 animate-ping'
                  : 'bg-emerald-500 ring-2 ring-emerald-200 shadow-2xs' 
                : 'bg-[#F2A900] ring-2 ring-amber-200'
            }`} />
          )}
        </button>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-3 border-t border-slate-100 relative">
        <div onClick={() => setShowProfileMenu(!showProfileMenu)} className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'p-2.5'} rounded-xl hover:bg-slate-100 cursor-pointer transition-colors group`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2545] to-[#132E59] text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-[#49C8D6]/30 group-hover:scale-105 transition-transform">
            {profile.name ? profile.name.charAt(0) : 'U'}
          </div>

          {!isCollapsed && (<div className="ml-2.5 min-w-0 flex-1">
              <div className="text-xs font-bold text-[#0B2545] truncate">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-mono">
                MSSV: {profile.studentId || 'Chưa cập nhật'}
              </div>
            </div>)}
        </div>

        {/* Profile Dropdown Popup */}
        {showProfileMenu && (<div className={`absolute ${isCollapsed ? 'left-full bottom-2 ml-2' : 'left-3 right-3 bottom-full mb-2'} w-64 bg-white rounded-2xl shadow-floating border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150`}>
            <div className="px-3.5 py-2.5 border-b border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hồ sơ sinh viên UEH</p>
              <p className="text-xs font-bold text-[#0B2545] truncate">{profile.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FEF7E6] text-[#B27B00]">
                  {profile.cohort}
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate">
                  {profile.studentId}
                </span>
              </div>
            </div>

            <div className="p-1.5 space-y-0.5">
              <button onClick={() => {
                setShowProfileMenu(false);
                onOpenOnboarding();
            }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left">
                <Sliders className="w-3.5 h-3.5 text-slate-500"/>
                Cập nhật mục tiêu & hồ sơ
              </button>

              <button onClick={() => {
                setShowProfileMenu(false);
                setShowCloudSync(true);
            }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-cyan-50/50 rounded-xl transition-colors text-left">
                <Cloud className="w-3.5 h-3.5 text-[#49C8D6]"/>
                Đồng bộ Neon Cloud
              </button>

              <button onClick={handleReset} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-xl transition-colors text-left">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600"/>
                Đặt lại dữ liệu mẫu
              </button>
            </div>
          </div>)}
      </div>
    </div>);
    return (<>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" title="Mở menu">
            <Menu className="w-5 h-5"/>
          </button>
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <img src="/logo.png" alt="UEH Tracker Logo" className="w-7 h-7 rounded-lg object-contain shadow-2xs"/>
            <div>
              <span className="font-extrabold text-[#0B2545] text-sm tracking-tight block">UEH Tracker</span>
              <span className="block text-[9.5px] text-[#49C8D6] font-bold tracking-wider">TECH-ACADEMY</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCloudSync(true)} 
            className={`p-1.5 rounded-xl border transition-colors ${
              user ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
            title="Đồng bộ Neon Cloud"
          >
            <Cloud className="w-4 h-4 text-[#49C8D6]" />
          </button>
          <button onClick={onOpenOnboarding} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B2545] to-[#132E59] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            {profile.name ? profile.name.charAt(0) : 'U'}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (<div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-[#0B2545]/40 backdrop-blur-xs transition-opacity" onClick={() => setMobileOpen(false)}/>
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3 z-20">
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <NavContent />
          </div>
        </div>)}

      {/* Desktop Floating Collapsible Sidebar */}
      <aside className={`hidden md:flex flex-col fixed top-3 left-3 bottom-3 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-floating transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <NavContent />
      </aside>

      {/* Cloud Sync Modal */}
      <CloudSyncModal isOpen={showCloudSync} onClose={() => setShowCloudSync(false)} />
    </>);
};
