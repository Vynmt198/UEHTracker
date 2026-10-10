import prisma from '../../database/prisma.js';

export class DrlService {
  async getRecords(userId, semesterId) {
    return prisma.drlRecord.findMany({
      where: {
        userId,
        ...(semesterId ? { semesterId } : {}),
      },
      orderBy: { dateRecorded: 'desc' },
      include: { semester: true },
    });
  }

  async createRecord(userId, { semesterId, criterionId, activityTitle, pointsEarned, proofUrl, isManual }) {
    return prisma.drlRecord.create({
      data: {
        userId,
        semesterId,
        criterionId: String(criterionId),
        activityTitle,
        pointsEarned: Number(pointsEarned) || 0,
        proofUrl,
        isManual: isManual !== undefined ? Boolean(isManual) : true,
      },
    });
  }

  async deleteRecord(userId, recordId) {
    const record = await prisma.drlRecord.findFirst({
      where: { id: recordId, userId },
    });
    if (!record) {
      const error = new Error('Không tìm thấy bản ghi rèn luyện');
      error.statusCode = 404;
      throw error;
    }

    await prisma.drlRecord.delete({ where: { id: recordId } });
    return { success: true, message: 'Đã xóa bản ghi rèn luyện thành công' };
  }

  async getDrlSummary(userId, semesterId) {
    const records = await this.getRecords(userId, semesterId);

    // Điểm sàn đầu kỳ chuẩn UEH: 50 điểm
    const BASE_POINTS = 50;
    const additionalPoints = records.reduce((sum, r) => sum + r.pointsEarned, 0);
    const totalDrl = Math.min(100, Math.max(0, BASE_POINTS + additionalPoints));

    let classification = 'Trung bình';
    if (totalDrl >= 90) classification = 'Xuất sắc';
    else if (totalDrl >= 80) classification = 'Tốt';
    else if (totalDrl >= 65) classification = 'Khá';
    else if (totalDrl >= 50) classification = 'Trung bình';
    else if (totalDrl >= 35) classification = 'Yếu';
    else classification = 'Kém';

    return {
      basePoints: BASE_POINTS,
      additionalPoints,
      totalDrl,
      classification,
      totalActivities: records.length,
    };
  }
}

export default new DrlService();
