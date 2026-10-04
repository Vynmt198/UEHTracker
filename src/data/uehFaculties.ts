/**
 * Danh sách đầy đủ 33 Khoa / Viện và chuyên ngành trực thuộc Đại học Kinh tế TP. Hồ Chí Minh (UEH)
 */

export const UEH_FACULTIES = [
  'Khoa Quản trị',
  'Khoa Kinh doanh quốc tế - Marketing',
  'Khoa Tài chính',
  'Khoa Ngân hàng',
  'Khoa Kế toán',
  'Khoa Du lịch',
  'Khoa Kinh tế',
  'Khoa Tài chính công',
  'Khoa Luật',
  'Khoa Quản lý nhà nước',
  'Khoa Ngoại ngữ',
  'Khoa Toán - Thống kê',
  'Khoa Công nghệ thông tin kinh doanh',
  'Khoa Thiết kế Truyền thông',
  'Khoa Tài năng kinh doanh',
  'Khoa Tài chính - Kế toán',
  'Khoa Kinh doanh quản lý',
  'Khoa Công nghệ',
  'Khoa Cơ bản',
  'Viện Phát triển Nguồn nhân lực và Kinh doanh',
  'Viện Kinh tế môi trường Đông Nam Á',
  'Viện Nghiên cứu Chính sách nông nghiệp và sức khỏe',
  'Viện Tài chính bền vững',
  'Viện Toán ứng dụng',
  'Viện Công nghệ thông minh và tương tác',
  'Viện Đổi mới sáng tạo',
  'Viện Đô thị thông minh và quản lý',
  'Viện Đào tạo quốc tế',
  'Viện Khoa học quốc tế',
  'Viện Khoa học chính trị - xã hội',
  'Viện Ngôn ngữ - Quốc tế học',
  'Viện Nghiên cứu và tư vấn phát triển vùng',
  'Viện Nghiên cứu kinh doanh'
] as const;

export type UEHFacultyName = typeof UEH_FACULTIES[number];

export const MAJORS_BY_FACULTY: Record<string, string[]> = {
  'Khoa Quản trị': [
    'Quản trị kinh doanh',
    'Quản trị nhân lực',
    'Quản trị bệnh viện',
    'Quản trị sự kiện và lễ hội',
    'Khởi nghiệp và Đổi mới sáng tạo'
  ],
  'Khoa Kinh doanh quốc tế - Marketing': [
    'Kinh doanh quốc tế',
    'Marketing',
    'Logistics và Quản lý Chuỗi cung ứng',
    'Thương mại điện tử',
    'Kinh doanh thương mại',
    'Truyền thông Marketing tích hợp'
  ],
  'Khoa Tài chính': [
    'Tài chính doanh nghiệp',
    'Thị trường chứng khoán',
    'Đầu tư tài chính',
    'Quản trị rủi ro tài chính',
    'Định giá tài sản'
  ],
  'Khoa Ngân hàng': [
    'Ngân hàng thương mại',
    'Thị trường tài chính',
    'Ngân hàng số',
    'Công nghệ tài chính ngân hàng'
  ],
  'Khoa Kế toán': [
    'Kế toán doanh nghiệp',
    'Kiểm toán',
    'Kế toán công',
    'Kế toán quốc tế (ACCA / CPA)'
  ],
  'Khoa Du lịch': [
    'Quản trị khách sạn',
    'Quản trị dịch vụ du lịch và lữ hành',
    'Quản trị nhà hàng và dịch vụ ăn uống',
    'Du lịch thông minh và bền vững'
  ],
  'Khoa Kinh tế': [
    'Kinh tế học',
    'Kinh tế đầu tư',
    'Kinh tế phát triển',
    'Kinh tế nông nghiệp và phát triển nông thôn',
    'Kinh tế chính trị ứng dụng'
  ],
  'Khoa Tài chính công': [
    'Tài chính công',
    'Thuế trong kinh doanh',
    'Hải quan và Thương mại quốc tế',
    'Quản lý ngân sách nhà nước'
  ],
  'Khoa Luật': [
    'Luật kinh tế',
    'Luật kinh doanh quốc tế',
    'Luật tài chính - ngân hàng'
  ],
  'Khoa Quản lý nhà nước': [
    'Quản lý công',
    'Chính sách công',
    'Quản trị khu vực công'
  ],
  'Khoa Ngoại ngữ': [
    'Tiếng Anh thương mại',
    'Ngôn ngữ Anh',
    'Tiếng Anh truyền thông kinh doanh'
  ],
  'Khoa Toán - Thống kê': [
    'Thống kê kinh tế',
    'Toán kinh tế',
    'Phân tích dữ liệu kinh doanh',
    'Khoa học tính toán bảo hiểm (Actuary)'
  ],
  'Khoa Công nghệ thông tin kinh doanh': [
    'Hệ thống thông tin quản lý',
    'Khoa học dữ liệu',
    'Kỹ thuật phần mềm',
    'Công nghệ tài chính (FinTech)',
    'An toàn thông tin trong kinh doanh'
  ],
  'Khoa Thiết kế Truyền thông': [
    'Thiết kế truyền thông',
    'Truyền thông số',
    'Công nghệ đa phương tiện',
    'Nghệ thuật số'
  ],
  'Khoa Tài năng kinh doanh': [
    'Cử nhân Tài năng Quản trị',
    'Cử nhân Tài năng Tài chính',
    'Cử nhân Tài năng Marketing'
  ],
  'Khoa Tài chính - Kế toán': [
    'Tài chính - Kế toán ứng dụng',
    'Kế toán quản trị'
  ],
  'Khoa Kinh doanh quản lý': [
    'Quản trị dự án kinh doanh',
    'Quản lý vận hành chuỗi giá trị'
  ],
  'Khoa Công nghệ': [
    'Công nghệ thông minh',
    'Robot và Trí tuệ nhân tạo (AI)',
    'Kỹ thuật điều khiển và tự động hóa'
  ],
  'Khoa Cơ bản': [
    'Toán cao cấp và Ứng dụng kinh tế',
    'Khoa học xã hội và nhân văn'
  ],
  'Viện Phát triển Nguồn nhân lực và Kinh doanh': [
    'Phát triển nguồn nhân lực',
    'Tư vấn và phát triển kinh doanh'
  ],
  'Viện Kinh tế môi trường Đông Nam Á': [
    'Kinh tế môi trường',
    'Kinh tế tuần hoàn và phát triển bền vững'
  ],
  'Viện Nghiên cứu Chính sách nông nghiệp và sức khỏe': [
    'Chính sách nông nghiệp và an ninh lương thực',
    'Kinh tế y tế và sức khỏe cộng đồng'
  ],
  'Viện Tài chính bền vững': [
    'Tài chính xanh (Green Finance)',
    'ESG và Đầu tư có trách nhiệm'
  ],
  'Viện Toán ứng dụng': [
    'Toán tài chính và mô hình hóa',
    'Khoa học tính toán ứng dụng'
  ],
  'Viện Công nghệ thông minh và tương tác': [
    'Công nghệ tương tác và thiết kế trải nghiệm (UX/UI)',
    'Truyền thông tương tác số'
  ],
  'Viện Đổi mới sáng tạo': [
    'Khởi nghiệp và Đổi mới sáng tạo',
    'Quản trị vườn ươm doanh nghiệp'
  ],
  'Viện Đô thị thông minh và quản lý': [
    'Quản lý đô thị thông minh',
    'Quy hoạch và kiến trúc đô thị thông minh'
  ],
  'Viện Đào tạo quốc tế': [
    'Cử nhân Kinh doanh ISB BBus',
    'Tài chính Ứng dụng ISB',
    'Marketing Quốc tế ISB'
  ],
  'Viện Khoa học quốc tế': [
    'Khoa học ứng dụng quốc tế',
    'Chương trình liên kết quốc tế'
  ],
  'Viện Khoa học chính trị - xã hội': [
    'Khoa học chính trị và quản lý',
    'Xã hội học kinh tế'
  ],
  'Viện Ngôn ngữ - Quốc tế học': [
    'Quốc tế học',
    'Ngôn ngữ ứng dụng trong kinh doanh'
  ],
  'Viện Nghiên cứu và tư vấn phát triển vùng': [
    'Quy hoạch và phát triển kinh tế vùng',
    'Kinh tế địa phương'
  ],
  'Viện Nghiên cứu kinh doanh': [
    'Nghiên cứu kinh doanh ứng dụng',
    'Phương pháp nghiên cứu định lượng'
  ]
};
