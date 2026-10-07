# 🎓 UEH Tracker - Nền tảng Quản trị GPA, Điểm Rèn Luyện & Cố vấn Học tập Smart Planner dành cho UEHer

<p align="center">
  <img src="./public/logo.png" alt="UEH Tracker Logo" width="100" height="100" style="border-radius: 16px;" />
</p>

<p align="center">
  <b>Hệ thống quản trị học tập toàn diện được thiết kế chuẩn hóa 100% theo Quy chế Đào tạo & Quy chế Rèn luyện của Đại học Kinh tế TP. Hồ Chí Minh (UEH).</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.3.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/UEH-Standardized-005B96?style=flat-square" alt="UEH Standardized" />
</p>

---

## 📌 Mục lục

1. [Giới thiệu tổng quan](#-giới-thiệu-tổng-quan)
2. [Tính năng cốt lõi](#-tính-năng-cốt-lõi)
   - [1. Smart Planner - Cố vấn thông minh 3 Phân hệ](#1-smart-planner---cố-vấn-thông-minh-3-phân-hệ)
   - [2. Quản lý GPA chuẩn UEH](#2-quản-lý-gpa-chuẩn-ueh)
   - [3. Quản lý Điểm Rèn Luyện (ĐRL)](#3-quản-lý-điểm-rèn-luyện-đrl)
   - [4. Danh mục 33 Khoa / Viện & Chuyên ngành UEH](#4-danh-mục-33-khoa--viện--chuyên-ngành-ueh)
   - [5. Hệ thống Onboarding & Quản trị dữ liệu](#5-hệ-thống-onboarding--quản-trị-dữ-liệu)
3. [Quy chế & Công thức tính toán chuẩn UEH](#-quy-chế--công-thức-tính-toán-chuẩn-ueh)
   - [Thang quy đổi Điểm Hệ 10 → Điểm Chữ → Hệ 4](#thang-quy-đổi-điểm-hệ-10--điểm-chữ--hệ-4)
   - [Quy tắc khống chế điểm học phần](#quy-tắc-khống-chế-điểm-học-phần)
   - [Điểm sàn & Khung 5 Mục Rèn Luyện UEH](#điểm-sàn--khung-5-mục-rèn-luyện-ueh)
   - [Điều kiện xét Học bổng Khuyến khích học tập](#điều-kiện-xét-học-bổng-khuyến-khích-học-tập)
4. [Kiến trúc kỹ thuật & Công nghệ (Tech Stack)](#-kiến-trúc-kỹ-thuật--công-nghệ-tech-stack)
5. [Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục-dự-án)
6. [Hướng dẫn cài đặt & Triển khai](#-hướng-dẫn-cài-đặt--triển-khai)
7. [Cam kết chất lượng & Trải nghiệm người dùng](#-cam-kết-chất-lượng--trải-nghiệm-người-dùng)

---

## 🌟 Giới thiệu tổng quan

**UEH Tracker** ra đời nhằm giải quyết những khó khăn đặc thù của sinh viên Đại học Kinh tế TP. Hồ Chí Minh trong hành trình học tập đại học:
- **Áp lực cạnh tranh học bổng:** Cần tính toán chính xác điểm GPA tích lũy, GPA học kỳ và ĐRL song song.
- **Quy chế điểm rèn luyện phức tạp:** Khung 5 mục với hơn 70 tiểu mục nhỏ, có điểm sàn mặc định (50 điểm), điểm tối đa từng mục và trần khống chế nghiêm ngặt.
- **Rủi ro thiếu giờ / trùng lịch hoạt động:** Khó tìm kiếm hoạt động phù hợp với chuyên ngành, lịch rảnh và mục tiêu cá nhân.

UEH Tracker không chỉ là một công cụ nhập điểm thụ động, mà hoạt động như một **Cố vấn chiến lược cá nhân hóa (Smart Action Engine)** giúp sinh viên tối ưu hóa từng tín chỉ và từng điểm rèn luyện để chạm tới mục tiêu tốt nghiệp loại Giỏi/Xuất sắc và săn Học bổng Khuyến khích học tập UEH.

---

## 🚀 Tính năng cốt lõi

### 1. Smart Planner - Cố vấn thông minh 3 Phân hệ
Kiến trúc phân tách rõ ràng thành 3 Sub-tabs độc lập, trực quan và không bị lấn cấn thao tác:

- **📚 Tab 1: Kế hoạch GPA (GPA Planner)**
  - **Khối chẩn đoán (Diagnostic Banner):** So sánh trực tiếp GPA thực tế so với GPA mục tiêu (mặc định 3.60/4.00). Đưa ra phân tích khoảng cách và cảnh báo nếu có môn nguy cơ.
  - **Công cụ tính GPA cần gánh (Required GPA Calculator):** Tự động tính toán số điểm GPA trung bình bắt buộc phải đạt trong các tín chỉ còn lại để chạm mốc mục tiêu tốt nghiệp.
  - **Adaptive Aim (Cơ chế gợi ý Aim linh hoạt):** Phát hiện độ lệch thực tế vs kỳ vọng theo luật $\pm 0.3$:
    - Nếu điểm thực tế cao hơn $\ge +0.3$: Đề xuất tăng Aim lên mức cao hơn để bứt phá GPA.
    - Nếu điểm thực tế hụt $\le -0.3$: Đề xuất hạ Aim an toàn và gợi ý kéo điểm ở các môn khác.
  - **Tác vụ hành động nhanh (Actionable Tasks):** Phân loại môn học thành các nhóm ưu tiên (Môn đang học cần kéo điểm, môn dự kiến cần lập chiến lược).

- **🏆 Tab 2: Chiến lược ĐRL (DRL Strategy)**
  - **Gap Audit (Soi thiếu hụt từng mục):** Rà soát chi tiết cả 5 mục quy chế. Chỉ rõ mục nào đã chạm mức **Tối đa**, mục nào còn thiếu bao nhiêu điểm để đạt mục tiêu (85/100 hoặc 90/100).
  - **Bộ đếm thời gian tới Hạn nộp ĐRL:** Đồng hồ đếm ngược trực quan giúp sinh viên chủ động nộp minh chứng trước kỳ đánh giá của Khoa/Trường.
  - **Smart Gap Finder (Đề xuất hoạt động thông minh):**
    - Lọc nhanh hoạt động theo **Thứ trong tuần** (Thứ 2 đến Chủ nhật) và **Ca rảnh rỗi** (Sáng: 07:00-11:30, Chiều: 13:00-17:30, Tối: 18:00-21:30).
    - Phân loại hướng đích: *Nghiên cứu khoa học, Kỹ năng mềm, Tình nguyện - Công đồng, Chuyên môn học thuật*.
    - Nút thao tác một chạm: "Ghi nhận tham gia" tự động cộng điểm chuẩn xác vào đúng mã tiêu chí quy chế.

- **🌱 Tab 3: Định hướng cá nhân (Career & Growth)**
  - **Hồ sơ sinh viên UEH:** Hiển thị Khóa (K48, K49, K50...), Khoa/Viện và Chuyên ngành cụ thể.
  - **Bản đồ kỹ năng & Hoạt động theo chuyên ngành:** Tự động lọc các buổi tọa đàm, Workshop chuyên môn và phong trào từ Khoa/Viện chủ quản của sinh viên.
  - **Linh vật Kipo đồng hành:** Hệ thống phản hồi tương tác, thông báo thành tích và khuyến khích học tập thân thiện.

---

### 2. Quản lý GPA chuẩn UEH
- **Phân chia theo Học kỳ:** Quản lý danh sách học kỳ đầy đủ (`Năm 1 - HK1`, `Năm 1 - HK2`, `Năm 2 - HK đầu`, ...), đánh dấu học kỳ hiện tại (`isCurrent`).
- **Modal thiết lập môn học & Điểm thành phần:**
  - Nhập không giới hạn các đầu điểm: Chuyên cần, Bài tập quá trình, Kiểm tra giữa kỳ, Thuyết trình nhóm, Thi kết thúc học phần.
  - **Kiểm soát trọng số nghiêm ngặt:** Cảnh báo tức thời nếu tổng trọng số $\ne 100\%$.
  - **Quy tắc trần quá trình:** Cảnh báo nếu tổng điểm quá trình vượt quá trần quy định 70% của UEH.
  - **Sửa triệt để lỗi số:** Hỗ trợ xóa trắng input (empty state) và tự động loại bỏ số 0 ở đầu (không gặp lỗi `0099` hay `09`).
- **Thống kê kép:**
  - **GPA Thực tế:** Tính từ các môn đã có điểm hoàn thành.
  - **GPA Dự kiến:** Kết hợp điểm thực tế với điểm Aim của các môn đang học/chưa học, cho sinh viên cái nhìn dự phóng trước kỳ thi.
- **Bộ máy thẩm định Học bổng:** Tự động đánh giá các mức học bổng khuyến khích học tập (Xuất sắc, Giỏi, Khá) tương ứng với GPA và ĐRL hiện tại.

---

### 3. Quản lý Điểm Rèn Luyện (ĐRL)
- **Điểm sàn chuẩn quy chế:** Đầu mỗi học kỳ, sinh viên được khởi tạo **50 điểm sàn mặc định**:
  - Mục 1: `15 điểm`
  - Mục 2: `10 điểm`
  - Mục 3: `5 điểm`
  - Mục 4: `10 điểm`
  - Mục 5: `10 điểm`
- **Cây tiêu chí phân cấp 3 cấp (`drlCriteria.json`):**
  - Rõ ràng từng điều khoản quy chế, giới hạn điểm tối thiểu, tối đa và mức trừ phạt.
  - Hiển thị nhãn **"Tối đa"** khi đã đạt trần điểm tiêu chí, tránh tình trạng sinh viên dồn sức vào mục đã đầy điểm.
- **Kho 220+ hoạt động UEH chuẩn hóa (`uehActivities.json`):**
  - Đầy đủ thông tin: Đơn vị tổ chức, ngày giờ, địa điểm (Cơ sở A, B, N, H, V...), loại hình (Chuyên môn vs Trải nghiệm), phân bổ điểm chi tiết (ví dụ: `2.2`: 2đ, `3.2.1`: 3đ).
- **Ghi nhận điểm thủ công (`ManualAdjustmentModal.tsx`):**
  - Cho phép sinh viên tự cộng/trừ điểm các hoạt động bên ngoài hoặc điểm thưởng/phạt đột xuất, ghi chú minh chứng rõ ràng theo ngày.

---

### 4. Danh mục 33 Khoa / Viện & Chuyên ngành UEH
Dữ liệu chuẩn hóa hoàn toàn tại [`src/data/uehFaculties.ts`](file:///e:/GPA-UEH/src/data/uehFaculties.ts) bao gồm toàn bộ 33 đơn vị đào tạo của UEH:

| STT | Tên Khoa / Viện | Các Chuyên ngành Tiêu biểu |
|:---:|:---|:---|
| 1 | Khoa Quản trị | Quản trị kinh doanh, Quản trị nhân lực, Quản trị bệnh viện, Khởi nghiệp... |
| 2 | Khoa Kinh doanh quốc tế - Marketing | Kinh doanh quốc tế, Ngoại thương, Marketing, Truyền thông số, Logistics... |
| 3 | Khoa Tài chính | Tài chính doanh nghiệp, Định giá tài sản, Quản trị rủi ro... |
| 4 | Khoa Ngân hàng | Ngân hàng, Ngân hàng đầu tư, Fintech... |
| 5 | Khoa Kế toán | Kế toán công, Kế toán doanh nghiệp, Kiểm toán... |
| 6 | Khoa Du lịch | Quản trị du lịch & lữ hành, Quản trị khách sạn, Quản trị sự kiện... |
| 7 | Khoa Kinh tế | Kinh tế học, Kinh tế phát triển, Kinh tế bất động sản... |
| 8 | Khoa Tài chính công | Thuế, Hải quan, Quản lý tài chính công... |
| 9 | Khoa Luật | Luật kinh tế, Luật kinh doanh quốc tế... |
| 10 | Khoa Quản lý nhà nước | Quản lý công, Chính sách công... |
| 11 | Khoa Ngoại ngữ | Tiếng Anh thương mại, Tiếng Anh biên phiên dịch... |
| 12 | Khoa Toán - Thống kê | Toán tài chính, Thống kê kinh doanh, Phân tích dữ liệu kinh doanh... |
| 13 | Khoa Công nghệ thông tin kinh doanh | Hệ thống thông tin quản lý, Kỹ thuật phần mềm, Khoa học dữ liệu, AI... |
| 14 | Khoa Thiết kế Truyền thông | Thiết kế đồ họa, Truyền thông số và thiết kế tương tác... |
| 15 | Khoa Tài năng kinh doanh | Cử nhân tài năng ISB BBus, Quản trị tài năng... |
| 16 | Khoa Tài chính - Kế toán | Phân tích tài chính, Kế toán - Kiểm toán tích hợp... |
| 17 | Khoa Kinh doanh quản lý | Quản lý chuỗi cung ứng, Kinh doanh số... |
| 18 | Khoa Công nghệ | Công nghệ kỹ thuật, Kỹ thuật số... |
| 19 | Khoa Cơ bản | Khoa học cơ bản, Lý luận chính trị... |
| 20-33 | Các Viện nghiên cứu & Đào tạo chuyên sâu | Viện Đào tạo quốc tế (ISB), Viện Đô thị thông minh & Quản lý (ISCM), Viện Đổi mới sáng tạo (UII), Viện Công nghệ thông minh (ATIM), Viện Toán ứng dụng, Viện Tài chính bền vững... |

---

### 5. Hệ thống Onboarding & Quản trị dữ liệu
- **Khảo sát ban đầu tương tác:** Hướng dẫn tân sinh viên hoặc người dùng mới nhập thông tin hồ sơ: Khóa, Khoa, Chuyên ngành, Mục tiêu học bổng, Thói quen học tập, Khung giờ rảnh.
- **Bảo mật & Cục bộ:** Dữ liệu hoàn toàn được lưu trữ tại `localStorage` của trình duyệt người dùng, bảo mật quyền riêng tư tuyệt đối.
- **Sao lưu & Phục hồi:** Hỗ trợ tính năng Export/Import toàn bộ hồ sơ, bảng điểm và nhật ký rèn luyện sang định dạng JSON gọn nhẹ.

---

## 📐 Quy chế & Công thức tính toán chuẩn UEH

### Thang quy đổi Điểm Hệ 10 → Điểm Chữ → Hệ 4

Theo quy định đào tạo theo học chế tín chỉ của UEH:

$$GPA_{học kỳ} = \frac{\sum (Điểm\_Hệ\_4_i \times Số\_tín\_chỉ_i)}{\sum Số\_tín\_chỉ_i}$$

| Điểm thang 10 | Điểm Chữ | Thang điểm 4 | Xếp loại học lực |
|:---:|:---:|:---:|:---|
| **9.0 – 10.0** | **A+** | **4.0** | Xuất sắc |
| **8.5 – 8.9** | **A** | **4.0** | Giỏi |
| **8.0 – 8.4** | **B+** | **3.5** | Khá giỏi |
| **7.0 – 7.9** | **B** | **3.0** | Khá |
| **6.5 – 6.9** | **C+** | **2.5** | Trung bình khá |
| **5.5 – 6.4** | **C** | **2.0** | Trung bình |
| **5.0 – 5.4** | **D+** | **1.5** | Trung bình yếu |
| **4.0 – 4.9** | **D** | **1.0** | Yếu (Đạt) |
| **3.0 – 3.9** | **F+** | **0.5** | Kém (Không đạt) |
| **< 3.0** | **F** | **0.0** | Kém (Rớt môn) |

### Quy tắc khống chế điểm học phần
- **Trần điểm quá trình:** Các đầu điểm đánh giá quá trình và giữa kỳ không được chiếm vượt quá 70% tổng số điểm môn học.
- **Quy tắc điểm liệt / Vắng thi:** Nếu có bất kỳ cột điểm nào bị 0 điểm hoặc sinh viên vắng thi kết thúc học phần (`isAbsent = true`), điểm tổng kết học phần bị khống chế tối đa là **4.9 (Điểm F - Không đạt)** theo quy chế học vụ.

### Điểm sàn & Khung 5 Mục Rèn Luyện UEH
Tổng điểm rèn luyện tối đa là **100 điểm**, phân bổ theo 5 nội dung:

$$\text{Tổng ĐRL} = \min(100, \sum_{k=1}^5 \min(\text{Điểm\_thực\_tế}_k, \text{Trần\_mục}_k))$$

1. **Mục 1:** Đánh giá về ý thức tham gia học tập (*Điểm sàn: 15đ, Tối đa: 20đ*).
2. **Mục 2:** Đánh giá về ý thức chấp hành pháp quy và nội quy (*Điểm sàn: 10đ, Tối đa: 25đ*).
3. **Mục 3:** Đánh giá về ý thức tham gia các hoạt động chính trị, xã hội, văn hóa, thể thao (*Điểm sàn: 5đ, Tối đa: 20đ*).
4. **Mục 4:** Đánh giá về phẩm chất công dân và quan hệ cộng đồng (*Điểm sàn: 10đ, Tối đa: 25đ*).
5. **Mục 5:** Đánh giá về ý thức và kết quả tham gia phụ trách lớp, đoàn thể (*Điểm sàn: 10đ, Tối đa: 10đ*).

**Khung xếp loại rèn luyện:**
- **Xuất sắc:** 90 – 100 điểm
- **Tốt:** 80 – 89 điểm
- **Khá:** 65 – 79 điểm
- **Trung bình:** 50 – 64 điểm
- **Yếu:** 35 – 49 điểm
- **Kém:** Dưới 35 điểm

### Điều kiện xét Học bổng Khuyến khích học tập
Để được đưa vào danh sách xét học bổng khuyến khích học tập theo từng kỳ, sinh viên phải thỏa mãn đồng thời cả 2 điều kiện:

| Hạng học bổng | Điều kiện GPA (Hệ 4) | Điều kiện ĐRL | Yêu cầu tín chỉ |
|:---|:---:|:---:|:---|
| **Xuất sắc** | $\ge 3.60$ | $\ge 90$ | Đạt tối thiểu 15 tín chỉ / kỳ |
| **Giỏi** | $\ge 3.20$ | $\ge 80$ | Đạt tối thiểu 15 tín chỉ / kỳ |
| **Khá** | $\ge 2.50$ | $\ge 65$ | Đạt tối thiểu 15 tín chỉ / kỳ |

*(Lưu ý: Không có môn học nào trong kỳ bị điểm F hoặc bị kỷ luật từ mức khiển trách trở lên).*

---

## 🛠 Kiến trúc kỹ thuật & Công nghệ (Tech Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                          Giao diện                          │
│        React 19 + TypeScript + Tailwind CSS + Lucide        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Tầng Quản lý Trạng thái                  │
│             AppContext.tsx (Centralized State)             │
│   • Profile State   • Semester / Courses   • DRL Ledger     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼─────────────┐ ┌──────────────▼───────────────┐
│     Tầng Xử lý Nghiệp vụ   │ │        Tầng Cơ sở Dữ liệu    │
│  • gpaCalculator.ts        │ │  • drlCriteria.json (Cây ĐRL)│
│    - Convert 10 -> 4       │ │  • uehActivities.json (220+) │
│    - Adaptive Aim (±0.3)   │ │  • uehFaculties.ts (33 Khoa) │
│    - Required GPA Engine   │ │  • LocalStorage Persistence  │
│    - Scholarship Tier      │ └──────────────────────────────┘
└────────────────────────────┘
```

- **Frontend Core:** [React 19](https://react.dev/) kết hợp với [TypeScript](https://www.typescriptlang.org/) đảm bảo Type Safety chặt chẽ.
- **Build Tool:** [Vite 8](https://vitejs.dev/) mang lại tốc độ Hot Module Replacement (HMR) cực nhanh.
- **Styling System:** [Tailwind CSS 3.4](https://tailwindcss.com/) với bảng màu được thiết kế tỉ mỉ, hỗ trợ giao diện bóng bẩy, chuẩn SaaS hiện đại.
- **Iconography:** [Lucide React](https://lucide.dev/) và bộ vector giáo dục tùy biến `EduIcons.tsx`.
- **Hiệu ứng & Hoạt cảnh:** `canvas-confetti` cho màn hình chúc mừng khi đạt học bổng hoặc vượt mục tiêu.

---

## 📁 Cấu trúc thư mục dự án

```
GPA-UEH/
├── index.html                   # Entry point HTML chính của ứng dụng
├── package.json                 # Cấu hình dự án, scripts và dependencies
├── tsconfig.json                # Cấu hình TypeScript compiler
├── vite.config.ts               # Cấu hình Vite bundler
├── tailwind.config.js           # Cấu hình theme Tailwind CSS
├── postcss.config.js            # PostCSS plugin config
├── public/                      # Static assets
│   ├── logo.png                 # Logo biểu trưng UEH Tracker
│   └── favicon.ico              # Web favicon
├── scripts/                     # Scripts hỗ trợ dữ liệu
│   └── generateActivities.js    # Script sinh và chuẩn hóa 220+ hoạt động UEH
├── src/
│   ├── App.tsx                  # Layout chính: Sidebar + Route Navigation
│   ├── main.tsx                 # Bootstrap React root
│   ├── index.css                # Global styles, Tailwind directives & animations
│   ├── types/
│   │   └── index.ts             # Định nghĩa Type TypeScript cho toàn bộ app
│   ├── context/
│   │   └── AppContext.tsx       # Central State Context: Lưu trữ & đồng bộ LocalStorage
│   ├── utils/
│   │   └── gpaCalculator.ts     # Bộ máy tính toán GPA, Adaptive Aim, Học bổng
│   ├── data/
│   │   ├── drlCriteria.json     # Cây quy chế tiêu chí 5 mục ĐRL chuẩn UEH
│   │   ├── uehActivities.json   # Danh mục hơn 220 hoạt động UEH có phân bổ điểm
│   │   └── uehFaculties.ts      # Danh sách đầy đủ 33 Khoa/Viện & Chuyên ngành UEH
│   └── components/
│       ├── Sidebar.tsx          # Thanh điều hướng trượt đóng mở (Collapsible Slide Bar)
│       ├── Navigation.tsx       # Thanh điều hướng dự phòng
│       ├── OnboardingModal.tsx  # Modal khảo sát hồ sơ sinh viên ban đầu
│       ├── common/
│       │   ├── EduIcons.tsx     # Bộ icons chuyên ngành giáo dục
│       │   ├── Mascot.tsx       # Linh vật trợ lý học tập Kipo
│       │   └── PrimaryButton.tsx# Component nút bấm chuẩn UI
│       ├── gpa/
│       │   ├── GPADashboard.tsx       # Tổng quan phân hệ GPA
│       │   ├── CourseGradeModal.tsx   # Modal nhập điểm thành phần không lỗi số 0
│       │   ├── CourseAddModal.tsx     # Modal thêm môn học mới
│       │   ├── SemesterModal.tsx      # Modal thêm & quản lý học kỳ
│       │   └── AdaptiveAimBanner.tsx  # Banner chẩn đoán Aim linh hoạt
│       ├── drl/
│       │   ├── DRLModule.tsx          # Entry view phân hệ Điểm Rèn Luyện
│       │   ├── DRLOverview.tsx        # Bảng tổng kết 5 mục rèn luyện & tiến độ
│       │   ├── DrlCriteriaTree.tsx    # Cây phân cấp tiêu chí hiển thị trạng thái "Tối đa"
│       │   ├── ActivityList.tsx       # Danh sách & Bộ lọc hoạt động rèn luyện
│       │   └── ManualAdjustmentModal.tsx # Modal ghi nhận điểm rèn luyện thủ công
│       ├── planner/
│       │   └── SmartPlanner.tsx       # Trợ lý Smart Planner với 3 Sub-tabs chuyên biệt
│       └── forum/
│           └── ForumPlaceholder.tsx   # Phân hệ cộng đồng UEHer (Đang phát triển)
```

---

## 💻 Hướng dẫn cài đặt & Triển khai

### Yêu cầu môi trường
- **Node.js**: Phiên bản `18.0.0` trở lên (Khuyến nghị Node.js 20 LTS hoặc 22).
- **npm** (đi kèm Node) hoặc **yarn** / **pnpm**.

### Các bước cài đặt

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/Vynmt198/UEHTracker.git
   cd UEHTracker
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Chạy máy chủ phát triển (Development Mode):**
   ```bash
   npm run dev
   ```
   *Mở trình duyệt truy cập tại:* `http://localhost:5173`

4. **Kiểm tra TypeScript & Đóng gói sản phẩm (Production Build):**
   ```bash
   npm run build
   ```

5. **Chạy thử bản đóng gói (Preview):**
   ```bash
   npm run preview
   ```

---

## 💎 Cam kết chất lượng & Trải nghiệm người dùng

- **Trực quan & Tinh gọn:** Giao diện được thiết kế theo tiêu chuẩn công thái học, không dùng ký tự emoji bừa bãi hay icon AI gây rối mắt.
- **Không độ trễ:** 100% tính toán diễn ra ngay trên Client, mượt mà ở tốc độ 60fps.
- **Độc lập nền tảng:** Chạy trơn tru trên mọi trình duyệt hiện đại (Chrome, Edge, Safari, Firefox) trên cả Laptop, Máy tính bảng và Điện thoại thông minh.

---

<p align="center">
  Được phát triển với tất cả tâm huyết dành riêng cho cộng đồng sinh viên <b>Đại học Kinh tế TP. Hồ Chí Minh (UEH)</b>.
  <br />
  <sub>Phiên bản: 1.0.0 • Bản quyền © 2026 UEH Tracker Team</sub>
</p>
