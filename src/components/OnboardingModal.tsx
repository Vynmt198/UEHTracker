import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, X, Check } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    name: profile.name || '',
    studentId: profile.studentId || '',
    email: profile.email || '',
    cohort: profile.cohort || 'K49',
    faculty: profile.faculty || UEH_FACULTIES[0],
    major: profile.major || MAJORS_BY_FACULTY[UEH_FACULTIES[0]][0],
    scholarshipTierTarget: profile.scholarshipTierTarget || 'Xuất sắc'
  });

  if (!isOpen) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      isOnboarded: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Thiết lập hồ sơ sinh viên</h2>
              <p className="text-xs text-slate-500 font-normal">Cá nhân hóa mục tiêu GPA & ĐRL tại UEH</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="p-5 space-y-4">
          {/* Name & MSSV */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                required
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
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                placeholder="31231021456"
              />
            </div>
          </div>

          {/* Cohort & Faculty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Khóa</label>
              <select
                value={formData.cohort}
                onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
              >
                <option value="K48">K48 (2022-2026)</option>
                <option value="K49">K49 (2023-2027)</option>
                <option value="K50">K50 (2024-2028)</option>
                <option value="K51">K51 (2025-2029)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Khoa / Viện</label>
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

          {/* Major */}
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

          {/* Scholarship Target */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Mục tiêu học bổng UEH
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: 'Xuất sắc', condition: 'GPA ≥ 3.6 • ĐRL ≥ 90' },
                { tier: 'Giỏi', condition: 'GPA ≥ 3.2 • ĐRL ≥ 80' },
                { tier: 'Khá', condition: 'GPA ≥ 2.5 • ĐRL ≥ 65' }
              ].map((item) => {
                const active = formData.scholarshipTierTarget === item.tier;
                return (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => setFormData({ ...formData, scholarshipTierTarget: item.tier as 'Xuất sắc' | 'Giỏi' | 'Khá' })}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      active
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{item.tier}</span>
                      {active && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      {item.condition}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Để sau
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-[#49C8D6] hover:bg-[#3db8c6] transition-colors shadow-xs"
            >
              Lưu hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
