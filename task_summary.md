# 📋 Tóm Tắt Trạng Thái Dự Án UEH Tracker

*Thời gian cập nhật:* 10/10/2026

---

## 1. 🟢 Trạng thái hiện tại của dự án (Current Status)

Dự án **UEH Tracker** đã chính thức hoàn thiện chuyển đổi sang kiến trúc **Fullstack Cloud Hybrid** với sự tích hợp của **Neon Serverless PostgreSQL Cloud**, kết nối hoàn chỉnh giữa giao diện người dùng và hệ thống cơ sở dữ liệu đám mây.

- **Frontend (Client-side & Offline-First):**
  - Chạy trên nền tảng **React 19 + Vite 8.3 + Tailwind CSS 3.4**.
  - Hoạt động mượt mà ở cả hai chế độ:
    - **Offline/Guest Mode:** Lưu trữ và tính toán tức thì trên `localStorage` cho sinh viên chưa đăng nhập.
    - **Cloud-Synced Mode:** Tự động đồng bộ hai chiều (Push/Pull) lên đám mây khi đăng nhập tài khoản UEH.
  - Tích hợp modal **Đồng bộ Neon Cloud** (`CloudSyncModal.jsx`) hỗ trợ đăng nhập, đăng ký và sao lưu dữ liệu chỉ với 1 click.
  - Vượt qua 100% bộ **24 Unit Tests** về quy chế GPA/ĐRL UEH và build production bundle không có cảnh báo lỗi.

- **Backend & Cloud Database (API & PostgreSQL Serverless):**
  - Xây dựng trên nền tảng **Node.js (ES Modules) + Express.js + Prisma ORM 6.4**.
  - **Cơ sở dữ liệu đám mây Neon:**
    - Dự án: `UEH Tracker` (`flat-band-12164942`).
    - Nhánh hoạt động: `production` (`br-weathered-unit-b3lo0ub5`).
    - Hỗ trợ kiến trúc kép: **Connection Pooling (PgBouncer)** cho API runtime và **Direct URL** phục vụ Prisma Migrations.
    - Đã deploy thành công migration `20261010034528_init_neon_schema`.
    - Đã nạp dữ liệu chuẩn (Seeded) cho **33 Khoa / Viện** và toàn bộ chuyên ngành UEH.
  - **Tài liệu Swagger UI:** Hoạt động ổn định tại `http://localhost:3000/api/docs`.

- **Môi trường & Git Repository:**
  - Thiết lập thành công **Neon MCP Server** và **Neon Agent Skills** (8 bộ kỹ năng chính thức của Neon).
  - Tệp `.gitignore` bảo vệ tuyệt đối không làm lộ biến môi trường và khóa bí mật (`.env`, `.env.local`, `.neon`).
  - Toàn bộ mã nguồn đã được commit và push lên nhánh `main` của GitHub: `https://github.com/Vynmt198/UEHTracker.git`.

---

## 2. 📁 Các file vừa tạo và chỉnh sửa trong phiên làm việc

| Đường dẫn file | Mô tả chi tiết thay đổi |
|---|---|
| `backend/.env` & `backend/.env.example` | Cấu hình `DATABASE_URL` (pooled) và `DIRECT_URL` (unpooled) trỏ trực tiếp đến Neon Serverless PostgreSQL Cloud. |
| `backend/prisma/schema.prisma` | Cập nhật khối `datasource db` hỗ trợ `directUrl = env("DIRECT_URL")` cho phép migrate an toàn qua PgBouncer. |
| `backend/prisma/migrations/` | Tạo và áp dụng bản di chuyển cơ sở dữ liệu `20261010034528_init_neon_schema` lên Neon. |
| `backend/src/modules/sync/sync.service.js` | Chuẩn hóa ánh xạ trạng thái môn học `CourseStatus` (Đang học / Đã hoàn thành / Chưa học), hỗ trợ đồng bộ dữ liệu đa chiều. |
| `backend/src/modules/sync/sync.routes.js` | Mở rộng alias route `/api/v1/sync/push` song song với `/api/v1/sync/push-local`. |
| `src/services/api.js` | **(Mới)** Xây dựng API Client bằng `axios` với Interceptor tự động gắn JWT Bearer token và xử lý dọn phiên đăng nhập. |
| `src/context/AppContext.jsx` | Tích hợp trạng thái người dùng (`user`), phương thức đăng nhập (`login`), đăng ký (`register`), đăng xuất (`logout`) và 2 hàm đồng bộ đám mây (`syncToCloud`, `syncFromCloud`). |
| `src/components/common/CloudSyncModal.jsx` | **(Mới)** Modal giao diện xác thực và đồng bộ dữ liệu đám mây (hỗ trợ tab Đăng nhập, Đăng ký, nút điền nhanh tài khoản test, trạng thái kết nối Neon Cloud). |
| `src/components/Sidebar.jsx` | Tích hợp nút kích hoạt đồng bộ Cloud trên cả thanh Sidebar desktop và Top-bar mobile. |
| `neon.ts` | Khởi tạo cấu hình Infrastructure-as-Code của Neon dự án. |
| `.agents/skills/neon*/` | Cài đặt đầy đủ 8 bộ kỹ năng chính thức của Neon (`neon`, `neon-postgres`, `neon-auth`, `neon-functions`...). |
| `.gitignore` & `backend/.gitignore` | Bổ sung quy tắc loại trừ nghiêm ngặt các file nhạy cảm (`.env`, `.env.*`, `*.local`, `.neon`). |

---

## 3. 🎯 Kế hoạch & Roadmap cho phiên làm việc tiếp theo (Next Steps)

Khi mở phiên chat mới, bạn có thể copy đoạn này để tiếp tục phát triển ngay:

1. **Phát triển phân hệ Diễn đàn sinh viên UEH (`src/components/forum/ForumPlaceholder.jsx`):**
   - Thay thế giao diện màn hình chờ (Placeholder) bằng giao diện thảo luận chính thức.
   - Đấu nối với hệ thống Backend API (`/api/v1/forum`):
     - Đăng bài viết chia sẻ kinh nghiệm học tập, review môn học/giảng viên.
     - Cây bình luận đa cấp (Nested comments).
     - Tính năng Upvote / Downvote tương tác.

2. **Tự động đồng bộ định kỳ (Background Auto-Sync):**
   - Thiết lập cơ chế tự động đẩy dữ liệu ngầm lên Neon Cloud mỗi khi sinh viên thêm/sửa/xóa môn học hoặc cập nhật ĐRL (Debounced Auto-save).

3. **Trải nghiệm PWA (Progressive Web App):**
   - Cấu hình file `manifest.json` và Service Worker để sinh viên có thể cài đặt UEH Tracker lên màn hình chính điện thoại và xem bảng điểm offline.
