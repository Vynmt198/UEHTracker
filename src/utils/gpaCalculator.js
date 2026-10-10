/**
 * Quy đổi điểm hệ 10 sang chữ và hệ 4 theo thang điểm chuẩn UEH
 * Làm tròn 1 chữ số thập phân trước khi đối chiếu.
 * Nếu bị điểm liệt hoặc vắng thi (isFailedDueToRegulation = true) => Điểm F / 0.0 hệ 4.
 */
export function convertScore10ToUEH(score10, isFailedDueToRegulation = false) {
  if (score10 === null || score10 === undefined || isNaN(score10)) {
    return { letter: '--', gpa4: 0, description: 'Chưa có điểm', colorClass: 'text-slate-400' };
  }

  // Nếu rớt do quy chế điểm liệt (< 1.0 cuối kỳ) hoặc vắng thi
  if (isFailedDueToRegulation) {
    return { letter: 'F', gpa4: 0.0, description: 'Kém (Rớt do quy chế điểm liệt/vắng thi)', colorClass: 'text-red-600 font-bold' };
  }

  // Round to 1 decimal place for scale matching chuẩn UEH
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
export function validateWeights(components) {
  const totalWeight = (components || []).reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
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
 * Kiểm tra trần điểm quá trình theo quy chế UEH:
 * Điểm quá trình tối đa chiếm 70% tổng điểm môn học.
 */
export function validateProcessWeight(components, maxProcessWeight = 70) {
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
 * - Score10 = sum(score_i * weight_i / 100) làm tròn 1 chữ số thập phân
 * - Quy tắc điểm liệt / vắng thi: Điểm thi cuối kỳ < 1.0 hoặc vắng thi (isAbsent)
 *   hoặc điểm quá trình/cuối kỳ = 0 => tối đa 4.9 (Rớt môn - Điểm F / 0.0 hệ 4),
 *   bất kể điểm quá trình cao đến đâu.
 */
export function calculateCourseFinalScore(components) {
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

    // Kiểm tra vắng thi hoặc điểm 0
    if (comp.isAbsent || comp.score === 0) {
      hasZeroOrAbsent = true;
    }

    // Quy chế điểm liệt: Điểm thi cuối kỳ < 1.0 (ví dụ 0.5)
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

  // Nếu chưa nhập đủ 100% trọng số, tính điểm tạm thời theo phần đã nhập
  let finalScore = isComplete ? totalWeightedScore : (totalWeightedScore / gradedWeight) * 10;
  // Điểm học phần hệ 10 làm tròn đến 1 chữ số thập phân chuẩn UEH
  finalScore = Math.round(finalScore * 10) / 10;

  const isFailedDueToRegulation = hasZeroOrAbsent;

  // Áp dụng luật UEH: 0 điểm, vắng thi hoặc thi cuối kỳ < 1.0 => Tối đa 4.9 (Rớt môn)
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
 * Tính GPA học kỳ hoặc tích lũy cho danh sách môn học:
 * - Điểm học phần hệ 10 làm tròn đến 1 chữ số thập phân.
 * - GPA tích lũy hệ 4 làm tròn đến 2 chữ số thập phân.
 */
export function calculateGPAStats(courses = []) {
  // 1. Phân loại các môn:
  // Môn được tính vào GPA thực tế (actual GPA) nếu:
  // - Trạng thái là 'Đã hoàn thành', HOẶC
  // - Đã có điểm tổng kết hợp lệ (finalScore10 !== null), HOẶC
  // - Đã nhập đủ các cột điểm thành phần 100% trọng số
  const completedCourses = courses.filter((c) => {
    if (c.status === 'Đã hoàn thành') return true;
    if (c.finalScore10 !== null && c.finalScore10 !== undefined && !isNaN(c.finalScore10)) return true;
    if (c.components && c.components.length > 0) {
      const finalResult = calculateCourseFinalScore(c.components);
      return finalResult.score10 !== null && finalResult.isComplete;
    }
    return false;
  });

  const inProgressOrPlannedCourses = courses.filter((c) => !completedCourses.includes(c));

  // 1. GPA Thực tế (chỉ tính môn đã có kết quả điểm)
  let totalCredits = 0;
  let earnedCredits = 0; // Tín chỉ tích lũy (không tính môn F/rớt)
  let totalPoints4 = 0;
  let totalPoints10 = 0;

  completedCourses.forEach((course) => {
    const finalResult = calculateCourseFinalScore(course.components);
    const score10 = course.finalScore10 ?? finalResult.score10;

    if (score10 !== null && score10 !== undefined && !isNaN(score10)) {
      // Nếu môn bị dính quy chế điểm liệt/vắng thi hoặc điểm < 4.0 thì điểm F / không đạt
      const isFailed = finalResult.isFailedDueToRegulation || course.gradeLetter === 'F' || score10 < 4.0;
      const uehGrade = convertScore10ToUEH(score10, isFailed);
      
      totalCredits += course.credits;
      if (!isFailed) {
        earnedCredits += course.credits;
      }
      totalPoints4 += uehGrade.gpa4 * course.credits;
      totalPoints10 += (Math.round(score10 * 10) / 10) * course.credits;
    }
  });

  const actualGPA4 = totalCredits > 0 ? Math.round((totalPoints4 / totalCredits) * 100) / 100 : 0;
  const actualScore10 = totalCredits > 0 ? Math.round((totalPoints10 / totalCredits) * 10) / 10 : 0;

  // 2. GPA Dự kiến (Expected/Projected GPA):
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
  const projectedScore10 = projectedCredits > 0 ? Math.round((projectedPoints10 / projectedCredits) * 10) / 10 : actualScore10;

  return {
    actualGPA4,
    actualScore10,
    completedCredits: earnedCredits > 0 ? earnedCredits : totalCredits,
    projectedGPA4,
    projectedScore10,
    totalPlannedCredits: projectedCredits,
    totalCourses: courses.length,
    completedCoursesCount: completedCourses.length
  };
}

/**
 * Adaptive Aim Rules Engine:
 * - Kiểm tra mục tiêu bất khả thi (Aim > 10.0 hoặc Aim < 0.0) -> 'impossible'
 * - Điểm thực >= Aim + 0.3 -> Gợi ý nâng Aim ('upgrade').
 * - Điểm thực <= Aim - 0.3 -> Gợi ý hạ Aim an toàn / đề xuất bù môn khác ('downgrade').
 * - Nằm trong khoảng ±0.3 -> Giữ nguyên Aim ('on_track').
 */
export function evaluateAdaptiveAim(course, options) {
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

  // Kiểm tra mục tiêu bất khả thi
  if (currentAim > 10.0 || currentAim < 0.0) {
    return {
      courseId: course.id,
      courseName: course.name,
      currentAim,
      actualScore,
      diff: 0,
      status: 'impossible',
      suggestedAim: 10.0,
      title: `Mục tiêu môn ${course.name} không khả thi`,
      message: `Mục tiêu ${currentAim} vượt ngoài thang điểm 0 - 10. Vui lòng thiết lập lại mục tiêu.`
    };
  }

  const diff = Math.round((actualScore - currentAim) * 10) / 10;

  // Adaptive Aim (±0.3 rule)
  if (diff >= 0.3) {
    const suggestedAim = Math.min(10, Math.round((currentAim + 0.3) * 10) / 10);
    return {
      courseId: course.id,
      courseName: course.name,
      currentAim,
      actualScore,
      diff,
      status: 'upgrade',
      suggestedAim,
      title: `Điểm môn ${course.name} vượt mục tiêu (+${diff})`,
      message: `Đạt ${actualScore} (Mục tiêu ${currentAim}). Bạn có thể tăng Aim lên ${suggestedAim} để nâng GPA tích lũy.`
    };
  } else if (diff <= -0.3) {
    const suggestedAim = Math.max(5.0, Math.round((currentAim - 0.3) * 10) / 10);
    return {
      courseId: course.id,
      courseName: course.name,
      currentAim,
      actualScore,
      diff,
      status: 'downgrade',
      suggestedAim,
      title: `Điểm môn ${course.name} chưa đạt kỳ vọng (${diff})`,
      message: `Đạt ${actualScore} (Mục tiêu ${currentAim}). Điều chỉnh Aim về ${suggestedAim} để tính toán lại học bổng an toàn.`
    };
  }

  // Khi điểm nằm trong khoảng ±0.3 (on_track)
  if (options?.returnOnTrack) {
    return {
      courseId: course.id,
      courseName: course.name,
      currentAim,
      actualScore,
      diff,
      status: 'on_track',
      suggestedAim: currentAim,
      title: `Môn ${course.name} bám sát mục tiêu`,
      message: `Đạt ${actualScore} (Mục tiêu ${currentAim}). Tiến độ hoàn thành mục tiêu đang rất tốt!`
    };
  }

  return null;
}

/**
 * Tính GPA cần giữ trong các tín chỉ còn lại toàn khóa để đạt GPA mục tiêu
 */
export function calculateRequiredGPA(
  completedCredits,
  actualGPA4,
  targetGPA = 3.6,
  totalGraduationCredits = 125
) {
  const remainingCredits = Math.max(0, totalGraduationCredits - completedCredits);
  if (completedCredits === 0) {
    const isImpossible = targetGPA > 4.0;
    return {
      remainingCredits,
      requiredGPA: targetGPA,
      status: isImpossible ? 'impossible' : 'achievable',
      message: isImpossible
        ? `Mục tiêu GPA ${targetGPA.toFixed(2)} vượt trần 4.00, không khả thi`
        : `Cần đạt GPA ${targetGPA.toFixed(2)} trong toàn khóa học`
    };
  }

  if (remainingCredits === 0) {
    return {
      remainingCredits: 0,
      requiredGPA: actualGPA4,
      status: actualGPA4 >= targetGPA ? 'already_achieved' : 'impossible',
      message: actualGPA4 >= targetGPA ? 'Đã hoàn thành toàn bộ tín chỉ và đạt mục tiêu' : 'Đã hoàn thành hết tín chỉ nhưng chưa đạt mục tiêu'
    };
  }

  const targetTotalPoints = targetGPA * totalGraduationCredits;
  const currentEarnedPoints = actualGPA4 * completedCredits;
  const pointsNeeded = targetTotalPoints - currentEarnedPoints;
  const required = Math.round((pointsNeeded / remainingCredits) * 100) / 100;

  if (required <= 0) {
    return {
      remainingCredits,
      requiredGPA: 0,
      status: 'already_achieved',
      message: 'Đã tích lũy đủ điểm đạt mục tiêu'
    };
  }

  if (required > 4.0) {
    return {
      remainingCredits,
      requiredGPA: required,
      status: 'impossible',
      message: `Cần GPA ${required.toFixed(2)} (> 4.00), mục tiêu không khả thi`
    };
  }

  return {
    remainingCredits,
    requiredGPA: required,
    status: 'achievable',
    message: `Cần duy trì GPA tối thiểu ${required.toFixed(2)} trong ${remainingCredits} tín chỉ còn lại`
  };
}

/**
 * Công thức tính điểm cần gánh kỳ tới (Next Semester Required GPA)
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
 * Đánh giá điều kiện xét học bổng khuyến khích học tập UEH
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
