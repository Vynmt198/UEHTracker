import prisma from '../../database/prisma.js';

export class UsersService {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          include: {
            faculty: true,
          },
        },
      },
    });

    if (!user) {
      const error = new Error('Không tìm thấy thông tin người dùng');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async updateProfile(userId, data) {
    return prisma.studentProfile.upsert({
      where: { userId },
      update: { ...data },
      create: {
        userId,
        fullName: data.fullName || 'Sinh viên UEH',
        ...data,
      },
      include: {
        faculty: true,
      },
    });
  }

  async listFaculties() {
    return prisma.faculty.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

export default new UsersService();
