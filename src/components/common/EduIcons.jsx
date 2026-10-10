import React from 'react';

/**
 * BỘ ICON ĐỘC QUYỀN UEH TRACKER (TECH-ACADEMY DESIGN SYSTEM)
 * Thiết kế chuẩn nét vẽ hình học cao cấp (Geometric Vector Duotone),
 * phối màu thương hiệu: Navy (#0B2545), Forest/Cyan (#49C8D6), Gold (#F2A900).
 * Thay thế hoàn toàn các icon mặc định và phong cách hoạt hình AI trước đây.
 */

// 1. Chiếc mũ học thuật Tech-Academy (Dùng cho Navigation Smart Planner & Bằng cấp)
export const IconAcademicCap = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M12 2.5L2 7.5L12 12.5L22 7.5L12 2.5Z" fill="#49C8D6" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 9.5V15.5C6 17.5 8.7 19.5 12 19.5C15.3 19.5 18 17.5 18 15.5V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 7.5V14.5C22 15.1 21.6 15.5 21 15.5" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="21" cy="16" r="1.5" fill="#F2A900"/>
  </svg>
);

// 2. Bảng điểm học thuật & Giáo trình điện tử (Dùng cho Quản lý GPA)
export const IconGPABook = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M4 19.5V5C4 3.9 4.9 3 6 3H18.5C19.3 3 20 3.7 20 4.5V19.5C20 20.3 19.3 21 18.5 21H6C4.9 21 4 20.1 4 19.5Z" fill="#49C8D6" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M4 17.5H19C19.6 17.5 20 17.9 20 18.5C20 19.9 18.9 21 17.5 21H6C4.9 21 4 20.1 4 19.5V17.5Z" fill="#0B2545" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 7.5H15" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11.5H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 3V9L18 7.5L20 9V3" fill="#F2A900" stroke="#F2A900" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

// 3. Huân chương rèn luyện & Danh dự UEH (Dùng cho Điểm Rèn Luyện)
export const IconDRLMedal = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M8 3.5L9.5 9.5H14.5L16 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9.5L8.5 13H15.5L12 9.5Z" fill="#49C8D6" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="15" r="5.5" fill="#FEF7E6" stroke="#F2A900" strokeWidth="1.8"/>
    <path d="M12 12.5L12.9 14.3L14.8 14.6L13.4 15.9L13.8 17.8L12 16.9L10.2 17.8L10.6 15.9L9.2 14.6L11.1 14.3L12 12.5Z" fill="#F2A900"/>
  </svg>
);

// 4. Diễn đàn học thuật sinh viên (Dùng cho Diễn đàn UEH)
export const IconForumChat = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M3.5 13.5C3.5 8.5 7.3 4.5 12 4.5C16.7 4.5 20.5 8.5 20.5 13.5C20.5 18.5 16.7 22.5 12 22.5C10.2 22.5 8.5 21.9 7 20.9L3.5 21.5L4.5 18C3.8 16.7 3.5 15.1 3.5 13.5Z" fill="#49C8D6" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="8.5" cy="13.5" r="1.2" fill="#0B2545"/>
    <circle cx="12" cy="13.5" r="1.2" fill="#49C8D6"/>
    <circle cx="15.5" cy="13.5" r="1.2" fill="#F2A900"/>
  </svg>
);

// 5. Cúp học bổng & Thành tích học thuật đỉnh cao (Trophy of Excellence)
export const IconTrophy = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M7 4H17V10C17 12.8 14.8 15 12 15C9.2 15 7 12.8 7 10V4Z" fill="#FEF7E6" stroke="#F2A900" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M7 6H3.5C2.7 6 2 6.7 2 7.5C2 9.4 3.6 11 5.5 11H7" stroke="#F2A900" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M17 6H20.5C21.3 6 22 6.7 22 7.5C22 9.4 20.4 11 18.5 11H17" stroke="#F2A900" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 15V18" stroke="#F2A900" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="9" r="1.5" fill="#F2A900"/>
  </svg>
);

// 6. Bút nhập điểm & Chỉnh sửa tinh chuẩn (Precision Stylus Pen)
export const IconEditPen = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M16.5 3.5L20.5 7.5L7.5 20.5H3.5V16.5L16.5 3.5Z" fill="#49C8D6" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 6L18 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M3.5 20.5L6.5 17.5" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// 7. Cột mốc hành trình học kỳ (Milestone Flag / Marker)
export const IconMilestone = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M5 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 4H17.5L15 8.5L17.5 13H5" fill="#49C8D6" fillOpacity="0.25" stroke="#49C8D6" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="5" cy="4" r="2" fill="#0B2545"/>
  </svg>
);

// 8. Mục tiêu tâm điểm (Target Aim & Precision)
export const IconTargetAim = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4.5" fill="#49C8D6" fillOpacity="0.2" stroke="#49C8D6" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="1.5" fill="#F2A900"/>
    <path d="M12 2V4.5M12 19.5V22M2 12H4.5M19.5 12H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// 9. Dấu hoàn thành xác thực (Verified Achievement Shield)
export const IconCheckShield = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M12 2.5L20 6.5V12C20 16.5 16.5 20.5 12 21.5C7.5 20.5 4 16.5 4 12V6.5L12 2.5Z" fill="#E0F7FA" stroke="#087F8C" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M8.5 12L11 14.5L15.5 9.5" stroke="#087F8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 10. Trạng thái đang học / Chiến đấu học thuật (In Progress Node)
export const IconProgressRing = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <circle cx="12" cy="12" r="8.5" stroke="#E2E8F0" strokeWidth="2"/>
    <path d="M12 3.5C16.7 3.5 20.5 7.3 20.5 12" stroke="#49C8D6" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" fill="#F2A900"/>
  </svg>
);

// 11. Trích dẫn cổ động / Thông điệp đồng hành (Quote Inspiration)
export const IconQuoteMark = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M9.5 7.5H6.5C5.4 7.5 4.5 8.4 4.5 9.5V12.5C4.5 13.6 5.4 14.5 6.5 14.5H8.5V16.5C8.5 17.6 7.6 18.5 6.5 18.5" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 7.5H15.5C14.4 7.5 13.5 8.4 13.5 9.5V12.5C13.5 13.6 14.4 14.5 15.5 14.5H17.5V16.5C17.5 17.6 16.6 18.5 15.5 18.5" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 12. Định hướng tương lai & La bàn học thuật (Academic Compass)
export const IconCompass = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <circle cx="12" cy="12" r="9" fill="#49C8D6" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z" fill="#F2A900" stroke="#0B2545" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1.5" fill="#0B2545"/>
  </svg>
);

// 13. Nghiên cứu khoa học & Dự án sinh viên (Research Lab)
export const IconResearchLab = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M9 3H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 3V8L4.5 19C3.8 20.3 4.8 22 6.3 22H17.7C19.2 22 20.2 20.3 19.5 19L14 8V3" fill="#49C8D6" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M7 16H17" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="10" cy="18.5" r="1" fill="#F2A900"/>
    <circle cx="14" cy="18.5" r="1" fill="#49C8D6"/>
  </svg>
);

// 14. Phát triển sự nghiệp & Thực tập doanh nghiệp (Executive Portfolio)
export const IconCareerBag = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <rect x="3" y="7" width="18" height="14" rx="3" fill="#49C8D6" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="#F2A900" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

// 15. Ngôi sao kỹ năng & Phát triển tài năng (Skill Sparkle)
export const IconSkillSpark = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" fill="#FEF7E6" stroke="#F2A900" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1.5" fill="#F2A900"/>
  </svg>
);

// 16. Mạng lưới kết nối học thuật & Đồng đội (Academic Network)
export const IconNetworkFist = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <circle cx="12" cy="6" r="3" fill="#49C8D6" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="5" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="19" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M9.5 8L6.5 15M14.5 8L17.5 15M7.5 17H16.5" stroke="#49C8D6" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// 17. Lịch biểu học tập & Thời khóa biểu (Academic Schedule Calendar)
export const IconScheduleCalendar = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <rect x="3" y="4" width="18" height="17" rx="3" fill="#49C8D6" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M7 2.5V5.5M17 2.5V5.5" stroke="#49C8D6" strokeWidth="2" strokeLinecap="round"/>
    <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
    <rect x="11" y="12" width="2.5" height="2.5" rx="0.5" fill="#49C8D6"/>
    <rect x="15" y="12" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
    <rect x="7" y="16" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
    <rect x="11" y="16" width="2.5" height="2.5" rx="0.5" fill="#F2A900"/>
  </svg>
);

// 18. Cảnh báo tiến độ / Lưu ý học phần (Schedule Alert)
export const IconScheduleAlert = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <circle cx="12" cy="12" r="9" fill="#FEF7E6" stroke="#F2A900" strokeWidth="1.8"/>
    <path d="M12 7.5V12.5" stroke="#F2A900" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="#F2A900"/>
  </svg>
);

// 19. Đẩy / Lưu lên Cloud (Upload Cloud Sync)
export const IconCloudUpload = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M6.5 19H17.5C19.4 19 21 17.4 21 15.5C21 13.8 19.7 12.3 18 12.1C17.6 8.7 14.8 6 11.5 6C8.7 6 6.3 7.8 5.4 10.4C3.5 10.8 2 12.5 2 14.5C2 17 4 19 6.5 19Z" fill="#49C8D6" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 15V10M12 10L9.5 12.5M12 10L14.5 12.5" stroke="#49C8D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 20. Tải từ Cloud về (Download Cloud Sync)
export const IconCloudDownload = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M6.5 19H17.5C19.4 19 21 17.4 21 15.5C21 13.8 19.7 12.3 18 12.1C17.6 8.7 14.8 6 11.5 6C8.7 6 6.3 7.8 5.4 10.4C3.5 10.8 2 12.5 2 14.5C2 17 4 19 6.5 19Z" fill="#FEF7E6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 10V15M12 15L9.5 12.5M12 15L14.5 12.5" stroke="#F2A900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
