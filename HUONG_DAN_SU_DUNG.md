# 🎵 HƯỚNG DẪN SỬ DỤNG ZING MP3 PLAYER

## 📋 Giới thiệu
Ứng dụng phát nhạc trực tuyến từ Zing MP3 được xây dựng bằng React và Node.js. Ứng dụng cho phép tìm kiếm, phát nhạc và trải nghiệm giao diện người dùng hiện đại.

## 🔧 Yêu cầu hệ thống
- **Node.js**: phiên bản 14 trở lên
- **NPM**: phiên bản 6 trở lên
- **Trình duyệt**: Chrome, Firefox, Edge (phiên bản mới nhất)

## 📦 Cài đặt

### Bước 1: Cài đặt các dependencies
```bash
npm install
```

### Bước 2: Khởi động Backend Server
Mở terminal thứ nhất và chạy:
```bash
node server.js
```
Server sẽ chạy tại: **http://localhost:3000**

### Bước 3: Khởi động Frontend (React App)
Mở terminal thứ hai và chạy:
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: **http://localhost:5173**

## 🎮 Cách sử dụng

### 1. Tìm kiếm bài hát
- Nhập tên bài hát hoặc ca sĩ vào ô tìm kiếm
- Chọn bài hát từ kết quả tìm kiếm
- Bài hát sẽ tự động phát

### 2. Điều khiển phát nhạc
- **Play/Pause**: Nhấn nút phát/tạm dừng
- **Next/Previous**: Chuyển bài hát tiếp theo/trước đó
- **Volume**: Điều chỉnh âm lượng
- **Seek**: Kéo thanh tiến trình để tua bài hát

### 3. Danh sách phát
- Xem danh sách các bài hát đã chọn
- Nhấn vào bài hát để phát
- Xóa bài hát khỏi danh sách

## 🔌 API Endpoints

Backend server cung cấp các API endpoints sau:

| Endpoint | Method | Mô tả | Ví dụ |
|----------|--------|-------|-------|
| `/api/search` | GET | Tìm kiếm bài hát | `/api/search?q=lối nhỏ` |
| `/api/song/:id` | GET | Lấy thông tin & stream bài hát | `/api/song/ZWZB9FAE` |
| `/api/home` | GET | Lấy dữ liệu trang chủ | `/api/home` |
| `/api/top100` | GET | Lấy bảng xếp hạng Top 100 | `/api/top100` |

## 📁 Cấu trúc thư mục

```
zing-mp3-player/
│
├── src/                    # Mã nguồn React
│   ├── App.jsx            # Component chính
│   ├── index.css          # Styles
│   └── main.jsx           # Entry point
│
├── server.js              # Backend API server
├── test_api.js            # Test API scripts
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

## ⚙️ Cấu hình

### Thay đổi Port
- **Backend**: Sửa `PORT` trong file `server.js` (mặc định: 3000)
- **Frontend**: Vite tự động chọn port (mặc định: 5173)

### CORS
Backend đã được cấu hình CORS để cho phép frontend kết nối. Nếu cần thay đổi, chỉnh sửa trong `server.js`:
```javascript
app.use(cors());
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Cannot find module"
**Giải pháp**: Chạy lại `npm install`

### Lỗi: "Port already in use"
**Giải pháp**: 
- Tắt ứng dụng đang chạy ở port đó
- Hoặc thay đổi port trong cấu hình

### Lỗi: "Failed to fetch song"
**Giải pháp**:
- Kiểm tra kết nối Internet
- Đảm bảo backend server đang chạy
- Kiểm tra ID bài hát có hợp lệ không

### Lỗi: Backend không kết nối được
**Giải pháp**:
- Kiểm tra xem `node server.js` có đang chạy không
- Kiểm tra URL API trong frontend code

## 🔄 Build cho Production

### Build Frontend
```bash
npm run build
```
Các file build sẽ được tạo trong thư mục `dist/`

### Preview Production Build
```bash
npm run preview
```

## 📝 Ghi chú kỹ thuật

### Công nghệ sử dụng
- **Frontend**: React 19, Vite, Lucide React (icons)
- **Backend**: Express.js, Node.js
- **API**: zingmp3-api-full-v2
- **Styling**: CSS hiện đại với glassmorphism effects

### Dependencies chính
- `react` & `react-dom`: Framework UI
- `express`: Web server
- `cors`: Xử lý CORS
- `zingmp3-api-full-v2`: API wrapper cho Zing MP3
- `lucide-react`: Icon library

## 🎯 Tính năng

✅ Tìm kiếm bài hát theo tên/ca sĩ  
✅ Phát nhạc trực tuyến  
✅ Giao diện người dùng đẹp mắt, hiện đại  
✅ Điều khiển phát nhạc đầy đủ  
✅ Responsive design  
✅ Danh sách phát động  

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra phần "Xử lý lỗi thường gặp" ở trên
2. Xem console log trong trình duyệt (F12)
3. Kiểm tra terminal output của server

## 📄 License
Dự án này được tạo ra cho mục đích học tập và cá nhân.

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 20/11/2025
