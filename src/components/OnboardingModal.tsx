import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Target, BookOpen, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const UEH_FACULTIES = [
  'Công nghệ thông tin kinh doanh',
  'Kinh doanh quốc tế - Marketing',
  'Tài chính - Ngân hàng',
  'Kế toán - Kiểm toán',
  'Kinh tế - Quản trị',
  'Luật',
  'Khoa Ngoại ngữ',
  'Viện Đào tạo Quốc tế (ISB)'
];

const MAJORS_BY_FACULTY: Record<string, string[]> = {
  'Công nghệ thông tin kinh doanh': ['Hệ thống thông tin quản lý', 'Khoa học dữ liệu', 'Kỹ thuật phần mềm', 'Công nghệ tài chính (FinTech)'],
  'Kinh doanh quốc tế - Marketing': ['Kinh doanh quốc tế', 'Marketing', 'Logistics và Quản lý Chuỗi cung ứng', 'Thương mại điện tử'],
  'Tài chính - Ngân hàng': ['Tài chính doanh nghiệp', 'Ngân hàng', 'Thị trường chứng khoán', 'Tài chính công'],
  'Kế toán - Kiểm toán': ['Kế toán doanh nghiệp', 'Kiểm toán', 'Kế toán công'],
  'Kinh tế - Quản trị': ['Quản trị kinh doanh', 'Kinh tế học', 'Quản trị nhân lực', 'Bất động sản'],
  'Luật': ['Luật kinh tế', 'Luật kinh doanh quốc tế'],
  'Khoa Ngoại ngữ': ['Tiếng Anh thương mại'],
  'Viện Đào tạo Quốc tế (ISB)': ['Cử nhân Kinh doanh ISB BBus', 'Tài chính Ứng dụng']
};

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: profile.name || '',
    studentId: profile.studentId || '',
    email: profile.email || '',
    cohort: profile.cohort || 'K49',
    faculty: profile.faculty || UEH_FACULTIES[0],
    major: profile.major || MAJORS_BY_FACULTY[UEH_FACULTIES[0]][0],
    goals: profile.goals || ['Học bổng', 'Tốt nghiệp đúng hạn'],
    scholarshipTierTarget: profile.scholarshipTierTarget || 'Xuất sắc',
    strengths: profile.strengths || ['Tư duy logic', 'Lập trình'],
    studyHabits: profile.studyHabits || 'Học nhóm và tự học thư viện vào buổi sáng',
    freeTimeSlots: profile.freeTimeSlots || ['Thứ 3 chiều', 'Thứ 6 chiều', 'Thứ 7']
  });

  if (!isOpen) return null;

  const toggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      return {
        ...prev,
        goals: exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal]
      };
    });
  };

  const toggleStrength = (strength: string) => {
    setFormData((prev) => {
      const exists = prev.strengths.includes(strength);
      return {
        ...prev,
        strengths: exists ? prev.strengths.filter((s) => s !== strength) : [...prev.strengths, strength]
      };
    });
  };

  const toggleFreeTime = (slot: string) => {
    setFormData((prev) => {
      const exists = prev.freeTimeSlots.includes(slot);
      return {
        ...prev,
        freeTimeSlots: exists ? prev.freeTimeSlots.filter((s) => s !== slot) : [...prev.freeTimeSlots, slot]
      };
    });
  };

  const handleFinish = () => {
    updateProfile({
      ...formData,
      isOnboarded: true
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-[#29B3C2] via-[#49C8D6] to-[#008899] p-6 text-white relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider">
              Khởi tạo hồ sơ UEHer
            </span>
            <span className="text-white/80 text-xs font-semibold">Bước {step} / 3</span>
          </div>
          <h2 className="text-2xl font-black">Chào mừng bạn đến với UEH Tracker</h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Thiết lập mục tiêu học tập, cá nhân hóa thuật toán Smart Schedule & điểm rèn luyện.
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-white' : s < step ? 'w-4 bg-white/70' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Khóa, Khoa, Ngành */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <BookOpen className="w-5 h-5 text-[#29B3C2]" />
                <h3 className="font-bold text-slate-800 text-base">Thông tin học tập cá nhân</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
                    placeholder="Nguyễn Văn An"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã số sinh viên (MSSV)</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
                    placeholder="31231021456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khóa học</label>
                  <select
                    value={formData.cohort}
                    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
                  >
                    <option value="K48">Khóa K48 (2022 - 2026)</option>
                    <option value="K49">Khóa K49 (2023 - 2027)</option>
                    <option value="K50">Khóa K50 (2024 - 2028)</option>
                    <option value="K51">Khóa K51 (2025 - 2029)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khoa / Viện đào tạo</label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => {
                      const newFac = e.target.value;
                      const majors = MAJORS_BY_FACULTY[newFac] || ['Chuyên ngành tổng hợp'];
                      setFormData({
                        ...formData,
                        faculty: newFac,
                        major: majors[0]
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
                  >
                    {UEH_FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên ngành theo học</label>
                <select
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
                >
                  {(MAJORS_BY_FACULTY[formData.faculty] || ['Chuyên ngành tổng hợp']).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Mục tiêu & Học bổng */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Target className="w-5 h-5 text-[#29B3C2]" />
                <h3 className="font-bold text-slate-800 text-base">Mục tiêu học tập & ĐRL UEH</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Mục tiêu trọng tâm của bạn trong năm nay (chọn nhiều mục)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Săn Học bổng Khuyến khích UEH', id: 'Học bổng', desc: 'GPA >= 3.20 & ĐRL >= 80' },
                    { label: 'Tốt nghiệp đúng hạn loại Giỏi / Xuất sắc', id: 'Tốt nghiệp đúng hạn', desc: 'Tích lũy đầy đủ 120-130 tín chỉ' },
                    { label: 'Cải thiện GPA & Nâng chuẩn học phần', id: 'Cải thiện GPA', desc: 'Tối ưu lại các môn bị điểm C/D' },
                    { label: 'Tích lũy ĐRL Xuất sắc (>= 90 điểm)', id: 'Tích lũy ĐRL', desc: 'Đạt danh hiệu Sinh viên 5 Tốt' }
                  ].map((goal) => {
                    const active = formData.goals.includes(goal.id);
                    return (
                      <div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          active
                            ? 'border-[#29B3C2] bg-[#E8FAFC]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 ${
                            active ? 'bg-[#29B3C2] text-white' : 'border border-slate-300'
                          }`}
                        >
                          {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{goal.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{goal.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Mức Học bổng Khuyến khích UEH hướng tới:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Xuất sắc', 'Giỏi', 'Khá'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData({ ...formData, scholarshipTierTarget: tier })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.scholarshipTierTarget === tier
                          ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{tier}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {tier === 'Xuất sắc' ? 'GPA 3.6+ / ĐRL 90+' : tier === 'Giỏi' ? 'GPA 3.2+ / ĐRL 80+' : 'GPA 2.5+ / ĐRL 65+'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Điểm mạnh, Thói quen học, Thời gian rảnh */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Clock className="w-5 h-5 text-[#29B3C2]" />
                <h3 className="font-bold text-slate-800 text-base">Thói quen học & Khoảng thời gian rảnh</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Điểm mạnh cá nhân</label>
                <div className="flex flex-wrap gap-2">
                  {['Tư duy logic', 'Lập trình', 'Làm việc nhóm', 'Thuyết trình', 'Viết báo cáo / NCKH', 'Ngoại ngữ (IELTS)', 'Tổ chức sự kiện'].map(
                    (str) => {
                      const active = formData.strengths.includes(str);
                      return (
                        <button
                          key={str}
                          type="button"
                          onClick={() => toggleStrength(str)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-[#29B3C2] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {str}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thói quen học tập</label>
                <input
                  type="text"
                  value={formData.studyHabits}
                  onChange={(e) => setFormData({ ...formData, studyHabits: e.target.value })}
                  placeholder="Ví dụ: Học buổi sáng tại Smart Library, tối ôn tập từ 20h"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Khoảng trống thường rảnh trong tuần (thuật toán Smart Schedule sẽ ưu tiên lấp):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Thứ 2 chiều', 'Thứ 3 chiều', 'Thứ 4 sáng', 'Thứ 5 chiều', 'Thứ 6 chiều', 'Thứ 7 trọn ngày', 'Chủ Nhật'].map(
                    (slot) => {
                      const active = formData.freeTimeSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleFreeTime(slot)}
                          className={`px-2.5 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                            active
                              ? 'border-[#29B3C2] bg-[#E8FAFC] text-[#007D8C] font-bold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Bỏ qua bước này
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#29B3C2] hover:bg-[#209aa8] text-white shadow-md shadow-cyan-500/20 transition-all"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-linear-to-r from-[#29B3C2] to-[#008899] hover:opacity-95 text-white shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Hoàn tất & Bắt đầu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
