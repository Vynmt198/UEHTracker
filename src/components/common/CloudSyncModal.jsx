import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  LogOut, 
  X, 
  Lock, 
  Mail, 
  User, 
  Database,
  ArrowRight,
  Sparkles,
  Server
} from 'lucide-react';
import { IconCloudUpload, IconCloudDownload, IconCheckShield } from './EduIcons';

export const CloudSyncModal = ({ isOpen, onClose }) => {
  const {
    user,
    login,
    register,
    logout,
    syncToCloud,
    syncFromCloud,
    isSyncing,
    syncStatus,
    syncMessage,
    lastSyncedAt,
    courses,
    semesters,
    autoSyncEnabled,
    setAutoSyncEnabled,
    autoSyncState,
    profile,
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      if (mode === 'login') {
        await login(email, password);
        setFormSuccess('Đăng nhập thành công! Đã kết nối Neon Cloud PostgreSQL.');
      } else {
        await register(email, password, fullName);
        setFormSuccess('Tạo tài khoản thành công! Dữ liệu đã sẵn sàng trên Neon Cloud.');
      }
    } catch (err) {
      setFormError(err.message || 'Thao tác không thành công');
    }
  };

  const handleFillTestAccount = () => {
    setEmail('test.student@ueh.edu.vn');
    setPassword('Password123!');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2545]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header: 3D Neon Cloud Interactive Panel */}
        <div className="relative p-6 bg-gradient-to-br from-[#0B2545] via-[#102a4e] to-[#071A31] text-white overflow-hidden">
          {/* Subtle Cyber Grid Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(73,200,214,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex items-center gap-4">
            {/* 3D Glowing Neon Cloud with Pulse */}
            <div className="relative p-3.5 bg-gradient-to-br from-[#49C8D6]/20 to-[#0B2545] text-[#49C8D6] rounded-2xl border border-[#49C8D6]/40 shadow-cyan-glow shrink-0">
              <Cloud className="w-7 h-7 drop-shadow-md animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49C8D6] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#49C8D6]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">Cổng Đồng Bộ Neon Cloud</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#49C8D6]/20 text-[#49C8D6] border border-[#49C8D6]/30">
                  SERVERLESS
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5 font-medium">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hạ tầng PostgreSQL bảo mật cho UEHer</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Content Body */}
        <div className="p-6 space-y-5">
          {user ? (
            /* Logged-in State: 2 Distinct Panels */
            <div className="space-y-5">
              {/* KHU VỰC 1: HỒ SƠ CÁ NHÂN (USER IDENTITY PROFILE CARD) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-[#E0F7FA]/30 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    HỒ SƠ SINH VIÊN KẾT NỐI
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đã kết nối
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#132E59] text-white flex items-center justify-center font-extrabold text-base ring-2 ring-[#49C8D6]/40 shadow-card shrink-0">
                      {(user.profile?.fullName || profile?.name || user.email)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0B2545] truncate">
                        {user.profile?.fullName || profile?.name || 'Sinh viên UEH'}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#F2A900] text-slate-950">
                      {profile?.cohort || 'K49'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0B2545] text-[#49C8D6]">
                      {profile?.faculty ? profile.faculty.split(' ')[0] : 'CNTT'}
                    </span>
                  </div>
                </div>

                {/* Database Quick Stats */}
                <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-200/80">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold block">Số học kỳ</span>
                    <span className="text-sm font-bold text-[#0B2545]">{semesters.length} kỳ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold block">Môn học đã lưu</span>
                    <span className="text-sm font-bold text-[#0B2545]">{courses.length} môn</span>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {syncMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                  syncStatus === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : syncStatus === 'error'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {syncStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : syncStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-slate-600 shrink-0 animate-spin" />
                  )}
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* KHU VỰC 2: BỘ ĐIỀU KHIỂN SYNC (CLOUD CONTROL CENTER) */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  BỘ ĐIỀU KHIỂN ĐỒNG BỘ (PUSH / PULL)
                </span>

                {/* Auto-Sync Glowing Toggle Card */}
                <div className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  autoSyncEnabled 
                    ? 'bg-[#E0F7FA]/30 border-[#49C8D6]/60 shadow-cyan-glow' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className={`w-3.5 h-3.5 ${autoSyncEnabled ? 'text-[#087F8C]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-[#0B2545]">Tự động đồng bộ ngầm (Auto-Sync)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Lưu điểm & môn học tức thì lên Cloud ngay khi chỉnh sửa
                    </p>
                    {autoSyncState !== 'idle' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#087F8C]">
                        {autoSyncState === 'pending' && '⏳ Chờ gom thay đổi...'}
                        {autoSyncState === 'saving' && '⚡ Đang tự động lưu lên Cloud...'}
                        {autoSyncState === 'saved' && '✅ Đã lưu ngầm mới nhất'}
                        {autoSyncState === 'error' && '⚠️ Chưa thể tự động lưu'}
                      </span>
                    )}
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={autoSyncEnabled}
                      onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#49C8D6] shadow-inner"></div>
                  </label>
                </div>

                {/* Large Gradient Push / Pull Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Push Button (Lưu lên Cloud) */}
                  <button
                    onClick={() => syncToCloud()}
                    disabled={isSyncing}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] via-[#132E59] to-[#0B2545] text-white border border-[#132E59] hover:border-[#49C8D6]/60 hover:shadow-floating active:scale-95 transition-all duration-200 flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white group-hover:text-[#49C8D6] transition-colors">
                        Lưu lên Cloud
                      </span>
                      <span className="block text-[10px] text-slate-300">Đẩy dữ liệu máy lên</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10 text-[#49C8D6] group-hover:bg-[#49C8D6] group-hover:text-white transition-all">
                      <IconCloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
                    </div>
                  </button>

                  {/* Pull Button (Tải về máy) */}
                  <button
                    onClick={() => syncFromCloud()}
                    disabled={isSyncing}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FEF7E6] to-[#FFF9ED] text-[#0B2545] border border-[#F2A900]/40 hover:border-[#F2A900] hover:shadow-gold-glow active:scale-95 transition-all duration-200 flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="text-left">
                      <span className="block text-xs font-bold text-[#0B2545] group-hover:text-[#B27B00] transition-colors">
                        Tải về máy
                      </span>
                      <span className="block text-[10px] text-slate-500">Kéo dữ liệu Cloud về</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F2A900]/20 text-[#B27B00] group-hover:bg-[#F2A900] group-hover:text-slate-950 transition-all">
                      <IconCloudDownload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : 'group-hover:translate-y-0.5 transition-transform'}`} />
                    </div>
                  </button>
                </div>

                {lastSyncedAt && (
                  <p className="text-[11px] text-slate-400 text-center pt-1 font-mono">
                    Lần đồng bộ gần nhất: {new Date(lastSyncedAt).toLocaleTimeString('vi-VN')} • {new Date(lastSyncedAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <IconCheckShield className="w-3.5 h-3.5 text-emerald-600" />
                  Mã hóa bảo mật UEH SSL
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold py-1.5 px-3 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất tài khoản
                </button>
              </div>
            </div>
          ) : (
            /* Logged-out State: Auth Tabs */
            <div>
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-100 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setFormError(''); setFormSuccess(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'login' ? 'bg-white text-[#0B2545] shadow-xs' : 'text-slate-500 hover:text-[#0B2545]'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setFormError(''); setFormSuccess(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'register' ? 'bg-white text-[#0B2545] shadow-xs' : 'text-slate-500 hover:text-[#0B2545]'
                  }`}
                >
                  Tạo tài khoản mới
                </button>
              </div>

              {/* Quick Fill Button */}
              <div className="mb-4 p-3 bg-[#FEF7E6] rounded-2xl border border-[#F2A900]/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#B27B00] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#F2A900] shrink-0" />
                  <span>Dùng tài khoản sinh viên mẫu</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillTestAccount}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#F2A900] hover:bg-[#FFBF24] text-slate-950 rounded-lg shadow-2xs transition-colors"
                >
                  Điền nhanh
                </button>
              </div>

              {/* Alerts */}
              {formError && (
                <div className="mb-3 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="mb-3 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Họ và tên sinh viên</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Vy"
                        className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email sinh viên UEH</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@ueh.edu.vn"
                      className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mật khẩu bảo mật</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#0B2545] via-[#102a4e] to-[#0B2545] hover:shadow-floating text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#49C8D6]" />
                      Đang xử lý kết nối...
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Đăng nhập & Bắt đầu đồng bộ' : 'Tạo tài khoản & Kết nối Cloud'}</span>
                      <ArrowRight className="w-4 h-4 text-[#49C8D6]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudSyncModal;
