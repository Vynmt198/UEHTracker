import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, X, Check, ArrowRight } from 'lucide-react';
import { Mascot } from './common/Mascot';
import { UEH_FACULTIES, MAJORS_BY_FACULTY } from '../data/uehFaculties';
export const OnboardingModal = ({ isOpen, onClose }) => {
    const { profile, updateProfile } = useApp();
    const [isCompleted, setIsCompleted] = useState(false);
    // Match existing profile faculty with full official list
    const initialFaculty = UEH_FACULTIES.find((f) => f.toLowerCase() === (profile.faculty || '').toLowerCase() ||
        f.toLowerCase().includes((profile.faculty || '').toLowerCase()) ||
        (profile.faculty || '').toLowerCase().includes(f.toLowerCase())) || UEH_FACULTIES[12];
    const availableInitialMajors = MAJORS_BY_FACULTY[initialFaculty] || ['Chuyên ngành tổng hợp'];
    const initialMajor = availableInitialMajors.find((m) => m === profile.major) || availableInitialMajors[0];
    const [formData, setFormData] = useState({
        name: profile.name || '',
        studentId: profile.studentId || '',
        email: profile.email || '',
        cohort: profile.cohort || 'K49',
        faculty: initialFaculty,
        major: initialMajor,
        scholarshipTierTarget: profile.scholarshipTierTarget || 'Xuất sắc',
        targetGPA: profile.targetGPA || 3.6,
        targetDRL: profile.targetDRL || 85
    });
    if (!isOpen)
        return null;
    const handleFinish = (e) => {
        e.preventDefault();
        updateProfile({
            ...formData,
            isOnboarded: true
        });
        setIsCompleted(true);
    };
    const handleCloseModal = () => {
        setIsCompleted(false);
        onClose();
    };
    if (isCompleted) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200">
          <Mascot pose="proud" size="lg" className="mx-auto justify-center"/>
          <h3 className="mt-4 font-bold text-slate-900 text-lg">Thiết lập hồ sơ thành công!</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-xs mx-auto">
            Kipo đã ghi nhận mục tiêu GPA <strong className="text-slate-900">{formData.targetGPA.toFixed(2)}</strong> và ĐRL <strong className="text-slate-900">{formData.targetDRL}đ</strong> của bạn ({formData.faculty}).
          </p>
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Học bổng mục tiêu:</span>
              <strong className="text-slate-900 font-semibold">{formData.scholarshipTierTarget}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Chuyên ngành:</span>
              <strong className="text-slate-900 font-semibold">{formData.major}</strong>
            </div>
          </div>
          <button onClick={handleCloseModal} className="btn-interactive-navy mt-6 w-full py-2.5 px-4 text-xs font-semibold shadow-xs flex items-center justify-center gap-2">
            <span>Bắt đầu khám phá ngay</span>
            <ArrowRight className="w-4 h-4 text-[#49C8D6]" />
          </button>
        </div>
      </div>);
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <User className="w-4 h-4"/>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Thiết lập hồ sơ sinh viên</h2>
              <p className="text-xs text-slate-500 font-normal">Cá nhân hóa mục tiêu GPA & ĐRL tại UEH</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="p-5 space-y-4">
          {/* Name & MSSV */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400" placeholder="Nguyễn Văn An"/>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mã số sinh viên (MSSV)</label>
              <input type="text" required value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400" placeholder="31231021456"/>
            </div>
          </div>

          {/* Cohort & Faculty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Khóa</label>
              <select value={formData.cohort} onChange={(e) => setFormData({ ...formData, cohort: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white">
                <option value="K48">K48 (2022-2026)</option>
                <option value="K49">K49 (2023-2027)</option>
                <option value="K50">K50 (2024-2028)</option>
                <option value="K51">K51 (2025-2029)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Khoa / Viện</label>
              <select value={formData.faculty} onChange={(e) => {
            const newFac = e.target.value;
            const majors = MAJORS_BY_FACULTY[newFac] || ['Chuyên ngành tổng hợp'];
            setFormData({
                ...formData,
                faculty: newFac,
                major: majors[0]
            });
        }} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white">
                {UEH_FACULTIES.map((fac) => (<option key={fac} value={fac}>
                    {fac}
                  </option>))}
              </select>
            </div>
          </div>

          {/* Major */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Chuyên ngành</label>
            <select value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white">
              {(MAJORS_BY_FACULTY[formData.faculty] || ['Chuyên ngành tổng hợp']).map((m) => (<option key={m} value={m}>
                  {m}
                </option>))}
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
            return (<button key={item.tier} type="button" onClick={() => {
                    const newTargetGPA = item.tier === 'Xuất sắc' ? 3.6 : item.tier === 'Giỏi' ? 3.2 : 2.5;
                    const newTargetDRL = item.tier === 'Xuất sắc' ? 90 : item.tier === 'Giỏi' ? 80 : 65;
                    setFormData({
                        ...formData,
                        scholarshipTierTarget: item.tier,
                        targetGPA: newTargetGPA,
                        targetDRL: newTargetDRL
                    });
                }} className={`p-2 rounded-lg border text-left transition-colors ${active
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{item.tier}</span>
                      {active && <Check className="w-3.5 h-3.5 text-slate-900"/>}
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      {item.condition}
                    </div>
                  </button>);
        })}
            </div>
          </div>

          {/* Target GPA and Target DRL Numerical inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">GPA Mục tiêu (Hệ 4)</label>
              <input type="number" step="0.05" min="2.0" max="4.0" value={formData.targetGPA} onChange={(e) => setFormData({ ...formData, targetGPA: parseFloat(e.target.value) || 3.6 })} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 font-medium"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">ĐRL Mục tiêu (/100)</label>
              <input type="number" min="50" max="100" value={formData.targetDRL} onChange={(e) => setFormData({ ...formData, targetDRL: parseInt(e.target.value, 10) || 85 })} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 font-medium"/>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
              Để sau
            </button>
            <button type="submit" className="btn-ueh px-4 py-1.5 rounded-lg text-xs font-medium">
              <span>Lưu hồ sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
};
