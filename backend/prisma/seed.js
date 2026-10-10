import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UEH_FACULTIES_SEED = [
  {
    name: 'Khoa Quản trị',
    code: 'F_MAN',
    majors: ['Quản trị kinh doanh', 'Quản trị nhân lực', 'Quản trị bệnh viện', 'Quản trị sự kiện và lễ hội', 'Khởi nghiệp và Đổi mới sáng tạo']
  },
  {
    name: 'Khoa Kinh doanh quốc tế - Marketing',
    code: 'F_IB_MKT',
    majors: ['Kinh doanh quốc tế', 'Marketing', 'Logistics và Quản lý Chuỗi cung ứng', 'Thương mại điện tử', 'Kinh doanh thương mại', 'Truyền thông Marketing tích hợp']
  },
  {
    name: 'Khoa Tài chính',
    code: 'F_FIN',
    majors: ['Tài chính doanh nghiệp', 'Định giá tài sản', 'Thị trường chứng khoán', 'Tài chính quốc tế', 'Công nghệ tài chính (Fintech)']
  },
  {
    name: 'Khoa Ngân hàng',
    code: 'F_BNK',
    majors: ['Ngân hàng thương mại', 'Thị trường tài chính', 'Ngân hàng số', 'Quản trị rủi ro tài chính', 'Thanh toán quốc tế']
  },
  {
    name: 'Khoa Kế toán',
    code: 'F_ACC',
    majors: ['Kế toán doanh nghiệp', 'Kiểm toán', 'Kế toán công', 'Kế toán quản trị quốc tế', 'Hệ thống thông tin kế toán']
  },
  {
    name: 'Khoa Du lịch',
    code: 'F_TOU',
    majors: ['Quản trị khách sạn', 'Quản trị dịch vụ du lịch và lữ hành', 'Quản trị nhà hàng và dịch vụ ăn uống', 'Quản trị du lịch thông minh']
  },
  {
    name: 'Khoa Kinh tế',
    code: 'F_ECO',
    majors: ['Kinh tế học', 'Kinh tế đầu tư', 'Kinh tế phát triển', 'Kinh tế nông nghiệp và nông thôn', 'Kinh tế chính trị']
  },
  {
    name: 'Khoa Tài chính công',
    code: 'F_PUB_FIN',
    majors: ['Thuế', 'Quản lý tài chính công', 'Hải quan - Ngoại thương', 'Chính sách thuế và hải quan']
  },
  {
    name: 'Khoa Luật',
    code: 'F_LAW',
    majors: ['Luật kinh tế', 'Luật kinh doanh quốc tế', 'Luật dân sự và tài sản', 'Pháp luật trong kỷ nguyên số']
  },
  {
    name: 'Khoa Quản lý nhà nước',
    code: 'F_PUB_MAN',
    majors: ['Quản lý công', 'Chính sách công', 'Quản trị địa phương', 'Quản trị nhân lực khu vực công']
  },
  {
    name: 'Khoa Ngoại ngữ',
    code: 'F_LAN',
    majors: ['Ngôn ngữ Anh thương mại', 'Tiếng Anh thương mại quốc tế', 'Tiếng Anh tài chính ngân hàng', 'Tiếng Pháp thương mại']
  },
  {
    name: 'Khoa Toán - Thống kê',
    code: 'F_MAT_STA',
    majors: ['Thống kê kinh doanh', 'Toán tài chính', 'Khoa học dữ liệu ứng dụng', 'Phân tích dữ liệu kinh doanh', 'Bảo hiểm và định phí']
  },
  {
    name: 'Khoa Công nghệ thông tin kinh doanh',
    code: 'F_BIT',
    majors: ['Hệ thống thông tin quản lý', 'Kỹ thuật phần mềm', 'Khoa học máy tính', 'An toàn thông tin kinh doanh', 'Trí tuệ nhân tạo (AI) ứng dụng']
  },
  {
    name: 'Khoa Thiết kế Truyền thông',
    code: 'F_DES_MED',
    majors: ['Thiết kế đồ họa', 'Truyền thông số và đa phương tiện', 'Thiết kế tương tác (UI/UX)', 'Hoạt hình và kỹ xảo số']
  },
  {
    name: 'Khoa Tài năng kinh doanh',
    code: 'F_TALENT',
    majors: ['Quản trị tài năng ISB', 'Tài chính tài năng ISB', 'Kinh doanh quốc tế tài năng', 'Marketing tài năng']
  },
  {
    name: 'Khoa Tài chính - Kế toán',
    code: 'F_FIN_ACC',
    majors: ['Tài chính kế toán tích hợp', 'Kiểm toán nâng cao', 'Quản lý tài chính chiến lược']
  },
  {
    name: 'Khoa Kinh doanh quản lý',
    code: 'F_BUS_MAN',
    majors: ['Quản trị chuỗi cung ứng toàn cầu', 'Kinh doanh dịch vụ', 'Quản trị bán lẻ']
  },
  {
    name: 'Khoa Công nghệ',
    code: 'F_TECH',
    majors: ['Công nghệ và đổi mới', 'Tự động hóa thông minh', 'Hệ thống nhúng và IoT']
  },
  {
    name: 'Khoa Cơ bản',
    code: 'F_BASIC',
    majors: ['Khoa học cơ bản', 'Triết học kinh tế', 'Phương pháp nghiên cứu khoa học']
  },
  {
    name: 'Viện Phát triển Nguồn nhân lực và Kinh doanh',
    code: 'I_HRD',
    majors: ['Phát triển nguồn nhân lực cao cấp', 'Tư vấn quản trị doanh nghiệp']
  },
  {
    name: 'Viện Kinh tế môi trường Đông Nam Á',
    code: 'I_EEPSEA',
    majors: ['Kinh tế môi trường', 'Kinh tế tuần hoàn', 'Phát triển bền vững (ESG)']
  },
  {
    name: 'Viện Nghiên cứu Chính sách nông nghiệp và sức khỏe',
    code: 'I_HAPRI',
    majors: ['Chính sách kinh tế nông nghiệp', 'Kinh tế y tế và sức khỏe']
  },
  {
    name: 'Viện Tài chính bền vững',
    code: 'I_SUST_FIN',
    majors: ['Tài chính xanh (Green Finance)', 'Đầu tư bền vững', 'Báo cáo ESG doanh nghiệp']
  },
  {
    name: 'Viện Toán ứng dụng',
    code: 'I_APP_MATH',
    majors: ['Toán ứng dụng trong kinh tế', 'Mô hình hóa dữ liệu', 'Tính toán lượng giác và lượng tử']
  },
  {
    name: 'Viện Công nghệ thông minh và tương tác',
    code: 'I_SMART_TECH',
    majors: ['Công nghệ tương tác thông minh', 'Thực tế ảo và thực tế tăng cường (VR/AR)', 'Giao tiếp người máy (HCI)']
  },
  {
    name: 'Viện Đổi mới sáng tạo',
    code: 'I_INNOVATION',
    majors: ['Khởi nghiệp đổi mới sáng tạo (UII)', 'Vườn ươm doanh nghiệp trẻ', 'Chuyển giao công nghệ']
  },
  {
    name: 'Viện Đô thị thông minh và quản lý',
    code: 'I_SMART_CITY',
    majors: ['Quy hoạch đô thị thông minh', 'Quản lý dự án đô thị', 'Kiến trúc và thiết kế bền vững']
  },
  {
    name: 'Viện Đào tạo quốc tế',
    code: 'I_ISB',
    majors: ['Cử nhân ISB BBus', 'Kinh doanh quốc tế Western Sydney', 'Tài chính - Ứng dụng quốc tế']
  },
  {
    name: 'Viện Khoa học quốc tế',
    code: 'I_INT_SCI',
    majors: ['Khoa học dữ liệu quốc tế', 'Nghiên cứu đa ngành toàn cầu']
  },
  {
    name: 'Viện Khoa học chính trị - xã hội',
    code: 'I_POL_SOC',
    majors: ['Xã hội học kinh tế', 'Tâm lý học hành vi', 'Truyền thông xã hội']
  },
  {
    name: 'Viện Ngôn ngữ - Quốc tế học',
    code: 'I_LANG_INT',
    majors: ['Ngoại ngữ ứng dụng', 'Biên phiên dịch đa ngữ kinh tế']
  },
  {
    name: 'Viện Nghiên cứu và tư vấn phát triển vùng',
    code: 'I_REGIONAL',
    majors: ['Chiến lược phát triển vùng kinh tế', 'Tư vấn chính sách vĩ mô']
  },
  {
    name: 'Viện Nghiên cứu kinh doanh',
    code: 'I_BUS_RES',
    majors: ['Nghiên cứu thị trường chuyên sâu', 'Phân tích dữ liệu doanh nghiệp lớn']
  }
];

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu (Seeding) cho UEH Tracker bằng JavaScript...');

  for (const f of UEH_FACULTIES_SEED) {
    await prisma.faculty.upsert({
      where: { code: f.code },
      update: { name: f.name, majors: f.majors },
      create: {
        code: f.code,
        name: f.name,
        majors: f.majors
      }
    });
  }
  console.log(`✅ Đã nạp thành công ${UEH_FACULTIES_SEED.length} Khoa / Viện và chuyên ngành trực thuộc!`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
