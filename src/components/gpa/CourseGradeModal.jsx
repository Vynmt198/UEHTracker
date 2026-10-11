import React, { useState } from 'react';
import { validateWeights, calculateCourseFinalScore, convertScore10ToUEH } from '../../utils/gpaCalculator';
import { Plus, Trash2, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export const CourseGradeModal = ({ course, isOpen, onClose, onSave }) => {
    const [components, setComponents] = useState(() => course.components && course.components.length > 0
        ? JSON.parse(JSON.stringify(course.components))
        : [
            { id: 'c-1', name: 'Điểm quá trình', weight: 50, score: '' },
            { id: 'c-2', name: 'Điểm kết thúc học phần', weight: 50, score: '' }
        ]);

    if (!isOpen)
        return null;

    const handleAddComponent = () => {
        const newComp = {
            id: `comp-${Date.now()}`,
            name: `Thành phần điểm ${components.length + 1}`,
            weight: 10,
            score: ''
        };
        setComponents([...components, newComp]);
    };

    const handleRemoveComponent = (id) => {
        if (components.length <= 1) {
            alert('Học phần phải có tối thiểu 1 thành phần điểm!');
            return;
        }
        setComponents(components.filter((c) => c.id !== id));
    };

    const handleUpdate = (id, field, value) => {
        setComponents(components.map((c) => {
            if (c.id !== id)
                return c;
            return { ...c, [field]: value };
        }));
    };

    const handleWeightChange = (id, value) => {
        if (value === '') {
            handleUpdate(id, 'weight', '');
            return;
        }
        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
            handleUpdate(id, 'weight', numericValue);
        }
    };

    const handleScoreChange = (id, value) => {
        if (value === '') {
            handleUpdate(id, 'score', '');
            return;
        }
        if (value.endsWith('.') || value.endsWith(',')) {
            handleUpdate(id, 'score', value);
            return;
        }
        const cleanValue = value.replace(',', '.');
        const numericValue = Number(cleanValue);
        if (!isNaN(numericValue)) {
            if (cleanValue.length > 1 && cleanValue.startsWith('0') && !cleanValue.startsWith('0.')) {
                handleUpdate(id, 'score', numericValue);
            }
            else {
                handleUpdate(id, 'score', cleanValue);
            }
        }
    };

    // Validation: Kiểm tra từng thành phần điểm xem có bị thiếu không
    const componentValidations = components.map((comp, idx) => {
        const itemNumber = idx + 1;
        const nameEmpty = !comp.name || comp.name.trim() === '';
        
        const weightEmpty = comp.weight === '' || comp.weight === null || comp.weight === undefined;
        const weightNum = Number(comp.weight);
        const weightInvalid = weightEmpty || isNaN(weightNum) || weightNum <= 0;

        const scoreEmpty = comp.score === '' || comp.score === null || comp.score === undefined;
        const scoreNum = Number(comp.score);
        const scoreInvalid = !comp.isAbsent && (scoreEmpty || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10);

        const errors = [];
        if (nameEmpty) errors.push(`Cột #${itemNumber}: Chưa nhập tên đầu điểm`);
        if (weightInvalid) errors.push(`Cột #${itemNumber}: Trọng số phải lớn hơn 0%`);
        if (scoreInvalid) {
            if (scoreEmpty) {
                errors.push(`Cột #${itemNumber} (${comp.name || 'Thành phần ' + itemNumber}): Chưa nhập điểm số (hoặc chưa chọn Vắng thi)`);
            } else {
                errors.push(`Cột #${itemNumber} (${comp.name || 'Thành phần ' + itemNumber}): Điểm số phải trong khoảng 0 - 10`);
            }
        }

        return {
            nameEmpty,
            weightInvalid,
            scoreInvalid,
            errors
        };
    });

    const itemErrors = componentValidations.flatMap((cv) => cv.errors);

    // Convert components to valid ScoreComponent[] for calculation and saving
    const normalizedComponents = components.map((c) => ({
        id: c.id,
        name: c.name,
        weight: typeof c.weight === 'number' ? c.weight : Number(c.weight) || 0,
        score: c.score === '' || c.score === null || c.score === undefined ? null : Number(c.score),
        isAbsent: c.isAbsent
    }));

    const weightVal = validateWeights(normalizedComponents);

    // Check process weight <= 70%
    const finalExamComponent = normalizedComponents.find((c) => {
        const nameLower = (c.name || '').toLowerCase();
        return nameLower.includes('kết thúc') || nameLower.includes('cuối kỳ');
    });
    const processWeight = normalizedComponents
        .filter((c) => c !== finalExamComponent)
        .reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
    const isProcessWeightValid = processWeight <= 70;

    // Tổng hợp tất cả lỗi validation
    const allErrors = [...itemErrors];
    if (!weightVal.isValid) {
        allErrors.push(`Quy định trọng số: ${weightVal.message}`);
    }
    if (finalExamComponent && !isProcessWeightValid) {
        allErrors.push(`Quy chế UEH: Tổng trọng số điểm quá trình (${processWeight}%) không được vượt quá 70%!`);
    }

    const isAllDataFilled = allErrors.length === 0;

    // Chỉ tính điểm tổng kết khi TẤT CẢ các thành phần đã được nhập điểm đầy đủ (hoặc vắng thi)
    const finalCalc = isAllDataFilled ? calculateCourseFinalScore(normalizedComponents) : null;
    const uehGrade = finalCalc && finalCalc.score10 !== null ? convertScore10ToUEH(finalCalc.score10, finalCalc.hasZeroOrAbsent) : null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isAllDataFilled) {
            alert(`Không thể lưu bảng điểm! Vui lòng nhập đầy đủ các thông tin:\n\n- ${allErrors.join('\n- ')}`);
            return;
        }
        onSave(normalizedComponents);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] relative">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-extrabold text-[#0B2545] uppercase tracking-wider">
                            Bảng đầu điểm học phần
                        </span>
                        <h2 className="text-base font-extrabold text-slate-900 mt-0.5">{course.name}</h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {course.credits} tín chỉ • Mục tiêu: {course.aimScore10 || 8.0} Hệ 10
                        </p>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Đóng"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                            Các cột điểm & Tỷ lệ trọng số
                        </h3>
                        <button 
                            type="button" 
                            onClick={handleAddComponent} 
                            className="btn-interactive-outline text-xs px-2.5 py-1.5 font-bold shadow-2xs"
                        >
                            <Plus className="w-3.5 h-3.5"/>
                            <span>Thêm đầu điểm</span>
                        </button>
                    </div>

                    {/* Dynamic Table */}
                    <div className="space-y-2.5">
                        {components.map((comp, index) => {
                            const cv = componentValidations[index] || {};
                            return (
                                <div 
                                    key={comp.id} 
                                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-2.5 ${
                                        cv.nameEmpty || cv.weightInvalid || cv.scoreInvalid
                                            ? 'border-amber-300 bg-amber-50/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="w-6 h-6 rounded-lg bg-[#0B2545]/5 text-[#0B2545] text-xs font-extrabold flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 w-full sm:w-auto">
                                        <input 
                                            type="text" 
                                            value={comp.name} 
                                            onChange={(e) => handleUpdate(comp.id, 'name', e.target.value)} 
                                            placeholder="Tên thành phần (vd: Giữa kỳ, Cuối kỳ...)" 
                                            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                                                cv.nameEmpty 
                                                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500' 
                                                    : 'border-slate-200 focus:border-[#49C8D6]'
                                            } focus:outline-none font-medium`}
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div className="w-24 shrink-0 flex items-center gap-1">
                                        <input 
                                            type="text" 
                                            inputMode="numeric" 
                                            value={comp.weight} 
                                            onChange={(e) => handleWeightChange(comp.id, e.target.value)} 
                                            placeholder="0" 
                                            className={`w-full px-2 py-1.5 text-xs text-center font-bold rounded-lg border transition-colors ${
                                                cv.weightInvalid 
                                                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500' 
                                                    : 'border-slate-200 focus:border-[#49C8D6]'
                                            } focus:outline-none`}
                                        />
                                        <span className="text-xs text-slate-500 font-bold">%</span>
                                    </div>

                                    {/* Score */}
                                    <div className="w-24 shrink-0 flex items-center gap-1">
                                        <input 
                                            type="text" 
                                            inputMode="decimal" 
                                            disabled={comp.isAbsent} 
                                            value={comp.score === null || comp.score === undefined ? '' : comp.score} 
                                            onChange={(e) => handleScoreChange(comp.id, e.target.value)} 
                                            placeholder="Chưa có" 
                                            className={`w-full px-2 py-1.5 text-xs text-center font-black rounded-lg border transition-colors ${
                                                cv.scoreInvalid 
                                                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 placeholder:text-rose-400 focus:border-rose-500' 
                                                    : 'border-slate-200 focus:border-[#49C8D6]'
                                            } focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-mono`}
                                        />
                                        <span className="text-[11px] text-slate-400 font-medium">/10</span>
                                    </div>

                                    {/* Absent Checkbox */}
                                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer shrink-0 font-medium select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={!!comp.isAbsent} 
                                            onChange={(e) => {
                                                handleUpdate(comp.id, 'isAbsent', e.target.checked);
                                                if (e.target.checked) {
                                                    handleUpdate(comp.id, 'score', 0);
                                                }
                                            }} 
                                            className="rounded text-[#0B2545] accent-[#0B2545] focus:ring-[#49C8D6]"
                                        />
                                        <span>Vắng thi</span>
                                    </label>

                                    {/* Remove */}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveComponent(comp.id)} 
                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0" 
                                        title="Xóa cột điểm này"
                                    >
                                        <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* CẢNH BÁO KHI CHƯA NHẬP ĐỦ DỮ LIỆU */}
                    {!isAllDataFilled && (
                        <div className="p-3.5 rounded-xl bg-amber-50/95 border border-amber-300 text-amber-950 text-xs space-y-2 shadow-2xs">
                            <div className="flex items-center gap-2 font-bold text-amber-900">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Chưa nhập đủ dữ liệu — Không thể lưu bảng điểm</span>
                            </div>
                            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                Vui lòng hoàn tất các mục sau trước khi lưu bảng điểm học phần:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900 pl-1 font-medium">
                                {allErrors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Validation Banner: Mandatory Weight = 100% */}
                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        weightVal.isValid
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}>
                        {weightVal.isValid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                        )}
                        <div>
                            <p className="font-bold">
                                {weightVal.isValid ? 'Tổng trọng số đạt 100%' : weightVal.message}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500 font-normal">
                                Quy định UEH: Tổng trọng số các bài thi và kiểm tra quá trình phải bằng đúng 100%. Nút xác nhận chỉ khả dụng khi tổng tỷ lệ đạt 100%.
                            </p>
                        </div>
                    </div>

                    {/* Special Zero / Absent Rule Banner */}
                    {finalCalc && finalCalc.hasZeroOrAbsent && (
                        <div className="p-3 rounded-xl bg-red-50/80 border border-red-200 text-red-900 text-xs flex items-center gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0"/>
                            <div>
                                <span className="font-bold">Cảnh báo quy chế UEH: </span>
                                Có thành phần điểm bằng 0 hoặc vắng thi. Theo quy chế đào tạo, điểm học phần tối đa là 4.9 (Rớt môn - Điểm F).
                            </div>
                        </div>
                    )}

                    {/* Realtime Result Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Điểm tổng kết ước tính</p>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className={`text-2xl font-black font-mono ${isAllDataFilled ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {finalCalc && finalCalc.score10 !== null ? finalCalc.score10.toFixed(2) : '--'}
                                </span>
                                <span className="text-xs text-slate-400">/ 10</span>
                            </div>
                            {!isAllDataFilled && (
                                <p className="text-[10px] text-amber-700 font-medium mt-0.5">Chưa đủ điểm các cột để tính</p>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium">Quy đổi Thang UEH</p>
                            <div className="flex items-center gap-2 justify-end mt-0.5">
                                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900 font-bold text-xs font-mono">
                                    {uehGrade ? uehGrade.letter : '--'}
                                </span>
                                <span className="text-sm font-bold text-slate-900 font-mono">
                                    {uehGrade ? `${uehGrade.gpa4.toFixed(1)} / 4.0` : '-- / 4.0'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                                {uehGrade ? uehGrade.description : 'Đang chờ nhập đủ điểm'}
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="btn-interactive-outline text-xs px-3.5 py-1.5 font-medium"
                    >
                        Hủy bỏ
                    </button>

                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={!isAllDataFilled} 
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            isAllDataFilled
                                ? 'btn-ueh cursor-pointer'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none opacity-80'
                        }`}
                        title={!isAllDataFilled ? 'Chưa nhập đủ dữ liệu để lưu bảng điểm' : 'Lưu bảng điểm'}
                    >
                        <span>Lưu bảng điểm</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
