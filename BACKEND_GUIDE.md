# Hướng Dẫn Sử Dụng Backend - Hat Music

Tài liệu này mô tả chi tiết về backend server của ứng dụng Hat Music. Backend này được xây dựng bằng **Node.js** và **Express**, sử dụng thư viện `zingmp3-api-full-v2` để tương tác với dữ liệu từ Zing MP3.

## 1. Yêu Cầu Hệ Thống

*   **Node.js**: Phiên bản 14.0.0 trở lên.
*   **NPM**: Đi kèm với Node.js.

## 2. Cài Đặt & Chạy Server

### Cài đặt Dependencies
Nếu bạn chưa cài đặt các thư viện cần thiết, hãy chạy lệnh sau trong thư mục gốc của dự án:

```bash
npm install express cors zingmp3-api-full-v2 axios
```

### Khởi Động Server
Để chạy server, mở terminal tại thư mục gốc và chạy lệnh:

```bash
node server.js
```

Server sẽ khởi động tại địa chỉ: `http://localhost:3010`

## 3. Danh Sách API Endpoints

Tất cả các API đều có prefix là `/api`.

### 3.1. Tìm Kiếm Bài Hát
Tìm kiếm bài hát, nghệ sĩ, album theo từ khóa.

*   **Endpoint:** `/api/search`
*   **Method:** `GET`
*   **Query Params:**
    *   `q`: Từ khóa tìm kiếm (Bắt buộc). Ví dụ: `Đen Vâu`.
*   **Ví dụ Request:**
    ```
  GET http://localhost:3010/api/search?q=Đen Vâu
    ```
*   **Response (JSON):**
    ```json
    {
      "data": {
        "songs": [
          {
            "encodeId": "Z6U0E0Z7",
            "title": "Nấu Ăn Cho Em",
            "artistsNames": "Đen, PiaLinh",
            "thumbnailM": "https://photo-resize-zmp3.zmdcdn.me/...",
            "duration": 254,
            "album": { "title": "Nấu Ăn Cho Em (Single)" }
          },
          ...
        ]
      }
    }
    ```

### 3.2. Lấy Thông Tin & Stream Bài Hát
Lấy link phát nhạc (streaming URL) và thông tin chi tiết của một bài hát dựa trên ID.

*   **Endpoint:** `/api/song/:id`
*   **Method:** `GET`
*   **Params:**
    *   `id`: ID của bài hát (encodeId). Ví dụ: `Z6U0E0Z7`.
*   **Ví dụ Request:**
    ```
  GET http://localhost:3010/api/song/Z6U0E0Z7
    ```
*   **Response (JSON):**
    ```json
    {
      "data": {
        "128": "https://mp3-320s1-zmp3.zmdcdn.me/...", // Link nhạc 128kbps
        "320": "https://mp3-320s1-zmp3.zmdcdn.me/..."  // Link nhạc 320kbps (nếu có)
      },
      "msg": "Success",
      "err": 0
    }
    ```

### 3.3. Lấy Bảng Xếp Hạng Top 100
Lấy danh sách Top 100 bài hát hot nhất hiện tại.

*   **Endpoint:** `/api/top100`
*   **Method:** `GET`
*   **Ví dụ Request:**
    ```
  GET http://localhost:3010/api/top100
    ```
*   **Response (JSON):**
    Trả về danh sách các bài hát trong Top 100, bao gồm thông tin chi tiết như tên, nghệ sĩ, album, thumbnail.

### 3.4. Radio Proxy (Hỗ trợ phát Radio)
Dùng để proxy các luồng radio nếu gặp vấn đề về CORS hoặc cần xử lý header.

*   **Endpoint:** `/api/radio-proxy`
*   **Method:** `GET`
*   **Query Params:**
    *   `url`: URL của luồng radio cần proxy.
*   **Ví dụ Request:**
    ```
  GET http://localhost:3010/api/radio-proxy?url=https://stream.vov.vn/...
    ```

## 4. Cấu Trúc File `server.js`

*   **Khởi tạo:** Import Express, CORS và ZingMP3 API.
*   **Middleware:** Sử dụng `cors()` để cho phép Frontend (chạy ở port khác, ví dụ 5173) gọi API.
*   **Routes:** Định nghĩa các route xử lý request và gọi hàm tương ứng từ thư viện `zingmp3-api-full-v2`.
*   **Error Handling:** Các block `try-catch` để bắt lỗi khi gọi API Zing và trả về status 500 nếu có lỗi.

## 5. Lưu Ý Quan Trọng

*   **Cookie Zing MP3:** Thư viện `zingmp3-api-full-v2` cần cookie hợp lệ để hoạt động ổn định. Nếu bạn gặp lỗi không lấy được dữ liệu, hãy kiểm tra xem cookie trong thư viện có cần cập nhật không (thường thư viện này tự xử lý, nhưng đôi khi Zing thay đổi cơ chế bảo mật).
*   **Geo-blocking:** Một số bài hát chỉ phát được ở Việt Nam. Nếu bạn đang ở nước ngoài, bạn có thể cần VPN Việt Nam để server hoạt động đúng (nếu server chạy local).

---
*Tài liệu được tạo tự động bởi Hat Music.*
