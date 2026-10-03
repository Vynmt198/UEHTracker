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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Bảng đầu điểm học phần
            </span>
            <h2 className="text-base font-semibold text-slate-900 mt-0.5">{course.name}</h2>
            <p className="text-xs text-slate-500 font-normal">
              {course.credits} tín chỉ • Mục tiêu: {course.aimScore10 || 8.0} Hệ 10
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Các cột điểm & Tỷ lệ trọng số
            </h3>
            <button
              type="button"
              onClick={handleAddComponent}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm đầu điểm
            </button>
          </div>

          {/* Dynamic Table */}
          <div className="space-y-2">
            {components.map((comp, index) => (
              <div
                key={comp.id}
                className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-2.5"
              >
                <div className="w-5 h-5 rounded bg-slate-100 text-slate-500 text-[11px] font-medium flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                {/* Name */}
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleUpdate(comp.id, 'name', e.target.value)}
                    placeholder="Tên thành phần (vd: Giữa kỳ, Cuối kỳ...)"
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                {/* Weight */}
                <div className="w-24 shrink-0 flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={comp.weight}
                    onChange={(e) => handleUpdate(comp.id, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs text-center font-medium rounded border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                  <span className="text-xs text-slate-500 font-medium">%</span>
                </div>

                {/* Score */}
                <div className="w-24 shrink-0 flex items-center gap-1">
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
                    className="w-full px-2 py-1 text-xs text-center font-medium rounded border border-slate-200 focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span className="text-[11px] text-slate-400">/10</span>
                </div>

                {/* Absent Checkbox */}
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={!!comp.isAbsent}
                    onChange={(e) => {
                      handleUpdate(comp.id, 'isAbsent', e.target.checked);
                      if (e.target.checked) {
                        handleUpdate(comp.id, 'score', 0);
                      }
                    }}
                    className="rounded text-slate-700"
                  />
                  <span>Vắng thi</span>
                </label>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveComponent(comp.id)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors shrink-0"
                  title="Xóa cột điểm này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Validation Banner: Mandatory Weight = 100% */}
          <div
            className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              weightVal.isValid
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {weightVal.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {weightVal.isValid
                  ? 'Tổng trọng số đạt 100%'
                  : weightVal.message}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 font-normal">
                Quy định UEH: Tổng trọng số các bài thi và kiểm tra quá trình phải bằng đúng 100%. Nút xác nhận chỉ khả dụng khi tổng tỷ lệ đạt 100%.
              </p>
            </div>
          </div>

          {/* Special Zero / Absent Rule Banner */}
          {finalCalc.hasZeroOrAbsent && (
            <div className="p-3 rounded-lg bg-red-50/70 border border-red-200 text-red-900 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="font-semibold">Cảnh báo quy chế UEH: </span>
                Có thành phần điểm bằng 0 hoặc vắng thi. Theo quy chế đào tạo, điểm học phần tối đa là 4.9 (Rớt môn - Điểm F).
              </div>
            </div>
          )}

          {/* Realtime Result Card - Flat & Minimal */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-normal">Điểm tổng kết ước tính</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-semibold text-slate-900">
                  {finalCalc.score10 !== null ? finalCalc.score10.toFixed(2) : '--'}
                </span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 font-normal">Quy đổi Thang UEH</p>
              <div className="flex items-center gap-2 justify-end mt-0.5">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900 font-semibold text-xs">
                  {uehGrade.letter}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {uehGrade.gpa4.toFixed(1)} / 4.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{uehGrade.description}</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!weightVal.isValid}
            className={`px-4 py-2 rounded-lg text-xs font-medium shadow-xs transition-colors ${
              weightVal.isValid
                ? 'bg-[#49C8D6] hover:bg-[#3db8c6] text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Lưu bảng điểm
          </button>
        </div>
      </div>
    </div>
  );
};
