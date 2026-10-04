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
import { IconScheduleCalendar, IconScheduleAlert } from '../common/EduIcons';

export const ActivityList: React.FC = () => {
  const {
    profile,
    allActivities,
    registeredActivityIds,
    toggleActivityRegistration,
    getDRLProgress,
    scheduleBlocks,
    checkActivityScheduleConflict,
    addActivityToSchedule
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState(() => profile.faculty || 'Tất cả');
  const [criterionFilter, setCriterionFilter] = useState('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<'all' | 'chuyen_mon' | 'trai_nghiem'>('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [scheduleFeedback, setScheduleFeedback] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Slide-over Panel state
  const [selectedActivity, setSelectedActivity] = useState<UEHActivity | null>(null);

  const handleAddToSchedule = (activity: UEHActivity) => {
    const res = addActivityToSchedule(activity);
    setScheduleFeedback({
      message: res.message,
      type: res.success ? 'success' : 'warning'
    });
    setTimeout(() => setScheduleFeedback(null), 3500);
  };

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

    const matchesType =
      activityTypeFilter === 'all' || act.activityType === activityTypeFilter;

    const matchesAudience =
      audienceFilter === 'all' ||
      act.audienceCategory === audienceFilter ||
      (audienceFilter === 'freshman' && act.tags.some((t) => t.includes('Tân sinh viên')));

    return matchesSearch && matchesFaculty && matchesCriterion && matchesType && matchesAudience;
  });

  const getActivityStatus = (act: UEHActivity) => {
    const isRegistered = registeredActivityIds.includes(act.id);
    if (!isRegistered) {
      return {
        label: 'Mở',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    }
    // Simulate approval vs completed for visual scan
    const isPending = act.code.charCodeAt(act.code.length - 1) % 3 === 0;
    if (isPending) {
      return {
        label: 'Chờ duyệt',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    }
    return {
      label: 'Hoàn thành',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls - Scan-First Minimalist SaaS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              HOẠT ĐỘNG RÈN LUYỆN
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Danh mục hoạt động ({filteredActivities.length}/{allActivities.length})
            </h2>
          </div>

          <div className="text-xs font-medium text-slate-600 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            ĐÃ TÍCH LŨY: <strong className="text-slate-900 font-semibold">{registeredActivityIds.length}</strong>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, BTC, mã..."
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
              <option value="Công nghệ thông tin kinh doanh">Khoa CNTT Kinh doanh</option>
              <option value="Kinh doanh quốc tế - Marketing">Khoa KDQT - Marketing</option>
              <option value="Tài chính - Ngân hàng">Khoa Tài chính - Ngân hàng</option>
              <option value="Kế toán - Kiểm toán">Khoa Kế toán - Kiểm toán</option>
              <option value="Kinh tế - Quản trị">Khoa Kinh tế - Quản trị</option>
              <option value="Luật">Khoa Luật</option>
              <option value="Khoa Ngoại ngữ">Khoa Ngoại ngữ</option>
              <option value="Khoa Du lịch">Khoa Du lịch</option>
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

          <div>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-slate-400 bg-white font-medium"
            >
              <option value="all">Tất cả loại hoạt động</option>
              <option value="chuyen_mon">Chuyên môn / Học thuật</option>
              <option value="trai_nghiem">Trải nghiệm Văn hóa - Xã hội</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flat Activity Table - 1 Line per Activity, Click to open Slide-over Drawer */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">TÊN HOẠT ĐỘNG</th>
                <th className="py-2.5 px-3 w-32">KHOA / ĐƠN VỊ</th>
                <th className="py-2.5 px-3 w-28 text-center">THỜI GIAN</th>
                <th className="py-2.5 px-4 w-24 text-right">ĐIỂM ĐRL</th>
                <th className="py-2.5 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Mascot pose="inspect" size="md" />
                      <p className="mt-3 text-xs font-semibold text-slate-800">
                        Không tìm thấy hoạt động phù hợp với bộ lọc hiện tại.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                        Thử điều chỉnh từ khóa tìm kiếm hoặc chọn lại Khoa / Tiêu chí rèn luyện để xem thêm các hoạt động khác nhé!
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const isRegistered = registeredActivityIds.includes(act.id);

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
                        />
                      </td>

                      {/* Cột 2: Tên hoạt động (cắt ngắn bằng CSS truncate max-w-md, font-medium text-slate-800 text-sm) */}
                      <td className="py-3 px-3 max-w-[280px] sm:max-w-md">
                        <div className="font-medium text-slate-800 text-sm group-hover:text-[#49C8D6] transition-colors truncate">
                          {act.title}
                        </div>
                      </td>

                      {/* Cột 3: Tag phân loại nhỏ dạng badge xám nhạt */}
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md font-medium border border-slate-200/80 truncate inline-block max-w-[130px]">
                          {act.facultyTarget === 'Tất cả'
                            ? (act.tags[0] || 'Chung UEH')
                            : act.facultyTarget.replace('Khoa ', '')}
                        </span>
                      </td>

                      {/* Cột 4: Thời gian rút gọn */}
                      <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {act.date.slice(5)} • {act.startTime}
                      </td>

                      {/* Cột 5: Điểm rèn luyện nổi bật: Pill xanh emerald */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-xs font-mono inline-block">
                          +{act.totalPoints.toFixed(1)}đ
                        </span>
                      </td>

                      {/* Cột 6: Nút hoặc icon trượt mở xem chi tiết (Drawer / Slide-over từ bên phải) */}
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

              {/* Schedule Feedback / Conflict Status inside drawer */}
              {(() => {
                const isScheduled = scheduleBlocks.some((b) => b.activityId === selectedActivity.id);
                const conflict = checkActivityScheduleConflict(selectedActivity);

                if (isScheduled) {
                  return (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Hoạt động này đã được lưu vào Thời khóa biểu của bạn.</span>
                    </div>
                  );
                }
                if (conflict.hasConflict && conflict.conflictingBlock) {
                  return (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Xung đột lịch rảnh: </strong>
                        Trùng giờ với <em>"{conflict.conflictingBlock.title}"</em> ({conflict.conflictingBlock.startTime} - {conflict.conflictingBlock.endTime}).
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {scheduleFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium border ${
                    scheduleFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {scheduleFeedback.message}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-2.5">
              {/* Check / Add to schedule button */}
              {(() => {
                const isScheduled = scheduleBlocks.some((b) => b.activityId === selectedActivity.id);
                const conflict = checkActivityScheduleConflict(selectedActivity);

                if (conflict.hasConflict && !isScheduled) {
                  return (
                    <div
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 select-none shrink-0"
                      title={`Trùng lịch với: ${conflict.conflictingBlock?.title}`}
                    >
                      <IconScheduleAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Trùng giờ học</span>
                    </div>
                  );
                }

                if (isScheduled) {
                  return (
                    <div
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 select-none shrink-0"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Đã vào TKB</span>
                    </div>
                  );
                }

                return (
                  <button
                    onClick={() => handleAddToSchedule(selectedActivity)}
                    className="btn-interactive-outline w-full sm:w-auto shrink-0"
                  >
                    <IconScheduleCalendar className="w-3.5 h-3.5 text-[#007D8C] shrink-0" />
                    <span>Thêm vào TKB</span>
                  </button>
                );
              })()}

              <button
                onClick={() => {
                  toggleActivityRegistration(selectedActivity.id);
                }}
                className={`w-full sm:flex-1 ${
                  registeredActivityIds.includes(selectedActivity.id)
                    ? 'btn-interactive-outline'
                    : 'btn-interactive-primary'
                }`}
              >
                <span>
                  {registeredActivityIds.includes(selectedActivity.id)
                    ? 'Hủy đăng ký'
                    : 'Đăng ký ngay'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
