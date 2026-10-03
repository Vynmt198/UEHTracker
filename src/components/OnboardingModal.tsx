import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ArrowLeft, BookOpen, Target, Clock, Check } from 'lucide-react';
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Flat Minimal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Thiết lập hồ sơ
              </span>
              <span className="text-xs text-slate-400 font-normal">• Bước {step} / 3</span>
            </div>
            <h2 className="text-base font-semibold text-slate-900 mt-0.5">Hồ sơ sinh viên UEH</h2>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-slate-900' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Khóa, Khoa, Ngành */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Thông tin học tập cá nhân</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                    placeholder="Nguyễn Văn An"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mã số sinh viên (MSSV)</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                    placeholder="31231021456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Khóa</label>
                  <select
                    value={formData.cohort}
                    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
                  >
                    <option value="K48">K48 (2022 - 2026)</option>
                    <option value="K49">K49 (2023 - 2027)</option>
                    <option value="K50">K50 (2024 - 2028)</option>
                    <option value="K51">K51 (2025 - 2029)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Khoa / Viện đào tạo</label>
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
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Chuyên ngành</label>
                <select
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Target className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Mục tiêu học tập & ĐRL</h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Mục tiêu trọng tâm:
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
                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-2.5 ${
                          active
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 shrink-0 ${
                            active ? 'bg-slate-900 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {active && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-900">{goal.label}</p>
                          <p className="text-[11px] text-slate-500 font-normal mt-0.5">{goal.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Mức Học bổng Khuyến khích UEH hướng tới:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Xuất sắc', 'Giỏi', 'Khá'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData({ ...formData, scholarshipTierTarget: tier })}
                      className={`p-2.5 rounded-lg border text-center transition-colors ${
                        formData.scholarshipTierTarget === tier
                          ? 'border-slate-900 bg-slate-900 text-white font-medium'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs">{tier}</div>
                      <div className={`text-[10px] mt-0.5 font-normal ${formData.scholarshipTierTarget === tier ? 'text-slate-300' : 'text-slate-500'}`}>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Clock className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Thói quen & Khung giờ rảnh</h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Điểm mạnh</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Tư duy logic', 'Lập trình', 'Làm việc nhóm', 'Thuyết trình', 'Viết báo cáo / NCKH', 'Ngoại ngữ (IELTS)', 'Tổ chức sự kiện'].map(
                    (str) => {
                      const active = formData.strengths.includes(str);
                      return (
                        <button
                          key={str}
                          type="button"
                          onClick={() => toggleStrength(str)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            active
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Thói quen học tập</label>
                <input
                  type="text"
                  value={formData.studyHabits}
                  onChange={(e) => setFormData({ ...formData, studyHabits: e.target.value })}
                  placeholder="Ví dụ: Tự học tại thư viện vào buổi sáng, tối ôn tập từ 20h"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Khoảng trống thường rảnh trong tuần:
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
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors text-center ${
                            active
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
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
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs font-normal text-slate-400 hover:text-slate-600"
            >
              Bỏ qua
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#49C8D6] hover:bg-[#3db8c6] text-white shadow-xs transition-colors"
            >
              Tiếp tục <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#49C8D6] hover:bg-[#3db8c6] text-white shadow-xs transition-colors"
            >
              Hoàn tất & Bắt đầu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
