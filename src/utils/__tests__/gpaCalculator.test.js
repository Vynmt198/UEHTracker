import { describe, it, expect } from 'vitest';
import {
  convertScore10ToUEH,
  validateWeights,
  validateProcessWeight,
  calculateCourseFinalScore,
  calculateGPAStats,
  evaluateAdaptiveAim,
  calculateRequiredGPA,
  calculateNextSemesterRequiredGPA,
  evaluateScholarship
} from '../gpaCalculator.js';

describe('UEH GPA Calculator Unit Tests (JavaScript)', () => {
  // =========================================================================
  // 1. QUY ĐỔI THANG ĐIỂM CHUẨN UEH (Hệ 10 -> Chữ -> Hệ 4)
  // =========================================================================
  describe('1. Quy đổi thang điểm chuẩn UEH (convertScore10ToUEH)', () => {
    it('Quy đổi điểm hạng A+ và A (8.5 - 10.0 -> Hệ 4: 4.0)', () => {
      const res10 = convertScore10ToUEH(10);
      expect(res10.letter).toBe('A+');
      expect(res10.gpa4).toBe(4.0);

      const res92 = convertScore10ToUEH(9.2);
      expect(res92.letter).toBe('A+');
      expect(res92.gpa4).toBe(4.0);

      const res85 = convertScore10ToUEH(8.5);
      expect(res85.letter).toBe('A');
      expect(res85.gpa4).toBe(4.0);

      const resRound = convertScore10ToUEH(8.46);
      expect(resRound.letter).toBe('A');
      expect(resRound.gpa4).toBe(4.0);
    });

    it('Quy đổi điểm hạng B+ (8.0 - 8.4 -> Hệ 4: 3.5) và B (7.0 - 7.9 -> Hệ 4: 3.0)', () => {
      const resBPlus = convertScore10ToUEH(8.2);
      expect(resBPlus.letter).toBe('B+');
      expect(resBPlus.gpa4).toBe(3.5);

      const resBPlusEdge = convertScore10ToUEH(8.0);
      expect(resBPlusEdge.letter).toBe('B+');
      expect(resBPlusEdge.gpa4).toBe(3.5);

      const resB = convertScore10ToUEH(7.5);
      expect(resB.letter).toBe('B');
      expect(resB.gpa4).toBe(3.0);

      const resBEdge = convertScore10ToUEH(7.0);
      expect(resBEdge.letter).toBe('B');
      expect(resBEdge.gpa4).toBe(3.0);
    });

    it('Quy đổi điểm hạng C+ (6.5 - 6.9 -> Hệ 4: 2.5) và C (5.5 - 6.4 -> Hệ 4: 2.0)', () => {
      const resCPlus = convertScore10ToUEH(6.8);
      expect(resCPlus.letter).toBe('C+');
      expect(resCPlus.gpa4).toBe(2.5);

      const resC = convertScore10ToUEH(5.8);
      expect(resC.letter).toBe('C');
      expect(resC.gpa4).toBe(2.0);

      const resCEdge = convertScore10ToUEH(5.5);
      expect(resCEdge.letter).toBe('C');
      expect(resCEdge.gpa4).toBe(2.0);
    });

    it('Quy đổi điểm hạng D+ (5.0 - 5.4 -> Hệ 4: 1.5) và D (4.0 - 4.9 -> Hệ 4: 1.0)', () => {
      const resDPlus = convertScore10ToUEH(5.2);
      expect(resDPlus.letter).toBe('D+');
      expect(resDPlus.gpa4).toBe(1.5);

      const resD = convertScore10ToUEH(4.5);
      expect(resD.letter).toBe('D');
      expect(resD.gpa4).toBe(1.0);

      const resDEdge = convertScore10ToUEH(4.0);
      expect(resDEdge.letter).toBe('D');
      expect(resDEdge.gpa4).toBe(1.0);
    });

    it('Quy đổi điểm không đạt (< 4.0 hoặc dính quy chế điểm liệt)', () => {
      const resFPlus = convertScore10ToUEH(3.5);
      expect(resFPlus.letter).toBe('F+');
      expect(resFPlus.gpa4).toBe(0.5);

      const resF = convertScore10ToUEH(2.0);
      expect(resF.letter).toBe('F');
      expect(resF.gpa4).toBe(0.0);

      const resZero = convertScore10ToUEH(0);
      expect(resZero.letter).toBe('F');
      expect(resZero.gpa4).toBe(0.0);

      const resRegFail = convertScore10ToUEH(4.9, true);
      expect(resRegFail.letter).toBe('F');
      expect(resRegFail.gpa4).toBe(0.0);
    });

    it('Xử lý các giá trị không hợp lệ (null, undefined, NaN)', () => {
      expect(convertScore10ToUEH(null).letter).toBe('--');
      expect(convertScore10ToUEH(null).gpa4).toBe(0);
      expect(convertScore10ToUEH(undefined).letter).toBe('--');
      expect(convertScore10ToUEH(NaN).letter).toBe('--');
    });
  });

  // =========================================================================
  // 2. RÀNG BUỘC TRỌNG SỐ & QUY CHẾ ĐIỂM
  // =========================================================================
  describe('2. Ràng buộc trọng số & Quy chế điểm môn học', () => {
    it('Kiểm tra tổng trọng số các cột thành phần đúng 100%', () => {
      const validComponents = [
        { id: '1', name: 'Chuyên cần', weight: 10, score: 9 },
        { id: '2', name: 'Giữa kỳ', weight: 40, score: 8 },
        { id: '3', name: 'Thi cuối kỳ', weight: 50, score: 8.5 }
      ];
      const valSuccess = validateWeights(validComponents);
      expect(valSuccess.isValid).toBe(true);
      expect(valSuccess.totalWeight).toBe(100);
      expect(valSuccess.diff).toBe(0);

      const deficientComponents = [
        { id: '1', name: 'Quá trình', weight: 30, score: 8 },
        { id: '2', name: 'Cuối kỳ', weight: 50, score: 7 }
      ];
      const valDeficient = validateWeights(deficientComponents);
      expect(valDeficient.isValid).toBe(false);
      expect(valDeficient.totalWeight).toBe(80);
      expect(valDeficient.diff).toBe(20);

      const excessComponents = [
        { id: '1', name: 'Quá trình', weight: 60, score: 8 },
        { id: '2', name: 'Cuối kỳ', weight: 50, score: 7 }
      ];
      const valExcess = validateWeights(excessComponents);
      expect(valExcess.isValid).toBe(false);
      expect(valExcess.totalWeight).toBe(110);
      expect(valExcess.diff).toBe(10);
    });

    it('Kiểm tra trần điểm quá trình không vượt quá 70% tổng điểm môn học', () => {
      const normalComponents = [
        { id: '1', name: 'Điểm quá trình', weight: 50, score: 8 },
        { id: '2', name: 'Điểm thi kết thúc học phần', weight: 50, score: 8 }
      ];
      expect(validateProcessWeight(normalComponents).isValid).toBe(true);
      expect(validateProcessWeight(normalComponents).processWeight).toBe(50);

      const maxProcessComponents = [
        { id: '1', name: 'Chuyên cần', weight: 20, score: 9 },
        { id: '2', name: 'Giữa kỳ', weight: 50, score: 8 },
        { id: '3', name: 'Thi cuối kỳ', weight: 30, score: 8 }
      ];
      expect(validateProcessWeight(maxProcessComponents).isValid).toBe(true);
      expect(validateProcessWeight(maxProcessComponents).processWeight).toBe(70);

      const invalidProcessComponents = [
        { id: '1', name: 'Quá trình', weight: 75, score: 8 },
        { id: '2', name: 'Thi kết thúc học phần', weight: 25, score: 8 }
      ];
      const resInvalid = validateProcessWeight(invalidProcessComponents);
      expect(resInvalid.isValid).toBe(false);
      expect(resInvalid.processWeight).toBe(75);
      expect(resInvalid.message).toContain('không được vượt quá 70%');
    });

    it('Quy tắc điểm liệt / vắng thi: Điểm thi cuối kỳ < 1.0 hoặc vắng thi nhận tối đa 4.9', () => {
      const failedByExamComponents = [
        { id: '1', name: 'Điểm quá trình', weight: 50, score: 10.0 },
        { id: '2', name: 'Điểm thi kết thúc học phần', weight: 50, score: 0.5 }
      ];
      const resCalc1 = calculateCourseFinalScore(failedByExamComponents);
      expect(resCalc1.hasZeroOrAbsent).toBe(true);
      expect(resCalc1.isFailedDueToRegulation).toBe(true);
      expect(resCalc1.score10).toBe(4.9);

      const absentComponents = [
        { id: '1', name: 'Điểm quá trình', weight: 50, score: 10.0 },
        { id: '2', name: 'Điểm thi kết thúc học phần', weight: 50, score: null, isAbsent: true }
      ];
      const resCalc2 = calculateCourseFinalScore(absentComponents);
      expect(resCalc2.hasZeroOrAbsent).toBe(true);
      expect(resCalc2.isFailedDueToRegulation).toBe(true);
      expect(resCalc2.score10).toBeLessThanOrEqual(4.9);

      const zeroScoreComponents = [
        { id: '1', name: 'Điểm quá trình', weight: 50, score: 0 },
        { id: '2', name: 'Điểm thi cuối kỳ', weight: 50, score: 10.0 }
      ];
      const resCalc3 = calculateCourseFinalScore(zeroScoreComponents);
      expect(resCalc3.hasZeroOrAbsent).toBe(true);
      expect(resCalc3.score10).toBe(4.9);
    });
  });

  // =========================================================================
  // 3. LÀM TRÒN ĐIỂM CHUẨN UEH
  // =========================================================================
  describe('3. Làm tròn điểm chuẩn UEH (Hệ 10: 1 chữ số thập phân, Hệ 4: 2 chữ số thập phân)', () => {
    it('Làm tròn điểm học phần hệ 10 đến 1 chữ số thập phân', () => {
      const comps = [
        { id: '1', name: 'Điểm quá trình', weight: 30, score: 8.0 },
        { id: '2', name: 'Điểm cuối kỳ', weight: 70, score: 8.5 }
      ];
      const res = calculateCourseFinalScore(comps);
      expect(res.score10).toBe(8.4);
    });

    it('GPA tích lũy hệ 4 làm tròn đến đúng 2 chữ số thập phân', () => {
      const mockCourses = [
        {
          id: 'c1',
          name: 'Kinh tế vi mô',
          credits: 3,
          status: 'Đã hoàn thành',
          aimScore10: 8.5,
          semesterId: 'hk1',
          components: [
            { id: '1', name: 'Quá trình', weight: 50, score: 8.0 },
            { id: '2', name: 'Thi cuối kỳ', weight: 50, score: 8.0 }
          ]
        },
        {
          id: 'c2',
          name: 'Toán cao cấp',
          credits: 4,
          status: 'Đã hoàn thành',
          aimScore10: 9.0,
          semesterId: 'hk1',
          components: [
            { id: '1', name: 'Quá trình', weight: 50, score: 9.0 },
            { id: '2', name: 'Thi cuối kỳ', weight: 50, score: 9.0 }
          ]
        }
      ];

      const stats = calculateGPAStats(mockCourses);
      expect(stats.completedCredits).toBe(7);
      expect(stats.actualGPA4).toBe(3.79);
    });
  });

  // =========================================================================
  // 4. LOGIC ADAPTIVE AIM (Mục tiêu thích ứng ±0.3)
  // =========================================================================
  describe('4. Logic Adaptive Aim (evaluateAdaptiveAim)', () => {
    it('Gợi ý nâng Aim khi điểm thực tế vượt mục tiêu >= +0.3 (status: upgrade)', () => {
      const course = {
        id: 'c1',
        name: 'Nguyên lý kế toán',
        credits: 3,
        status: 'Đã hoàn thành',
        aimScore10: 8.0,
        finalScore10: 8.5,
        semesterId: 'hk1',
        components: []
      };

      const fb = evaluateAdaptiveAim(course);
      expect(fb).not.toBeNull();
      expect(fb?.status).toBe('upgrade');
      expect(fb?.diff).toBe(0.5);
      expect(fb?.suggestedAim).toBe(8.3);
    });

    it('Gợi ý hạ Aim an toàn khi điểm thực tế kém mục tiêu <= -0.3 (status: downgrade)', () => {
      const course = {
        id: 'c2',
        name: 'Xác suất thống kê',
        credits: 3,
        status: 'Đã hoàn thành',
        aimScore10: 8.5,
        finalScore10: 7.5,
        semesterId: 'hk1',
        components: []
      };

      const fb = evaluateAdaptiveAim(course);
      expect(fb).not.toBeNull();
      expect(fb?.status).toBe('downgrade');
      expect(fb?.diff).toBe(-1.0);
      expect(fb?.suggestedAim).toBe(8.2);
    });

    it('Điểm nằm trong khoảng dung sai ±0.3 (on_track)', () => {
      const course = {
        id: 'c3',
        name: 'Kinh tế lượng',
        credits: 3,
        status: 'Đã hoàn thành',
        aimScore10: 8.0,
        finalScore10: 8.2,
        semesterId: 'hk1',
        components: []
      };

      expect(evaluateAdaptiveAim(course)).toBeNull();

      const fbTrack = evaluateAdaptiveAim(course, { returnOnTrack: true });
      expect(fbTrack).not.toBeNull();
      expect(fbTrack?.status).toBe('on_track');
      expect(fbTrack?.diff).toBe(0.2);
    });

    it('Cảnh báo khi mục tiêu bất khả thi (Aim > 10 hoặc Aim < 0)', () => {
      const courseImpossible = {
        id: 'c4',
        name: 'Luật kinh tế',
        credits: 3,
        status: 'Đã hoàn thành',
        aimScore10: 10.5,
        finalScore10: 9.0,
        semesterId: 'hk1',
        components: []
      };

      const fb = evaluateAdaptiveAim(courseImpossible);
      expect(fb).not.toBeNull();
      expect(fb?.status).toBe('impossible');
    });
  });

  // =========================================================================
  // 5. CÔNG THỨC TÍNH ĐIỂM CẦN GÁNH (Required GPA)
  // =========================================================================
  describe('5. Công thức tính điểm cần gánh (Required GPA)', () => {
    it('Tính điểm GPA kỳ tới cần gánh (calculateNextSemesterRequiredGPA) - Trường hợp khả thi', () => {
      const res = calculateNextSemesterRequiredGPA(60, 3.30, 20, 3.40);
      expect(res.status).toBe('achievable');
      expect(res.requiredGPA).toBe(3.70);
    });

    it('Tính điểm GPA kỳ tới cần gánh - Trường hợp bất khả thi (yêu cầu kỳ tới > 4.0)', () => {
      const res = calculateNextSemesterRequiredGPA(60, 3.00, 15, 3.50);
      expect(res.status).toBe('impossible');
      expect(res.requiredGPA).toBe(5.50);
      expect(res.message).toContain('> 4.00');
    });

    it('Tính điểm GPA kỳ tới cần gánh - Trường hợp đã đạt hoặc vượt mục tiêu', () => {
      const res = calculateNextSemesterRequiredGPA(100, 3.80, 5, 3.20);
      expect(res.status).toBe('already_achieved');
      expect(res.requiredGPA).toBe(0);
    });

    it('Tính GPA cần gánh toàn khóa (calculateRequiredGPA)', () => {
      const res = calculateRequiredGPA(60, 3.20, 3.60, 125);
      expect(res.status).toBe('achievable');
      expect(res.requiredGPA).toBe(3.97);

      const impossibleRes = calculateRequiredGPA(100, 2.50, 3.80, 125);
      expect(impossibleRes.status).toBe('impossible');
    });
  });

  // =========================================================================
  // 6. ĐIỀU KIỆN XÉT HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP UEH
  // =========================================================================
  describe('6. Điều kiện xét học bổng khuyến khích học tập UEH (evaluateScholarship)', () => {
    it('Đạt học bổng Xuất sắc (GPA >= 3.60 và ĐRL >= 90)', () => {
      const res = evaluateScholarship(3.75, 92);
      expect(res.tier).toBe('Xuất sắc');
    });

    it('Đạt học bổng Giỏi (GPA >= 3.20 và ĐRL >= 80)', () => {
      const res = evaluateScholarship(3.40, 85);
      expect(res.tier).toBe('Giỏi');

      const resGpaHigh = evaluateScholarship(3.80, 82);
      expect(resGpaHigh.tier).toBe('Giỏi');
    });

    it('Đạt học bổng Khá (GPA >= 2.50 và ĐRL >= 70)', () => {
      const res = evaluateScholarship(2.90, 75);
      expect(res.tier).toBe('Khá');
    });

    it('Chưa đủ điều kiện xét học bổng khi GPA hoặc ĐRL dưới chuẩn', () => {
      const resLowDrl = evaluateScholarship(3.80, 65);
      expect(resLowDrl.tier).toBe('Chưa đạt');

      const resLowGpa = evaluateScholarship(2.30, 95);
      expect(resLowGpa.tier).toBe('Chưa đạt');
    });

    it('BỊ LOẠI khỏi xét học bổng nếu dính điểm F trong kỳ, bất kể GPA và ĐRL cao', () => {
      const resWithF = evaluateScholarship(3.90, 95, { hasFailedCourse: true });
      expect(resWithF.tier).toBe('Chưa đạt');
      expect(resWithF.description).toContain('điểm F');

      const resWithFDirect = evaluateScholarship(3.80, 90, true);
      expect(resWithFDirect.tier).toBe('Chưa đạt');
    });
  });
});
