import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cloud, 
  CloudRain, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  LogOut, 
  X, 
  Lock, 
  Mail, 
  User, 
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';

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
        setFormSuccess('Đăng nhập thành công! Dữ liệu đang được đồng bộ với Neon Cloud.');
      } else {
        await register(email, password, fullName);
        setFormSuccess('Đăng ký tài khoản thành công và đã kết nối Neon Cloud!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#49C8D6]/20 text-[#49C8D6] rounded-xl border border-[#49C8D6]/30">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">Đồng bộ Neon Cloud</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Postgres: <strong className="text-emerald-400 font-mono">flat-band-12164942</strong> (production)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {user ? (
            /* Logged-in State: Sync Dashboard */
            <div className="space-y-4">
              {/* User Identity Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{user.profile?.fullName || user.email}</h4>
                      <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                    Online
                  </span>
                </div>
              </div>

              {/* Database Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                  <span className="text-[11px] text-sky-700 font-medium block">Số học kỳ</span>
                  <span className="text-lg font-bold text-sky-950">{semesters.length} kỳ</span>
                </div>
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                  <span className="text-[11px] text-teal-700 font-medium block">Môn học đã lưu</span>
                  <span className="text-lg font-bold text-teal-950">{courses.length} môn</span>
                </div>
              </div>

              {/* Status Message */}
              {syncMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
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

              {lastSyncedAt && (
                <p className="text-[11px] text-slate-400 text-center">
                  Lần đồng bộ gần nhất: {new Date(lastSyncedAt).toLocaleTimeString('vi-VN')} {new Date(lastSyncedAt).toLocaleDateString('vi-VN')}
                </p>
              )}

              {/* Sync Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => syncToCloud()}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                >
                  <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                  {isSyncing ? 'Đang đồng bộ...' : 'Đẩy dữ liệu hiện tại lên Cloud (Push)'}
                </button>

                <button
                  onClick={() => syncFromCloud()}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <DownloadCloud className="w-4 h-4 text-[#49C8D6]" />
                  Tải dữ liệu từ Neon Cloud về máy (Pull)
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            /* Logged-out State: Auth Tabs */
            <div>
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setFormError(''); setFormSuccess(''); }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setFormError(''); setFormSuccess(''); }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tạo tài khoản
                </button>
              </div>

              {/* Quick Fill Button */}
              <div className="mb-4 p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dùng tài khoản test có sẵn</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillTestAccount}
                  className="px-2 py-1 text-[11px] font-semibold bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg transition-colors"
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
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Họ và tên</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn An"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Email UEH</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@ueh.edu.vn"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#49C8D6] focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Đăng nhập & Đồng bộ' : 'Tạo tài khoản mới'}
                      <ArrowRight className="w-3.5 h-3.5" />
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
