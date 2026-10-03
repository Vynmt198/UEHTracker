import React, { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, academicYear: string) => void;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [yearNumber, setYearNumber] = useState('Năm 2');
  const [term, setTerm] = useState('HK1');
  const [academicYear, setAcademicYear] = useState('2026-2027');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${yearNumber} - ${term}`;
    onAdd(fullName, academicYear);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#29B3C2]" />
            <h3 className="font-bold text-slate-800 text-base">Thêm học kỳ mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Năm đào tạo</label>
              <select
                value={yearNumber}
                onChange={(e) => setYearNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
              >
                <option value="Năm 1">Năm 1</option>
                <option value="Năm 2">Năm 2</option>
                <option value="Năm 3">Năm 3</option>
                <option value="Năm 4">Năm 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Học kỳ (HK)</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
              >
                <option value="HK1">HK1 (Kỳ Mùa Thu)</option>
                <option value="HK2">HK2 (Kỳ Mùa Xuân)</option>
                <option value="HK Hè">HK Hè (Kỳ Phụ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Niên khóa đào tạo</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="VD: 2026-2027"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
            />
            <p className="text-[11px] text-slate-400 mt-1">Định dạng chuẩn UEH: Năm X - HK1 / HK2 + Niên khóa</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#29B3C2] hover:bg-[#209aa8] text-white shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" /> Khởi tạo học kỳ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
