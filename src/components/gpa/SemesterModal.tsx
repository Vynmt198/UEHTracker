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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900 text-sm">Thêm học kỳ mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Năm đào tạo</label>
              <select
                value={yearNumber}
                onChange={(e) => setYearNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
              >
                <option value="Năm 1">Năm 1</option>
                <option value="Năm 2">Năm 2</option>
                <option value="Năm 3">Năm 3</option>
                <option value="Năm 4">Năm 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Học kỳ (HK)</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
              >
                <option value="HK1">HK1 (Mùa Thu)</option>
                <option value="HK2">HK2 (Mùa Xuân)</option>
                <option value="HK Hè">HK Hè (Phụ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Niên khóa</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="VD: 2026-2027"
              required
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-normal">Quy chuẩn UEH: Năm X - HK1 / HK2 + Niên khóa</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#49C8D6] hover:bg-[#3db8c6] text-white shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Tạo học kỳ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
