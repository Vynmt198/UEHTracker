# 📋 Tóm Tắt Trạng Thái Dự Án UEH Tracker

*Thời gian cập nhật:* 10/10/2026

---

## 1. 🟢 Trạng thái hiện tại của dự án (Current Status)

Dự án **UEH Tracker** đã chính thức hoàn thiện phân hệ **Diễn đàn sinh viên UEH** và cơ chế **Tự động đồng bộ ngầm (Background Debounced Auto-Sync)**, kết nối xuyên suốt giữa Frontend (React 19 + Vite 8.3) và Backend (Node.js ES Modules + Express + Prisma ORM) với **Neon Serverless PostgreSQL Cloud** (Dự án: `flat-band-12164942`, branch `production`).

- **Frontend (Client-side & Offline-First & Realtime Cloud Sync):**
  - Chạy trên nền tảng **React 19 + Vite 8.3 + Tailwind CSS 3.4**.
  - **Phân hệ Diễn đàn sinh viên UEH chính thức:**
    - Thay thế hoàn toàn `ForumPlaceholder.jsx` bằng bộ UI hoàn chỉnh, chuẩn phong cách UEH: `ForumModule.jsx`, `PostCard.jsx`, `PostDetailView.jsx`, `CreatePostModal.jsx`, `CommentTree.jsx`, `CommentItem.jsx`.
    - Bộ lọc chuyên mục (Săn học bổng UEH, Góc học tập & NCKH, Review môn học & Giảng viên, Hỏi đáp chung).
    - Tìm kiếm từ khóa theo thời gian thực và lọc theo hashtag phổ biến (`#HocBongUEH`, `#K49`, `#KinhTeLuong`...).
    - Tương tác Upvote / Downvote đa chiều trực tiếp từ feed và trang chi tiết với cơ chế Toggle thông minh.
    - Cây thảo luận đa cấp (Nested threaded comments) đệ quy không giới hạn cấp độ, hỗ trợ trả lời bình luận phân nhánh trực quan.
  - **Cơ chế Tự động đồng bộ ngầm (Background Auto-Sync):**
    - Tự động gom thay đổi điểm số, môn học, học kỳ và ĐRL đẩy ngầm lên Neon Cloud sau 2.5s không thao tác (`Debounced Auto-Save`).
    - Cơ chế chống lặp vô hạn `skipNextAutoSync` khi kéo dữ liệu từ đám mây về máy.
    - Hiển thị trạng thái đồng bộ sống động trên Sidebar và nút Toggle bật/tắt trong `CloudSyncModal.jsx`.
  - Bộ kiểm thử tự động tăng lên **31/31 Unit Tests** (100% Pass) trên Vitest; thời gian build production bundle đạt **< 1 giây**.

- **Backend & Cơ sở dữ liệu đám mây Neon:**
  - Hoạt động ổn định tại `http://localhost:3000/api/v1/forum`.
  - Mở rộng Middleware `optionalAuthMiddleware` cho phép khách vãng lai duyệt bài viết công khai, tự động nhận diện tài khoản để trả về trạng thái `userVote`.
  - Nạp dữ liệu mẫu chất lượng cao về học bổng, review môn học qua `backend/prisma/seedForum.js`.

---

## 2. 📁 Các file vừa tạo và chỉnh sửa trong phiên làm việc

| Đường dẫn file | Mô tả chi tiết thay đổi |
|---|---|
| `src/components/forum/forumConstants.js` | **(Mới)** Hằng số danh mục thảo luận UEH, màu sắc badge, tiêu chí sắp xếp và hàm tính thời gian tương đối `formatRelativeTime`. |
| `src/components/forum/CommentItem.jsx` | **(Mới)** Thành phần bình luận đệ quy hỗ trợ trả lời phân cấp, hiển thị tác giả, khóa và thời gian đăng. |
| `src/components/forum/CommentTree.jsx` | **(Mới)** Khung thảo luận đa cấp, tích hợp form gửi bình luận gốc và cây phản hồi theo luồng. |
| `src/components/forum/PostCard.jsx` | **(Mới)** Thẻ hiển thị bài viết trên bảng tin với điểm số vote tương tác, danh mục, tác giả, tags và số bình luận. |
| `src/components/forum/PostDetailView.jsx` | **(Mới)** Màn hình chi tiết bài viết đầy đủ với hộp vote Reddit-style, sao chép link chia sẻ và cây bình luận lồng nhau. |
| `src/components/forum/CreatePostModal.jsx` | **(Mới)** Modal đăng bài viết mới với bộ chọn chuyên mục, nhập tiêu đề, nội dung và gắn thẻ tag linh hoạt. |
| `src/components/forum/ForumModule.jsx` | **(Mới)** Phân hệ Diễn đàn hoàn chỉnh tích hợp thanh tìm kiếm, bộ lọc chuyên mục, hot tags và phân trang. |
| `src/components/forum/ForumPlaceholder.jsx` | Chuyển đổi thành bộ render trung gian trỏ về `ForumModule`, duy trì tính tương thích với cấu hình lazy loading. |
| `src/components/forum/__tests__/forum.test.js` | **(Mới)** Bộ unit test cho các hằng số diễn đàn, hàm định dạng thời gian và interface API. |
| `src/context/AppContext.jsx` | Tích hợp cơ chế Background Debounced Auto-Sync (2.5s), cờ `skipNextAutoSync`, xuất bản `autoSyncEnabled`, `autoSyncState`. |
| `src/components/common/CloudSyncModal.jsx` | Tích hợp công tắc gạt (Toggle Switch) bật/tắt tính năng Auto-Sync và hiển thị trạng thái lưu ngầm thời gian thực. |
| `src/components/Sidebar.jsx` | Cập nhật nhãn Diễn đàn thành `Mới` và thêm chỉ báo trạng thái Auto-Sync sống động trên nút Neon Cloud. |
| `src/services/api.js` | Bổ sung module `forumApi` kết nối các endpoint `/forum/posts`, `/forum/posts/:id`, comment và vote. |
| `backend/src/common/middlewares/auth.middleware.js` | Bổ sung và xuất bản `optionalAuthMiddleware` hỗ trợ đọc bài viết công khai kèm nhận diện người dùng. |
| `backend/src/modules/forum/forum.routes.js` | Áp dụng `optionalAuthMiddleware` cho các route đọc bài viết `GET /posts` và `GET /posts/:id`. |
| `backend/src/modules/forum/forum.controller.js` | Truyền ID người dùng đang đăng nhập (nếu có) vào service để trả về trạng thái vote. |
| `backend/src/modules/forum/forum.service.js` | Tối ưu truy vấn bài viết theo chuyên mục/sắp xếp, xây dựng thuật toán dựng cây bình luận đa cấp không giới hạn độ sâu và hỗ trợ hủy vote (Toggle). |
| `backend/prisma/seedForum.js` | **(Mới)** Kịch bản nạp dữ liệu bài viết và cây bình luận mẫu thực tế lên Neon Postgres. |

---

## 3. 🎯 Kế hoạch & Roadmap cho các phiên làm việc tiếp theo

1. **Trải nghiệm PWA (Progressive Web App) & Offline Caching:**
   - Cấu hình file `manifest.json` và Service Worker để sinh viên có thể cài đặt UEH Tracker lên màn hình chính điện thoại và xem bảng điểm offline.
2. **Xuất báo cáo Bảng điểm & Hồ sơ rèn luyện:**
   - Tính năng xuất bảng điểm và minh chứng ĐRL thành file PDF / Excel chuẩn mẫu UEH để sinh viên nộp xét học bổng và xét tốt nghiệp.
3. **Thông báo đẩy (In-app Notifications):**
   - Thông báo khi có sinh viên khác phản hồi vào bài viết hoặc bình luận của mình trên diễn đàn.
