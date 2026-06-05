# 🌐 Hướng dẫn Deploy - Trần Quang Long Personal Website

## Stack
- React 19 + Vite + TypeScript + Tailwind CSS v4
- Express.js backend (Gemini AI integration)
- Firebase Firestore (contact forms, newsletter)

## Deploy lên Render.com (Khuyến nghị)

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit: Trần Quang Long personal website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tran-quang-long-website.git
git push -u origin main
```

### Bước 2: Tạo Web Service trên Render.com
1. Truy cập [render.com](https://render.com) và đăng nhập
2. Click **"New +"** → **"Web Service"**
3. Kết nối với GitHub repo của bạn
4. Cấu hình:
   - **Name**: `tran-quang-long-website`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Bước 3: Cấu hình Environment Variables trên Render
Vào tab **Environment** và thêm:
- `NODE_ENV` = `production`
- `GEMINI_API_KEY` = *(API key của bạn từ Google AI Studio)*

### Bước 4: Deploy
Click **"Create Web Service"** và đợi build hoàn thành (~3-5 phút)

## Environment Variables cần thiết
| Variable | Giá trị | Bắt buộc |
|----------|---------|-----------|
| `NODE_ENV` | `production` | ✅ |
| `GEMINI_API_KEY` | API key từ AI Studio | ✅ (cho AI tools) |

## Firebase Setup
Firebase Firestore đã được cấu hình sẵn trong `firebase-applet-config.json`.
Không cần thiết lập thêm - contact forms và newsletter sẽ hoạt động ngay.
