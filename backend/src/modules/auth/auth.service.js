import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../database/prisma.js';

export class AuthService {
  async register({ email, password, fullName, studentId, cohort }) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      const error = new Error('Email này đã được đăng ký tài khoản');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        profile: {
          create: {
            fullName: fullName.trim(),
            studentId: studentId?.trim(),
            cohort: cohort?.trim(),
          },
        },
      },
      include: { profile: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async login({ email, password }) {
    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profile: true },
    });

    if (!user) {
      const error = new Error('Email hoặc mật khẩu không chính xác');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Email hoặc mật khẩu không chính xác');
      error.statusCode = 401;
      throw error;
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken) {
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET || 'ueh_tracker_super_secure_refresh_secret_key_2026';
      const decoded = jwt.verify(refreshToken, refreshSecret);

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.refreshTokenHash) {
        const error = new Error('Refresh token không hợp lệ hoặc đã bị hủy');
        error.statusCode = 401;
        throw error;
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        const error = new Error('Refresh token không hợp lệ');
        error.statusCode = 401;
        throw error;
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      const error = new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      error.statusCode = 401;
      throw error;
    }
  }

  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { success: true, message: 'Đăng xuất thành công' };
  }

  async generateTokens(userId, email, role) {
    const accessSecret = process.env.JWT_ACCESS_SECRET || 'ueh_tracker_super_secure_access_secret_key_2026';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'ueh_tracker_super_secure_refresh_secret_key_2026';
    const accessExp = process.env.JWT_ACCESS_EXPIRATION || '15m';
    const refreshExp = process.env.JWT_REFRESH_EXPIRATION || '7d';

    const payload = { sub: userId, email, role };

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessExp });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExp });

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId, refreshToken) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}

export default new AuthService();
