export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'UEH Tracker RESTful API (JavaScript Node.js)',
    description: 'Hệ sinh thái API Backend hoàn chỉnh cho ứng dụng UEH Tracker - Quản lý GPA, Điểm Rèn Luyện và Diễn đàn sinh viên Đại học Kinh tế TP.HCM',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập JWT access token',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản sinh viên UEH mới',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'fullName'],
                properties: {
                  email: { type: 'string', example: 'nguyenvanan.st@ueh.edu.vn' },
                  password: { type: 'string', example: 'MatKhau123@' },
                  fullName: { type: 'string', example: 'Nguyễn Văn An' },
                  studentId: { type: 'string', example: '31231020001' },
                  cohort: { type: 'string', example: 'K49' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Đăng ký thành công' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập sinh viên',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'nguyenvanan.st@ueh.edu.vn' },
                  password: { type: 'string', example: 'MatKhau123@' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Đăng nhập thành công' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Làm mới Access Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Thành công' } },
      },
    },
    '/profile/me': {
      get: {
        tags: ['Profile'],
        summary: 'Lấy thông tin profile người dùng hiện tại',
        responses: { 200: { description: 'Thành công' } },
      },
      put: {
        tags: ['Profile'],
        summary: 'Cập nhật thông tin profile',
        responses: { 200: { description: 'Cập nhật thành công' } },
      },
    },
    '/profile/faculties': {
      get: {
        tags: ['Profile'],
        summary: 'Lấy danh mục 33 Khoa / Viện và chuyên ngành UEH',
        responses: { 200: { description: 'Thành công' } },
      },
    },
    '/academic/summary': {
      get: {
        tags: ['Academic'],
        summary: 'Tổng hợp GPA hệ 4, hệ 10, điểm cần gánh và học bổng UEH',
        responses: { 200: { description: 'Thành công' } },
      },
    },
    '/academic/semesters': {
      get: { tags: ['Academic'], summary: 'Danh sách học kỳ', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Academic'], summary: 'Tạo học kỳ mới', responses: { 201: { description: 'OK' } } },
    },
    '/academic/courses': {
      get: { tags: ['Academic'], summary: 'Danh sách môn học', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Academic'], summary: 'Thêm môn học mới kèm các cột điểm', responses: { 201: { description: 'OK' } } },
    },
    '/academic/courses/{id}/grades': {
      put: {
        tags: ['Academic'],
        summary: 'Cập nhật điểm thành phần (kiểm tra trần 70% và điểm liệt < 1.0)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/drl/records': {
      get: { tags: ['DRL'], summary: 'Danh sách hoạt động rèn luyện', responses: { 200: { description: 'OK' } } },
      post: { tags: ['DRL'], summary: 'Ghi nhận hoạt động rèn luyện (+/-)', responses: { 201: { description: 'OK' } } },
    },
    '/drl/summary': {
      get: { tags: ['DRL'], summary: 'Tổng kết điểm rèn luyện & xếp loại UEH (50 điểm sàn)', responses: { 200: { description: 'OK' } } },
    },
    '/sync/push-local': {
      post: { tags: ['Sync'], summary: 'Migrate toàn bộ dữ liệu LocalStorage lên Cloud', responses: { 200: { description: 'OK' } } },
    },
    '/sync/pull': {
      get: { tags: ['Sync'], summary: 'Kéo toàn bộ cây dữ liệu học tập về Client', responses: { 200: { description: 'OK' } } },
    },
    '/forum/posts': {
      get: { tags: ['Forum'], summary: 'Danh sách bài viết (phân trang, search, filter)', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Forum'], summary: 'Đăng bài viết mới', responses: { 201: { description: 'OK' } } },
    },
    '/forum/posts/{id}': {
      get: { tags: ['Forum'], summary: 'Chi tiết bài viết kèm comment tree', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
    },
    '/forum/posts/{id}/comments': {
      post: { tags: ['Forum'], summary: 'Thêm bình luận (hỗ trợ nested reply)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'OK' } } },
    },
    '/forum/posts/{id}/vote': {
      post: { tags: ['Forum'], summary: 'Upvote / Downvote bài viết', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
    },
  },
};
