import React, { useState } from 'react';
import { CriteriaProgress } from '../../context/AppContext';
import { DRLSubCriteriaProgress } from '../../types';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DrlCriteriaTreeProps {
  criteriaList: CriteriaProgress[];
}

const cleanCriterionTitle = (title: string, code?: string): string => {
  if (!title) return '';
  if (code) {
    const escaped = code.replace(/\./g, '\\.');
    return title.replace(new RegExp(`^${escaped}\\.?\\s*`, 'i'), '').trim();
  }
  return title.replace(/^(\d+(\.\d+)*)\.?\s*/, '').trim();
};

export const DrlCriteriaTree: React.FC<DrlCriteriaTreeProps> = ({ criteriaList }) => {
  const [expandedMain, setExpandedMain] = useState<Record<number, boolean>>({ 1: true });
  const [expandedSub, setExpandedSub] = useState<Record<string, boolean>>({
    '1.2': true,
    '1.3': true,
    '1.4': true
  });

  const toggleMain = (id: number) => {
    setExpandedMain((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSub = (code: string) => {
    setExpandedSub((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const renderSubItem = (sub: DRLSubCriteriaProgress, depth = 0) => {
    const hasChildren = sub.children && sub.children.length > 0;
    const isSubExpanded = !!expandedSub[sub.code];

    const isPenalty = !!sub.isPenalty;
    const isDefault = !!sub.isDefault;
    const percent = sub.maxPoints > 0
      ? Math.min(100, Math.round((sub.currentPoints / sub.maxPoints) * 100))
      : 0;

    return (
      <div key={sub.code} className="space-y-1">
        <div
          onClick={() => hasChildren && toggleSub(sub.code)}
          className={`py-2 px-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-colors ${
            hasChildren ? 'cursor-pointer hover:bg-slate-100/70' : 'hover:bg-slate-50'
          } ${depth > 0 ? 'ml-3 sm:ml-5 border-l-2 border-slate-200 pl-3' : 'bg-white border border-slate-100'}`}
        >
          {/* Left: Code, Name, Badges */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren && (
              <button
                type="button"
                className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
              >
                {isSubExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
              {sub.code}
            </span>

            <span
              className={`text-xs font-medium truncate ${
                isPenalty ? 'text-rose-700' : 'text-slate-800'
              }`}
            >
              {cleanCriterionTitle(sub.title, sub.code)}
            </span>

            {isDefault && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 shrink-0">
                Sàn UEH
              </span>
            )}

            {isPenalty && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-0.5">
                <AlertOctagon className="w-2.5 h-2.5" />
                Vi phạm
              </span>
            )}
          </div>

          {/* Right: Progress bar & Points */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono">
            {!isPenalty && sub.maxPoints > 0 && (
              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden md:block">
                <div
                  className="h-full rounded-full bg-[#49C8D6] transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}

            <div
              className={`text-xs font-bold w-16 text-right ${
                isPenalty ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {sub.currentPoints > 0 ? `+${sub.currentPoints}` : sub.currentPoints}
              {!isPenalty && <span className="text-slate-400 font-normal text-[10px]">/{sub.maxPoints}đ</span>}
            </div>

            <div className="w-16 text-right">
              {sub.isCapped ? (
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Đạt trần
                </span>
              ) : isPenalty ? (
                <span className="text-[10px] text-slate-400 font-mono">
                  {sub.minPoints ? `Min ${sub.minPoints}đ` : '-'}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">
                  -{Math.max(0, sub.maxPoints - sub.currentPoints)}đ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Children (Level 3) */}
        {hasChildren && isSubExpanded && (
          <div className="space-y-1 pt-0.5 animate-in fade-in duration-150">
            {sub.children!.map((child) => renderSubItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {criteriaList.map((crit) => {
        const isExpanded = !!expandedMain[crit.id];
        const percent = Math.min(100, Math.round((crit.currentPoints / crit.maxPoints) * 100));

        const baseDesc =
          crit.id === 1
            ? 'Sẵn 15đ nội quy'
            : crit.id === 2
            ? 'Sẵn 10đ học tập'
            : crit.id === 3
            ? 'Sẵn 5đ văn thể mỹ'
            : crit.id === 4
            ? 'Sẵn 10đ quan hệ CĐ'
            : 'Sẵn 10đ cán bộ lớp';

        return (
          <div key={crit.id} className="interactive-card !p-0 overflow-hidden shadow-xs">
            {/* Header Row - Level 1 (Mục lớn chính xác theo văn bản gốc UEH) */}
            <div
              onClick={() => toggleMain(crit.id)}
              className="p-4 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100"
            >
              {/* Col 1: Tên đầy đủ chính thức UEH */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-xs">
                  {crit.id}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {crit.name || crit.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-cyan-800 font-semibold bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">
                      ✓ {baseDesc}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {crit.subCriteriaProgress.length} tiêu chí con
                    </span>
                  </div>
                </div>
              </div>

              {/* Col 2: Thanh tiến độ mỏng (#49C8D6) */}
              <div className="w-full md:w-52 shrink-0 flex items-center gap-3">
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#49C8D6] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Col 3: Tỉ lệ điểm: current/max */}
              <div className="text-xs font-bold text-slate-900 w-20 text-left md:text-right shrink-0 font-mono">
                {crit.currentPoints}/{crit.maxPoints}đ
              </div>

              {/* Col 4: Badge Đạt trần / Thiếu hụt & Nút mở rộng */}
              <div className="w-24 flex items-center justify-end gap-2 shrink-0">
                {crit.isCapped ? (
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                    Đạt trần
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    -{Math.max(0, crit.maxPoints - crit.currentPoints)}đ
                  </span>
                )}

                <span className="text-slate-400 p-0.5 hover:text-slate-700 transition-transform duration-200">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </div>
            </div>

            {/* Level 2 & Level 3 Sub-Criteria Tree Content */}
            {isExpanded && (
              <div className="bg-slate-50/50 p-4 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
                {crit.subCriteriaProgress.map((sub) => renderSubItem(sub, 0))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
