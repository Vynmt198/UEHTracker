import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UEHActivity } from '../../types';
import { DAY_NAMES } from '../../utils/scheduleMatcher';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Tag,
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

  // Find which main criteria are capped
  const cappedMainIds = new Set(criteriaList.filter((c) => c.isCapped).map((c) => c.id.toString()));

  const filteredActivities = allActivities.filter((act) => {
    // Search
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      act.code.toLowerCase().includes(searchTerm.toLowerCase());

    // Faculty filter
    const matchesFaculty =
      facultyFilter === 'Tất cả' ||
      act.facultyTarget === 'Tất cả' ||
      act.facultyTarget.toLowerCase().includes(facultyFilter.toLowerCase());

    // Criterion filter
    const matchesCriterion =
      criterionFilter === 'all' ||
      act.allocations.some((alloc) => alloc.criterionCode.startsWith(criterionFilter));

    return matchesSearch && matchesFaculty && matchesCriterion;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#29B3C2]" />
              Danh mục Hoạt động Rèn luyện UEH
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống tự động phân bổ điểm vào các tiêu chí con tương ứng và ngăn cộng dồn khi chạm trần.
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#E8FAFC] text-[#007D8C] border border-cyan-200">
            Đã đăng ký / tham gia: {registeredActivityIds.length} hoạt động
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, ban tổ chức, tag..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#49C8D6]"
            />
          </div>

          {/* Faculty filter */}
          <div>
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white"
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

          {/* Criteria filter */}
          <div>
            <select
              value={criterionFilter}
              onChange={(e) => setCriterionFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#49C8D6] bg-white"
            >
              <option value="all">Tất cả 5 Mục tiêu chí</option>
              <option value="1">Mục 1: Pháp luật & Nội quy</option>
              <option value="2">Mục 2: Học tập & NCKH UEH</option>
              <option value="3">Mục 3: Chính trị, Thể thao, Môi trường</option>
              <option value="4">Mục 4: Ý thức cộng đồng & Tình nguyện</option>
              <option value="5">Mục 5: Cán bộ lớp & Thành tích</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((act) => {
          const isRegistered = registeredActivityIds.includes(act.id);

          // Check if any allocated criterion is already capped
          const touchesCapped = act.allocations.some((alloc) =>
            cappedMainIds.has(alloc.criterionCode.split('.')[0])
          );

          return (
            <div
              key={act.id}
              className={`bg-white rounded-3xl border p-5 transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                isRegistered
                  ? 'border-[#29B3C2] bg-linear-to-b from-[#E8FAFC]/50 to-white shadow-xs'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-3">
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-600 font-mono">
                      {act.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8FAFC] text-[#007D8C]">
                      {act.facultyTarget}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    +{act.totalPoints} Điểm
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">BTC: {act.organizer}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {act.description}
                </p>

                {/* Time & Location */}
                <div className="space-y-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#29B3C2]" />
                    <span>
                      {DAY_NAMES[act.dayOfWeek]} ({act.date})
                    </span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-[#29B3C2]" />
                    <span>
                      {act.startTime} - {act.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span className="truncate">{act.location}</span>
                  </div>
                </div>

                {/* Multi-Criteria Allocation Badges (Đặc tả: Xử lý đa tiêu chí) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Phân bổ tiêu chí con:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {act.allocations.map((alloc) => (
                      <span
                        key={alloc.criterionCode}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-50 border border-cyan-200 text-[#007D8C] text-[11px] font-bold"
                      >
                        <span>Mục {alloc.criterionCode}:</span>
                        <span>+{alloc.points}đ</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cap Warning on this activity */}
                {touchesCapped && !isRegistered && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Chứa tiêu chí bạn đã chạm trần (phần điểm đó sẽ không được cộng dồn)</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleActivityRegistration(act.id)}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isRegistered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#29B3C2] hover:bg-[#209aa8] text-white shadow-cyan-500/15'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
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
