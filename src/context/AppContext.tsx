import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Semester,
  Course,
  UEHActivity,
  DRLMainCriteria,
  DRLManualAdjustment,
  ScheduleBlock,
  GapTimeSlot
} from '../types';
import drlCriteriaRaw from '../data/drlCriteria.json';
import activitiesRaw from '../data/uehActivities.json';
import { findValidGapTimes } from '../utils/scheduleMatcher';
import { calculateCourseFinalScore, convertScore10ToUEH } from '../utils/gpaCalculator';

const drlCriteriaData = drlCriteriaRaw as DRLMainCriteria[];
const activitiesData = activitiesRaw as UEHActivity[];

export interface CriteriaProgress {
  id: number;
  title: string;
  currentPoints: number;
  maxPoints: number;
  rawPoints: number;
  isCapped: boolean;
  excessPoints: number;
  subCriteriaProgress: {
    code: string;
    title: string;
    currentPoints: number;
    maxPoints: number;
    rawPoints: number;
    isCapped: boolean;
  }[];
}

interface AppContextType {
  activeTab: 'gpa' | 'drl' | 'schedule' | 'forum';
  setActiveTab: (tab: 'gpa' | 'drl' | 'schedule' | 'forum') => void;

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

  // DRL
  registeredActivityIds: string[];
  toggleActivityRegistration: (activityId: string) => void;
  manualAdjustments: DRLManualAdjustment[];
  addManualAdjustment: (adj: Omit<DRLManualAdjustment, 'id' | 'date'>) => void;
  deleteManualAdjustment: (id: string) => void;
  getDRLProgress: () => {
    totalDRL: number;
    rank: string;
    criteriaList: CriteriaProgress[];
    cappedCriteriaCount: number;
    deficitMap: Record<string, number>;
  };

  // Schedule
  scheduleBlocks: ScheduleBlock[];
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  deleteScheduleBlock: (id: string) => void;
  validGapTimes: GapTimeSlot[];
  allActivities: UEHActivity[];
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'drl' | 'schedule' | 'forum'>('gpa');

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

  const [registeredActivityIds, setRegisteredActivityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ueh_tracker_activities');
    return saved ? JSON.parse(saved) : ['act-001', 'act-003'];
  });

  const [manualAdjustments, setManualAdjustments] = useState<DRLManualAdjustment[]>(() => {
    const saved = localStorage.getItem('ueh_tracker_drl_adjustments');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'adj-1',
            reason: 'Khen thưởng Ban cán sự lớp gương mẫu HK1',
            criterionId: 5,
            points: 3,
            date: '2026-09-20'
          }
        ];
  });

  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>(() => {
    const saved = localStorage.getItem('ueh_tracker_schedule');
    return saved ? JSON.parse(saved) : defaultScheduleBlocks;
  });

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
    setRegisteredActivityIds(['act-001', 'act-003']);
    setManualAdjustments([]);
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
  };

  const deleteSemester = (id: string) => {
    setSemesters((prev) => prev.filter((s) => s.id !== id));
    setCourses((prev) => prev.filter((c) => c.semesterId !== id));
    if (selectedSemesterId === id) {
      const remaining = semesters.filter((s) => s.id !== id);
      if (remaining.length > 0) setSelectedSemesterId(remaining[0].id);
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

  // DRL activities and multi-criteria allocation engine
  const toggleActivityRegistration = (activityId: string) => {
    setRegisteredActivityIds((prev) => {
      const exists = prev.includes(activityId);
      if (exists) {
        // Also remove any linked schedule block
        setScheduleBlocks((sBlocks) => sBlocks.filter((b) => b.activityId !== activityId));
        return prev.filter((id) => id !== activityId);
      } else {
        // Find activity to auto add to schedule as convenient option
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
        return [...prev, activityId];
      }
    });
  };

  const addManualAdjustment = (adj: Omit<DRLManualAdjustment, 'id' | 'date'>) => {
    const newAdj: DRLManualAdjustment = {
      ...adj,
      id: `adj-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setManualAdjustments((prev) => [newAdj, ...prev]);
  };

  const deleteManualAdjustment = (id: string) => {
    setManualAdjustments((prev) => prev.filter((a) => a.id !== id));
  };

  /**
   * Tính toán toàn diện tiến độ ĐRL theo 5 mục tiêu chí:
   * - Phân bổ đúng mã tiêu chí con cho từng hoạt động
   * - Chặn trần điểm cho từng tiêu chí con và tiêu chí lớn (Cap Warning)
   * - Cộng/trừ điều chỉnh thủ công
   * - Tính bản đồ thiếu hụt điểm (deficit map) để nạp vào Schedule Matcher
   */
  const getDRLProgress = () => {
    const registeredActivities = activitiesData.filter((a) => registeredActivityIds.includes(a.id));

    // Map subcriteria points
    const subPointsMap: Record<string, number> = {};
    registeredActivities.forEach((act) => {
      act.allocations.forEach((alloc) => {
        subPointsMap[alloc.criterionCode] = (subPointsMap[alloc.criterionCode] || 0) + alloc.points;
      });
    });

    let totalCappedSum = 0;
    let cappedCount = 0;
    const deficitMap: Record<string, number> = {};

    const criteriaList: CriteriaProgress[] = drlCriteriaData.map((mainCat) => {
      let mainRawSum = 0;
      let mainCappedSum = 0;

      const subProgress = mainCat.subCriteria.map((sub) => {
        const raw = subPointsMap[sub.code] || 0;
        const capped = Math.min(raw, sub.maxPoints);
        const isCapped = raw >= sub.maxPoints;

        mainRawSum += raw;
        mainCappedSum += capped;

        return {
          code: sub.code,
          title: sub.title,
          currentPoints: capped,
          maxPoints: sub.maxPoints,
          rawPoints: raw,
          isCapped
        };
      });

      // Thêm điểm điều chỉnh thủ công cho mục này
      const adjustmentsForCat = manualAdjustments
        .filter((a) => a.criterionId === mainCat.id)
        .reduce((sum, a) => sum + a.points, 0);

      mainRawSum += adjustmentsForCat;
      mainCappedSum = Math.max(0, Math.min(mainCat.maxPoints, mainCappedSum + adjustmentsForCat));

      const isCapped = mainCappedSum >= mainCat.maxPoints;
      const excessPoints = Math.max(0, Math.round((mainRawSum - mainCat.maxPoints) * 10) / 10);

      if (isCapped) {
        cappedCount++;
      }

      totalCappedSum += mainCappedSum;
      deficitMap[mainCat.id.toString()] = Math.max(0, mainCat.maxPoints - mainCappedSum);

      return {
        id: mainCat.id,
        title: mainCat.title,
        currentPoints: mainCappedSum,
        maxPoints: mainCat.maxPoints,
        rawPoints: mainRawSum,
        isCapped,
        excessPoints,
        subCriteriaProgress: subProgress
      };
    });

    const finalDRL = Math.min(100, Math.round(totalCappedSum * 10) / 10);

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
        registeredActivityIds,
        toggleActivityRegistration,
        manualAdjustments,
        addManualAdjustment,
        deleteManualAdjustment,
        getDRLProgress,
        scheduleBlocks,
        addScheduleBlock,
        deleteScheduleBlock,
        validGapTimes,
        allActivities: activitiesData
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
