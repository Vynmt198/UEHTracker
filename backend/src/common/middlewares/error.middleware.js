export const errorMiddleware = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Lỗi hệ thống máy chủ nội bộ';

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || null,
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};
