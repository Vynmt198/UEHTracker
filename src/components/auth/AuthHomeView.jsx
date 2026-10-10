import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Loader2, ArrowRight, Sparkles, Mail, Lock, User, GraduationCap, BookOpen } from 'lucide-react';

export default function AuthHomeView({ onLoginSuccess }) {
  const { login, register } = useApp();
  const [phase, setPhase] = useState('splash'); // 'splash' | 'auth'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [cohort, setCohort] = useState('K49');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Tự động chuyển từ Splash sang Form Auth sau 1.6s
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('auth');
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const handleFillDemo = () => {
    setEmail('vymainguyen1908@gmail.com');
    setPassword('12345678');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (authMode === 'register') {
        // Gọi hàm đăng ký tài khoản MỚI và khởi tạo Clean State trắng
        await register({
          email,
          password,
          fullName,
          cohort,
          major: major.trim() || 'Công nghệ thông tin kinh doanh'
        });
      } else {
        await login(email, password);
      }
      onLoginSuccess?.();
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi xác thực. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    onLoginSuccess?.();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0B2545] via-[#003B20] to-[#005831] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Visual Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#005831]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F2A900]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#49C8D6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'splash' ? (
            /* ========================================================================= */
            /* PHASE 1: SPLASH SCREEN (LOGO + MASCOT + SLOGAN)                           */
            /* ========================================================================= */
            <motion.div
              key="splash"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -25, transition: { duration: 0.4 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center justify-center py-12"
            >
              {/* Mascot của người dùng với hiệu ứng nổi nhẹ nhàng */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 p-3 shadow-2xl flex items-center justify-center mb-6"
              >
                <img
                  src="/mascot-proud.png"
                  alt="UEH Tracker Mascot"
                  className="w-22 h-22 object-contain drop-shadow-md select-none"
                  draggable={false}
                />
              </motion.div>

              {/* Logo Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                UEH <span className="text-[#F2A900]">TRACKER</span>
              </h1>

              {/* Slogan chính thức */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-3.5 text-emerald-200/90 text-sm font-semibold tracking-wide max-w-xs text-center leading-relaxed"
              >
                GPA trong tầm tay, tương lai trong tầm với
              </motion.p>

              {/* Nhịp Pulse chuyển cảnh */}
              <div className="mt-8 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F2A900] rounded-full animate-ping" />
                <span className="w-2 h-2 bg-white/40 rounded-full" />
                <span className="w-2 h-2 bg-white/40 rounded-full" />
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* PHASE 2: AUTH CARD (SLIDE UP + FADE IN)                                   */
            /* ========================================================================= */
            <motion.div
              key="auth-card"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-7 border border-white/60"
            >
              {/* Header thu gọn với Mascot & Slogan */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#132E59] flex items-center justify-center p-1.5 shadow-md shrink-0">
                    <img src="/logo.png" alt="UEH Logo" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#0B2545] leading-tight">UEH TRACKER</h2>
                    <p className="text-[11px] text-[#005831] font-semibold">
                      GPA trong tầm tay, tương lai trong tầm với
                    </p>
                  </div>
                </div>
                <img
                  src="/mascot-proud.png"
                  alt="Mascot"
                  className="w-10 h-10 object-contain shrink-0"
                  draggable={false}
                />
              </div>

              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-[#005831] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-[#005831] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tạo tài khoản mới
                </button>
              </div>

              {/* Nút điền nhanh tài khoản test ở chế độ login */}
              {authMode === 'login' && (
                <div className="mb-4 p-2.5 rounded-xl bg-[#FEF7E6] border border-[#F2A900]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                    <span>Dùng tài khoản test có sẵn</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="px-2 py-1 rounded-lg bg-[#F2A900] text-slate-950 font-bold hover:bg-[#e09b00] transition-colors text-[11px]"
                  >
                    Điền nhanh
                  </button>
                </div>
              )}

              {/* Thông báo lỗi */}
              {errorMsg && (
                <div className="mb-4 p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100">
                  {errorMsg}
                </div>
              )}

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005831]"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Khóa
                        </label>
                        <select
                          value={cohort}
                          onChange={(e) => setCohort(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#005831]"
                        >
                          <option value="K48">K48</option>
                          <option value="K49">K49</option>
                          <option value="K50">K50</option>
                          <option value="K51">K51</option>
                          <option value="K52">K52</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Chuyên ngành
                        </label>
                        <input
                          type="text"
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                          placeholder="CNTT Kinh doanh..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005831]"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Email UEH / Cá nhân
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@st.ueh.edu.vn"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005831]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005831]"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#005831] via-[#084b2c] to-[#0B2545] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý kết nối Neon Cloud...</span>
                    </>
                  ) : authMode === 'login' ? (
                    <>
                      <span>Đăng nhập vào hệ thống</span>
                      <ArrowRight className="w-4 h-4 text-[#F2A900]" />
                    </>
                  ) : (
                    <>
                      <span>Tạo tài khoản mới (Khởi tạo trắng)</span>
                      <ArrowRight className="w-4 h-4 text-[#F2A900]" />
                    </>
                  )}
                </button>
              </form>

              {/* Tùy chọn trải nghiệm nhanh không bắt buộc đăng nhập */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium"
                >
                  Trải nghiệm nhanh không cần đăng nhập ➔
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
