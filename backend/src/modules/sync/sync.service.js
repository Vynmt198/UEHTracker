import prisma from '../../database/prisma.js';
import {
  calculateCourseFinalScore,
  convertScore10ToUEH,
} from '../../utils/gpaCalculator.js';

function normalizeCourseStatus(status) {
  if (!status) return 'DANG_HOC';
  const s = String(status).trim().toUpperCase();
  if (s === 'DA_HOAN_THANH' || s.includes('HOÀN THÀNH') || s.includes('HOAN THANH')) {
    return 'DA_HOAN_THANH';
  }
  if (s === 'CHUA_HOC' || s.includes('CHƯA HỌC') || s.includes('CHUA HOC')) {
    return 'CHUA_HOC';
  }
  return 'DANG_HOC';
}

export class SyncService {
  async pushLocal(userId, { profile, semesters = [], courses = [], drlRecords = [] }) {
    return prisma.$transaction(async (tx) => {
      // 1. Profile
      if (profile) {
        await tx.studentProfile.upsert({
          where: { userId },
          update: { ...profile },
          create: {
            userId,
            fullName: profile.fullName || 'Sinh viên UEH',
            ...profile,
          },
        });
      }

      // 2. Semesters mapping
      const semesterIdMap = new Map();

      if (semesters && semesters.length > 0) {
        for (const sem of semesters) {
          let existingSem = await tx.semester.findFirst({
            where: { userId, name: sem.name },
          });

          if (!existingSem) {
            existingSem = await tx.semester.create({
              data: {
                userId,
                name: sem.name,
                academicYear: sem.academicYear || '2024-2025',
                order: sem.order || 1,
                isCurrent: Boolean(sem.isCurrent),
              },
            });
          }

          semesterIdMap.set(sem.name, existingSem.id);
        }
      }

      // 3. Courses
      if (courses && courses.length > 0) {
        for (const c of courses) {
          const targetSemId = semesterIdMap.get(c.semesterId) || c.semesterId;

          const validSem = await tx.semester.findFirst({
            where: { id: targetSemId, userId },
          });
          if (!validSem) continue;

          const comps = c.components || [];
          const calc = calculateCourseFinalScore(comps);
          let letterGrade = null;
          let gpa4 = null;

          if (calc.score10 !== null) {
            const ueh = convertScore10ToUEH(calc.score10, calc.isFailedDueToRegulation);
            letterGrade = ueh.letter;
            gpa4 = ueh.gpa4;
          }

          const existingCourse = await tx.course.findFirst({
            where: { semesterId: validSem.id, name: c.name, userId },
          });

          const normalizedStatus = normalizeCourseStatus(c.status);

          if (existingCourse) {
            await tx.scoreComponent.deleteMany({
              where: { courseId: existingCourse.id },
            });
            await tx.course.update({
              where: { id: existingCourse.id },
              data: {
                credits: Number(c.credits) || 3,
                aimScore10: Number(c.aimScore10) || existingCourse.aimScore10,
                finalScore10: calc.score10,
                letterGrade,
                gpa4,
                status: normalizedStatus,
                components: {
                  create: comps.map((comp) => ({
                    name: comp.name,
                    weight: Number(comp.weight) || 0,
                    score: comp.score !== null && comp.score !== undefined ? Number(comp.score) : null,
                    isAbsent: Boolean(comp.isAbsent),
                    isExempt: Boolean(comp.isExempt),
                  })),
                },
              },
            });
          } else {
            await tx.course.create({
              data: {
                userId,
                semesterId: validSem.id,
                code: c.code,
                name: c.name,
                credits: Number(c.credits) || 3,
                status: normalizedStatus,
                aimScore10: Number(c.aimScore10) || 8.0,
                finalScore10: calc.score10,
                letterGrade,
                gpa4,
                components: {
                  create: comps.map((comp) => ({
                    name: comp.name,
                    weight: Number(comp.weight) || 0,
                    score: comp.score !== null && comp.score !== undefined ? Number(comp.score) : null,
                    isAbsent: Boolean(comp.isAbsent),
                    isExempt: Boolean(comp.isExempt),
                  })),
                },
              },
            });
          }
        }
      }

      // 4. DRL Records
      if (drlRecords && drlRecords.length > 0) {
        for (const drl of drlRecords) {
          await tx.drlRecord.create({
            data: {
              userId,
              criterionId: String(drl.criterionId),
              activityTitle: drl.activityTitle,
              pointsEarned: Number(drl.pointsEarned) || 0,
              proofUrl: drl.proofUrl,
              isManual: drl.isManual !== undefined ? Boolean(drl.isManual) : true,
            },
          });
        }
      }

      return {
        success: true,
        message: 'Đồng bộ toàn bộ dữ liệu từ LocalStorage lên Cloud thành công!',
      };
    });
  }

  async pullCloud(userId) {
    const [profile, semesters, courses, drlRecords] = await Promise.all([
      prisma.studentProfile.findUnique({
        where: { userId },
        include: { faculty: true },
      }),
      prisma.semester.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      }),
      prisma.course.findMany({
        where: { userId },
        include: { components: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.drlRecord.findMany({
        where: { userId },
        orderBy: { dateRecorded: 'desc' },
      }),
    ]);

    return {
      profile,
      semesters,
      courses,
      drlRecords,
      pulledAt: new Date().toISOString(),
    };
  }
}

export default new SyncService();
