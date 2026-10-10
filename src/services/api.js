import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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

// Response Interceptor: Chuẩn hóa dữ liệu trả về và xử lý phiên hết hạn
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ueh_tracker_token');
      localStorage.removeItem('ueh_tracker_user');
    }
    const message = error.response?.data?.message || error.message || 'Lỗi kết nối máy chủ';
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

export default apiClient;
