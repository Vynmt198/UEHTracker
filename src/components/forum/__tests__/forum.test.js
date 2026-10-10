import { describe, it, expect } from 'vitest';
import { 
  FORUM_CATEGORIES, 
  SORT_OPTIONS, 
  formatRelativeTime 
} from '../forumConstants';
import { forumApi } from '../../../services/api';

describe('UEH Forum Module Tests', () => {
  describe('1. Forum Categories Configuration', () => {
    it('Chứa đầy đủ các danh mục học thuật & đời sống UEH', () => {
      const ids = FORUM_CATEGORIES.map((c) => c.id);
      expect(ids).toContain('ALL');
      expect(ids).toContain('SAN_HOC_BONG');
      expect(ids).toContain('GOC_HOC_TAP');
      expect(ids).toContain('REVIEW_MON_HOC');
      expect(ids).toContain('HOI_DAP');
    });

    it('Mỗi danh mục đều có nhãn hiển thị và định dạng màu sắc', () => {
      FORUM_CATEGORIES.forEach((cat) => {
        expect(cat.label).toBeDefined();
        expect(cat.badgeClass).toBeDefined();
      });
    });
  });

  describe('2. Relative Time Formatter (formatRelativeTime)', () => {
    it('Định dạng thời gian "Vừa xong" khi chênh lệch dưới 60 giây', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('Vừa xong');
    });

    it('Định dạng phút trước', () => {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveMinsAgo)).toBe('5 phút trước');
    });

    it('Định dạng giờ trước', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
      expect(formatRelativeTime(threeHoursAgo)).toBe('3 giờ trước');
    });

    it('Trả về chuỗi rỗng khi tham số null/undefined', () => {
      expect(formatRelativeTime(null)).toBe('');
      expect(formatRelativeTime(undefined)).toBe('');
    });
  });

  describe('3. Forum API Client Interface', () => {
    it('forumApi xuất bản đầy đủ các phương thức CRUD, comment và vote', () => {
      expect(typeof forumApi.getPosts).toBe('function');
      expect(typeof forumApi.getPostDetail).toBe('function');
      expect(typeof forumApi.createPost).toBe('function');
      expect(typeof forumApi.addComment).toBe('function');
      expect(typeof forumApi.votePost).toBe('function');
    });
  });
});
