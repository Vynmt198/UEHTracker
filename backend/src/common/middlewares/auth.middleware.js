import jwt from 'jsonwebtoken';
import prisma from '../../database/prisma.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: 'Yêu cầu đăng nhập để truy cập tài nguyên này',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_ACCESS_SECRET || 'ueh_tracker_super_secure_access_secret_key_2026';

    const decoded = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị khóa',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc token không hợp lệ',
    });
  }
};
