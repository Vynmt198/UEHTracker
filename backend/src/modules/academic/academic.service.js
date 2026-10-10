import prisma from '../../database/prisma.js';
import {
  calculateCourseFinalScore,
  calculateNextSemesterRequiredGPA,
  convertScore10ToUEH,
  evaluateScholarship,
  validateProcessWeight,
  validateWeights,
} from '../../utils/gpaCalculator.js';

export class AcademicService {
  // --- SEMESTERS ---
  async getSemesters(userId) {
    return prisma.semester.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: {
        courses: {
          include: {
            components: true,
          },
        },
      },
    });
  }

  async createSemester(userId, { name, academicYear, order, isCurrent }) {
    return prisma.semester.create({
      data: {
        userId,
        name,
        academicYear,
        order: order || 1,
        isCurrent: isCurrent || false,
      },
    });
  }

  async deleteSemester(userId, semesterId) {
    const semester = await prisma.semester.findFirst({
      where: { id: semesterId, userId },
    });
    if (!semester) {
      const error = new Error('Không tìm thấy học kỳ tương ứng');
      error.statusCode = 404;
      throw error;
    }
    await prisma.semester.delete({ where: { id: semesterId } });
    return { success: true, message: 'Đã xóa học kỳ thành công' };
  }

  // --- COURSES ---
  async getCourses(userId, semesterId) {
    return prisma.course.findMany({
      where: {
        userId,
        ...(semesterId ? { semesterId } : {}),
      },
      include: {
        components: true,
        semester: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCourse(userId, { semesterId, code, name, credits, status, aimScore10, components }) {
    const semester = await prisma.semester.findFirst({
      where: { id: semesterId, userId },
    });
    if (!semester) {
      const error = new Error('Học kỳ không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    const defaultComponents = components || [
      { name: 'Điểm quá trình', weight: 50, score: null },
      { name: 'Điểm kết thúc học phần', weight: 50, score: null },
    ];

    const weightVal = validateWeights(defaultComponents);
    if (!weightVal.isValid) {
      const error = new Error(weightVal.message);
      error.statusCode = 400;
      throw error;
    }

    const processVal = validateProcessWeight(defaultComponents);
    if (!processVal.isValid) {
      const error = new Error(processVal.message);
      error.statusCode = 400;
      throw error;
    }

    const calcResult = calculateCourseFinalScore(defaultComponents);
    let letterGrade = null;
    let gpa4 = null;

    if (calcResult.score10 !== null) {
      const uehGrade = convertScore10ToUEH(calcResult.score10, calcResult.isFailedDueToRegulation);
      letterGrade = uehGrade.letter;
      gpa4 = uehGrade.gpa4;
    }

    return prisma.course.create({
      data: {
        userId,
        semesterId,
        code,
        name,
        credits: Number(credits) || 3,
        status: status || 'DANG_HOC',
        aimScore10: Number(aimScore10) || 8.0,
        finalScore10: calcResult.score10,
        letterGrade,
        gpa4,
        components: {
          create: defaultComponents.map((c) => ({
            name: c.name,
            weight: Number(c.weight) || 0,
            score: c.score !== null && c.score !== undefined ? Number(c.score) : null,
            isAbsent: Boolean(c.isAbsent),
            isExempt: Boolean(c.isExempt),
          })),
        },
      },
      include: { components: true },
    });
  }

  async updateCourseGrades(userId, courseId, { components = [], status, aimScore10 }) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!course) {
      const error = new Error('Không tìm thấy môn học');
      error.statusCode = 404;
      throw error;
    }

    // 1. Kiểm tra tổng trọng số 100%
    const weightVal = validateWeights(components);
    if (!weightVal.isValid) {
      const error = new Error(weightVal.message);
      error.statusCode = 400;
      throw error;
    }

    // 2. Kiểm tra trần điểm quá trình <= 70%
    const processVal = validateProcessWeight(components);
    if (!processVal.isValid) {
      const error = new Error(processVal.message);
      error.statusCode = 400;
      throw error;
    }

    // 3. Tính điểm tổng kết học phần theo quy chế UEH (điểm liệt < 1.0 tối đa 4.9 F)
    const calcResult = calculateCourseFinalScore(components);
    let letterGrade = null;
    let gpa4 = null;

    if (calcResult.score10 !== null) {
      const uehGrade = convertScore10ToUEH(calcResult.score10, calcResult.isFailedDueToRegulation);
      letterGrade = uehGrade.letter;
      gpa4 = uehGrade.gpa4;
    }

    const newStatus =
      status ||
      (calcResult.isComplete && calcResult.score10 !== null
        ? 'DA_HOAN_THANH'
        : course.status);

    await prisma.$transaction([
      prisma.scoreComponent.deleteMany({
        where: { courseId },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: {
          status: newStatus,
          aimScore10: aimScore10 !== undefined ? Number(aimScore10) : course.aimScore10,
          finalScore10: calcResult.score10,
          letterGrade,
          gpa4,
          components: {
            create: components.map((c) => ({
              name: c.name,
              weight: Number(c.weight) || 0,
              score: c.score !== null && c.score !== undefined ? Number(c.score) : null,
              isAbsent: Boolean(c.isAbsent),
              isExempt: Boolean(c.isExempt),
            })),
          },
        },
      }),
    ]);

    return prisma.course.findUnique({
      where: { id: courseId },
      include: { components: true },
    });
  }

  async deleteCourse(userId, courseId) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!course) {
      const error = new Error('Không tìm thấy môn học');
      error.statusCode = 404;
      throw error;
    }
    await prisma.course.delete({ where: { id: courseId } });
    return { success: true, message: 'Đã xóa môn học thành công' };
  }

  // --- SUMMARY ---
  async getAcademicSummary(userId) {
    const courses = await prisma.course.findMany({
      where: { userId },
      include: { components: true },
    });

    const userProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    const completed = courses.filter((c) => c.status === 'DA_HOAN_THANH');
    let totalCompletedCredits = 0;
    let totalPoints4 = 0;
    let totalPoints10 = 0;
    let hasFailedCourse = false;

    completed.forEach((c) => {
      if (c.gpa4 !== null && c.finalScore10 !== null) {
        totalCompletedCredits += c.credits;
        totalPoints4 += c.gpa4 * c.credits;
        totalPoints10 += c.finalScore10 * c.credits;

        if (c.letterGrade === 'F' || c.gpa4 === 0.0) {
          hasFailedCourse = true;
        }
      }
    });

    const cumulativeGPA4 =
      totalCompletedCredits > 0
        ? Math.round((totalPoints4 / totalCompletedCredits) * 100) / 100
        : 0;

    const cumulativeScore10 =
      totalCompletedCredits > 0
        ? Math.round((totalPoints10 / totalCompletedCredits) * 10) / 10
        : 0;

    const targetGPA = userProfile?.targetGPA ?? 3.60;
    const targetDRL = userProfile?.targetDRL ?? 85;

    const nextSemesterNeeded = calculateNextSemesterRequiredGPA(
      totalCompletedCredits,
      cumulativeGPA4,
      15,
      targetGPA
    );

    const scholarship = evaluateScholarship(cumulativeGPA4, targetDRL, {
      hasFailedCourse,
    });

    return {
      totalCompletedCredits,
      cumulativeGPA4,
      cumulativeScore10,
      totalCourses: courses.length,
      completedCoursesCount: completed.length,
      targetGPA,
      nextSemesterNeeded,
      scholarship,
    };
  }
}

export default new AcademicService();
