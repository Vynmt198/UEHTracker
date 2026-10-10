import app from '../src/app.js';

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM TRA TOÀN DIỆN BACKEND CRUD & AUTH TRÊN NEON POSTGRES ---');
  
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;
  console.log(`Express Test Server đang lắng nghe tại cổng: ${port}`);

  let accessToken = '';
  let refreshToken = '';
  let userId = '';
  const testEmail = `test_${Date.now()}@ueh.edu.vn`;
  const testPassword = 'Password123!';

  try {
    // 1. ĐĂNG KÝ (REGISTER)
    console.log('\n[1/11] Kiểm tra Đăng ký (POST /auth/register)...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        fullName: 'Nguyễn Kiểm Thử',
        studentId: '31231029999',
        cohort: 'K49',
      }),
    });
    const regData = await regRes.json();
    if (!regData.success || !regData.data.accessToken) {
      throw new Error(`Đăng ký thất bại: ${JSON.stringify(regData)}`);
    }
    console.log('✅ Đăng ký thành công! User ID:', regData.data.user.id);
    userId = regData.data.user.id;
    accessToken = regData.data.accessToken;
    refreshToken = regData.data.refreshToken;

    // 2. ĐĂNG NHẬP (LOGIN)
    console.log('\n[2/11] Kiểm tra Đăng nhập (POST /auth/login)...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.data.accessToken) {
      throw new Error(`Đăng nhập thất bại: ${JSON.stringify(loginData)}`);
    }
    accessToken = loginData.data.accessToken;
    console.log('✅ Đăng nhập thành công! Token xác thực hợp lệ.');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    // 3. HỒ SƠ CÁ NHÂN (PROFILE GET & PUT)
    console.log('\n[3/11] Kiểm tra Hồ sơ người dùng (GET & PUT /profile/me)...');
    const profileRes = await fetch(`${baseUrl}/profile/me`, { headers: authHeaders });
    const profileData = await profileRes.json();
    if (!profileData.success || profileData.data.email !== testEmail) {
      throw new Error(`Lấy hồ sơ thất bại: ${JSON.stringify(profileData)}`);
    }

    const updateProfileRes = await fetch(`${baseUrl}/profile/me`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        targetGPA: 3.85,
        targetDRL: 90,
        studyHabits: 'Học buổi sáng, thích NCKH',
      }),
    });
    const updateProfileData = await updateProfileRes.json();
    if (!updateProfileData.success || updateProfileData.data.targetGPA !== 3.85) {
      throw new Error(`Cập nhật hồ sơ thất bại: ${JSON.stringify(updateProfileData)}`);
    }
    console.log('✅ Hồ sơ cá nhân: Lấy và Cập nhật thành công.');

    // 4. DANH MỤC KHOA / VIỆN (FACULTIES GET)
    console.log('\n[4/11] Kiểm tra Danh mục Khoa / Viện (GET /profile/faculties)...');
    const facRes = await fetch(`${baseUrl}/profile/faculties`);
    const facData = await facRes.json();
    if (!facData.success || facData.data.length === 0) {
      throw new Error(`Lấy danh mục khoa thất bại: ${JSON.stringify(facData)}`);
    }
    console.log(`✅ Lấy thành công ${facData.data.length} Khoa/Viện từ Neon Cloud.`);

    // 5. CRUD HỌC KỲ (ACADEMIC SEMESTERS)
    console.log('\n[5/11] Kiểm tra CRUD Học kỳ (/academic/semesters)...');
    const createSemRes = await fetch(`${baseUrl}/academic/semesters`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Năm 2 - HK1 (Test)',
        academicYear: '2025-2026',
        order: 3,
        isCurrent: true,
      }),
    });
    const createSemData = await createSemRes.json();
    if (!createSemData.success) {
      throw new Error(`Tạo học kỳ thất bại: ${JSON.stringify(createSemData)}`);
    }
    const semesterId = createSemData.data.id;

    const listSemRes = await fetch(`${baseUrl}/academic/semesters`, { headers: authHeaders });
    const listSemData = await listSemRes.json();
    if (!listSemData.success || listSemData.data.length === 0) {
      throw new Error(`Lấy danh sách học kỳ thất bại`);
    }
    console.log('✅ CRUD Học kỳ: Tạo và Đọc thành công. Semester ID:', semesterId);

    // 6. CRUD MÔN HỌC (ACADEMIC COURSES)
    console.log('\n[6/11] Kiểm tra CRUD Môn học (/academic/courses)...');
    const createCourseRes = await fetch(`${baseUrl}/academic/courses`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        semesterId,
        code: 'UEH_TEST_101',
        name: 'Kinh tế học thực nghiệm',
        credits: 3,
        status: 'DANG_HOC',
        aimScore10: 8.5,
        components: [
          { name: 'Quá trình', weight: 50, score: 9.0 },
          { name: 'Cuối kỳ', weight: 50, score: 8.0 },
        ],
      }),
    });
    const createCourseData = await createCourseRes.json();
    if (!createCourseData.success) {
      throw new Error(`Tạo môn học thất bại: ${JSON.stringify(createCourseData)}`);
    }
    const courseId = createCourseData.data.id;

    const updateGradeRes = await fetch(`${baseUrl}/academic/courses/${courseId}/grades`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        components: [
          { name: 'Quá trình', weight: 50, score: 9.5 },
          { name: 'Cuối kỳ', weight: 50, score: 8.5 },
        ],
      }),
    });
    const updateGradeData = await updateGradeRes.json();
    if (!updateGradeData.success || updateGradeData.data.finalScore10 !== 9.0) {
      throw new Error(`Cập nhật điểm môn học thất bại: ${JSON.stringify(updateGradeData)}`);
    }
    console.log('✅ CRUD Môn học: Tạo, Tính điểm tự động (finalScore10 = 9.0, A+) thành công.');

    // 7. CRUD ĐIỂM RÈN LUYỆN (DRL)
    console.log('\n[7/11] Kiểm tra CRUD Điểm rèn luyện (/drl/records)...');
    const createDrlRes = await fetch(`${baseUrl}/drl/records`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        semesterId,
        criterionId: '3',
        activityTitle: 'Tham gia Ngày hội Sách UEH Book Fair 2026',
        pointsEarned: 3,
        isManual: true,
      }),
    });
    const createDrlData = await createDrlRes.json();
    if (!createDrlData.success) {
      throw new Error(`Tạo bản ghi ĐRL thất bại: ${JSON.stringify(createDrlData)}`);
    }
    const drlId = createDrlData.data.id;

    const listDrlRes = await fetch(`${baseUrl}/drl/records?semesterId=${semesterId}`, { headers: authHeaders });
    const listDrlData = await listDrlRes.json();
    if (!listDrlData.success) {
      throw new Error(`Lấy danh sách ĐRL thất bại`);
    }

    const delDrlRes = await fetch(`${baseUrl}/drl/records/${drlId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const delDrlData = await delDrlRes.json();
    if (!delDrlData.success) {
      throw new Error(`Xóa bản ghi ĐRL thất bại`);
    }
    console.log('✅ CRUD Điểm rèn luyện: Tạo, Liệt kê, Xóa thành công.');

    // 8. CRUD DIỄN ĐÀN (FORUM POSTS & MULTI-LEVEL COMMENTS & VOTES)
    console.log('\n[8/11] Kiểm tra CRUD Diễn đàn (/forum)...');
    const createPostRes = await fetch(`${baseUrl}/forum/posts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Thảo luận môn Quản trị học UEH - K49',
        content: 'Chia sẻ kinh nghiệm làm tiểu luận nhóm và thuyết trình.',
        category: 'GOC_HOC_TAP',
        tags: ['QuanTriHoc', 'K49', 'TieuLuan'],
      }),
    });
    const createPostData = await createPostRes.json();
    if (!createPostData.success) {
      throw new Error(`Đăng bài viết diễn đàn thất bại: ${JSON.stringify(createPostData)}`);
    }
    const postId = createPostData.data.id;

    // Bình luận gốc
    const rootCommentRes = await fetch(`${baseUrl}/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        content: 'Môn này nhóm mình được 9.0 nè, slide nhớ dùng tông màu nhã nhặn nhé.',
      }),
    });
    const rootCommentData = await rootCommentRes.json();
    if (!rootCommentData.success) {
      throw new Error(`Bình luận gốc thất bại: ${JSON.stringify(rootCommentData)}`);
    }
    const rootCommentId = rootCommentData.data.id;

    // Bình luận lồng nhau (Reply)
    const replyRes = await fetch(`${baseUrl}/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        parentId: rootCommentId,
        content: 'Cảm ơn bạn! Cho mình hỏi thầy có hỏi vấn đáp từng người không?',
      }),
    });
    const replyData = await replyRes.json();
    if (!replyData.success) {
      throw new Error(`Trả lời bình luận thất bại: ${JSON.stringify(replyData)}`);
    }

    // Upvote
    const voteRes = await fetch(`${baseUrl}/forum/posts/${postId}/vote`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ type: 'UPVOTE' }),
    });
    const voteData = await voteRes.json();
    if (!voteData.success || voteData.data.upvotesCount !== 1) {
      throw new Error(`Upvote thất bại: ${JSON.stringify(voteData)}`);
    }

    // Chi tiết bài viết có cây bình luận
    const postDetailRes = await fetch(`${baseUrl}/forum/posts/${postId}`, { headers: authHeaders });
    const postDetailData = await postDetailRes.json();
    if (!postDetailData.success || postDetailData.data.comments.length !== 1 || postDetailData.data.comments[0].replies.length !== 1) {
      throw new Error(`Cây bình luận đa cấp không đúng cấu trúc: ${JSON.stringify(postDetailData)}`);
    }
    console.log('✅ CRUD Diễn đàn: Đăng bài, Cây bình luận đa cấp (Root -> Reply) và Upvote thành công.');

    // 9. ĐỒNG BỘ HYBRID CLOUD SYNC (PUSH & PULL)
    console.log('\n[9/11] Kiểm tra Đồng bộ đám mây (POST /sync/push & GET /sync/pull)...');
    const pushRes = await fetch(`${baseUrl}/sync/push`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        profile: {
          fullName: 'Nguyễn Kiểm Thử Đồng Bộ',
          targetGPA: 3.9,
          targetDRL: 95,
        },
        semesters: [
          { name: 'Năm 1 - HK1 (Sync)', academicYear: '2024-2025', order: 1, isCurrent: false },
        ],
        courses: [
          {
            name: 'Kinh tế lượng ứng dụng',
            credits: 3,
            status: 'Đang học',
            aimScore10: 9.0,
            components: [
              { name: 'Quá trình', weight: 50, score: 9.0 },
              { name: 'Cuối kỳ', weight: 50, score: 9.0 },
            ],
          },
        ],
        drlRecords: [
          { criterionId: '1', activityTitle: 'Chấp hành nội quy UEH', pointsEarned: 15, isManual: true },
        ],
      }),
    });
    const pushData = await pushRes.json();
    if (!pushData.success) {
      throw new Error(`Sync push thất bại: ${JSON.stringify(pushData)}`);
    }

    const pullRes = await fetch(`${baseUrl}/sync/pull`, { headers: authHeaders });
    const pullData = await pullRes.json();
    if (!pullData.success || !pullData.data.profile || pullData.data.semesters.length === 0) {
      throw new Error(`Sync pull thất bại: ${JSON.stringify(pullData)}`);
    }
    console.log('✅ Cloud Sync: Push dữ liệu lên Neon và Pull dữ liệu về thành công 100%.');

    // 10. REFRESH TOKEN
    console.log('\n[10/11] Kiểm tra Làm mới phiên (POST /auth/refresh)...');
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const refreshData = await refreshRes.json();
    if (!refreshData.success || !refreshData.data.accessToken) {
      throw new Error(`Refresh token thất bại: ${JSON.stringify(refreshData)}`);
    }
    accessToken = refreshData.data.accessToken;
    console.log('✅ Refresh Token: Cấp mới access token thành công.');

    // 11. ĐĂNG XUẤT (LOGOUT)
    console.log('\n[11/11] Kiểm tra Đăng xuất (POST /auth/logout)...');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const logoutData = await logoutRes.json();
    if (!logoutData.success) {
      throw new Error(`Đăng xuất thất bại: ${JSON.stringify(logoutData)}`);
    }

    // Dọn dẹp tài khoản test
    console.log('\n[Dọn dẹp] Xóa người dùng thử nghiệm trên Neon Cloud...');
    const prisma = (await import('../src/database/prisma.js')).default;
    await prisma.user.delete({ where: { id: userId } });
    console.log('✅ Đã xóa user kiểm thử thành công.');

    console.log('\n🎉 TẤT CẢ 11/11 HẠNG MỤC BACKEND CRUD, AUTH, VOTE, SYNC ĐỀU HOẠT ĐỘNG HOÀN HẢO!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ KIỂM TRA THẤT BẠI:', err);
  process.exit(1);
});
