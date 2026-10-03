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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">Điều chỉnh điểm rèn luyện thủ công</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsNegative(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                !isNegative
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Điểm cộng (+)
            </button>

            <button
              type="button"
              onClick={() => setIsNegative(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                isNegative
                  ? 'border-red-300 bg-red-50 text-red-800 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MinusCircle className="w-4 h-4 text-red-600" />
              Điểm trừ (-) Vi phạm
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mục tiêu chí áp dụng</label>
            <select
              value={criterionId}
              onChange={(e) => setCriterionId(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white"
            >
              <option value={1}>Mục 1: Chấp hành pháp luật & nội quy (Tối đa 25đ)</option>
              <option value={2}>Mục 2: Học tập & NCKH tại UEH (Tối đa 20đ)</option>
              <option value={3}>Mục 3: Chính trị, xã hội, thể thao, môi trường (Tối đa 20đ)</option>
              <option value={4}>Mục 4: Ý thức cộng đồng & Tình nguyện (Tối đa 15đ)</option>
              <option value={5}>Mục 5: Cán bộ lớp & Thành tích đặc biệt (Tối đa 20đ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Số điểm điều chỉnh</label>
            <input
              type="number"
              min="0.5"
              max="20"
              step="0.5"
              value={pointsAmount}
              onChange={(e) => setPointsAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lý do điều chỉnh</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Khen thưởng Ban cán sự lớp / Trừ điểm vi phạm quy chế thi..."
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
            />
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#29B3C2] hover:bg-[#209aa8] text-white shadow-md shadow-cyan-500/20"
            >
              Xác nhận ghi điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
