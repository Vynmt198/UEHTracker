import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, MinusCircle, X, ShieldAlert, Award, Info } from 'lucide-react';
import { DRLManualAdjustment, DRLCriterionNode } from '../../types';
import drlCriteriaRaw from '../../data/drlCriteria.json';

interface ManualAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (adj: Omit<DRLManualAdjustment, 'id' | 'date'>) => void;
}

interface SelectableOption {
  mainId: number;
  mainName: string;
  subId: string;
  label: string;
  fullTitle: string;
  suggestedPoints: number;
  isPenalty: boolean;
  minPoints?: number;
  maxPoints?: number;
}

export const ManualAdjustmentModal: React.FC<ManualAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [isNegative, setIsNegative] = useState<boolean>(false);
  const [selectedMainId, setSelectedMainId] = useState<number>(1);
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [pointsAmount, setPointsAmount] = useState<number>(3);
  const [reason, setReason] = useState('');

  // Extract all selectable 2nd & 3rd level sub-criteria options from drlCriteria.json
  const allOptions: SelectableOption[] = useMemo(() => {
    const list: SelectableOption[] = [];

    (drlCriteriaRaw as any[]).forEach((mainCat) => {
      const mId = parseInt(mainCat.id, 10);
      const mName = mainCat.shortName || mainCat.name;

      (mainCat.children || []).forEach((c2: DRLCriterionNode) => {
        if (c2.children && c2.children.length > 0) {
          c2.children.forEach((c3: DRLCriterionNode) => {
            const isPen = !!c3.isPenalty || !!c2.isPenalty;
            const pts = c3.points ?? (c3.range ? c3.range[0] : isPen ? -2 : 2);
            list.push({
              mainId: mId,
              mainName: mName,
              subId: c3.id,
              label: `${c3.name}`,
              fullTitle: c3.name,
              suggestedPoints: pts,
              isPenalty: isPen,
              minPoints: c3.minPoints,
              maxPoints: c3.maxPoints
            });
          });
        } else {
          // Leaf level 2
          const isPen = !!c2.isPenalty;
          const pts = c2.points ?? (isPen ? -2 : 2);
          list.push({
            mainId: mId,
            mainName: mName,
            subId: c2.id,
            label: `${c2.name}`,
            fullTitle: c2.name,
            suggestedPoints: pts,
            isPenalty: isPen,
            minPoints: c2.minPoints,
            maxPoints: c2.maxPoints
          });
        }
      });
    });

    return list;
  }, []);

  // Filter options based on mode (+ or -) and selected main category
  const filteredSubOptions = useMemo(() => {
    return allOptions.filter((opt) => {
      const matchCategory = opt.mainId === selectedMainId;
      const matchType = isNegative ? opt.isPenalty : !opt.isPenalty;
      return matchCategory && matchType;
    });
  }, [allOptions, selectedMainId, isNegative]);

  // When switching tab (+ / -) or main category, auto-select first available sub-option
  useEffect(() => {
    if (filteredSubOptions.length > 0) {
      const first = filteredSubOptions[0];
      setSelectedSubId(first.subId);
      setPointsAmount(Math.abs(first.suggestedPoints));
    } else {
      setSelectedSubId('custom');
      setPointsAmount(isNegative ? 2 : 3);
    }
  }, [isNegative, selectedMainId, filteredSubOptions]);

  // When picking a sub-criterion from dropdown, auto-suggest points and placeholder
  const handleSubCriteriaChange = (subId: string) => {
    setSelectedSubId(subId);
    if (subId === 'custom') {
      setPointsAmount(isNegative ? 2 : 3);
      return;
    }
    const matched = filteredSubOptions.find((o) => o.subId === subId);
    if (matched) {
      setPointsAmount(Math.abs(matched.suggestedPoints));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do hoặc ghi chú điều chỉnh!');
      return;
    }

    const matched = allOptions.find((o) => o.subId === selectedSubId);
    const finalPoints = isNegative ? -Math.abs(pointsAmount) : Math.abs(pointsAmount);

    onAdd({
      reason: reason.trim(),
      criterionId: selectedMainId,
      subCriterionId: selectedSubId !== 'custom' ? selectedSubId : undefined,
      subCriterionName: matched ? matched.label : undefined,
      points: finalPoints
    });

    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              {isNegative ? (
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              ) : (
                <Award className="w-4 h-4 text-cyan-600" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ghi nhận điểm rèn luyện</h3>
              <p className="text-[11px] text-slate-500">
                Cập nhật điểm cộng khen thưởng hoặc trừ vi phạm theo quy chế UEH
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode Selector Tabs: Cộng (+) vs Trừ (-) */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setIsNegative(false)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                !isNegative
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Điểm cộng (+) Khen thưởng/Chức vụ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNegative(true)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isNegative
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5 text-white" />
              <span>Điểm trừ (-) Vi phạm</span>
            </button>
          </div>

          {/* Level 1: Mục chính (1 trong 5 Mục lớn) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1. Mục tiêu chí lớn
            </label>
            <select
              value={selectedMainId}
              onChange={(e) => setSelectedMainId(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 bg-white"
            >
              <option value={1}>Mục 1: Chấp hành pháp luật & nội quy, quy chế (Max 25đ)</option>
              <option value={2}>Mục 2: Trách nhiệm, tinh thần & thái độ học tập (Max 20đ)</option>
              <option value={3}>Mục 3: Chính trị, xã hội, văn thể mỹ & môi trường (Max 20đ)</option>
              <option value={4}>Mục 4: Ý thức công dân trong quan hệ cộng đồng (Max 15đ)</option>
              <option value={5}>Mục 5: Cán bộ lớp, đoàn thể & thành tích đặc biệt (Max 20đ)</option>
            </select>
          </div>

          {/* Level 2: Tiểu mục chi tiết (Cascader Level 2) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                2. Điều khoản con chi tiết {isNegative ? '(Quy định vi phạm)' : '(Nội dung quy chế)'}
              </label>
              <span className="text-[10px] text-slate-400">
                {filteredSubOptions.length} điều khoản phù hợp
              </span>
            </div>

            <select
              value={selectedSubId}
              onChange={(e) => handleSubCriteriaChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-400 bg-white"
            >
              {filteredSubOptions.map((opt) => (
                <option key={opt.subId} value={opt.subId}>
                  [{opt.subId}] {opt.label}
                </option>
              ))}
              <option value="custom">-- Tùy chỉnh khác (Ghi nhận nội dung tự do) --</option>
            </select>
          </div>

          {/* Points Input & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điểm {isNegative ? 'sẽ bị trừ' : 'được cộng'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono">
                  {isNegative ? '-' : '+'}
                </span>
                <input
                  type="number"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(parseFloat(e.target.value) || 0)}
                  className={`w-full pl-7 pr-3 py-2 rounded-lg border text-xs font-bold font-mono focus:outline-none ${
                    isNegative
                      ? 'border-rose-200 bg-rose-50/30 text-rose-700 focus:border-rose-400'
                      : 'border-slate-200 text-slate-900 focus:border-slate-400'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                *Đã tự điền mức gợi ý theo quy chuẩn UEH. Bạn có thể sửa đổi nếu cần.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minh chứng / Thời gian
              </label>
              <input
                type="text"
                placeholder="VD: QĐ số 124 / Học kỳ 1..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lý do ghi nhận / Diễn giải chi tiết <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isNegative
                  ? 'VD: Vắng sinh hoạt lớp ngày 15/09 không phép; Không hoàn thành khảo sát ĐRL...'
                  : 'VD: Ban cán sự lớp gương mẫu HK1; Tham gia hỗ trợ ngày hội tuyển sinh Khoa...'
              }
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {isNegative
                ? 'Điểm trừ sẽ được trừ trực tiếp vào Mục đã chọn và khấu trừ vào tổng điểm rèn luyện của học kỳ này.'
                : 'Điểm cộng sẽ tích lũy vào Mục đã chọn và bị giới hạn bởi mức Điểm tối đa (Trần điểm) của Mục đó.'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg text-white transition-all shadow-xs ${
                isNegative
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isNegative ? 'Xác nhận trừ điểm' : 'Xác nhận cộng điểm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
