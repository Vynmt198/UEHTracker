// Generator script for 220 realistic UEH activities
const fs = require('fs');
const path = require('path');

const faculties = [
  'Công nghệ thông tin kinh doanh',
  'Kinh doanh quốc tế - Marketing',
  'Tài chính - Ngân hàng',
  'Kế toán - Kiểm toán',
  'Kinh tế - Quản trị',
  'Luật',
  'Khoa Ngoại ngữ',
  'Viện Đào tạo Quốc tế (ISB)',
  'Khoa Du lịch',
  'Khoa Toán - Thống kê',
  'Tất cả'
];

const locations = [
  'Hội trường A.103 - Cơ sở A (59C Nguyễn Đình Chiểu)',
  'Hội trường B1.302 - Cơ sở B (279 Nguyễn Tri Phương)',
  'Phòng Hội thảo B1.205 - Cơ sở B',
  'Smart Library - Tầng 6 Cơ sở B',
  'Sảnh B2 - Cơ sở B (Nguyễn Tri Phương)',
  'Hội trường E.001 - Cơ sở E (54 Nguyễn Văn Thủ)',
  'Hội trường N.101 - Cơ sở N (Nha Trang)',
  'Cơ sở H (Hoàng Diệu) - Phòng H.201',
  'UEH Mekong Campus (Vĩnh Long)',
  'Online - MS Teams & Zoom UEH'
];

const days = [1, 2, 3, 4, 5, 6, 7];

const timeslots = [
  { start: '08:00', end: '10:30' },
  { start: '09:00', end: '11:30' },
  { start: '13:30', end: '16:00' },
  { start: '14:00', end: '16:30' },
  { start: '18:00', end: '20:30' },
  { start: '08:30', end: '11:45' }
];

const activityTemplates = [
  // 1. Freshman activities
  {
    prefix: 'Chào đón Tân sinh viên',
    tags: ['Tân sinh viên', 'Năm nhất', 'Hội nhập UEH'],
    faculty: 'Tất cả',
    type: 'trai_nghiem',
    audience: 'freshman',
    goal: 'networking',
    allocations: [{ criterionCode: '1.2', points: 2.0 }, { criterionCode: '3.1', points: 2.0 }]
  },
  {
    prefix: 'Hội nhập sinh viên năm nhất & Hướng dẫn sử dụng Smart Library',
    tags: ['Tân sinh viên', 'Thư viện', 'Kỹ năng số'],
    faculty: 'Tất cả',
    type: 'trai_nghiem',
    audience: 'freshman',
    goal: 'soft_skills',
    allocations: [{ criterionCode: '1.2', points: 1.5 }, { criterionCode: '2.3', points: 1.5 }]
  },
  {
    prefix: 'Ngày hội Câu lạc bộ - Đội - Nhóm UEH Club Fair',
    tags: ['Tân sinh viên', 'CLB', 'Networking'],
    faculty: 'Tất cả',
    type: 'trai_nghiem',
    audience: 'freshman',
    goal: 'networking',
    allocations: [{ criterionCode: '3.1', points: 3.0 }]
  },
  {
    prefix: 'Phương pháp tự học đại học & Quản trị thời gian cho K50',
    tags: ['Tân sinh viên', 'Kỹ năng học tập', 'GPA'],
    faculty: 'Tất cả',
    type: 'chuyen_mon',
    audience: 'freshman',
    goal: 'soft_skills',
    allocations: [{ criterionCode: '2.1', points: 2.0 }, { criterionCode: '2.3', points: 1.0 }]
  },

  // 2. Scientific research
  {
    prefix: 'Hội thảo phương pháp Nghiên cứu Khoa học Sinh viên UEH500',
    tags: ['NCKH', 'UEH500', 'Học thuật'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'scientific_research',
    allocations: [{ criterionCode: '2.2', points: 4.0 }, { criterionCode: '2.7.4.2', points: 2.0 }]
  },
  {
    prefix: 'Tập huấn kỹ năng viết bài báo khoa học chuẩn Scopus',
    tags: ['NCKH', 'Bài báo quốc tế', 'Scopus'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'scientific_research',
    allocations: [{ criterionCode: '2.2', points: 4.0 }]
  },
  {
    prefix: 'Vòng sơ loại Cuộc thi Nhà nghiên cứu trẻ Young Researchers',
    tags: ['NCKH', 'Cuộc thi', 'Học thuật'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'scientific_research',
    allocations: [{ criterionCode: '2.2', points: 5.0 }]
  },

  // 3. Career / Business
  {
    prefix: 'Ngày hội Phỏng vấn thử & Tuyển dụng Career Fair UEH',
    tags: ['Nghề nghiệp', 'Tuyển dụng', 'Doanh nghiệp'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'career',
    allocations: [{ criterionCode: '2.3', points: 2.0 }, { criterionCode: '3.1', points: 2.0 }]
  },
  {
    prefix: 'Company Tour tham quan và làm việc thực tế tại Doanh nghiệp',
    tags: ['Company Tour', 'Doanh nghiệp', 'Trải nghiệm'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'career',
    allocations: [{ criterionCode: '2.2', points: 2.5 }, { criterionCode: '3.4.2.2', points: 1.0 }]
  },
  {
    prefix: 'Workshop Kỹ năng chinh phục nhà tuyển dụng Big4 & MNCs',
    tags: ['Big4', 'Phỏng vấn', 'CV', 'Kỹ năng'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'career',
    allocations: [{ criterionCode: '2.3', points: 2.5 }, { criterionCode: '3.1', points: 1.5 }]
  },

  // 4. Soft skills
  {
    prefix: 'Chuyên đề Kỹ năng Thuyết trình & Đàm phán đỉnh cao',
    tags: ['Kỹ năng mềm', 'Thuyết trình', 'Giao tiếp'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'soft_skills',
    allocations: [{ criterionCode: '2.3', points: 2.0 }, { criterionCode: '3.1', points: 1.5 }]
  },
  {
    prefix: 'Khóa đào tạo Tư duy phản biện và Giải quyết vấn đề phức tạp',
    tags: ['Kỹ năng mềm', 'Tư duy phản biện', 'Critical Thinking'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'soft_skills',
    allocations: [{ criterionCode: '2.3', points: 3.0 }]
  },
  {
    prefix: 'Kỹ năng Phân tích Dữ liệu ứng dụng PowerBI & Tableau',
    tags: ['Kỹ năng số', 'Data Analytics', 'PowerBI'],
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'soft_skills',
    allocations: [{ criterionCode: '2.3', points: 3.5 }, { criterionCode: '2.2', points: 1.0 }]
  },

  // 5. Networking
  {
    prefix: 'UEH Alumni Coffee Talk: Kết nối Cựu sinh viên thành đạt',
    tags: ['Networking', 'Alumni', 'Kết nối'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'networking',
    allocations: [{ criterionCode: '3.1', points: 2.0 }, { criterionCode: '4.2', points: 1.5 }]
  },
  {
    prefix: 'Giao lưu mạng lưới Lãnh đạo Trẻ ASEAN Young Leaders Forum',
    tags: ['Networking', 'Quốc tế', 'Lãnh đạo'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'networking',
    allocations: [{ criterionCode: '3.1', points: 3.0 }, { criterionCode: '5.2', points: 2.0 }]
  },

  // 6. Green Campus & Volunteering
  {
    prefix: 'UEH Green Campus: Ngày hội Thu gom Pin cũ & Rác thải công nghệ',
    tags: ['Green Campus', 'Môi trường', 'Tình nguyện'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'volunteer',
    allocations: [{ criterionCode: '3.2', points: 4.0 }, { criterionCode: '4.1', points: 2.0 }]
  },
  {
    prefix: 'Chiến dịch Hiến máu tình nguyện Giọt hồng UEH',
    tags: ['Hiến máu', 'Tình nguyện', 'Cộng đồng'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'volunteer',
    allocations: [{ criterionCode: '4.1', points: 5.0 }]
  },
  {
    prefix: 'Chiến dịch Mùa hè xanh & Tình nguyện vì cộng đồng',
    tags: ['Mùa hè xanh', 'Tình nguyện', 'Xã hội'],
    type: 'trai_nghiem',
    audience: 'all',
    goal: 'volunteer',
    allocations: [{ criterionCode: '4.1', points: 5.0 }, { criterionCode: '3.1', points: 3.0 }]
  },

  // 7. Academic contests by faculty
  {
    prefix: 'Cuộc thi Học thuật IT Hackathon FinTech 2026',
    tags: ['Học thuật', 'Hackathon', 'Fintech', 'AI'],
    faculty: 'Công nghệ thông tin kinh doanh',
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'academic',
    allocations: [{ criterionCode: '2.2', points: 5.0 }, { criterionCode: '2.7.4.2', points: 2.5 }]
  },
  {
    prefix: 'Cuộc thi Marketing Arena Vòng loại bảng UEH',
    tags: ['Marketing', 'Cuộc thi', 'Học thuật'],
    faculty: 'Kinh doanh quốc tế - Marketing',
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'academic',
    allocations: [{ criterionCode: '2.2', points: 4.5 }, { criterionCode: '3.1', points: 1.5 }]
  },
  {
    prefix: 'Đấu trường Tài chính Chứng khoán Sinh viên FBAC',
    tags: ['Tài chính', 'Chứng khoán', 'Học thuật'],
    faculty: 'Tài chính - Ngân hàng',
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'academic',
    allocations: [{ criterionCode: '2.2', points: 4.5 }, { criterionCode: '3.4.2.2', points: 1.0 }]
  },
  {
    prefix: 'Hội thảo Chuẩn mực Kế toán Quốc tế IFRS và Tác động tại VN',
    tags: ['Kế toán', 'IFRS', 'Kiểm toán'],
    faculty: 'Kế toán - Kiểm toán',
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'academic',
    allocations: [{ criterionCode: '2.2', points: 3.5 }, { criterionCode: '2.3', points: 1.5 }]
  },
  {
    prefix: 'Diễn đàn Pháp luật Kinh doanh & Tranh tụng Trọng tài Thương mại',
    tags: ['Luật', 'Pháp lý', 'Tranh biện'],
    faculty: 'Luật',
    type: 'chuyen_mon',
    audience: 'all',
    goal: 'academic',
    allocations: [{ criterionCode: '1.1', points: 3.0 }, { criterionCode: '2.2', points: 3.0 }]
  }
];

const organizers = [
  'Đoàn Thanh niên - Hội Sinh viên UEH',
  'Khoa Công nghệ thông tin kinh doanh & CLB BIT',
  'Khoa Kinh doanh quốc tế - Marketing & Margroup',
  'Khoa Tài chính - Ngân hàng & CLB SCUE',
  'Khoa Kế toán - Kiểm toán & CLB A²C',
  'Khoa Luật & CLB Luật gia Tương lai',
  'Viện Đổi mới Sáng tạo (UII)',
  'Ban Quản trị KTX & Môi trường Xanh',
  'Ban Học tập Đoàn Trường UEH',
  'Viện Đào tạo Quốc tế (ISB)',
  'CLB Tiếng Anh Bell Club UEH',
  'CLB Kỹ năng Doanh nhân Dynamic UEH'
];

const activities = [];
let actCount = 0;

// Generate 220 items deterministically
for (let i = 1; i <= 220; i++) {
  const tmpl = activityTemplates[(i - 1) % activityTemplates.length];
  const faculty = tmpl.faculty || faculties[(i - 1) % (faculties.length - 1)];
  const organizer = organizers[(i - 1) % organizers.length];
  const location = locations[(i - 1) % locations.length];
  const slot = timeslots[(i - 1) % timeslots.length];
  const day = days[(i - 1) % days.length];

  // Month October/November 2026
  const dayNum = 1 + ((i * 3) % 28);
  const dateStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;

  const numCode = i < 10 ? `00${i}` : i < 100 ? `0${i}` : `${i}`;
  const code = `UEH-ACT-${numCode}`;

  // Title variety
  const seriesNum = Math.floor((i - 1) / activityTemplates.length) + 1;
  const title = seriesNum > 1 ? `${tmpl.prefix} (Kỳ ${seriesNum})` : tmpl.prefix;

  const totalPoints = tmpl.allocations.reduce((s, a) => s + a.points, 0);

  activities.push({
    id: `act-${numCode}`,
    code,
    title,
    organizer,
    facultyTarget: faculty,
    activityType: tmpl.type,
    audienceCategory: tmpl.audience,
    goalCategory: tmpl.goal,
    date: dateStr,
    dayOfWeek: day,
    startTime: slot.start,
    endTime: slot.end,
    location,
    allocations: tmpl.allocations,
    totalPoints: Math.round(totalPoints * 10) / 10,
    tags: tmpl.tags,
    description: `Hoạt động chính thức trực thuộc hệ thống rèn luyện UEH, kiểm duyệt bởi ${organizer}. Tham gia đầy đủ để được điểm danh tự động qua app UEH Student.`
  });
}

const outPath = path.join(__dirname, 'src', 'data', 'uehActivities.json');
fs.writeFileSync(outPath, JSON.stringify(activities, null, 2), 'utf-8');
console.log(`Successfully generated ${activities.length} activities to ${outPath}`);
