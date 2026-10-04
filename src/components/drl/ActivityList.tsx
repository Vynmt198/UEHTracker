import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UEHActivity } from '../../types';
import {
  Search,
  Check,
  Calendar,
  Clock,
  MapPin,
  Award,
  X,
  FileText,
  UserCheck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Mascot } from '../common/Mascot';

export const ActivityList: React.FC = () => {
  const {
    allActivities,
    registeredActivityIds,
    toggleActivityRegistration,
    getDRLProgress,
    currentDrlSemesterId,
    setCurrentDrlSemesterId,
    semesters
  } = useApp();

  const currentSemester = semesters.find((s) => s.id === currentDrlSemesterId) || semesters[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [criterionFilter, setCriterionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'ongoing' | 'closed'>('all');

  // Slide-over Panel state
  const [selectedActivity, setSelectedActivity] = useState<UEHActivity | null>(null);

  const { criteriaList } = getDRLProgress();

  // Activity operational status helper
  const getActivityStatus = (act: UEHActivity) => {
    const todayStr = '2026-10-04';
    if (act.date < todayStr) {
      return {
        key: 'closed' as const,
        label: 'Đã kết thúc',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200'
      };
    }
    if (act.date === todayStr || act.date === '2026-10-05') {
      return {
        key: 'ongoing' as const,
        label: 'Đang diễn ra',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
      };
    }
    return {
      key: 'open' as const,
      label: 'Mở đăng ký',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  };

  const filteredActivities = allActivities.filter((act) => {
    const matchesSearch =
      !searchTerm.trim() ||
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      act.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCriterion =
      criterionFilter === 'all' ||
      act.allocations.some((alloc) => alloc.criterionCode.startsWith(criterionFilter));

    const statusInfo = getActivityStatus(act);
    const matchesStatus =
      statusFilter === 'all' || statusInfo.key === statusFilter;

    return matchesSearch && matchesCriterion && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls - Scan-First Minimalist SaaS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              HOẠT ĐỘNG RÈN LUYỆN • {currentSemester?.name || 'Học kỳ hiện tại'}
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Danh mục hoạt động ({filteredActivities.length}/{allActivities.length})
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="text-[11px] text-slate-400">Học kỳ:</span>
              <select
                value={currentDrlSemesterId}
                onChange={(e) => setCurrentDrlSemesterId(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-medium text-slate-600 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
              ĐÃ TÍCH LŨY: <strong className="text-slate-900 font-semibold">{registeredActivityIds.length}</strong>
            </div>
          </div>
        </div>

        {/* Filter Controls Row - 3 Core Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {/* 1. Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoạt động, đơn vị tổ chức..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          {/* 2. Category Filter (5 Main Criteria) */}
          <div>
            <select
              value={criterionFilter}
              onChange={(e) => setCriterionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 bg-white font-medium"
            >
              <option value="all">Tất cả 5 mục tiêu chí</option>
              <option value="1">Mục 1: Chấp hành pháp luật & nội quy</option>
              <option value="2">Mục 2: Trách nhiệm & thái độ học tập</option>
              <option value="3">Mục 3: Hoạt động chính trị, xã hội & môi trường</option>
              <option value="4">Mục 4: Ý thức cộng đồng</option>
              <option value="5">Mục 5: Cán bộ lớp & Thành tích</option>
            </select>
          </div>

          {/* 3. Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 bg-white font-medium"
            >
              <option value="all">Tất cả tình trạng</option>
              <option value="open">Đang mở đăng ký</option>
              <option value="ongoing">Đang tổ chức</option>
              <option value="closed">Đã hoàn thành / Đã đóng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flat Activity Table - 1 Line per Activity, Click to open Slide-over Drawer */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">TÊN HOẠT ĐỘNG</th>
                <th className="py-2.5 px-3 w-28 text-center">TIÊU CHÍ</th>
                <th className="py-2.5 px-3 w-32 text-center">TÌNH TRẠNG</th>
                <th className="py-2.5 px-3 w-28 text-center">THỜI GIAN</th>
                <th className="py-2.5 px-4 w-24 text-right">ĐIỂM ĐRL</th>
                <th className="py-2.5 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Mascot pose="inspect" size="md" />
                      <p className="mt-3 text-xs font-semibold text-slate-800">
                        Không tìm thấy hoạt động phù hợp với bộ lọc hiện tại.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                        Thử điều chỉnh từ khóa tìm kiếm hoặc chọn lại Tiêu chí / Tình trạng hoạt động để xem thêm các hoạt động khác nhé!
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const isRegistered = registeredActivityIds.includes(act.id);
                  const statusInfo = getActivityStatus(act);
                  const mainCategories = Array.from(
                    new Set((act.allocations || []).map((alloc) => alloc.criterionCode.split('.')[0]))
                  ).filter(Boolean);

                  return (
                    <tr
                      key={act.id}
                      onClick={() => setSelectedActivity(act)}
                      className="group hover:bg-slate-50 cursor-pointer transition-colors relative"
                    >
                      {/* Cột 1: [Checkbox] xác nhận tham gia */}
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActivityRegistration(act.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isRegistered}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-[#49C8D6] focus:ring-[#49C8D6] cursor-pointer"
                          title={isRegistered ? 'Bỏ chọn hoạt động này' : 'Xác nhận tham gia để cộng điểm'}
                        />
                      </td>

                      {/* Cột 2: Tên hoạt động & Đơn vị tổ chức */}
                      <td className="py-3 px-3 max-w-[260px] sm:max-w-sm md:max-w-md">
                        <div className="font-medium text-slate-800 text-sm group-hover:text-[#49C8D6] transition-colors truncate">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {act.organizer}
                        </div>
                      </td>

                      {/* Cột 3: Tiêu chí (Tag ngắn gọn của mục chính: Mục 1, Mục 2...) */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {mainCategories.map((mId) => (
                            <span
                              key={mId}
                              className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md font-medium border border-slate-200/80"
                            >
                              Mục {mId}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Cột 4: Tình trạng (Mở đăng ký, Đang diễn ra, Đã kết thúc) */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border inline-block ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Cột 5: Thời gian rút gọn */}
                      <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {act.date.slice(5)} • {act.startTime}
                      </td>

                      {/* Cột 6: Điểm rèn luyện nổi bật: Pill xanh emerald */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-xs font-mono inline-block">
                          +{act.totalPoints.toFixed(1)}đ
                        </span>
                      </td>

                      {/* Cột 7: Nút xem chi tiết (Drawer / Slide-over) */}
                      <td className="py-3 px-3 text-center text-slate-400 group-hover:text-slate-700">
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Panel (Drawer) for Activity Details */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedActivity(null)}
          />

          {/* Drawer content */}
          <div className="relative w-full sm:w-[480px] bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-slate-400 bg-slate-50 font-mono px-1.5 py-0.5 rounded border border-slate-100">
                    {selectedActivity.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      getActivityStatus(selectedActivity).badgeClass
                    }`}
                  >
                    {getActivityStatus(selectedActivity).label}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedActivity.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Đóng chi tiết"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-600">
              {/* Point Allocation Cards */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Điểm rèn luyện nhận được</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    +{selectedActivity.totalPoints} Điểm
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  {selectedActivity.allocations.map((alloc) => (
                    <div key={alloc.criterionCode} className="text-[11px] font-mono text-[#007D8C] font-semibold">
                      Mục {alloc.criterionCode}: +{alloc.points}đ
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Info List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Đơn vị tổ chức: </span>
                    <strong className="text-slate-800 font-semibold">{selectedActivity.organizer}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Thời gian: </span>
                    <strong className="text-slate-800 font-semibold">
                      Thứ {selectedActivity.dayOfWeek === 7 ? 'CN' : selectedActivity.dayOfWeek + 1}, {selectedActivity.date} ({selectedActivity.startTime} - {selectedActivity.endTime})
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Địa điểm: </span>
                    <strong className="text-slate-800 font-semibold">{selectedActivity.location}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Khoa / Đối tượng: </span>
                    <strong className="text-slate-800 font-semibold">
                      {selectedActivity.facultyTarget} • {selectedActivity.audienceCategory || 'Toàn trường'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  MÔ TẢ HOẠT ĐỘNG
                </span>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Regulation & Proof Guidelines */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  QUY CHẾ MINH CHỨNG
                </span>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Điểm rèn luyện được đồng bộ tự động hoặc thông qua mã QR/Biên nhận tham gia do {selectedActivity.organizer} cấp.
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  toggleActivityRegistration(selectedActivity.id);
                }}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  registeredActivityIds.includes(selectedActivity.id)
                    ? 'btn-interactive-outline text-rose-700 hover:bg-rose-50 border-rose-200'
                    : 'btn-interactive-primary'
                }`}
              >
                <span>
                  {registeredActivityIds.includes(selectedActivity.id)
                    ? 'Hủy xác nhận tham gia'
                    : '✓ Xác nhận đã tham gia (+ĐRL)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
