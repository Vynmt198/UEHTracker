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

---

## 3. 🎯 Việc tiếp theo cần làm (Next Steps & Roadmap)

1. **Phát triển phân hệ Diễn đàn (`src/components/forum/ForumPlaceholder.tsx`):**
   - Hiện đang ở dạng màn hình chờ (Placeholder).
   - Xây dựng giao diện thảo luận, hỏi đáp kinh nghiệm học tập, review môn học/giảng viên và chia sẻ hoạt động săn học bổng giữa các UEHer.

2. **Tối ưu hóa hiệu năng & Code Splitting:**
   - Áp dụng `React.lazy` và dynamic `import()` cho các màn hình lớn (`SmartPlanner`, `DRLModule`, `GPADashboard`) để chia nhỏ file bundle `index.js` (hiện đang > 500kB).

3. **Viết kiểm thử tự động (Unit Tests):**
   - Bổ sung bộ test cho `src/utils/gpaCalculator.ts`:
     - Kiểm thử logic quy đổi thang điểm UEH (Hệ 10 $\rightarrow$ Chữ $\rightarrow$ Hệ 4).
     - Kiểm thử luật Adaptive Aim ($\pm 0.3$).
     - Kiểm thử công thức tính điểm GPA cần gánh (*Required GPA*).
     - Kiểm thử quy tắc khống chế điểm liệt / vắng thi.

4. **Trải nghiệm PWA (Progressive Web App):**
   - Đăng ký Service Worker và file `manifest.json` để sinh viên có thể cài đặt ứng dụng lên màn hình chính điện thoại và xem bảng điểm offline.
