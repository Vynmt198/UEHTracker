import React, { useState } from 'react';
import { ScheduleBlock } from '../../types';
import { Calendar, X, Plus } from 'lucide-react';
import { DAY_NAMES } from '../../utils/scheduleMatcher';

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (block: Omit<ScheduleBlock, 'id'>) => void;
  defaultDay?: number;
}

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultDay = 2
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<number>(defaultDay);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('11:15');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Cơ sở B - 279 Nguyễn Tri Phương');
  const [type, setType] = useState<'class' | 'personal' | 'part_time'>('class');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên môn học hoặc sự kiện!');
      return;
    }

    if (startTime >= endTime) {
      alert('Giờ bắt đầu phải trước giờ kết thúc!');
      return;
    }

    onAdd({
      dayOfWeek,
      startTime,
      endTime,
      title: title.trim(),
      location: location.trim(),
      type
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900 text-sm">Thêm sự kiện lịch biểu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tên môn học / Sự kiện</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Toán ứng dụng, Đi làm thêm, Tự học..."
              required
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Thứ trong tuần</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>
                    {DAY_NAMES[d]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Loại sự kiện</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white font-medium"
              >
                <option value="class">Lịch học chính khóa</option>
                <option value="personal">Việc riêng / Tự học</option>
                <option value="part_time">Làm thêm / Thực tập</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Giờ bắt đầu</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Giờ kết thúc</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Địa điểm</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="VD: B1.302 Cơ sở B, Thư viện..."
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
              <div className="svg-wrapper"><Plus className="w-3.5 h-3.5" /></div>
              <span>Thêm lịch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
