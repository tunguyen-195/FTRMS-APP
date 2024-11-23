import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

// Tính toán __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình i18n
i18n.configure({
  locales: ['en', 'vi'], // Các ngôn ngữ hỗ trợ
  directory: path.join(__dirname, '../locales'), // Đường dẫn đến thư mục chứa các tệp dịch
  defaultLocale: 'vi', // Ngôn ngữ mặc định
  cookie: 'lang', // Tên cookie để lưu trữ ngôn ngữ
  autoReload: true, // Tự động tải lại khi tệp dịch thay đổi
  updateFiles: false, // Không tự động cập nhật tệp dịch
  syncFiles: true, // Đồng bộ hóa các tệp dịch
  objectNotation: true // Cho phép sử dụng object notation cho các key
});

console.log('i18n configured with locales:', i18n.getLocales());

// Middleware để thiết lập ngôn ngữ từ cookie
export const i18nMiddleware = (req, res, next) => {
  i18n.init(req, res); // Khởi tạo i18n cho mỗi yêu cầu
  const currentLang = req.cookies.lang || i18n.getLocale(); // Sử dụng ngôn ngữ mặc định trên i18n nếu không có cookie
  req.setLocale(currentLang);
  res.locals.lng = currentLang;
  // console.log(`Ngôn ngữ hiện tại từ cookie: ${currentLang}`); // Log để kiểm tra
  // console.log(`Ngôn ngữ hiện tại từ i18n: ${req.getLocale()}`); // Log để kiểm tra
  next();
};

export default i18n;
