import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
export const SemesterModal = ({ isOpen, onClose, onAdd }) => {
    const [yearNumber, setYearNumber] = useState('Năm 2');
    const [term, setTerm] = useState('HK1');
    const [academicYear, setAcademicYear] = useState('2026-2027');
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        const fullName = `${yearNumber} - ${term}`;
        onAdd(fullName, academicYear);
        onClose();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 max-w-md w-full p-6 space-y-4 relative overflow-hidden">
        {/* Soft ambient glow */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-[#49C8D6]/15 via-[#0B2545]/10 to-transparent rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#0B2545] text-[#49C8D6] shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0B2545] text-sm">Thêm học kỳ mới</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0B2545] mb-1">Năm đào tạo</label>
              <select value={yearNumber} onChange={(e) => setYearNumber(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6] bg-white text-slate-800 font-medium">
                <option value="Năm 1">Năm 1</option>
                <option value="Năm 2">Năm 2</option>
                <option value="Năm 3">Năm 3</option>
                <option value="Năm 4">Năm 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2545] mb-1">Học kỳ (HK)</label>
              <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6] bg-white text-slate-800 font-medium">
                <option value="HK1">HK1</option>
                <option value="HK2">HK2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2545] mb-1">Niên khóa</label>
            <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="VD: 2026-2027" required className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#49C8D6] focus:ring-1 focus:ring-[#49C8D6] text-slate-800 font-medium"/>
            <p className="text-[11px] text-slate-500 mt-1 font-normal">Quy chuẩn UEH: Năm X - HK1 / HK2 + Niên khóa</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-interactive-outline text-xs px-3.5 py-1.5 font-medium">
              Hủy
            </button>
            <button type="submit" className="btn-ueh text-xs font-semibold px-4 py-1.5">
              <div className="svg-wrapper"><Plus className="w-3.5 h-3.5"/></div>
              <span>Tạo học kỳ</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
};
