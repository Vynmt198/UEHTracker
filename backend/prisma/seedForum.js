import prisma from '../src/database/prisma.js';

export async function seedForumPosts() {
  const existingCount = await prisma.forumPost.count();
  if (existingCount > 0) {
    console.log(`Forum already has ${existingCount} posts, skipping seed.`);
    return;
  }

  // Ensure author user
  let author = await prisma.user.findFirst({
    where: { email: 'test.student@ueh.edu.vn' },
  });

  if (!author) {
    author = await prisma.user.create({
      data: {
        email: 'test.student@ueh.edu.vn',
        passwordHash: '$2b$10$Ep99k.e00Zszk63.H7kEfeXNq3W.p00qYF0c7/v2sR2q5p5.W.', // placeholder
        profile: {
          create: {
            fullName: 'Nguyễn Văn Toàn',
            studentId: '31231021456',
            major: 'Hệ thống thông tin quản lý',
            cohort: 'K49',
          },
        },
      },
    });
  }

  // Demo Student 2 for realistic replies
  let student2 = await prisma.user.findFirst({
    where: { email: 'phuong.thao@ueh.edu.vn' },
  });

  if (!student2) {
    student2 = await prisma.user.create({
      data: {
        email: 'phuong.thao@ueh.edu.vn',
        passwordHash: '$2b$10$Ep99k.e00Zszk63.H7kEfeXNq3W.p00qYF0c7/v2sR2q5p5.W.',
        profile: {
          create: {
            fullName: 'Lê Phương Thảo',
            studentId: '31221028765',
            major: 'Kinh doanh quốc tế',
            cohort: 'K48',
          },
        },
      },
    });
  }

  // Demo Student 3
  let student3 = await prisma.user.findFirst({
    where: { email: 'minh.tri@ueh.edu.vn' },
  });

  if (!student3) {
    student3 = await prisma.user.create({
      data: {
        email: 'minh.tri@ueh.edu.vn',
        passwordHash: '$2b$10$Ep99k.e00Zszk63.H7kEfeXNq3W.p00qYF0c7/v2sR2q5p5.W.',
        profile: {
          create: {
            fullName: 'Trần Minh Trí',
            studentId: '31231029988',
            major: 'Tài chính doanh nghiệp',
            cohort: 'K49',
          },
        },
      },
    });
  }

  // Post 1: Săn học bổng
  const post1 = await prisma.forumPost.create({
    data: {
      authorId: author.id,
      title: 'Kinh nghiệm duy trì GPA 3.8+ và săn học bổng Khuyến khích học tập UEH các kỳ',
      content: `Chào các bạn UEHers, mình là sinh viên K49 ngành Hệ thống thông tin quản lý. Sau 2 học kỳ vừa rồi may mắn đạt học bổng Khuyến khích học tập loại Xuất sắc, mình xin chia sẻ lại lộ trình và mẹo học tập thực chiến:

1. Phân bổ điểm thành phần: Đừng bao giờ bỏ lỡ 10% chuyên cần và 30% bài tập quá trình. Đây là chiếc "phao cứu sinh" kéo điểm 10 kết thúc học phần cực kỳ hiệu quả.
2. Quản lý thời gian thi giữa kỳ và cuối kỳ: UEH thường dồn lịch thi các môn chung trong 2 tuần cao điểm. Hãy lập bảng Smart Planner từ tuần thứ 7 của học kỳ.
3. Tích lũy ĐRL song song: Để nhận học bổng, ĐRL bắt buộc phải từ 80 trở lên (loại Tốt trở lên). Hãy tham gia các buổi tọa đàm NCKH và hiến máu nhân đạo từ đầu kỳ!

Chúc các bạn kỳ này đều rinh được học bổng UEH nhé!`,
      category: 'SAN_HOC_BONG',
      tags: ['HocBongUEH', 'K49', 'KinhNghiem', 'GPA3.8'],
      viewsCount: 142,
      upvotesCount: 28,
      downvotesCount: 1,
    },
  });

  // Post 1 Comments (nested tree)
  const comment1 = await prisma.forumComment.create({
    data: {
      postId: post1.id,
      authorId: student2.id,
      content: 'Bài viết rất tâm huyết ạ! Cho em hỏi thêm môn Kinh tế vi mô thầy nào dạy dễ hiểu và cho điểm quá trình thoáng vậy anh?',
    },
  });

  const reply1_1 = await prisma.forumComment.create({
    data: {
      postId: post1.id,
      authorId: author.id,
      parentId: comment1.id,
      content: 'Chào Thảo, môn Vi mô mình học cô Thùy Dung nhé, cô giảng slide cực kỳ trực quan và cho nhiều bài tập làm nhóm để gỡ điểm kiểm tra nè.',
    },
  });

  await prisma.forumComment.create({
    data: {
      postId: post1.id,
      authorId: student3.id,
      parentId: reply1_1.id,
      content: 'Xác nhận nhé, cô Dung chấm thi trắc nghiệm giữa kỳ chuẩn format đề thi cuối kỳ của viện luôn á.',
    },
  });

  // Post 2: Review Môn học & Giảng viên
  const post2 = await prisma.forumPost.create({
    data: {
      authorId: student2.id,
      title: 'Review chi tiết học phần Kinh tế lượng: Cách sống sót qua kiểm tra EViews và Stata',
      content: `Kinh tế lượng là nỗi ám ảnh của không ít anh chị em UEH. Dưới đây là những lưu ý cốt tử:
- Nắm chắc bản chất mô hình hồi quy OLS: Các giả định cổ điển (đa cộng tuyến, phương sai sai số thay đổi, tự tương quan).
- Thực hành phần mềm EViews/R ngay từ tuần 3: Đừng đợi đến tuần làm tiểu luận mới mở app ra cài.
- Đề thi tự luận cuối kỳ: Chú ý kỹ cách đọc bảng báo cáo hồi quy (Hệ số R-squared, P-value, T-stat).`,
      category: 'REVIEW_MON_HOC',
      tags: ['KinhTeLuong', 'EViews', 'ReviewMonHoc', 'UEH'],
      viewsCount: 98,
      upvotesCount: 19,
      downvotesCount: 0,
    },
  });

  await prisma.forumComment.create({
    data: {
      postId: post2.id,
      authorId: author.id,
      content: 'Thêm một tip nữa: Nên mượn thêm sách bài tập có lời giải của thư viện thông minh UEH B2 nhé mọi người!',
    },
  });

  // Post 3: Góc học tập & NCKH
  await prisma.forumPost.create({
    data: {
      authorId: student3.id,
      title: 'Tìm bạn đồng hành làm Nghiên cứu khoa học sinh viên (UEH Eureka 2026)',
      content: `Nhóm mình hiện có 2 thành viên đang định hướng nghiên cứu về mảng: "Ứng dụng AI và GenAI trong phân tích dữ liệu tài chính doanh nghiệp vừa và nhỏ tại TP.HCM".
Cần tìm thêm 1-2 bạn đam mê NCKH:
- Yêu cầu: Có tinh thần trách nhiệm, biết tìm kiếm tài liệu trên Scopus/Google Scholar hoặc biết chạy dữ liệu cơ bản.
- Quyền lợi: Cộng 10-15 điểm rèn luyện Mục 2, mở rộng hồ sơ du học/học bổng.
Inbox hoặc để lại liên hệ bên dưới để nhóm kết nối nhé!`,
      category: 'GOC_HOC_TAP',
      tags: ['NCKH', 'Eureka2026', 'TimDongDoi', 'Fintech'],
      viewsCount: 76,
      upvotesCount: 15,
      downvotesCount: 0,
    },
  });

  // Post 4: Hỏi đáp chung
  await prisma.forumPost.create({
    data: {
      authorId: author.id,
      title: 'Hỏi về quy trình đăng ký môn học vượt đợt 2 và xin mở thêm lớp học phần',
      content: `Mọi người cho mình hỏi nếu tín chỉ đợt 1 bị full sĩ số thì làm đơn xin mở thêm lớp ở phòng Đào tạo cơ sở A hay nộp trực tuyến qua cổng sinh viên (student.ueh.edu.vn) vậy ạ? Thời gian phản hồi thường mất mấy ngày? Cảm ơn cả nhà!`,
      category: 'HOI_DAP',
      tags: ['DangKyMonHoc', 'PhongDaoTao', 'HoiDap'],
      viewsCount: 52,
      upvotesCount: 8,
      downvotesCount: 0,
    },
  });

  console.log('Seeded sample forum posts and comments successfully!');
}

if (process.argv[1]?.endsWith('seedForum.js')) {
  seedForumPosts()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
