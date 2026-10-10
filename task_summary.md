# 📋 Tóm Tắt Trạng Thái Dự Án UEH Tracker

*Thời gian cập nhật:* 07/10/2026

---

## 1. 🟢 Trạng thái hiện tại của dự án (Current Status)

- **Độ ổn định:** Hoàn thiện và chạy ổn định tất cả các phân hệ cốt lõi:
  - **Smart Planner:** Hoạt động mượt mà với kiến trúc 3 Sub-tabs riêng biệt (Kế hoạch GPA, Chiến lược ĐRL, Định hướng cá nhân), tích hợp chẩn đoán thông minh, Adaptive Aim, Gap Audit và Smart Gap Finder.
  - **Quản lý GPA:** Nhập điểm thành phần chính xác, ràng buộc tổng trọng số 100%, trần điểm quá trình $\le 70\%$, xử lý quy chế điểm liệt và vắng thi (tối đa 4.9 F), tính GPA hệ 10 và hệ 4 chuẩn UEH, đánh giá điều kiện học bổng.
  - **Quản lý Điểm Rèn Luyện (ĐRL):** Tự động khởi tạo 50 điểm sàn đầu kỳ cho 5 mục quy chế, cây tiêu chí 3 cấp thể hiện trạng thái "Tối đa", kho 220+ hoạt động UEH và modal ghi nhận điểm thủ công minh bạch.
  - **Hồ sơ sinh viên:** Tích hợp đầy đủ 33 Khoa / Viện và chuyên ngành trực thuộc UEH.
- **Tình trạng mã nguồn & Build:**
  - `TypeScript` và `Vite` build thành công 100% (`npm run build` không có lỗi cú pháp hoặc Type error).
  - Nhánh `main` đã được đồng bộ hoàn toàn với remote repository (`origin/main`).

---

## 2. 📁 Các file vừa tạo và chỉnh sửa gần đây (Recently Modified Files)

| File | Nội dung thay đổi |
|---|---|
| `README.md` | **(Mới)** Tài liệu dự án toàn diện: giới thiệu, quy chế tính điểm UEH, kiến trúc kỹ thuật, danh mục 33 Khoa/Viện, cấu trúc thư mục và hướng dẫn cài đặt. |
| `src/data/uehFaculties.ts` | Bổ sung danh sách đầy đủ 33 Khoa & Viện chính thức của UEH và toàn bộ chuyên ngành trực thuộc. |
| `src/components/planner/SmartPlanner.tsx` | Tái cấu trúc thành 3 Sub-tabs chuyên biệt (GPA, ĐRL, Định hướng); gỡ bỏ emoji/icon AI thừa; bổ sung bộ lọc Smart Gap Finder theo thứ và ca rảnh (Sáng/Chiều/Tối). |
| `src/components/gpa/CourseGradeModal.tsx` | Khắc phục triệt để lỗi ô nhập số không thể xóa trắng hoặc tự động sinh số 0 ở đầu (`0099`/`09`). |
| `src/components/drl/DrlCriteriaTree.tsx` | Điều chỉnh nhãn trạng thái từ *"Đạt trần"* thành *"Tối đa"* trong cây tiêu chí rèn luyện. |
| `src/components/drl/ActivityList.tsx` | Tinh gọn bộ lọc tìm kiếm ĐRL, gỡ bỏ dropdown Khoa/Viện lấn sân sang Smart Planner nhằm đảm bảo tính phân tách nhiệm vụ (Separation of Concerns). |
| `src/components/Sidebar.tsx` & `src/App.tsx` | Loại bỏ hoàn toàn tính năng và menu Thời khóa biểu (TKB) theo yêu cầu. |
| `src/utils/gpaCalculator.ts` | Hoàn thiện chuẩn UEH: chuẩn hóa trần điểm quá trình <= 70%, điểm liệt cuối kỳ < 1.0, tính GPA cần gánh kỳ tới `calculateNextSemesterRequiredGPA`, điều kiện học bổng khống chế điểm F. |
| `src/utils/__tests__/gpaCalculator.test.ts` | **(Mới)** Bộ Unit Test 24 test cases bao phủ toàn diện 100% logic thang điểm UEH, trọng số, làm tròn, Adaptive Aim, điểm cần gánh và học bổng. |
| `src/App.tsx` | Tích hợp `React.lazy` và `Suspense` cùng `ModuleLoadingFallback` cho 4 phân hệ lớn (`SmartPlanner`, `GPADashboard`, `DRLModule`, `ForumPlaceholder`). |
| `vite.config.ts` | Tối ưu hóa Chunk Distribution (`manualChunks`), tách riêng `vendor-react`, `vendor-icons`, `data-activities`, `data-criteria`, triệt tiêu cảnh báo chunk > 500kB. |
| `backend/` | **(Mới)** Hệ sinh thái Backend hoàn chỉnh: NestJS + Prisma ORM + PostgreSQL, đầy đủ các module Auth (JWT/Bcrypt), Profile, Academic (GPA quy chế UEH), DRL, Sync LocalStorage-Cloud, Forum, Swagger UI và Docker Compose. |

---

## 3. 🎯 Việc tiếp theo cần làm (Next Steps & Roadmap)

1. **Phát triển phân hệ Diễn đàn phía Frontend (`src/components/forum/ForumPlaceholder.tsx`):**
   - Hiện đang ở dạng màn hình chờ (Placeholder).
   - Xây dựng giao diện thảo luận, hỏi đáp kinh nghiệm học tập, review môn học/giảng viên và kết nối với Backend API (`/api/v1/forum`).

2. **Tích hợp API Client / State Sync phía Frontend:**
   - Kết nối frontend với API `POST /api/v1/sync/push-local` để sinh viên có thể sao lưu dữ liệu từ LocalStorage lên Cloud khi đăng nhập.

3. **Trải nghiệm PWA (Progressive Web App):**
   - Đăng ký Service Worker và file `manifest.json` để sinh viên có thể cài đặt ứng dụng lên màn hình chính điện thoại và xem bảng điểm offline.


