# 📋 Tóm Tắt Trạng Thái Dự Án UEH Tracker

*Thời gian cập nhật:* 10/10/2026

---

## 1. 🟢 Trạng thái hiện tại của dự án (Current Status)

Dự án **UEH Tracker** đã hoàn thiện toàn diện phân hệ **Diễn đàn sinh viên UEH**, cơ chế **Tự động đồng bộ ngầm (Background Debounced Auto-Sync)**, giải quyết triệt để vấn đề **Điều hướng & Lưu vết trạng thái khi tải lại trang (URL Hash & LocalStorage Navigation Persistence)**, đồng thời vượt qua 100% bài kiểm tra tích hợp thực tế 11/11 luồng Backend CRUD & Auth trên **Neon Serverless PostgreSQL Cloud** (Project: `flat-band-12164942`, branch `production`).

- **Frontend (Client-side & Navigation & Offline-First):**
  - Chạy trên nền tảng **React 19 + Vite 8.3 + Tailwind CSS 3.4**.
  - **Khắc phục triệt để lỗi chuyển trang / F5 bị văng về trang mặc định:**
    - Đồng bộ 2 chiều giữa `activeTab` (`planner`, `gpa`, `drl`, `forum`) với `window.location.hash` (`#gpa`, `#forum`...) và `localStorage`.
    - Hỗ trợ đầy đủ phím Back / Forward của trình duyệt qua sự kiện `popstate` và `hashchange`.
    - Ghi nhớ học kỳ được chọn `selectedSemesterId` và các Sub-tabs con trong Smart Planner, DRL và Diễn đàn.
  - **Phân hệ Diễn đàn sinh viên UEH:**
    - Thay thế hoàn toàn `ForumPlaceholder.jsx` bằng bộ UI hoàn chỉnh: `ForumModule.jsx`, `PostCard.jsx`, `PostDetailView.jsx`, `CreatePostModal.jsx`, `CommentTree.jsx`, `CommentItem.jsx`.
    - Bộ lọc chuyên mục, hashtag, tìm kiếm thời gian thực, điểm số vote và cây bình luận đa cấp lồng nhau.
  - **Cơ chế Tự động đồng bộ ngầm (Background Auto-Sync):**
    - Debounced Push 2.5s gom dữ liệu tự động đẩy lên Neon Cloud, chống lặp vô hạn `skipNextAutoSync` và có Toggle Switch bật/tắt.
  - **Bộ kiểm thử tự động:** Đạt **34/34 Unit Tests (100% Pass)** trên Vitest; thời gian build production bundle đạt **< 1.1 giây**.

- **Backend & Cloud Database (API & PostgreSQL Serverless):**
  - Hoạt động ổn định trên Node.js ES Modules + Express + Prisma ORM 6.4 trỏ tới Neon PostgreSQL Cloud.
  - Vượt qua kiểm thử End-to-End tự động [verify-backend-crud.js](file:///e:/GPA-UEH/backend/scripts/verify-backend-crud.js) cho cả **11/11 luồng**:
    1. Đăng ký tài khoản (Register)
    2. Đăng nhập & sinh JWT Bearer (Login)
    3. Xem & cập nhật thông tin cá nhân (Profile GET & PUT)
    4. Lấy danh mục 33 Khoa / Viện UEH (Faculties)
    5. CRUD Học kỳ (Semesters)
    6. CRUD Môn học, tính điểm tự động & xếp loại chuẩn UEH (Courses & Auto-grade)
    7. CRUD Điểm rèn luyện theo quy chế 5 mục UEH (DRL)
    8. CRUD Diễn đàn, đăng bài, Upvote/Downvote & Cây bình luận đa cấp (Forum & Nested Threads)
    9. Đồng bộ 2 chiều đám mây (Cloud Sync Push/Pull)
    10. Cấp mới phiên đăng nhập (Refresh Token)
    11. Đăng xuất an toàn & dọn dẹp phiên (Logout)

---

## 2. 📁 Các file vừa tạo và chỉnh sửa trong phiên làm việc

| Đường dẫn file | Mô tả chi tiết thay đổi |
|---|---|
| `src/context/AppContext.jsx` | Lưu vết `activeTab`, `selectedSemesterId` vào `localStorage`, lắng nghe sự kiện `popstate`/`hashchange` và đồng bộ URL hash `#tab`. |
| `src/components/planner/SmartPlanner.jsx` | Lưu vết `activeSubTab` (GPA, DRL Strategy, Career) vào `localStorage` khi người dùng chuyển tab con. |
| `src/components/drl/DRLModule.jsx` | Lưu vết `currentSubTab` (Tổng quan vs Danh sách hoạt động) vào `localStorage`. |
| `src/components/forum/ForumModule.jsx` | Lưu vết `activeCategory` vào `localStorage` và xử lý danh sách thảo luận. |
| `backend/scripts/verify-backend-crud.js` | **(Mới)** Kịch bản kiểm tra tích hợp toàn diện 11/11 luồng API CRUD và xác thực trực tiếp trên Neon Cloud. |
| `src/utils/__tests__/navigation.test.js` | **(Mới)** Bộ unit test kiểm tra cơ chế điều hướng, lưu vết tab và học kỳ. |
| `src/components/forum/*` | Bộ 8 files UI diễn đàn UEH, cây bình luận đa cấp, vote và modal tạo bài viết. |
| `backend/src/common/middlewares/auth.middleware.js` | Bổ sung `optionalAuthMiddleware` hỗ trợ xem công khai kèm nhận diện người dùng. |
| `backend/src/modules/forum/*` | Tối ưu service và route diễn đàn hỗ trợ sắp xếp, phân trang và toggle vote. |
| `backend/prisma/seedForum.js` | Kịch bản nạp bài viết và cây bình luận mẫu thực tế lên Neon Postgres. |

---

## 3. 🎯 Kế hoạch & Roadmap cho các phiên làm việc tiếp theo

1. **Trải nghiệm PWA (Progressive Web App) & Offline Caching:**
   - Cấu hình file `manifest.json` và Service Worker để sinh viên có thể cài đặt UEH Tracker lên màn hình chính điện thoại và xem bảng điểm offline.
2. **Xuất báo cáo Bảng điểm & Hồ sơ rèn luyện:**
   - Tính năng xuất bảng điểm và minh chứng ĐRL thành file PDF / Excel chuẩn mẫu UEH để sinh viên nộp xét học bổng và xét tốt nghiệp.
