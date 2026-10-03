import { Course, ScoreComponent } from '../types';

export interface UEHGradeInfo {
  letter: string;
  gpa4: number;
  description: string;
  colorClass: string;
}

/**
 * Quy đổi điểm hệ 10 sang chữ và hệ 4 theo thang điểm chuẩn UEH
 */
export function convertScore10ToUEH(score10: number | null | undefined): UEHGradeInfo {
  if (score10 === null || score10 === undefined || isNaN(score10)) {
    return { letter: '--', gpa4: 0, description: 'Chưa có điểm', colorClass: 'text-slate-400' };
  }

  // Round to 1 decimal place for scale matching
  const score = Math.round(score10 * 10) / 10;

  if (score >= 9.0) {
    return { letter: 'A+', gpa4: 4.0, description: 'Xuất sắc', colorClass: 'text-emerald-600 font-bold' };
  } else if (score >= 8.5) {
    return { letter: 'A', gpa4: 4.0, description: 'Giỏi', colorClass: 'text-emerald-500 font-bold' };
  } else if (score >= 8.0) {
    return { letter: 'B+', gpa4: 3.5, description: 'Khá giỏi', colorClass: 'text-cyan-600 font-bold' };
  } else if (score >= 7.0) {
    return { letter: 'B', gpa4: 3.0, description: 'Khá', colorClass: 'text-cyan-500 font-semibold' };
  } else if (score >= 6.5) {
    return { letter: 'C+', gpa4: 2.5, description: 'Trung bình khá', colorClass: 'text-amber-500 font-semibold' };
  } else if (score >= 5.5) {
    return { letter: 'C', gpa4: 2.0, description: 'Trung bình', colorClass: 'text-amber-600' };
  } else if (score >= 5.0) {
    return { letter: 'D+', gpa4: 1.5, description: 'Trung bình yếu', colorClass: 'text-orange-500' };
  } else if (score >= 4.0) {
    return { letter: 'D', gpa4: 1.0, description: 'Yếu (Đạt)', colorClass: 'text-orange-600' };
  } else if (score >= 3.0) {
    return { letter: 'F+', gpa4: 0.5, description: 'Kém (Không đạt)', colorClass: 'text-red-500 font-semibold' };
  } else {
    return { letter: 'F', gpa4: 0.0, description: 'Kém (Rớt môn)', colorClass: 'text-red-600 font-bold' };
  }
}

/**
 * Kiểm tra tính hợp lệ của tổng trọng số (phải đúng 100%)
 */
export function validateWeights(components: ScoreComponent[]): {
  isValid: boolean;
  totalWeight: number;
  diff: number;
  message: string;
} {
  const totalWeight = components.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const roundedTotal = Math.round(totalWeight * 100) / 100;
  const diff = Math.round((100 - roundedTotal) * 100) / 100;

  if (Math.abs(roundedTotal - 100) < 0.001) {
    return {
      isValid: true,
      totalWeight: 100,
      diff: 0,
      message: 'Tổng trọng số đạt chuẩn 100%'
    };
  }

  if (roundedTotal < 100) {
    return {
      isValid: false,
      totalWeight: roundedTotal,
      diff,
      message: `Tổng trọng số mới đạt ${roundedTotal}%. Còn thiếu ${diff}% nữa để đủ 100%!`
    };
  }

  return {
    isValid: false,
    totalWeight: roundedTotal,
    diff: Math.abs(diff),
    message: `Tổng trọng số hiện tại là ${roundedTotal}%. Vượt quá ${Math.abs(diff)}% so với quy định 100%!`
  };
}

/**
 * Tính điểm tổng kết học phần theo thang 10 có áp dụng luật UEH:
 * - Score10 = sum(score_i * weight_i / 100)
 * - Nếu có điểm quá trình/kết thúc = 0 hoặc vắng (isAbsent) => tối đa 4.9 (Rớt).
 */
export function calculateCourseFinalScore(components: ScoreComponent[]): {
  score10: number | null;
  hasZeroOrAbsent: boolean;
  isComplete: boolean;
} {
  if (!components || components.length === 0) {
    return { score10: null, hasZeroOrAbsent: false, isComplete: false };
  }

  let totalWeightedScore = 0;
  let gradedWeight = 0;
  let hasZeroOrAbsent = false;

  for (const comp of components) {
    const w = Number(comp.weight) || 0;
    if (comp.isAbsent || comp.score === 0) {
      hasZeroOrAbsent = true;
    }

    if (comp.score !== null && comp.score !== undefined && !isNaN(comp.score)) {
      totalWeightedScore += comp.score * (w / 100);
      gradedWeight += w;
    }
  }

  const isComplete = Math.abs(gradedWeight - 100) < 0.001;

  if (gradedWeight === 0) {
    return { score10: null, hasZeroOrAbsent, isComplete: false };
  }

  // Nếu chưa nhập đủ 100% trọng số, tính điểm tạm thời theo phần đã nhập
  let finalScore = isComplete ? totalWeightedScore : (totalWeightedScore / gradedWeight) * 10;
  finalScore = Math.round(finalScore * 100) / 100;

  // Áp dụng luật UEH: 0 điểm hoặc vắng thi => Tối đa 4.9 (Rớt môn)
  if (hasZeroOrAbsent && finalScore > 4.9) {
    finalScore = 4.9;
  }

  return {
    score10: Math.min(10, Math.max(0, finalScore)),
    hasZeroOrAbsent,
    isComplete
  };
}

/**
 * Tính GPA học kỳ hoặc tích lũy cho danh sách môn học
 */
export function calculateGPAStats(courses: Course[]) {
  const completedCourses = courses.filter((c) => c.status === 'Đã hoàn thành');
  const inProgressOrPlannedCourses = courses.filter((c) => c.status !== 'Đã hoàn thành');

  // 1. GPA Thực tế (chỉ tính môn đã hoàn thành)
  let totalCredits = 0;
  let totalPoints4 = 0;
  let totalPoints10 = 0;

  completedCourses.forEach((course) => {
    const finalResult = calculateCourseFinalScore(course.components);
    const score10 = course.finalScore10 ?? finalResult.score10;

    if (score10 !== null && score10 !== undefined) {
      const uehGrade = convertScore10ToUEH(score10);
      totalCredits += course.credits;
      totalPoints4 += uehGrade.gpa4 * course.credits;
      totalPoints10 += score10 * course.credits;
    }
  });

  const actualGPA4 = totalCredits > 0 ? Math.round((totalPoints4 / totalCredits) * 100) / 100 : 0;
  const actualScore10 = totalCredits > 0 ? Math.round((totalPoints10 / totalCredits) * 100) / 100 : 0;

  // 2. GPA Dự kiến (Expected/Projected GPA):
  // Các môn chưa hoàn thành thế giá trị bằng Aim quy đổi hệ 4
  let projectedCredits = totalCredits;
  let projectedPoints4 = totalPoints4;
  let projectedPoints10 = totalPoints10;

  inProgressOrPlannedCourses.forEach((course) => {
    const aim10 = course.aimScore10 || 8.0;
    const aimGrade = convertScore10ToUEH(aim10);
    projectedCredits += course.credits;
    projectedPoints4 += aimGrade.gpa4 * course.credits;
    projectedPoints10 += aim10 * course.credits;
  });

  const projectedGPA4 = projectedCredits > 0 ? Math.round((projectedPoints4 / projectedCredits) * 100) / 100 : actualGPA4;
  const projectedScore10 = projectedCredits > 0 ? Math.round((projectedPoints10 / projectedCredits) * 100) / 100 : actualScore10;

  return {
    actualGPA4,
    actualScore10,
    completedCredits: totalCredits,
    projectedGPA4,
    projectedScore10,
    totalPlannedCredits: projectedCredits,
    totalCourses: courses.length,
    completedCoursesCount: completedCourses.length
  };
}

export interface AdaptiveAimFeedback {
  courseId: string;
  courseName: string;
  currentAim: number;
  actualScore: number;
  diff: number;
  status: 'upgrade' | 'downgrade' | 'on_track';
  suggestedAim: number;
  title: string;
  message: string;
}

/**
 * Adaptive Aim Rules Engine:
 * - Điểm thực >= Aim + 0.3 -> Gợi ý nâng Aim.
 * - Điểm thực <= Aim - 0.3 -> Gợi ý hạ Aim an toàn / đề xuất bù môn khác.
 * - Nằm trong khoảng ±0.3 -> Giữ nguyên Aim (On track).
 */
export function evaluateAdaptiveAim(course: Course): AdaptiveAimFeedback | null {
  // Only evaluate if course has final score or is completed and has an aim
  if (course.finalScore10 === null || course.finalScore10 === undefined || !course.aimScore10) {
    return null;
  }

  // If course status is not completed, don't trigger noisy warnings
  if (course.status !== 'Đã hoàn thành') {
    return null;
  }

  const actualScore = course.finalScore10;
  const currentAim = course.aimScore10;
  const diff = Math.round((actualScore - currentAim) * 10) / 10;

  if (diff >= 0.5) {
    const suggestedAim = Math.min(10, Math.round((currentAim + 0.5) * 10) / 10);
    return {
      courseId: course.id,
      courseName: course.name,
      currentAim,
      actualScore,
      diff,
      status: 'upgrade',
      suggestedAim,
      title: `Điểm môn ${course.name} vượt mục tiêu`,
      message: `Đạt ${actualScore} (Mục tiêu ${currentAim}). Bạn có thể tăng Aim lên ${suggestedAim} để nâng GPA tích lũy.`
    };
  } else if (diff <= -0.5) {
    const suggestedAim = Math.max(5.0, Math.round((currentAim - 0.5) * 10) / 10);
    return {
      courseId: course.id,
      courseName: course.name,
      currentAim,
      actualScore,
      diff,
      status: 'downgrade',
      suggestedAim,
      title: `Điểm môn ${course.name} chưa đạt kỳ vọng`,
      message: `Đạt ${actualScore} (Mục tiêu ${currentAim}). Điều chỉnh Aim về ${suggestedAim} để tính toán lại học bổng.`
    };
  }

  return null;
}

/**
 * Đánh giá điều kiện xét học bổng khuyến khích học tập UEH
 */
export function evaluateScholarship(gpa4: number, drl: number): {
  tier: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Chưa đạt';
  color: string;
  badgeBg: string;
  description: string;
} {
  if (gpa4 >= 3.6 && drl >= 90) {
    return {
      tier: 'Xuất sắc',
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
      description: 'Đạt chuẩn Học bổng Khuyến khích Xuất sắc (GPA >= 3.60 & ĐRL >= 90)'
    };
  } else if (gpa4 >= 3.2 && drl >= 80) {
    return {
      tier: 'Giỏi',
      color: 'text-cyan-600',
      badgeBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      description: 'Đạt chuẩn Học bổng Khuyến khích Giỏi (GPA >= 3.20 & ĐRL >= 80)'
    };
  } else if (gpa4 >= 2.5 && drl >= 65) {
    return {
      tier: 'Khá',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
      description: 'Đạt chuẩn Học bổng Khuyến khích Khá (GPA >= 2.50 & ĐRL >= 65)'
    };
  }

  return {
    tier: 'Chưa đạt',
    color: 'text-slate-500',
    badgeBg: 'bg-slate-100 border-slate-200 text-slate-600',
    description: 'Chưa đủ điều kiện xét học bổng (Cần tối thiểu GPA 2.50 & ĐRL 65)'
  };
}
