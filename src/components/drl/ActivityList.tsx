import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UEHActivity } from '../../types';
import { DAY_NAMES } from '../../utils/scheduleMatcher';
import {
  Search,
  Check,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Award
} from 'lucide-react';

export const ActivityList: React.FC = () => {
  const { allActivities, registeredActivityIds, toggleActivityRegistration, getDRLProgress } =
    useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('Tất cả');
  const [criterionFilter, setCriterionFilter] = useState('all');

  const { criteriaList } = getDRLProgress();
  const cappedMainIds = new Set(criteriaList.filter((c) => c.isCapped).map((c) => c.id.toString()));

  const filteredActivities = allActivities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      act.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty =
      facultyFilter === 'Tất cả' ||
      act.facultyTarget === 'Tất cả' ||
      act.facultyTarget.toLowerCase().includes(facultyFilter.toLowerCase());

    const matchesCriterion =
      criterionFilter === 'all' ||
      act.allocations.some((alloc) => alloc.criterionCode.startsWith(criterionFilter));

    return matchesSearch && matchesFaculty && matchesCriterion;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls - Flat & Minimal */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              Danh mục Hoạt động Rèn luyện
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Tự động phân bổ điểm vào các tiêu chí con tương ứng và ngăn cộng dồn khi chạm trần.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-600 px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
            Đã đăng ký: {registeredActivityIds.length} hoạt động
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, BTC, mã..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 bg-white font-medium"
            >
              <option value="Tất cả">Tất cả Khoa / Viện</option>
              <option value="Công nghệ thông tin">Khoa CNTT Kinh doanh</option>
              <option value="Marketing">Khoa Kinh doanh quốc tế - Marketing</option>
              <option value="Tài chính">Khoa Tài chính - Ngân hàng</option>
              <option value="Kế toán">Khoa Kế toán - Kiểm toán</option>
              <option value="Quản trị">Khoa Kinh tế - Quản trị</option>
              <option value="Luật">Khoa Luật</option>
            </select>
          </div>

          <div>
            <select
              value={criterionFilter}
              onChange={(e) => setCriterionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 bg-white font-medium"
            >
              <option value="all">Tất cả 5 Mục tiêu chí</option>
              <option value="1">Mục 1: Pháp luật & Nội quy</option>
              <option value="2">Mục 2: Học tập & NCKH</option>
              <option value="3">Mục 3: Chính trị, Thể thao, MT</option>
              <option value="4">Mục 4: Ý thức cộng đồng</option>
              <option value="5">Mục 5: Cán bộ lớp & Thành tích</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Grid - Flat clean cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredActivities.map((act) => {
          const isRegistered = registeredActivityIds.includes(act.id);
          const touchesCapped = act.allocations.some((alloc) =>
            cappedMainIds.has(alloc.criterionCode.split('.')[0])
          );

          return (
            <div
              key={act.id}
              className={`bg-white rounded-xl border p-4.5 transition-colors flex flex-col justify-between space-y-3 shadow-xs ${
                isRegistered
                  ? 'border-slate-400 bg-slate-50/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2.5">
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      {act.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-normal">
                      {act.facultyTarget}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                    +{act.totalPoints}đ
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">BTC: {act.organizer}</p>
                </div>

                <p className="text-xs text-slate-600 font-normal line-clamp-2 leading-relaxed">
                  {act.description}
                </p>

                {/* Time & Location */}
                <div className="space-y-1 text-xs text-slate-500 pt-1 font-normal">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {DAY_NAMES[act.dayOfWeek]} ({act.date})
                    </span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {act.startTime} - {act.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{act.location}</span>
                  </div>
                </div>

                {/* Multi-Criteria Allocation */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium mb-1">
                    Phân bổ tiêu chí:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {act.allocations.map((alloc) => (
                      <span
                        key={alloc.criterionCode}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium"
                      >
                        <span>Mục {alloc.criterionCode}:</span>
                        <span>+{alloc.points}đ</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cap Warning */}
                {touchesCapped && !isRegistered && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Chứa tiêu chí bạn đã chạm trần (phần điểm đó không cộng dồn)</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleActivityRegistration(act.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                    isRegistered
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-[#49C8D6] hover:bg-[#3db8c6] text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {isRegistered ? 'Đã tham gia (Click để hủy)' : 'Đăng ký tham gia'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
