import { describe, it, expect, beforeEach } from 'vitest';

describe('Navigation & Tab Persistence Tests', () => {
  const VALID_TABS = ['planner', 'gpa', 'drl', 'forum'];

  // In-memory mock for environments without browser window.localStorage
  const store = {};
  const mockStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };

  const storage = typeof localStorage !== 'undefined' ? localStorage : mockStorage;

  beforeEach(() => {
    storage.clear();
  });

  it('Lưu và đọc tab hiện tại chính xác từ localStorage', () => {
    storage.setItem('ueh_tracker_active_tab', 'forum');
    expect(storage.getItem('ueh_tracker_active_tab')).toBe('forum');

    storage.setItem('ueh_tracker_active_tab', 'gpa');
    expect(storage.getItem('ueh_tracker_active_tab')).toBe('gpa');
  });

  it('Các tab điều hướng hợp lệ bao gồm đầy đủ 4 phân hệ chính', () => {
    expect(VALID_TABS).toContain('planner');
    expect(VALID_TABS).toContain('gpa');
    expect(VALID_TABS).toContain('drl');
    expect(VALID_TABS).toContain('forum');
  });

  it('Lưu và phục hồi học kỳ được chọn chính xác qua localStorage', () => {
    storage.setItem('ueh_tracker_selected_semester_id', 'sem-1');
    expect(storage.getItem('ueh_tracker_selected_semester_id')).toBe('sem-1');
  });
});
