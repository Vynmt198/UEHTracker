export const FORUM_CATEGORIES = [
  {
    id: 'ALL',
    label: 'Tất cả thảo luận',
    shortLabel: 'Tất cả',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    color: '#0f172a',
  },
  {
    id: 'SAN_HOC_BONG',
    label: 'Săn học bổng UEH',
    shortLabel: 'Học bổng',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    color: '#d97706',
    description: 'Bí quyết duy trì GPA 3.6+, tiêu chí xét học bổng Khuyến khích học tập & doanh nghiệp',
  },
  {
    id: 'GOC_HOC_TAP',
    label: 'Góc học tập & NCKH',
    shortLabel: 'Học tập',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    color: '#0284c7',
    description: 'Kho đề thi, phương pháp học, tìm đồng đội NCKH Eureka, thi học thuật UEH500',
  },
  {
    id: 'REVIEW_MON_HOC',
    label: 'Review Môn học & Giảng viên',
    shortLabel: 'Review môn',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    color: '#7e22ce',
    description: 'Kinh nghiệm chọn lớp, bí quyết qua môn đại cương và chuyên ngành',
  },
  {
    id: 'HOI_DAP',
    label: 'Hỏi đáp chung & Đời sống UEH',
    shortLabel: 'Hỏi đáp',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    color: '#059669',
    description: 'Thủ tục phòng Đào tạo, đăng ký tín chỉ, ký túc xá và hoạt động Đoàn - Hội',
  },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'popular', label: 'Nhiều Upvote nhất' },
  { id: 'views', label: 'Lượt xem nhiều nhất' },
];

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};
