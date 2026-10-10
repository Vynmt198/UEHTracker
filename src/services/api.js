import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout để hỗ trợ Render Free Tier Cold-Start (thường mất 30-50s)
});

// Request Interceptor: Tự động đính kèm Bearer JWT Token từ localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ueh_tracker_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hóa dữ liệu trả về và xử lý phiên hết hạn / Cold Start
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ueh_tracker_token');
      localStorage.removeItem('ueh_tracker_user');
    }

    let message = error.response?.data?.message;
    if (!message) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message = 'Máy chủ Backend đang khởi động lại từ trạng thái ngủ (Render Cold Start). Vui lòng đợi trong giây lát và thử lại!';
      } else if (error.message === 'Network Error') {
        message = 'Không thể kết nối đến máy chủ Backend (Network Error). Render có thể đang khởi động lại hoặc gặp sự cố mạng.';
      } else {
        message = error.message || 'Lỗi kết nối máy chủ';
      }
    }

    return Promise.reject(new Error(message));
  }
);

// Module API Xác thực (Auth)
export const authApi = {
  async register({ email, password, fullName }) {
    return apiClient.post('/auth/register', { email, password, fullName });
  },

  async login({ email, password }) {
    return apiClient.post('/auth/login', { email, password });
  },

  async getMe() {
    return apiClient.get('/profile/me');
  },

  logout() {
    localStorage.removeItem('ueh_tracker_token');
    localStorage.removeItem('ueh_tracker_user');
  },
};

// Module API Đồng bộ đám mây (Cloud Sync)
export const syncApi = {
  /**
   * Đẩy toàn bộ dữ liệu học tập từ LocalStorage lên Neon Cloud Postgres
   */
  async pushLocal(payload) {
    return apiClient.post('/sync/push', payload);
  },

  /**
   * Kéo toàn bộ dữ liệu học tập từ Neon Cloud Postgres về trình duyệt
   */
  async pullCloud() {
    return apiClient.get('/sync/pull');
  },
};

// Module API Khoa / Viện UEH
export const facultyApi = {
  async getFaculties() {
    return apiClient.get('/profile/faculties');
  },
};

// Module API Diễn đàn UEH (Forum)
export const forumApi = {
  /**
   * Lấy danh sách bài viết thảo luận với bộ lọc & phân trang
   */
  async getPosts(params = {}) {
    return apiClient.get('/forum/posts', { params });
  },

  /**
   * Lấy chi tiết bài viết kèm toàn bộ cây bình luận đa cấp
   */
  async getPostDetail(id) {
    return apiClient.get(`/forum/posts/${id}`);
  },

  /**
   * Đăng bài viết mới trên diễn đàn
   */
  async createPost(data) {
    return apiClient.post('/forum/posts', data);
  },

  /**
   * Đăng bình luận hoặc phản hồi (reply) vào bình luận cấp dưới
   */
  async addComment(postId, data) {
    return apiClient.post(`/forum/posts/${postId}/comments`, data);
  },

  /**
   * Upvote hoặc Downvote bài viết (nhấn lần 2 để hủy vote)
   */
  async votePost(postId, type) {
    return apiClient.post(`/forum/posts/${postId}/vote`, { type });
  },
};

export default apiClient;

