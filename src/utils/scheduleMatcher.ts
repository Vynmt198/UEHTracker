import { ScheduleBlock, GapTimeSlot, UEHActivity, MatchedActivity, MatchingStrategy, UserProfile } from '../types';

/**
 * Chuyển đổi giờ HH:mm sang phút
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Chuyển phút sang định dạng HH:mm
 */
export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Thuật toán quét và tìm kiếm Gap Time hợp lệ (Khoảng trống >= 60 phút giữa các khối bận)
 * Chỉ tính trong khung giờ hoạt động sinh viên (vd: 07:00 -> 21:00)
 */
export function findValidGapTimes(blocks: ScheduleBlock[], dayFilter?: number): GapTimeSlot[] {
  const DAY_START = timeToMinutes('07:00');
  const DAY_END = timeToMinutes('21:00');
  const MIN_GAP_MINUTES = 60;

  const validGaps: GapTimeSlot[] = [];
  const daysToCheck = dayFilter ? [dayFilter] : [1, 2, 3, 4, 5, 6, 7];

  daysToCheck.forEach((day) => {
    // Lấy các khối sự kiện bận trong ngày và sắp xếp tăng dần theo giờ bắt đầu
    const dayBlocks = blocks
      .filter((b) => b.dayOfWeek === day)
      .map((b) => ({
        start: timeToMinutes(b.startTime),
        end: timeToMinutes(b.endTime),
        title: b.title
      }))
      .sort((a, b) => a.start - b.start);

    if (dayBlocks.length === 0) {
      // Cả ngày trống => tạo 1 gap lớn buổi sáng và 1 buổi chiều nếu muốn, hoặc 1 gap chuẩn
      validGaps.push({
        id: `gap-${day}-full`,
        dayOfWeek: day,
        startTime: '07:30',
        endTime: '17:30',
        durationMinutes: timeToMinutes('17:30') - timeToMinutes('07:30')
      });
      return;
    }

    // 1. Kiểm tra khoảng trống từ đầu ngày (07:30) đến sự kiện đầu tiên
    const firstBlock = dayBlocks[0];
    if (firstBlock.start - DAY_START >= MIN_GAP_MINUTES) {
      validGaps.push({
        id: `gap-${day}-start`,
        dayOfWeek: day,
        startTime: minutesToTime(DAY_START),
        endTime: minutesToTime(firstBlock.start),
        durationMinutes: firstBlock.start - DAY_START
      });
    }

    // 2. Quét các khoảng trống giữa các sự kiện liên tiếp
    for (let i = 0; i < dayBlocks.length - 1; i++) {
      const currentBlockEnd = dayBlocks[i].end;
      const nextBlockStart = dayBlocks[i + 1].start;

      const gapDuration = nextBlockStart - currentBlockEnd;
      if (gapDuration >= MIN_GAP_MINUTES) {
        validGaps.push({
          id: `gap-${day}-${i}`,
          dayOfWeek: day,
          startTime: minutesToTime(currentBlockEnd),
          endTime: minutesToTime(nextBlockStart),
          durationMinutes: gapDuration
        });
      }
    }

    // 3. Kiểm tra khoảng trống từ sự kiện cuối cùng đến cuối ngày
    const lastBlock = dayBlocks[dayBlocks.length - 1];
    if (DAY_END - lastBlock.end >= MIN_GAP_MINUTES) {
      validGaps.push({
        id: `gap-${day}-end`,
        dayOfWeek: day,
        startTime: minutesToTime(lastBlock.end),
        endTime: minutesToTime(DAY_END),
        durationMinutes: DAY_END - lastBlock.end
      });
    }
  });

  return validGaps;
}

/**
 * Kiểm tra xem hoạt động có bị trùng với bất kỳ khối bận nào của sinh viên không
 */
export function isActivityConflicting(activity: UEHActivity, blocks: ScheduleBlock[]): boolean {
  const actStart = timeToMinutes(activity.startTime);
  const actEnd = timeToMinutes(activity.endTime);

  return blocks.some((b) => {
    if (b.dayOfWeek !== activity.dayOfWeek) return false;
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    // Có giao nhau về thời gian
    return Math.max(actStart, bStart) < Math.min(actEnd, bEnd);
  });
}

/**
 * Matching & Priority Engine:
 * So sánh khung giờ của hoạt động với Gap Time hợp lệ và chấm điểm ưu tiên theo 3 Option:
 * - Option 1: Chuyên môn (Faculty target match)
 * - Option 2: Tối ưu ĐRL (Bù đắp tiêu chí thiếu hụt nhiều nhất)
 * - Option 3: Kết hợp (Weighted score)
 */
export function matchActivitiesWithGaps(
  activities: UEHActivity[],
  gapSlots: GapTimeSlot[],
  blocks: ScheduleBlock[],
  profile: UserProfile,
  criteriaDeficitMap: Record<string, number>, // { "1": 15, "2": 8, "3": 12, ... } số điểm còn thiếu để max trần
  strategy: MatchingStrategy = 'balanced'
): MatchedActivity[] {
  const matchedList: MatchedActivity[] = [];

  for (const activity of activities) {
    // 1. Loại bỏ nếu hoạt động trùng lịch với bất kỳ khối bận nào
    if (isActivityConflicting(activity, blocks)) {
      continue;
    }

    const actStart = timeToMinutes(activity.startTime);
    const actEnd = timeToMinutes(activity.endTime);

    // 2. Tìm gap slot khớp thời gian (hoạt động phải nằm gọn hoặc phần lớn trong gap time)
    const matchingGap = gapSlots.find((gap) => {
      if (gap.dayOfWeek !== activity.dayOfWeek) return false;
      const gStart = timeToMinutes(gap.startTime);
      const gEnd = timeToMinutes(gap.endTime);

      return actStart >= gStart && actEnd <= gEnd;
    });

    if (!matchingGap) {
      continue;
    }

    // 3. Đánh giá độ phù hợp theo chuyên môn
    const facultyMatch =
      activity.facultyTarget === 'Tất cả' ||
      activity.facultyTarget.toLowerCase().includes(profile.faculty.toLowerCase()) ||
      profile.faculty.toLowerCase().includes(activity.facultyTarget.toLowerCase());

    // 4. Đánh giá độ phù hợp theo ĐRL thiếu hụt
    let pointsForDeficit = 0;
    const reasons: string[] = [];

    if (facultyMatch) {
      if (activity.facultyTarget !== 'Tất cả') {
        reasons.push(`Đúng chuyên môn Khoa/Viện: ${activity.facultyTarget}`);
      } else {
        reasons.push('Hoạt động phong trào mở rộng toàn UEH');
      }
    }

    // Tính điểm mang lại cho các tiêu chí còn thiếu
    activity.allocations.forEach((alloc) => {
      const mainCatId = alloc.criterionCode.split('.')[0];
      const deficit = criteriaDeficitMap[mainCatId] ?? 0;
      if (deficit > 0) {
        pointsForDeficit += Math.min(alloc.points, deficit);
        reasons.push(`Bổ sung +${alloc.points}đ cho Mục ${mainCatId} (đang thiếu ${deficit}đ)`);
      }
    });

    // 5. Tính Score theo chiến lược đã chọn
    let matchScore = 0;

    const facultyWeightScore = facultyMatch ? (activity.facultyTarget === 'Tất cả' ? 25 : 50) : 5;
    const drlDeficitScore = pointsForDeficit * 15; // Mỗi điểm lấp vào tiêu chí thiếu tương đương 15 điểm ưu tiên

    if (strategy === 'faculty') {
      matchScore = facultyWeightScore * 1.5 + drlDeficitScore * 0.4;
    } else if (strategy === 'drl_deficit') {
      matchScore = drlDeficitScore * 1.5 + facultyWeightScore * 0.3;
    } else {
      // balanced
      matchScore = facultyWeightScore * 0.9 + drlDeficitScore * 1.1;
    }

    matchedList.push({
      activity,
      gapSlot: matchingGap,
      matchScore: Math.round(matchScore * 10) / 10,
      reasons,
      facultyMatch,
      pointsForDeficit: Math.round(pointsForDeficit * 10) / 10
    });
  }

  // Sắp xếp theo thứ tự ưu tiên điểm matchScore giảm dần
  return matchedList.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Tên hiển thị các thứ trong tuần
 */
export const DAY_NAMES: Record<number, string> = {
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
  7: 'Chủ Nhật'
};
