import React, { useState } from 'react';
import { PlusCircle, MinusCircle, X } from 'lucide-react';
import { DRLManualAdjustment } from '../../types';

interface ManualAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (adj: Omit<DRLManualAdjustment, 'id' | 'date'>) => void;
}

export const ManualAdjustmentModal: React.FC<ManualAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [reason, setReason] = useState('');
  const [criterionId, setCriterionId] = useState<number>(1);
  const [isNegative, setIsNegative] = useState<boolean>(false);
  const [pointsAmount, setPointsAmount] = useState<number>(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do điều chỉnh!');
      return;
    }

    const finalPoints = isNegative ? -Math.abs(pointsAmount) : Math.abs(pointsAmount);

    onAdd({
      reason: reason.trim(),
      criterionId,
      points: finalPoints
    });

    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Ghi nhận điểm thủ công</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsNegative(false)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
                !isNegative
                  ? 'border-slate-400 bg-slate-100 text-slate-900'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-700" />
              Điểm cộng (+)
            </button>

            <button
              type="button"
              onClick={() => setIsNegative(true)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
                isNegative
                  ? 'border-red-300 bg-red-50 text-red-800'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5 text-red-600" />
              Điểm trừ (-) Vi phạm
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mục tiêu chí</label>
            <select
              value={criterionId}
              onChange={(e) => setCriterionId(parseInt(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
            >
              <option value={1}>Mục 1: Chấp hành pháp luật & nội quy (Tối đa 25đ)</option>
              <option value={2}>Mục 2: Học tập & NCKH tại UEH (Tối đa 20đ)</option>
              <option value={3}>Mục 3: Chính trị, xã hội, thể thao, môi trường (Tối đa 20đ)</option>
              <option value={4}>Mục 4: Ý thức cộng đồng & Tình nguyện (Tối đa 15đ)</option>
              <option value={5}>Mục 5: Cán bộ lớp & Thành tích đặc biệt (Tối đa 20đ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Số điểm</label>
            <input
              type="number"
              min="0.5"
              max="20"
              step="0.5"
              value={pointsAmount}
              onChange={(e) => setPointsAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Lý do</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Khen thưởng Ban cán sự lớp / Trừ điểm vi phạm..."
              required
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
            />
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
              className="btn-ueh text-xs font-medium px-4 py-1.5"
            >
              <span>Xác nhận</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
