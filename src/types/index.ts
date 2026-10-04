export type CourseStatus = 'Chưa học' | 'Đang học' | 'Đã hoàn thành';

export interface ScoreComponent {
  id: string;
  name: string;
  weight: number; // percentage (e.g. 10, 20, 50)
  score: number | null; // scale 0-10 or null if not yet graded
  isAbsent?: boolean;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  status: CourseStatus;
  aimScore10: number; // Mục tiêu điểm hệ 10 (vd: 8.5)
  components: ScoreComponent[];
  semesterId: string;
  finalScore10?: number | null;
  gradeLetter?: string;
  gpa4?: number | null;
  notes?: string;
}

export interface Semester {
  id: string;
  name: string; // "Năm 1 - HK1", "Năm 2 - HK2", etc.
  academicYear: string; // "2024-2025", "2025-2026", etc.
  isCurrent?: boolean;
}

export interface UserProfile {
  name: string;
  studentId: string;
  email: string;
  cohort: string; // Khóa (K48, K49, K50...)
  faculty: string; // Khoa / Viện
  major: string; // Chuyên ngành
  goals: string[]; // ['Học bổng', 'Tốt nghiệp đúng hạn', 'Cải thiện GPA', 'Tích lũy ĐRL']
  scholarshipTierTarget?: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Không đặt';
  targetGPA?: number; // default 3.60
  targetDRL?: number; // default 85
  totalGraduationCredits?: number; // default 125
  strengths: string[];
  studyHabits: string;
  freeTimeSlots: string[];
  isOnboarded: boolean;
}

export interface DRLSubCriteria {
  id: string; // vd: "1.1", "1.2", "2.1", "2.7.4.2"
  code: string;
  title: string;
  description?: string;
  maxPoints: number;
}

export interface DRLMainCriteria {
  id: number; // 1, 2, 3, 4, 5
  title: string;
  maxPoints: number;
  basePoints?: number;
  subCriteria: DRLSubCriteria[];
}

export interface ActivityCriterionAllocation {
  criterionCode: string; // vd: "2.2" hoặc "2.7.4.2"
  points: number; // vd: 2.5
}

export interface UEHActivity {
  id: string;
  code: string;
  title: string;
  organizer: string;
  facultyTarget: string; // Khoa/Viện hướng đến hoặc 'Tất cả'
  activityType: 'chuyen_mon' | 'trai_nghiem'; // Chuyên môn vs. Trải nghiệm văn hóa - xã hội
  audienceCategory?: 'freshman' | 'all' | 'k48' | 'k49' | 'k50' | 'senior';
  goalCategory?: 'scientific_research' | 'career' | 'soft_skills' | 'networking' | 'volunteer' | 'academic';
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 1: Thứ 2, ..., 7: CN
  startTime: string; // "08:00"
  endTime: string; // "10:30"
  location: string; // "Hội trường A.103", "Cơ sở B - B1.205", "Online - MS Teams"
  allocations: ActivityCriterionAllocation[];
  totalPoints: number;
  tags: string[];
  description: string;
  isRegistered?: boolean;
}

export interface DRLManualAdjustment {
  id: string;
  reason: string;
  criterionId: number; // 1-5
  points: number; // +/- points
  date: string;
}

export interface ScheduleBlock {
  id: string;
  dayOfWeek: number; // 1: Thứ 2, 2: Thứ 3, ..., 7: Chủ Nhật
  startTime: string; // "07:30"
  endTime: string; // "11:45"
  title: string;
  location?: string;
  type: 'class' | 'personal' | 'activity' | 'part_time';
  activityId?: string; // liên kết nếu là hoạt động ĐRL
}

export interface GapTimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export type MatchingStrategy = 'faculty' | 'drl_deficit' | 'balanced';

export interface MatchedActivity {
  activity: UEHActivity;
  gapSlot: GapTimeSlot;
  matchScore: number;
  reasons: string[];
  facultyMatch: boolean;
  pointsForDeficit: number;
}
