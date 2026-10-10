import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 UEH Tracker Backend (JavaScript ES Modules)`);
  console.log(`📡 Server đang chạy tại: http://localhost:${PORT}/api/v1`);
  console.log(`📚 Tài liệu Swagger UI: http://localhost:${PORT}/api/docs`);
  console.log(`====================================================`);
});
