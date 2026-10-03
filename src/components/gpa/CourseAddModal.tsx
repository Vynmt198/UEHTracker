import React, { useState } from 'react';
import { Course, CourseStatus, ScoreComponent } from '../../types';
import { BookOpen, Plus, X } from 'lucide-react';

interface CourseAddModalProps {
  isOpen: boolean;
  semesterId: string;
  onClose: () => void;
  onAdd: (course: Omit<Course, 'id'>) => void;
}

export const CourseAddModal: React.FC<CourseAddModalProps> = ({
  isOpen,
  semesterId,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [status, setStatus] = useState<CourseStatus>('Đang học');
  const [aimScore10, setAimScore10] = useState<number>(8.5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên môn học!');
      return;
    }

    // Default 3 standard UEH score components: Chuyên cần 10%, Quá trình 40%, Cuối kỳ 50%
    const defaultComponents: ScoreComponent[] = [
      { id: `c-${Date.now()}-1`, name: 'Chuyên cần & Tham gia lớp', weight: 10, score: null },
      { id: `c-${Date.now()}-2`, name: 'Kiểm tra quá trình & Bài tập lớn', weight: 40, score: null },
      { id: `c-${Date.now()}-3`, name: 'Thi kết thúc học phần', weight: 50, score: null }
    ];

    onAdd({
      semesterId,
      name: name.trim(),
      credits,
      status,
      aimScore10,
      components: defaultComponents
    });

    setName('');
    setCredits(3);
    setAimScore10(8.5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#29B3C2]" />
            <h3 className="font-bold text-slate-800 text-base">Thêm học phần mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên học phần (môn học)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Kinh tế lượng, Marketing căn bản..."
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số tín chỉ</label>
              <select
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
              >
                <option value={1}>1 tín chỉ</option>
                <option value={2}>2 tín chỉ</option>
                <option value={3}>3 tín chỉ (chuẩn UEH)</option>
                <option value={4}>4 tín chỉ</option>
                <option value={5}>5 tín chỉ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái môn</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white font-medium"
              >
                <option value="Chưa học">Chưa học</option>
                <option value="Đang học">Đang học</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">Mục tiêu điểm số (Aim Hệ 10)</label>
              <span className="text-sm font-black text-[#29B3C2]">{aimScore10.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={aimScore10}
              onChange={(e) => setAimScore10(parseFloat(e.target.value))}
              className="w-full accent-[#29B3C2] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>5.0 (Cần qua)</span>
              <span>7.5 (Khá)</span>
              <span>8.5 (Giỏi)</span>
              <span>10.0 (Xuất sắc)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            Học phần sẽ được tự động khởi tạo 3 cột điểm chuẩn UEH (10% - 40% - 50%). Bạn có thể tùy biến thêm/xóa cột điểm sau khi tạo.
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
              <Plus className="w-4 h-4" /> Thêm vào học kỳ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
