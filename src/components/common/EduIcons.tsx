import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// 1. Chiếc mũ cử nhân bo tròn ngộ nghĩnh (Thay cho Brain/AI)
export const IconAcademicCap: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Cap diamond body */}
    <path
      d="M12 3.5L2.5 8.2C1.8 8.5 1.8 9.5 2.5 9.8L12 14.5L21.5 9.8C22.2 9.5 22.2 8.5 21.5 8.2L12 3.5Z"
      fill="#49C8D6"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Skull cap underneath with smile curve */}
    <path
      d="M6.5 12.5V16C6.5 18.5 9 20.5 12 20.5C15 20.5 17.5 18.5 17.5 16V12.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Playful tassel hanging with bead */}
    <path
      d="M20 10.5V16.5C20 17.3 19.3 18 18.5 18"
      stroke="#49C8D6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="20" cy="10.5" r="1.5" fill="#49C8D6" />
    <circle cx="18.5" cy="18" r="1.5" fill="#49C8D6" />
  </svg>
);

// 2. Ly cà phê sinh viên có mắt cười / tia hơi nước (Thay cho icon sét "Tự động")
export const IconCoffeeBoost: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Steam vapor ripples */}
    <path
      d="M8.5 2.5C8 3.5 9 4.5 8.5 5.5"
      stroke="#49C8D6"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 2C11.5 3.2 12.5 4.2 12 5.5"
      stroke="#49C8D6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15.5 2.5C15 3.5 16 4.5 15.5 5.5"
      stroke="#49C8D6"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Coffee Cup Lid */}
    <rect
      x="5"
      y="6"
      width="14"
      height="2.5"
      rx="1.25"
      fill="#49C8D6"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {/* Cup Body */}
    <path
      d="M6.5 8.5L7.8 19.2C7.9 20.2 8.8 21 9.8 21H14.2C15.2 21 16.1 20.2 16.2 19.2L17.5 8.5H6.5Z"
      fill="#49C8D6"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Cup Sleeve with cute smiley eyes */}
    <path
      d="M7.2 12H16.8L16.4 16H7.6L7.2 12Z"
      fill="#49C8D6"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    {/* Little smiling curve inside sleeve */}
    <path
      d="M10.5 13.8C11 14.5 13 14.5 13.5 13.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// 3. Kính lúp bo tròn tinh nghịch soi tờ giấy ghi chú A+ (Thay cho kính lúp máy móc / Nghiên cứu)
export const IconResearchLab: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Research Paper in Background */}
    <rect
      x="3"
      y="3"
      width="12"
      height="15"
      rx="2"
      fill="#49C8D6"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {/* A+ Note on Paper */}
    <path
      d="M6 7.5L7.5 11.5M7.5 11.5L9 7.5M7.5 11.5H6.5"
      stroke="#49C8D6"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10.5 8.5V10.5M9.5 9.5H11.5"
      stroke="#49C8D6"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Big Playful Magnifying Glass */}
    <circle
      cx="14"
      cy="13"
      r="5.5"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Lens reflection shine */}
    <path
      d="M12 10.5C13 9.5 14.5 9.5 15.5 10.5"
      stroke="#49C8D6"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Handle with rubber grip */}
    <path
      d="M18 17L21.5 20.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="21" cy="20" r="1" fill="#49C8D6" />
  </svg>
);

// 4. Chiếc túi tote sinh viên có cài bút (Thay cho cặp da công sở / Nghề nghiệp)
export const IconCareerBag: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Tote Straps */}
    <path
      d="M9 8V5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Tote Bag Body */}
    <path
      d="M5 8H19L17.8 20C17.7 20.6 17.2 21 16.6 21H7.4C6.8 21 6.3 20.6 6.2 20L5 8Z"
      fill="#49C8D6"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Cute Pocket on Tote */}
    <rect
      x="8.5"
      y="12"
      width="7"
      height="6"
      rx="1.5"
      fill="white"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {/* Pen peeking out of pocket */}
    <path
      d="M13.5 9.5L13.5 13.5"
      stroke="#49C8D6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="13.5" cy="9" r="1" fill="currentColor" />
  </svg>
);

// 5. Ngôi sao lấp lánh 4 cánh cách điệu (Thay cho não hồng / Kỹ năng)
export const IconSkillSpark: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Big 4-point Sparkle */}
    <path
      d="M12 2C12 6.5 15.5 10 20 10C15.5 10 12 13.5 12 18C12 13.5 8.5 10 4 10C8.5 10 12 6.5 12 2Z"
      fill="#49C8D6"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Secondary baby sparkle top-right */}
    <path
      d="M19 16C19 17.5 20 18.5 21.5 18.5C20 18.5 19 19.5 19 21C19 19.5 18 18.5 16.5 18.5C18 18.5 19 17.5 19 16Z"
      fill="#49C8D6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Accent spark dots */}
    <circle cx="6" cy="18" r="1.5" fill="#49C8D6" />
    <circle cx="18" cy="4" r="1" fill="#49C8D6" />
  </svg>
);

// 6. Hai ly trà sữa / cụng ly sinh viên (Thay cho icon bắt tay / Networking)
export const IconNetworkFist: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Left Boba Cup */}
    <path
      d="M4.5 9L6 19.5C6.1 20.3 6.8 21 7.6 21H10.4C11.2 21 11.9 20.3 12 19.5L13.5 9H4.5Z"
      fill="#49C8D6"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Left Cup Lid */}
    <rect x="3.5" y="7" width="11" height="2" rx="1" fill="white" stroke="currentColor" strokeWidth="1.8" />
    {/* Left Straw */}
    <path d="M8.5 7L7 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Right Boba Cup */}
    <path
      d="M12.5 10.5L13.8 19.5C13.9 20.3 14.6 21 15.4 21H17.6C18.4 21 19.1 20.3 19.2 19.5L20.5 10.5H12.5Z"
      fill="#49C8D6"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Right Cup Lid */}
    <rect x="11.5" y="8.5" width="10" height="2" rx="1" fill="white" stroke="currentColor" strokeWidth="1.8" />
    {/* Right Straw */}
    <path d="M17 8.5L18.5 4" stroke="#49C8D6" strokeWidth="2" strokeLinecap="round" />

    {/* Boba pearls */}
    <circle cx="8" cy="18" r="1" fill="currentColor" />
    <circle cx="10" cy="18.5" r="1" fill="currentColor" />
    <circle cx="9" cy="16.5" r="1" fill="currentColor" />
    <circle cx="15.5" cy="18.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="18" r="1" fill="currentColor" />

    {/* Clinking spark */}
    <path d="M12 4.5L13 3M13.5 5.5L15 5" stroke="#49C8D6" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 7. Đồng hồ báo thức tròn trịa có chuông rung (Thay cho icon calendar Trùng lịch)
export const IconScheduleAlert: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Alarm bells on top */}
    <path
      d="M5 4.5C4 6 3.5 7.5 3.5 7.5L6.5 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 4.5C20 6 20.5 7.5 20.5 7.5L17.5 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Alarm clock round body */}
    <circle
      cx="12"
      cy="13.5"
      r="7.5"
      fill="#49C8D6"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Clock hands showing urgency */}
    <path
      d="M12 9.5V13.5L14.5 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Center pin */}
    <circle cx="12" cy="13.5" r="1" fill="#49C8D6" />
    {/* Feet */}
    <path d="M7 20.5L6 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 20.5L18 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Ringing vibration waves */}
    <path d="M1 11C1 11 1.5 13 1 15" stroke="#49C8D6" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M23 11C23 11 22.5 13 23 15" stroke="#49C8D6" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 8. Quyển sổ mở kèm chiếc kẹp ghim màu mint (Dùng cho GPA Nav)
export const IconGPABook: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Book Pages */}
    <path
      d="M4 6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V6Z"
      fill="#49C8D6"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Bookmark ribbon or note lines */}
    <path d="M8 8H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 16H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Cute mint paperclip on top right */}
    <path
      d="M16 2.5V7C16 8.1 16.9 9 18 9C19.1 9 20 8.1 20 7V4"
      stroke="#49C8D6"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// 9. Chiếc huy hiệu ruy băng ngộ nghĩnh (Dùng cho ĐRL Nav)
export const IconDRLMedal: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Ribbon tails */}
    <path
      d="M9 14.5L7 22L12 19.5L17 22L15 14.5"
      fill="#49C8D6"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Medal circle */}
    <circle
      cx="12"
      cy="9.5"
      r="6.5"
      fill="#49C8D6"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Playful star in medal */}
    <path
      d="M12 6.5L13.2 8.8L15.5 9.2L13.8 10.8L14.2 13L12 11.8L9.8 13L10.2 10.8L8.5 9.2L10.8 8.8L12 6.5Z"
      fill="#49C8D6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// 10. Lịch bàn ngộ nghĩnh (Dùng cho Thêm vào TKB)
export const IconScheduleCalendar: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Calendar Body */}
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15.5"
      rx="3"
      fill="#49C8D6"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {/* Header Accent Bar */}
    <path
      d="M3.5 9.5H20.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Spiral Rings */}
    <path d="M7.5 3V6" stroke="#49C8D6" strokeWidth="2" strokeLinecap="round" />
    <path d="M16.5 3V6" stroke="#49C8D6" strokeWidth="2" strokeLinecap="round" />
    {/* Mini grid dots/plus */}
    <circle cx="8" cy="13" r="1" fill="currentColor" />
    <circle cx="12" cy="13" r="1" fill="#49C8D6" />
    <circle cx="16" cy="13" r="1" fill="currentColor" />
    <circle cx="8" cy="16.5" r="1" fill="currentColor" />
    <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    <path d="M15 16.5L16 17.5L18 15.5" stroke="#49C8D6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

