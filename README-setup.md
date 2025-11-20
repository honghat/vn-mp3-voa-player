# Hướng dẫn cài đặt và sử dụng VOA MP3 Player

## 1. Clone và cài đặt
```bash
git clone git@github.com:honghat/vn-mp3-voa-player.git
cd vn-mp3-voa-player
npm install
```

## 2. Build frontend
```bash
npm run build
```

## 3. Cấu hình Nginx
- File cấu hình: `/etc/nginx/sites-available/music.hat404.io.vn`
- Sử dụng port: **8080** cho Nginx (frontend)
- Proxy API về backend port **3010**

Ví dụ cấu hình:
```nginx
server {
    listen 8080;
    server_name music.hat404.io.vn;

    root /home/pi/omv_data/vn-mp3-voa-player/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3010;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

Sau khi sửa cấu hình:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Khởi động backend Node.js
- Sử dụng port: **3010**
- File: `server.js`
- Có thể chạy bằng systemd hoặc thủ công:
```bash
node server.js
```
Hoặc dùng systemd:
```bash
sudo systemctl restart music-backend.service
```

## 5. Truy cập ứng dụng
- Frontend: http://music.hat404.io.vn:8080
- Backend API: http://localhost:3010/api/

## 6. Lưu ý
- Đảm bảo quyền truy cập thư mục cho Nginx: `chmod -R 755 dist`
- Nếu đổi port backend, sửa lại cấu hình Nginx cho đúng.

---
**Tác giả:** honghat
**Ngày cập nhật:** 21/11/2025
