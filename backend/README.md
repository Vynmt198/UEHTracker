# 🏛️ UEH Tracker - Backend API Ecosystem (JavaScript)

Hệ sinh thái Backend chuyên biệt cho ứng dụng **UEH Tracker** (Quản lý GPA, Điểm rèn luyện và Diễn đàn sinh viên Đại học Kinh tế TP.HCM), được xây dựng trên nền tảng **Node.js (JavaScript ES Modules) + Express.js + Prisma ORM + PostgreSQL**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Ngôn ngữ:** JavaScript thuần (Native ES Modules: `import/export`, strict mode, không phụ thuộc TypeScript compiler).
- **Framework:** [Express.js](https://expressjs.com/) (Kiến trúc Module phân lớp sạch sẽ: routes, controllers, services, database).
- **Database & ORM:** [PostgreSQL 16](https://www.postgresql.org/) kết hợp [Prisma ORM](https://www.prisma.io/).
- **Authentication:** JWT (Access Token + Refresh Token), Password Hashing với `bcrypt`.
- **Security:** Helmet, CORS Whitelist (`http://localhost:5173`).
- **API Documentation:** [Swagger / OpenAPI UI](https://swagger.io/) tại đường dẫn `/api/docs`.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
backend/
├── prisma/
│   ├── schema.prisma                  # Data Models chuẩn quan hệ (PostgreSQL)
│   └── seed.js                        # Seed 33 Khoa/Viện & chuyên ngành UEH (JavaScript)
├── src/
│   ├── common/
│   │   └── middlewares/               # auth.middleware.js, error.middleware.js
│   ├── database/                      # prisma.js (PrismaClient instance)
│   ├── modules/
│   │   ├── auth/                      # Register, Login (JWT), Refresh, Logout
│   │   ├── users/                     # Profile cá nhân, mục tiêu GPA/ĐRL, danh mục Khoa/Viện
│   │   ├── academic/                  # Học kỳ, Môn học, Điểm thành phần & GPA chuẩn UEH
│   │   ├── drl/                       # Ghi nhận hoạt động rèn luyện & tổng hợp 5 tiêu chí
│   │   ├── sync/                      # Migrate dữ liệu LocalStorage lên Cloud & Kéo về client
│   │   └── forum/                     # Bài viết, Cây bình luận phân cấp, Upvote/Downvote
│   ├── utils/                         # Single Source of Truth: gpaCalculator.js
│   ├── config/                        # swagger.js (OpenAPI Documentation config)
│   ├── app.js                         # Cấu hình Express app, middlewares, routes
│   └── main.js                        # Entry point khởi động server
├── docker-compose.yml                 # 1 lệnh khởi chạy PostgreSQL 16 + pgAdmin 4
├── .env / .env.example
└── package.json
```

---

## 🚀 Hướng Dẫn Khởi Chạy (Step-by-Step Setup)

### 1. Cơ sở dữ liệu PostgreSQL

Dự án hỗ trợ 2 tùy chọn kết nối:

#### 👉 Lựa chọn 1: Sử dụng Neon PostgreSQL Cloud (Khuyến nghị - Đã cấu hình sẵn)
Dự án đã liên kết sẵn với **Neon Cloud PostgreSQL Serverless** (Project: `flat-band-12164942`, Branch: `production`).
Bạn chỉ cần thiết lập file `.env` từ `.env.example`:
```env
DATABASE_URL="postgresql://neondb_owner:...@ep-...-pooler...neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require"
```

#### 👉 Lựa chọn 2: Khởi chạy Database cục bộ qua Docker
Tại thư mục `backend/`:
```bash
docker compose up -d
```
- **PostgreSQL Port:** `5432`
- **pgAdmin UI:** `http://localhost:5050` (Email: `admin@ueh.edu.vn`, Mật khẩu: `admin_password`).

### 2. Cài đặt Dependencies
```bash
cd backend
npm install
```

### 3. Đồng bộ Database Schema (Prisma)
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Nạp Dữ Liệu Mẫu (Seed 33 Khoa / Viện UEH)
```bash
npm run prisma:seed
```

### 5. Khởi động Server
```bash
npm run dev
# hoặc chạy production:
npm start
```
Server sẽ chạy tại: `http://localhost:3000/api/v1`

---

## 📚 Tài Liệu API & Swagger UI

Truy cập trực tiếp giao diện Swagger UI để test toàn bộ endpoints:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

### Danh mục Endpoints chính:
1. **Auth (`/api/v1/auth`):**
   - `POST /register`: Đăng ký tài khoản sinh viên UEH.
   - `POST /login`: Đăng nhập, nhận Access Token & Refresh Token.
   - `POST /refresh`: Cấp mới Access Token.
   - `POST /logout`: Đăng xuất an toàn.

2. **Profile (`/api/v1/profile`):**
   - `GET /me`: Lấy thông tin profile và mục tiêu của sinh viên.
   - `PUT /me`: Cập nhật khoa, chuyên ngành, GPA/ĐRL mục tiêu.
   - `GET /faculties`: Lấy danh mục 33 Khoa/Viện trực thuộc UEH.

3. **Academic (`/api/v1/academic`):**
   - `GET /summary`: Tổng hợp GPA hệ 4, hệ 10, điểm cần gánh và xét học bổng.
   - `GET/POST/DELETE /semesters`: Quản lý học kỳ.
   - `GET/POST/DELETE /courses`: Quản lý môn học và điểm thành phần (kiểm tra trần 70% quá trình, quy chế điểm liệt < 1.0 nhận tối đa 4.9 F).

4. **DRL (`/api/v1/drl`):**
   - `GET/POST/DELETE /records`: Ghi nhận hoạt động rèn luyện.
   - `GET /summary`: Tổng kết điểm rèn luyện (khởi tạo 50 điểm sàn) và xếp loại.

5. **Sync (`/api/v1/sync`):**
   - `POST /push-local`: Nhận JSON từ LocalStorage FE để migrate người dùng ẩn danh lên Cloud.
   - `GET /pull`: Tải toàn bộ cây dữ liệu học tập về máy khi đăng nhập trên thiết bị mới.

6. **Forum (`/api/v1/forum`):**
   - `GET /posts`: Danh sách bài viết (phân trang, search, filter category/tag).
   - `POST /posts`: Tạo bài viết mới.
   - `GET /posts/:id`: Chi tiết bài viết kèm cây bình luận phân cấp (Nested Comment Tree).
   - `POST /posts/:id/comments`: Bình luận hoặc trả lời bình luận khác.
   - `POST /posts/:id/vote`: Upvote / Downvote bài viết.
