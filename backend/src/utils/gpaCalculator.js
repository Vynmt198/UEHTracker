/**
 * Quy đổi điểm hệ 10 sang chữ và hệ 4 theo thang điểm chuẩn UEH
 */
export function convertScore10ToUEH(score10, isFailedDueToRegulation = false) {
  if (score10 === null || score10 === undefined || isNaN(score10)) {
    return { letter: '--', gpa4: 0, description: 'Chưa có điểm', colorClass: 'text-slate-400' };
  }

  if (isFailedDueToRegulation) {
    return { letter: 'F', gpa4: 0.0, description: 'Kém (Rớt do quy chế điểm liệt/vắng thi)', colorClass: 'text-red-600 font-bold' };
  }

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
export function validateWeights(components = []) {
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
 * Kiểm tra trần điểm quá trình theo quy chế UEH (tối đa 70%)
 */
export function validateProcessWeight(components = [], maxProcessWeight = 70) {
  if (!components || components.length === 0) {
    return { isValid: true, processWeight: 0, finalExamWeight: 0, message: 'Chưa có thành phần điểm' };
  }

  const finalExamComponent = components.find((c) => {
    const name = (c.name || '').toLowerCase();
    return name.includes('kết thúc') || name.includes('cuối kỳ') || name.includes('thi kết thúc') || name.includes('thi cuối');
  });

  const finalExamWeight = finalExamComponent ? Number(finalExamComponent.weight) || 0 : 0;
  const processWeight = components
    .filter((c) => c !== finalExamComponent)
    .reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  const roundedProcessWeight = Math.round(processWeight * 100) / 100;
  const isValid = roundedProcessWeight <= maxProcessWeight;

  return {
    isValid,
    processWeight: roundedProcessWeight,
    finalExamWeight: Math.round(finalExamWeight * 100) / 100,
    message: isValid
      ? `Điểm quá trình chiếm ${roundedProcessWeight}% (hợp lệ <= ${maxProcessWeight}%)`
      : `Quy chế UEH: Tổng trọng số điểm quá trình (${roundedProcessWeight}%) không được vượt quá ${maxProcessWeight}%!`
  };
}

/**
 * Tính điểm tổng kết học phần theo thang 10 có áp dụng luật UEH:
 * Điểm thi cuối kỳ < 1.0 hoặc vắng thi nhận tối đa 4.9 (Rớt môn - F)
 */
export function calculateCourseFinalScore(components = []) {
  if (!components || components.length === 0) {
    return { score10: null, hasZeroOrAbsent: false, isComplete: false, isFailedDueToRegulation: false };
  }

  let totalWeightedScore = 0;
  let gradedWeight = 0;
  let hasZeroOrAbsent = false;

  for (const comp of components) {
    const w = Number(comp.weight) || 0;
    const nameLower = (comp.name || '').toLowerCase();
    const isFinalExam = nameLower.includes('kết thúc') || nameLower.includes('cuối kỳ') || nameLower.includes('thi');

    if (comp.isAbsent || comp.score === 0) {
      hasZeroOrAbsent = true;
    }

    if (isFinalExam && comp.score !== null && comp.score !== undefined && comp.score < 1.0) {
      hasZeroOrAbsent = true;
    }

    if (comp.score !== null && comp.score !== undefined && !isNaN(comp.score)) {
      totalWeightedScore += comp.score * (w / 100);
      gradedWeight += w;
    }
  }

  const isComplete = Math.abs(gradedWeight - 100) < 0.001;

  if (gradedWeight === 0) {
    return { score10: null, hasZeroOrAbsent, isComplete: false, isFailedDueToRegulation: false };
  }

  let finalScore = isComplete ? totalWeightedScore : (totalWeightedScore / gradedWeight) * 10;
  finalScore = Math.round(finalScore * 10) / 10;

  const isFailedDueToRegulation = hasZeroOrAbsent;

  if (hasZeroOrAbsent && finalScore > 4.9) {
    finalScore = 4.9;
  }

  return {
    score10: Math.min(10, Math.max(0, finalScore)),
    hasZeroOrAbsent,
    isComplete,
    isFailedDueToRegulation
  };
}

/**
 * Tính điểm GPA kỳ tới cần gánh
 */
export function calculateNextSemesterRequiredGPA(
  completedCredits,
  currentGPA,
  nextSemesterCredits,
  targetCumulativeGPA = 3.6
) {
  if (nextSemesterCredits <= 0) {
    return {
      requiredGPA: currentGPA,
      status: currentGPA >= targetCumulativeGPA ? 'already_achieved' : 'impossible',
      message: 'Số tín chỉ kỳ tới phải lớn hơn 0'
    };
  }

  const totalFutureCredits = completedCredits + nextSemesterCredits;
  const targetTotalPoints = targetCumulativeGPA * totalFutureCredits;
  const currentEarnedPoints = currentGPA * completedCredits;
  const pointsNeeded = targetTotalPoints - currentEarnedPoints;
  const required = Math.round((pointsNeeded / nextSemesterCredits) * 100) / 100;

  if (pointsNeeded <= 0) {
    return {
      requiredGPA: 0,
      status: 'already_achieved',
      message: `GPA hiện tại (${currentGPA.toFixed(2)}) đã vượt mục tiêu tích lũy (${targetCumulativeGPA.toFixed(2)})`
    };
  }

  if (required > 4.0) {
    return {
      requiredGPA: required,
      status: 'impossible',
      message: `Kỳ tới cần đạt GPA ${required.toFixed(2)} (> 4.00), mục tiêu vượt trần tối đa của thang 4.0!`
    };
  }

  return {
    requiredGPA: required,
    status: 'achievable',
    message: `Kỳ tới cần đạt GPA tối thiểu ${required.toFixed(2)} để kéo GPA tích lũy lên ${targetCumulativeGPA.toFixed(2)}`
  };
}

/**
 * Đánh giá điều kiện xét học bổng UEH
 */
export function evaluateScholarship(gpa4, drl, options) {
  const hasFailedCourse = typeof options === 'boolean' ? options : options?.hasFailedCourse ?? false;

  if (hasFailedCourse) {
    return {
      tier: 'Chưa đạt',
      color: 'text-red-600',
      badgeBg: 'bg-red-50 border-red-200 text-red-700',
      description: 'Không đủ điều kiện xét học bổng do có môn bị điểm F trong kỳ xét (Quy chế UEH)'
    };
  }

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
  } else if (gpa4 >= 2.5 && drl >= 70) {
    return {
      tier: 'Khá',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
      description: 'Đạt chuẩn Học bổng Khuyến khích Khá (GPA >= 2.50 & ĐRL >= 70)'
    };
  }

  return {
    tier: 'Chưa đạt',
    color: 'text-slate-500',
    badgeBg: 'bg-slate-100 border-slate-200 text-slate-600',
    description: 'Chưa đủ điều kiện xét học bổng (Cần tối thiểu GPA 2.50 & ĐRL 70)'
  };
}
