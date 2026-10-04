import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Semester,
  Course,
  UEHActivity,
  DRLManualAdjustment,
  DRLSemesterData,
  DRLMainCriteria,
  DRLCriterionNode,
  DRLSubCriteriaProgress,
  ScheduleBlock,
  GapTimeSlot
} from '../types';
import drlCriteriaRaw from '../data/drlCriteria.json';
import activitiesRaw from '../data/uehActivities.json';
import { findValidGapTimes, timeToMinutes } from '../utils/scheduleMatcher';
import { calculateCourseFinalScore, convertScore10ToUEH } from '../utils/gpaCalculator';

const drlCriteriaData = drlCriteriaRaw as DRLMainCriteria[];
const activitiesData = activitiesRaw as UEHActivity[];

export interface CriteriaProgress {
  id: number;
  name: string;
  title: string;
  shortName: string;
  currentPoints: number;
  maxPoints: number;
  defaultPoints?: number;
  rawPoints: number;
  isCapped: boolean;
  excessPoints: number;
  subCriteriaProgress: DRLSubCriteriaProgress[];
}

interface AppContextType {
  activeTab: 'planner' | 'gpa' | 'drl' | 'schedule' | 'forum';
  setActiveTab: (tab: 'planner' | 'gpa' | 'drl' | 'schedule' | 'forum') => void;

  // Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetAllData: () => void;

  // GPA & Courses
  semesters: Semester[];
  selectedSemesterId: string;
  setSelectedSemesterId: (id: string) => void;
  addSemester: (name: string, academicYear: string) => void;
  deleteSemester: (id: string) => void;

  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // DRL (Multi-semester & Base 50 points)
  currentDrlSemesterId: string;
  setCurrentDrlSemesterId: (id: string) => void;
  drlSemesters: Record<string, DRLSemesterData>;
  registeredActivityIds: string[];
  toggleActivityRegistration: (activityId: string, semesterId?: string) => void;
  manualAdjustments: DRLManualAdjustment[];
  addManualAdjustment: (adj: Omit<DRLManualAdjustment, 'id' | 'date'>, semesterId?: string) => void;
  deleteManualAdjustment: (id: string, semesterId?: string) => void;
  getDRLProgress: (semesterId?: string) => {
    totalDRL: number;
    rank: string;
    criteriaList: CriteriaProgress[];
    cappedCriteriaCount: number;
    deficitMap: Record<string, number>;
  };
  getAllSemestersDRL: () => {
    semesterId: string;
    name: string;
    year: string;
    totalDRL: number;
    rank: string;
  }[];

  // Schedule
  scheduleBlocks: ScheduleBlock[];
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  deleteScheduleBlock: (id: string) => void;
  validGapTimes: GapTimeSlot[];
  allActivities: UEHActivity[];
  checkActivityScheduleConflict: (activity: UEHActivity) => {
    hasConflict: boolean;
    conflictingBlock?: ScheduleBlock;
    isAlreadyInSchedule: boolean;
  };
  addActivityToSchedule: (activity: UEHActivity) => { success: boolean; message: string };
}

const defaultProfile: UserProfile = {
  name: 'Nguyễn Văn An',
  studentId: '31231021456',
  email: 'an.nguyen@ueh.edu.vn',
  cohort: 'K49',
  faculty: 'Công nghệ thông tin kinh doanh',
  major: 'Hệ thống thông tin quản lý',
  goals: ['Học bổng', 'Tốt nghiệp đúng hạn', 'Tích lũy ĐRL'],
  scholarshipTierTarget: 'Xuất sắc',
  strengths: ['Tư duy logic', 'Lập trình', 'Làm việc nhóm'],
  studyHabits: 'Học buổi sáng & tối, tập trung cao độ',
  freeTimeSlots: ['Thứ 3 chiều', 'Thứ 6 chiều', 'Thứ 7'],
  isOnboarded: false
};

const defaultSemesters: Semester[] = [
  { id: 'sem-1', name: 'Năm 1 - HK1', academicYear: '2025-2026', isCurrent: false },
  { id: 'sem-2', name: 'Năm 1 - HK2', academicYear: '2025-2026', isCurrent: true }
];

const defaultCourses: Course[] = [
  {
    id: 'course-1',
    semesterId: 'sem-2',
    name: 'Toán ứng dụng trong Kinh tế',
    credits: 3,
    status: 'Đang học',
    aimScore10: 8.5,
    components: [
      { id: 'c1-1', name: 'Chuyên cần & Tham gia lớp', weight: 10, score: 9.0 },
      { id: 'c1-2', name: 'Kiểm tra quá trình & Bài tập lớn', weight: 40, score: 8.5 },
      { id: 'c1-3', name: 'Thi kết thúc học phần', weight: 50, score: null }
    ]
  },
  {
    id: 'course-2',
    semesterId: 'sem-2',
    name: 'Triết học Mác - Lênin',
    credits: 3,
    status: 'Đã hoàn thành',
    aimScore10: 8.0,
    finalScore10: 8.2,
    gradeLetter: 'B+',
    gpa4: 3.5,
    components: [
      { id: 'c2-1', name: 'Chuyên cần', weight: 10, score: 10.0 },
      { id: 'c2-2', name: 'Thuyết trình nhóm & Thảo luận', weight: 20, score: 8.0 },
      { id: 'c2-3', name: 'Kiểm tra giữa kỳ', weight: 20, score: 7.5 },
      { id: 'c2-4', name: 'Thi kết thúc học phần', weight: 50, score: 8.2 }
    ]
  },
  {
    id: 'course-3',
    semesterId: 'sem-2',
    name: 'Kinh tế vi mô',
    credits: 3,
    status: 'Đang học',
    aimScore10: 8.0,
    components: [
      { id: 'c3-1', name: 'Chuyên cần', weight: 10, score: 9.0 },
      { id: 'c3-2', name: 'Bài kiểm tra trắc nghiệm quá trình', weight: 30, score: 8.0 },
      { id: 'c3-3', name: 'Thi trắc nghiệm kết thúc học phần', weight: 60, score: null }
    ]
  },
  {
    id: 'course-4',
    semesterId: 'sem-1',
    name: 'Pháp luật đại cương',
    credits: 2,
    status: 'Đã hoàn thành',
    aimScore10: 8.0,
    finalScore10: 8.6,
    gradeLetter: 'A',
    gpa4: 4.0,
    components: [
      { id: 'c4-1', name: 'Quá trình', weight: 50, score: 8.5 },
      { id: 'c4-2', name: 'Cuối kỳ', weight: 50, score: 8.7 }
    ]
  }
];

const defaultScheduleBlocks: ScheduleBlock[] = [
  {
    id: 'sb-1',
    dayOfWeek: 2, // Thứ 3
    startTime: '07:30',
    endTime: '11:45',
    title: 'Toán ứng dụng trong Kinh tế (Lớp HP 26D1MAT501)',
    location: 'B1.302 - Cơ sở B',
    type: 'class'
  },
  {
    id: 'sb-2',
    dayOfWeek: 2, // Thứ 3
    startTime: '13:00',
    endTime: '16:15',
    title: 'Kinh tế vi mô (Lớp HP 26D1ECO502)',
    location: 'B1.205 - Cơ sở B',
    type: 'class'
  },
  {
    id: 'sb-3',
    dayOfWeek: 3, // Thứ 4
    startTime: '08:00',
    endTime: '11:15',
    title: 'Triết học Mác - Lênin',
    location: 'A.103 - Cơ sở A',
    type: 'class'
  },
  {
    id: 'sb-4',
    dayOfWeek: 4, // Thứ 5
    startTime: '13:30',
    endTime: '17:00',
    title: 'Làm việc nhóm BTL & Tự học tại Thư viện Smart Library',
    location: 'Cơ sở B - Tầng 6',
    type: 'personal'
  },
  {
    id: 'sb-5',
    dayOfWeek: 5, // Thứ 6
    startTime: '08:00',
    endTime: '11:30',
    title: 'Tiếng Anh thương mại BEC 1',
    location: 'B2.102 - Cơ sở B',
    type: 'class'
  }
];

const DEFAULT_BASE_POINTS = { m1: 15, m2: 10, m3: 5, m4: 10, m5: 10 };

const defaultDrlSemesters: Record<string, DRLSemesterData> = {
  'sem-1': {
    id: 'sem-1',
    name: 'Năm 1 - HK1',
    year: '2025-2026',
    basePoints: { m1: 15, m2: 10, m3: 5, m4: 10, m5: 10 },
    completedActivityIds: ['act-001', 'act-003', 'act-005', 'act-008'],
    manualAdjustments: [
      {
        id: 'adj-1',
        reason: 'Khen thưởng Ban cán sự lớp gương mẫu HK1',
        criterionId: 5,
        points: 3,
        date: '2025-11-20'
      }
    ],
    totalScore: 78,
    rank: 'Khá'
  },
  'sem-2': {
    id: 'sem-2',
    name: 'Năm 1 - HK2',
    year: '2025-2026',
    basePoints: { m1: 15, m2: 10, m3: 5, m4: 10, m5: 10 },
    completedActivityIds: ['act-001', 'act-003'],
    manualAdjustments: [],
    totalScore: 56,
    rank: 'Trung bình'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'gpa' | 'drl' | 'schedule' | 'forum'>('planner');

  // Load from localStorage or defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ueh_tracker_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('ueh_tracker_semesters');
    return saved ? JSON.parse(saved) : defaultSemesters;
  });

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(() => {
    const current = defaultSemesters.find((s) => s.isCurrent);
    return current ? current.id : defaultSemesters[0]?.id || '';
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ueh_tracker_courses');
    return saved ? JSON.parse(saved) : defaultCourses;
  });

  // DRL Multi-Semester State
  const [drlSemesters, setDrlSemesters] = useState<Record<string, DRLSemesterData>>(() => {
    const saved = localStorage.getItem('drl_semesters');
    return saved ? JSON.parse(saved) : defaultDrlSemesters;
  });

  const [currentDrlSemesterId, setCurrentDrlSemesterId] = useState<string>(() => {
    const saved = localStorage.getItem('currentDrlSemesterId');
    if (saved) return saved;
    const current = defaultSemesters.find((s) => s.isCurrent);
    return current ? current.id : defaultSemesters[0]?.id || 'sem-2';
  });

  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>(() => {
    const saved = localStorage.getItem('ueh_tracker_schedule');
    return saved ? JSON.parse(saved) : defaultScheduleBlocks;
  });

  // Derived properties for active DRL semester
  const activeDrlSemester = drlSemesters[currentDrlSemesterId] || {
    completedActivityIds: [],
    manualAdjustments: []
  };
  const registeredActivityIds = activeDrlSemester.completedActivityIds || [];
  const manualAdjustments = activeDrlSemester.manualAdjustments || [];

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('ueh_tracker_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ueh_tracker_semesters', JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem('ueh_tracker_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('drl_semesters', JSON.stringify(drlSemesters));
  }, [drlSemesters]);

  useEffect(() => {
    localStorage.setItem('currentDrlSemesterId', currentDrlSemesterId);
  }, [currentDrlSemesterId]);

  useEffect(() => {
    localStorage.setItem('ueh_tracker_activities', JSON.stringify(registeredActivityIds));
  }, [registeredActivityIds]);

  useEffect(() => {
    localStorage.setItem('ueh_tracker_drl_adjustments', JSON.stringify(manualAdjustments));
  }, [manualAdjustments]);

  useEffect(() => {
    localStorage.setItem('ueh_tracker_schedule', JSON.stringify(scheduleBlocks));
  }, [scheduleBlocks]);

  // Profile management
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setProfile({ ...defaultProfile, isOnboarded: false });
    setSemesters(defaultSemesters);
    setCourses(defaultCourses);
    setDrlSemesters(defaultDrlSemesters);
    setCurrentDrlSemesterId('sem-2');
    setScheduleBlocks(defaultScheduleBlocks);
    setSelectedSemesterId('sem-2');
  };

  // Semesters & Courses
  const addSemester = (name: string, academicYear: string) => {
    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      name,
      academicYear,
      isCurrent: true
    };
    setSemesters((prev) => [newSem, ...prev.map((s) => ({ ...s, isCurrent: false }))]);
    setSelectedSemesterId(newSem.id);

    // Initialize DRL for new semester with 50 base points
    const newDrlSem: DRLSemesterData = {
      id: newSem.id,
      name,
      year: academicYear,
      basePoints: { ...DEFAULT_BASE_POINTS },
      completedActivityIds: [],
      manualAdjustments: [],
      totalScore: 50,
      rank: 'Trung bình'
    };
    setDrlSemesters((prev) => ({ ...prev, [newSem.id]: newDrlSem }));
    setCurrentDrlSemesterId(newSem.id);
  };

  const deleteSemester = (id: string) => {
    setSemesters((prev) => prev.filter((s) => s.id !== id));
    setCourses((prev) => prev.filter((c) => c.semesterId !== id));
    setDrlSemesters((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (selectedSemesterId === id) {
      const remaining = semesters.filter((s) => s.id !== id);
      if (remaining.length > 0) setSelectedSemesterId(remaining[0].id);
    }
    if (currentDrlSemesterId === id) {
      const remaining = semesters.filter((s) => s.id !== id);
      if (remaining.length > 0) setCurrentDrlSemesterId(remaining[0].id);
    }
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const finalCalc = calculateCourseFinalScore(courseData.components);
    const uehGrade = convertScore10ToUEH(finalCalc.score10 ?? courseData.aimScore10);

    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      finalScore10: finalCalc.score10,
      gradeLetter: uehGrade.letter,
      gpa4: uehGrade.gpa4
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const merged = { ...c, ...updated };
        if (updated.components) {
          const finalCalc = calculateCourseFinalScore(merged.components);
          if (finalCalc.score10 !== null) {
            const ueh = convertScore10ToUEH(finalCalc.score10);
            merged.finalScore10 = finalCalc.score10;
            merged.gradeLetter = ueh.letter;
            merged.gpa4 = ueh.gpa4;
          }
        }
        return merged;
      })
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  /**
   * Tính toán toàn diện tiến độ ĐRL theo 5 mục tiêu chí:
   * - Phân bổ đúng mã tiêu chí con cho từng hoạt động
   * - 50 điểm khởi tạo phân bổ: Mục 1 (15đ), Mục 2 (10đ), Mục 3 (5đ), Mục 4 (10đ), Mục 5 (10đ)
   * - Chặn trần điểm cho từng tiêu chí con và tiêu chí lớn (Cap Warning)
   * - Cộng/trừ điều chỉnh thủ công
   * - Tính bản đồ thiếu hụt điểm (deficit map) để nạp vào Schedule Matcher
   */
  const computeDRLForSemester = (
    basePoints = DEFAULT_BASE_POINTS,
    completedActivityIds: string[] = [],
    manualAdjustmentsList: DRLManualAdjustment[] = []
  ) => {
    const registeredActivities = activitiesData.filter((a) =>
      completedActivityIds.includes(a.id)
    );

    const subPointsMap: Record<string, number> = {};
    const mainCategoryPointsMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    registeredActivities.forEach((act) => {
      act.allocations.forEach((alloc) => {
        const rawCode = alloc.criterionCode;
        subPointsMap[rawCode] = (subPointsMap[rawCode] || 0) + alloc.points;

        const mainId = parseInt(rawCode.split('.')[0], 10);
        if (mainId >= 1 && mainId <= 5) {
          mainCategoryPointsMap[mainId] = (mainCategoryPointsMap[mainId] || 0) + alloc.points;
        }
      });
    });

    let totalCappedSum = 0;
    let cappedCount = 0;
    const deficitMap: Record<string, number> = {};

    const buildNodeProgress = (node: DRLCriterionNode): DRLSubCriteriaProgress => {
      let raw = subPointsMap[node.id] || 0;

      // Add any sub-allocations where alloc code starts with node.id + '.'
      Object.keys(subPointsMap).forEach((code) => {
        if (code !== node.id && code.startsWith(node.id + '.')) {
          raw += subPointsMap[code];
        }
      });

      // Điểm sàn mặc định UEH
      if (node.isDefault) {
        if (node.id === '1.1') raw += (basePoints.m1 ?? 15);
        else if (node.id === '2.1') raw += (basePoints.m2 ?? 10);
        else if (node.id === '3.1') raw += (basePoints.m3 ?? 5);
        else if (node.id === '4.1') raw += (basePoints.m4 ?? 10);
        else if (node.id === '5.1') raw += (basePoints.m5 ?? 10);
        else if (node.points) raw += node.points;
      }

      // Add adjustments targeted to this specific subCriterion
      const directAdjustments = manualAdjustmentsList
        .filter(
          (a) =>
            a.subCriterionId === node.id ||
            (a.subCriterionId && a.subCriterionId.startsWith(node.id + '.'))
        )
        .reduce((sum, a) => sum + a.points, 0);
      raw += directAdjustments;

      // Recurse children if any
      const childrenProgress = node.children?.map(buildNodeProgress);
      if (childrenProgress && childrenProgress.length > 0) {
        const childrenSum = childrenProgress.reduce((sum, c) => sum + c.currentPoints, 0);
        raw = Math.max(raw, childrenSum);
      }

      const maxPts =
        node.maxPoints ??
        (node.points && !node.isPenalty
          ? node.points
          : node.range
          ? node.range[1]
          : 10);
      const minPts = node.minPoints ?? (node.isPenalty ? (node.maxPenalty ?? -15) : 0);

      const capped = node.isPenalty
        ? Math.max(minPts, Math.min(0, raw))
        : Math.min(maxPts, Math.max(0, raw));

      const isCapped = node.isPenalty ? raw <= minPts : raw >= maxPts;

      return {
        id: node.id,
        code: node.id,
        title: node.name,
        currentPoints: capped,
        maxPoints: maxPts,
        minPoints: minPts,
        rawPoints: raw,
        isCapped,
        isDefault: node.isDefault,
        isPenalty: node.isPenalty,
        range: node.range,
        children: childrenProgress
      };
    };

    const criteriaList: CriteriaProgress[] = drlCriteriaData.map((mainCat) => {
      const catId = typeof mainCat.id === 'string' ? parseInt(mainCat.id, 10) : mainCat.id;
      let mainRawSum = 0;
      let mainCappedSum = 0;

      const subProgress = (mainCat.children || []).map(buildNodeProgress);
      const subSum = subProgress.reduce((sum, s) => sum + s.currentPoints, 0);
      const subRaw = subProgress.reduce((sum, s) => sum + s.rawPoints, 0);

      mainRawSum = subRaw;
      mainCappedSum = subSum;

      // Add adjustments that are category-wide (without subCriterionId)
      const catWideAdjustments = manualAdjustmentsList
        .filter((a) => a.criterionId === catId && !a.subCriterionId)
        .reduce((sum, a) => sum + a.points, 0);

      mainRawSum += catWideAdjustments;
      mainCappedSum = Math.max(0, Math.min(mainCat.maxPoints, mainCappedSum + catWideAdjustments));

      const isCapped = mainCappedSum >= mainCat.maxPoints;
      const excessPoints = Math.max(0, Math.round((mainRawSum - mainCat.maxPoints) * 10) / 10);

      if (isCapped) {
        cappedCount++;
      }

      totalCappedSum += mainCappedSum;
      deficitMap[catId.toString()] = Math.max(0, mainCat.maxPoints - mainCappedSum);

      return {
        id: catId,
        name: mainCat.name,
        title: mainCat.name,
        shortName: mainCat.shortName || mainCat.name,
        currentPoints: mainCappedSum,
        maxPoints: mainCat.maxPoints,
        defaultPoints: mainCat.defaultPoints,
        rawPoints: mainRawSum,
        isCapped,
        excessPoints,
        subCriteriaProgress: subProgress
      };
    });

    const finalDRL = Math.min(100, Math.max(0, Math.round(totalCappedSum * 10) / 10));

    let rank = 'Trung bình';
    if (finalDRL >= 90) rank = 'Xuất sắc';
    else if (finalDRL >= 80) rank = 'Tốt';
    else if (finalDRL >= 65) rank = 'Khá';
    else if (finalDRL >= 50) rank = 'Trung bình';
    else if (finalDRL >= 35) rank = 'Yếu';
    else rank = 'Kém';

    return {
      totalDRL: finalDRL,
      rank,
      criteriaList,
      cappedCriteriaCount: cappedCount,
      deficitMap
    };
  };

  const getDRLProgress = (semesterId?: string) => {
    const targetId = semesterId || currentDrlSemesterId;
    const semData = drlSemesters[targetId] || {
      id: targetId,
      name: semesters.find((s) => s.id === targetId)?.name || 'Học kỳ',
      year: semesters.find((s) => s.id === targetId)?.academicYear || '2025-2026',
      basePoints: { ...DEFAULT_BASE_POINTS },
      completedActivityIds: [],
      manualAdjustments: [],
      totalScore: 50,
      rank: 'Trung bình'
    };

    return computeDRLForSemester(
      semData.basePoints || DEFAULT_BASE_POINTS,
      semData.completedActivityIds || [],
      semData.manualAdjustments || []
    );
  };

  const getAllSemestersDRL = () => {
    return semesters.map((s) => {
      const semData = drlSemesters[s.id] || {
        id: s.id,
        name: s.name,
        year: s.academicYear,
        basePoints: { ...DEFAULT_BASE_POINTS },
        completedActivityIds: [],
        manualAdjustments: [],
        totalScore: 50,
        rank: 'Trung bình'
      };
      const calc = computeDRLForSemester(
        semData.basePoints || DEFAULT_BASE_POINTS,
        semData.completedActivityIds || [],
        semData.manualAdjustments || []
      );
      return {
        semesterId: s.id,
        name: s.name,
        year: s.academicYear,
        totalDRL: calc.totalDRL,
        rank: calc.rank
      };
    });
  };

  // DRL activities and multi-criteria allocation engine
  const toggleActivityRegistration = (activityId: string, semesterId?: string) => {
    const targetId = semesterId || currentDrlSemesterId;
    const targetSem = semesters.find((s) => s.id === targetId);

    setDrlSemesters((prev) => {
      const cur = prev[targetId] || {
        id: targetId,
        name: targetSem?.name || 'Học kỳ',
        year: targetSem?.academicYear || '2025-2026',
        basePoints: { ...DEFAULT_BASE_POINTS },
        completedActivityIds: [],
        manualAdjustments: [],
        totalScore: 50,
        rank: 'Trung bình'
      };

      const exists = cur.completedActivityIds.includes(activityId);
      const updatedIds = exists
        ? cur.completedActivityIds.filter((id) => id !== activityId)
        : [...cur.completedActivityIds, activityId];

      const calc = computeDRLForSemester(cur.basePoints, updatedIds, cur.manualAdjustments);

      return {
        ...prev,
        [targetId]: {
          ...cur,
          completedActivityIds: updatedIds,
          totalScore: calc.totalDRL,
          rank: calc.rank as DRLSemesterData['rank']
        }
      };
    });

    // Schedule block toggle
    const currentList = drlSemesters[targetId]?.completedActivityIds || [];
    const exists = currentList.includes(activityId);
    if (exists) {
      setScheduleBlocks((sBlocks) => sBlocks.filter((b) => b.activityId !== activityId));
    } else {
      const act = activitiesData.find((a) => a.id === activityId);
      if (act) {
        const newBlock: ScheduleBlock = {
          id: `sb-act-${Date.now()}`,
          dayOfWeek: act.dayOfWeek,
          startTime: act.startTime,
          endTime: act.endTime,
          title: `[ĐRL] ${act.title}`,
          location: act.location,
          type: 'activity',
          activityId: act.id
        };
        setScheduleBlocks((sBlocks) => [...sBlocks, newBlock]);
      }
    }
  };

  const addManualAdjustment = (
    adj: Omit<DRLManualAdjustment, 'id' | 'date'>,
    semesterId?: string
  ) => {
    const targetId = semesterId || currentDrlSemesterId;
    const targetSem = semesters.find((s) => s.id === targetId);

    const newAdj: DRLManualAdjustment = {
      ...adj,
      id: `adj-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    setDrlSemesters((prev) => {
      const cur = prev[targetId] || {
        id: targetId,
        name: targetSem?.name || 'Học kỳ',
        year: targetSem?.academicYear || '2025-2026',
        basePoints: { ...DEFAULT_BASE_POINTS },
        completedActivityIds: [],
        manualAdjustments: [],
        totalScore: 50,
        rank: 'Trung bình'
      };

      const updatedAdjs = [newAdj, ...(cur.manualAdjustments || [])];
      const calc = computeDRLForSemester(cur.basePoints, cur.completedActivityIds, updatedAdjs);

      return {
        ...prev,
        [targetId]: {
          ...cur,
          manualAdjustments: updatedAdjs,
          totalScore: calc.totalDRL,
          rank: calc.rank as DRLSemesterData['rank']
        }
      };
    });
  };

  const deleteManualAdjustment = (id: string, semesterId?: string) => {
    const targetId = semesterId || currentDrlSemesterId;

    setDrlSemesters((prev) => {
      const cur = prev[targetId];
      if (!cur) return prev;

      const updatedAdjs = (cur.manualAdjustments || []).filter((a) => a.id !== id);
      const calc = computeDRLForSemester(cur.basePoints, cur.completedActivityIds, updatedAdjs);

      return {
        ...prev,
        [targetId]: {
          ...cur,
          manualAdjustments: updatedAdjs,
          totalScore: calc.totalDRL,
          rank: calc.rank as DRLSemesterData['rank']
        }
      };
    });
  };

  // Schedule management
  const addScheduleBlock = (blockData: Omit<ScheduleBlock, 'id'>) => {
    const newBlock: ScheduleBlock = {
      ...blockData,
      id: `sb-${Date.now()}`
    };
    setScheduleBlocks((prev) => [...prev, newBlock]);
  };

  const deleteScheduleBlock = (id: string) => {
    setScheduleBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const validGapTimes = findValidGapTimes(scheduleBlocks);

  const checkActivityScheduleConflict = (activity: UEHActivity) => {
    const isAlreadyInSchedule = scheduleBlocks.some((b) => b.activityId === activity.id);
    const actStart = timeToMinutes(activity.startTime);
    const actEnd = timeToMinutes(activity.endTime);

    const conflictingBlock = scheduleBlocks.find((b) => {
      if (b.dayOfWeek !== activity.dayOfWeek) return false;
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return actStart < bEnd && actEnd > bStart;
    });

    return {
      hasConflict: !!conflictingBlock && !isAlreadyInSchedule,
      conflictingBlock,
      isAlreadyInSchedule
    };
  };

  const addActivityToSchedule = (activity: UEHActivity) => {
    const check = checkActivityScheduleConflict(activity);
    if (check.isAlreadyInSchedule) {
      return { success: false, message: 'Hoạt động đã có trong TKB của bạn!' };
    }
    if (check.hasConflict && check.conflictingBlock) {
      return {
        success: false,
        message: `Trùng giờ với "${check.conflictingBlock.title}" (${check.conflictingBlock.startTime} - ${check.conflictingBlock.endTime})`
      };
    }
    addScheduleBlock({
      title: activity.title,
      dayOfWeek: activity.dayOfWeek,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      type: 'activity',
      activityId: activity.id
    });
    return { success: true, message: `Đã thêm vào TKB (Thứ ${activity.dayOfWeek === 7 ? 'CN' : activity.dayOfWeek + 1}, ${activity.startTime} - ${activity.endTime})!` };
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        updateProfile,
        resetAllData,
        semesters,
        selectedSemesterId,
        setSelectedSemesterId,
        addSemester,
        deleteSemester,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        // DRL
        currentDrlSemesterId,
        setCurrentDrlSemesterId,
        drlSemesters,
        registeredActivityIds,
        toggleActivityRegistration,
        manualAdjustments,
        addManualAdjustment,
        deleteManualAdjustment,
        getDRLProgress,
        getAllSemestersDRL,
        // Schedule
        scheduleBlocks,
        addScheduleBlock,
        deleteScheduleBlock,
        validGapTimes,
        allActivities: activitiesData,
        checkActivityScheduleConflict,
        addActivityToSchedule
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
