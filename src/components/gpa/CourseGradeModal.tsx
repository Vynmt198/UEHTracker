import React, { useState } from 'react';
import { Course, ScoreComponent } from '../../types';
import { validateWeights, calculateCourseFinalScore, convertScore10ToUEH } from '../../utils/gpaCalculator';
import { Plus, Trash2, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface CourseGradeModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedComponents: ScoreComponent[]) => void;
}

export const CourseGradeModal: React.FC<CourseGradeModalProps> = ({ course, isOpen, onClose, onSave }) => {
  const [components, setComponents] = useState<ScoreComponent[]>(() =>
    course.components && course.components.length > 0
      ? JSON.parse(JSON.stringify(course.components))
      : [
          { id: 'c-1', name: 'Chuyên cần', weight: 10, score: 9.0 },
          { id: 'c-2', name: 'Quá trình / Thuyết trình', weight: 40, score: 8.0 },
          { id: 'c-3', name: 'Thi kết thúc học phần', weight: 50, score: null }
        ]
  );

  if (!isOpen) return null;

  const handleAddComponent = () => {
    const newComp: ScoreComponent = {
      id: `comp-${Date.now()}`,
      name: `Đầu điểm ${components.length + 1}`,
      weight: 10,
      score: null
    };
    setComponents([...components, newComp]);
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length <= 1) {
      alert('Học phần phải có tối thiểu 1 thành phần điểm!');
      return;
    }
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleUpdate = (id: string, field: keyof ScoreComponent, value: any) => {
    setComponents(
      components.map((c) => {
        if (c.id !== id) return c;
        return { ...c, [field]: value };
      })
    );
  };

  // Validation
  const weightVal = validateWeights(components);
  const finalCalc = calculateCourseFinalScore(components);
  const uehGrade = convertScore10ToUEH(finalCalc.score10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightVal.isValid) {
      alert(`Lỗi: ${weightVal.message}`);
      return;
    }
    onSave(components);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#E8FAFC] text-[#007D8C] border border-cyan-200 uppercase">
              Bảng đầu điểm động UEH
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-1">{course.name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Số tín chỉ: {course.credits} • Mục tiêu (Aim): {course.aimScore10 || 8.0} Hệ 10
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Các thành phần điểm & Trọng số</h3>
            <button
              type="button"
              onClick={handleAddComponent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#007D8C] bg-[#E8FAFC] hover:bg-cyan-100 border border-cyan-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm đầu điểm
            </button>
          </div>

          {/* Dynamic Table */}
          <div className="space-y-2.5">
            {components.map((comp, index) => (
              <div
                key={comp.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                {/* Name */}
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleUpdate(comp.id, 'name', e.target.value)}
                    placeholder="Tên thành phần (vd: Giữa kỳ, Cuối kỳ...)"
                    className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
                  />
                </div>

                {/* Weight */}
                <div className="w-28 shrink-0 flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={comp.weight}
                    onChange={(e) => handleUpdate(comp.id, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs text-center font-bold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>

                {/* Score */}
                <div className="w-28 shrink-0 flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    disabled={comp.isAbsent}
                    value={comp.score === null || comp.score === undefined ? '' : comp.score}
                    onChange={(e) =>
                      handleUpdate(
                        comp.id,
                        'score',
                        e.target.value === '' ? null : parseFloat(e.target.value)
                      )
                    }
                    placeholder="Chưa có"
                    className="w-full px-2.5 py-1.5 text-xs text-center font-bold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#49C8D6] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span className="text-xs text-slate-400">/10</span>
                </div>

                {/* Absent Checkbox */}
                <label className="flex items-center gap-1.5 text-xs text-red-600 font-semibold cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={!!comp.isAbsent}
                    onChange={(e) => {
                      handleUpdate(comp.id, 'isAbsent', e.target.checked);
                      if (e.target.checked) {
                        handleUpdate(comp.id, 'score', 0);
                      }
                    }}
                    className="rounded text-red-600 focus:ring-red-400"
                  />
                  <span>Vắng thi</span>
                </label>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveComponent(comp.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Xóa cột điểm này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Validation Banner: Mandatory Weight = 100% */}
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
              weightVal.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {weightVal.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">
                {weightVal.isValid
                  ? 'Tổng trọng số chính xác 100%'
                  : `Ràng buộc kỹ thuật: ${weightVal.message}`}
              </p>
              <p className="mt-0.5 text-[11px] opacity-90">
                Quy định UEH: Tổng trọng số các bài thi và kiểm tra quá trình phải bằng đúng 100%. Nút xác nhận chỉ khả dụng khi tổng tỷ lệ đạt 100%.
              </p>
            </div>
          </div>

          {/* Special Zero / Absent Rule Banner */}
          {finalCalc.hasZeroOrAbsent && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <span className="font-bold">Cảnh báo quy chế UEH: </span>
                Có thành phần điểm bằng 0 hoặc vắng thi. Theo quy chế đào tạo, điểm học phần tối đa là 4.9 (Rớt môn - Điểm F).
              </div>
            </div>
          )}

          {/* Realtime Result Card */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Điểm tổng kết ước tính</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#49C8D6]">
                  {finalCalc.score10 !== null ? finalCalc.score10.toFixed(2) : '--'}
                </span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Quy đổi Thang điểm UEH</p>
              <div className="flex items-center gap-2 justify-end mt-0.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white font-black text-sm">
                  {uehGrade.letter}
                </span>
                <span className="text-base font-extrabold text-amber-400">
                  {uehGrade.gpa4.toFixed(1)} / 4.0
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">{uehGrade.description}</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!weightVal.isValid}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all ${
              weightVal.isValid
                ? 'bg-[#29B3C2] hover:bg-[#209aa8] text-white shadow-cyan-500/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            Lưu bảng điểm học phần
          </button>
        </div>
      </div>
    </div>
  );
};
