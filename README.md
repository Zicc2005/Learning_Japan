# 🌸 NihonLearn N5 (learningJapen)
### Nền Tảng Học Tiếng Nhật & Luyện Viết Bút Thuận Thư Pháp Chuẩn Nhật

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![JLPT](https://img.shields.io/badge/JLPT-N5_Standard-FF2D55?style=for-the-badge)](https://www.jlpt.jp/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 📌 Giới Thiệu Dự Án (Overview)

**NihonLearn N5** là nền tảng Web E-learning thế hệ mới dành cho người bắt đầu học tiếng Nhật, kết hợp giữa nghệ thuật thư pháp cổ điển (Shodo - 書道) và công nghệ AI nhận diện nét vẽ thời gian thực.

Ứng dụng giúp giải quyết triệt để rào cản lớn nhất của người mới học tiếng Nhật: **viết sai thứ tự nét chữ Hán**, **khó nhớ mặt chữ Kana**, và **thiếu môi trường luyện thi thực tế chuẩn format JLPT**.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 1. 🖌️ Phòng Luyện Viết Bút Thuận Chuẩn Nhật (Calligraphy Studio)
- **Công nghệ Canvas 2D High-DPI**: Tự động cân chỉnh theo tỉ lệ điểm ảnh màn hình (`devicePixelRatio`), tích hợp `ResizeObserver` cho tọa độ vẽ đè khít 100% lên nét mẫu.
- **2 Chế độ bút chuyên biệt**:
  - **Bút Dạ**: Nét đều, chắc chắn, phù hợp luyện tập căn bản.
  - **Bút Lông Cọ**: Giả lập lực nhấn thư pháp, vuốt nhọn ở đuôi nét (Hane - 撥ね, Harai - 払い).
- **Khung lưới thư pháp Á Đông**: Chuyển đổi linh hoạt giữa **Ô Mễ (米)** và **Ô Điền (田)**.
- **Hướng dẫn nét thông minh (Smart Stroke Guide)**:
  - Nét mẫu dạng **Nét Liền (Solid lines)** mềm mại, thẩm mỹ cao.
  - **Cơ chế trợ giúp tự động khi viết sai 3 lần**: Tự động kích hoạt mũi tên chuyển động (`animateMotion`) chỉ rõ hướng vuốt bút từ điểm bắt đầu đến điểm kết thúc.
- **AI Sensei Đánh giá Real-time**: Chấm điểm theo 3 trục tiêu chuẩn:
  1. *Thứ tự các nét (Stroke Order)*: 100%
  2. *Cân đối góc & Tỉ lệ khung ô (Balance)*: 96%
  3. *Lực nhấn & Tốc độ đưa bút (Pacing & Pressure)*: 94%
- **Thanh điều hướng chọn chữ 2 tầng**:
  - **Tầng 1**: Segmented Switcher (`Kanji N5`, `Hiragana`, `Katakana`, `214 Bộ Thủ`), bộ lọc theo chủ đề (`Ngày & Số`, `Tự Nhiên`, `Phương Hướng`), ô tìm kiếm thông minh hỗ trợ gõ tiếng Việt không dấu, phím tắt mở bảng tra cứu `[F]`.
  - **Tầng 2**: Dải băng chuyền ký tự (Carousel Ribbon) có nút cuộn mượt mà `‹` / `›`, hiển thị toàn bộ chữ, tự động cuộn chữ đang chọn vào tâm màn hình.

### 2. 🎴 Thẻ Ghi Nhớ 3D Kana (Hiragana & Katakana Studio)
- Trọn bộ **46 ký tự Hiragana** và **46 ký tự Katakana**.
- Mỗi chữ đều có **Mẹo nhớ bằng hình ảnh trực quan (Mnemonic Story)**, phát âm mẫu giọng Nhật chuẩn bản xứ và các từ vựng ví dụ song ngữ.

### 3. 🏮 Kho 103 Kanji N5 Cốt Lõi & 214 Bộ Thủ Khang Hy
- Tra cứu đầy đủ: Hán Việt, Nghĩa, Âm On (Onyomi), Âm Kun (Kunyomi), Số nét, Bộ thủ cấu thành.
- Danh sách từ ghép thực tế N5 xuất hiện trong các đề thi JLPT chính thức.
- Tích hợp 214 Bộ Thủ thư pháp hỗ trợ nhận diện chữ Hán nâng cao.

### 4. 📖 Cẩm Nang Ngữ Pháp JLPT N5 (Grammar Master)
- 35+ mẫu ngữ pháp trọng tâm phân loại rõ ràng:
  - Hệ thống trợ từ căn bản: `は`, `が`, `を`, `に`, `で`, `へ`, `と`, `も`, `から`, `まで`...
  - Thể động từ: Thể `て`, Thể `ない`, Thể từ điển (Dictionary Form).
  - Mẫu câu giao tiếp & cấu trúc biểu đạt nguyên nhân, mục đích, yêu cầu lịch sự.
- Ví dụ song ngữ Nhật - Hán tự - Romaji - Dịch nghĩa tiếng Việt.

### 5. 📝 Hệ Thống Thi Thử Trắc Nghiệm CBT N5 (Mock Test Suite)
- Giao diện mô phỏng phòng thi trắc nghiệm trên máy tính chuẩn JLPT.
- Đếm ngược thời gian làm bài, điều hướng nhanh danh sách câu hỏi.
- Chấm điểm tự động tức thì kèm bảng giải thích chi tiết từng câu sau khi nộp bài.

### 6. 🗺️ Bản Đồ Lộ Trình 10 Chặng & Gamification
- Lộ trình học 10 chặng theo chu kỳ **Lặp lại ngắt quãng (Spaced Repetition System - SRS)**.
- Hệ thống ghi nhận tiến độ: **Chuỗi ngày học (Streak)**, **Điểm kinh nghiệm (XP)**, **Nhiệm vụ hàng ngày (Daily Quests)**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Mục đích |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 6 | Giao diện hiện đại, render cực nhanh, HMR tức thì |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS | Dark Mode Ink-Stone, hiệu ứng Glassmorphism, Neon Glow |
| **Typography** | Google Fonts | Noto Sans JP, Noto Serif JP, Zen Maru Gothic, Outfit, Inter |
| **Canvas & Graphics** | HTML5 Canvas 2D + SVG Vector | Nhận diện nét vẽ, vẽ mực Sumi, hoạt họa vector chuyển động |
| **Audio & Voice** | Web Speech Synthesis API + Web Audio | Phát âm chuẩn tiếng Nhật, hiệu ứng âm thanh click, hoàn thành |
| **Routing** | Hash Router (`window.location.hash`) | Điều hướng mượt mà, không bao giờ bị lỗi 404 khi F5 trên server tĩnh |
| **Local Persistence** | HTML5 LocalStorage | Lưu trữ điểm số, chuỗi streak, danh sách chữ đã thuộc offline-first |

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Japan_Elearning/
├── public/                     # Tài nguyên tĩnh (ảnh đại diện, favicon, mascot)
├── data/                       # Bộ dữ liệu N5 chuẩn hóa
│   ├── kana/                   # Dữ liệu Hiragana & Katakana JSON
│   ├── kanji_n5/               # Dữ liệu 103 Kanji N5 JSON
│   ├── grammar_n5/             # Dữ liệu ngữ pháp N5 JSON
│   ├── mock_tests_n5/          # Bộ đề thi thử JLPT N5 JSON
│   └── vocab_n5/               # Từ vựng N5 JSON
├── src/
│   ├── components/             # Các khối giao diện tái sử dụng
│   │   ├── canvas/             # Bộ Canvas thư pháp (StrokeCanvas, CanvasToolbar, StrokeFeedback)
│   │   ├── characters/         # Bảng chọn ký tự, Modal chi tiết chữ
│   │   ├── layout/             # Header, NavigationBar, BottomNavigation, Footer
│   │   └── quests/             # Modal nhiệm vụ hàng ngày
│   ├── pages/                  # Các màn hình chính
│   │   ├── PracticePage.jsx    # Màn hình Luyện viết thư pháp bút thuận
│   │   ├── KanaPage.jsx        # Màn hình Học bảng chữ cái Kana 3D
│   │   ├── KanjiPage.jsx       # Màn hình Thư viện Kanji N5
│   │   ├── GrammarPage.jsx     # Màn hình Cẩm nang Ngữ pháp N5
│   │   ├── ExamPage.jsx        # Màn hình Thi thử trắc nghiệm CBT
│   │   ├── RoadmapPage.jsx     # Màn hình Bản đồ lộ trình học 10 chặng
│   │   └── SenseiPage.jsx      # Màn hình Trợ lý AI Sensei
│   ├── hooks/                  # Custom React hooks (useLocalStorage, useTTS)
│   ├── utils/                  # Thuật toán so khớp nét (strokeMatcher), âm thanh (soundEffects)
│   ├── data/                   # Dữ liệu nạp nhanh (kanjiN5Complete, radicals214)
│   ├── App.jsx                 # Component trung tâm quản lý routing & trạng thái toàn cục
│   ├── index.css               # Hệ thống CSS design tokens, scrollbar, font chữ
│   └── main.jsx                # Entrypoint khởi tạo React
├── index.html                  # File HTML chính với thẻ meta SEO & Google Fonts
├── vite.config.js              # Cấu hình Vite (đã set base: './' tương thích mọi nền tảng)
├── package.json                # Danh sách gói phụ thuộc & lệnh thực thi
└── .gitignore                  # Bỏ qua node_modules, dist, env, file tạm
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Getting Started)

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 18.0.0 trở lên.
- **Trình quản lý gói**: `npm` hoặc `yarn` hoặc `pnpm`.

### Các Bước Cài Đặt

1. **Clone kho lưu trữ về máy tính:**
   ```bash
   git clone https://github.com/Zicc2005/Learnkanji_1.py.git
   cd Learnkanji_1.py
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   *Mở trình duyệt truy cập: `http://localhost:3000` hoặc cổng được hiển thị trên terminal.*

4. **Đóng gói phiên bản phát hành (Production Build):**
   ```bash
   npm run build
   ```

5. **Xem thử bản build trên máy (Preview Production):**
   ```bash
   npm run preview
   ```

---

## 🌐 Hướng Dẫn Triển Khai Lên Web (Deployment Guide)

Dự án đã được cấu hình đường dẫn tương đối (`base: './'`) và hệ thống **Hash Routing** nên tương thích 100% với tất cả các dịch vụ lưu trữ web tĩnh.

### Cách 1: Triển Khai Lên Vercel (Khuyên dùng - Nhanh nhất & Tự động CI/CD)
1. Đăng nhập vào [Vercel](https://vercel.com) bằng tài khoản GitHub của bạn.
2. Bấm **Add New...** ➔ **Project**.
3. Chọn repo `learningJapen` (hoặc `Learnkanji_1.py`).
4. Giữ nguyên toàn bộ thiết lập mặc định (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Bấm **Deploy**. Sau 30 giây bạn sẽ nhận được đường link chính thức kèm HTTPS miễn phí!

### Cách 2: Triển Khai Lên GitHub Pages
1. Trong file `package.json`, thêm script deploy:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Thêm vào mục `"scripts"` trong `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Chạy lệnh:
   ```bash
   npm run deploy
   ```
4. Vào **Settings** của repository trên GitHub ➔ **Pages** ➔ Chọn branch `gh-pages` làm nguồn hiển thị.

### Cách 3: Triển Khai Lên Netlify
1. Đăng nhập [Netlify](https://www.netlify.com).
2. Kéo thả trực tiếp thư mục `dist/` vào khung tải lên hoặc liên kết với repo GitHub.
3. Cấu hình Build command: `npm run build`, Publish directory: `dist`.

---

## 🎯 Phím Tắt Tiện Lợi Trong Ứng Dụng (Keyboard Shortcuts)

| Phím tắt | Chức năng | Vị trí áp dụng |
| :---: | :--- | :--- |
| **`F`** | Mở / Đóng Bảng Tra Cứu Toàn Bộ Ký Tự | Trang Luyện Viết Bút Thuận |
| **`Z`** | Hoàn tác nét vẽ vừa viết (Undo) | Trang Luyện Viết Bút Thuận |
| **`Space`** | Bật / Tắt chế độ xem nét mẫu chuyển động | Trang Luyện Viết Bút Thuận |
| **`Enter`** | Chấm điểm nét vẽ thủ công qua AI Sensei | Trang Luyện Viết Bút Thuận |
| **`Esc`** | Đóng Modal hoặc Bảng tra cứu đang mở | Toàn bộ ứng dụng |

---

## 🤝 Đóng Góp Phát Triển (Contributing)

Mọi đóng góp nhằm nâng cao chất lượng bài học và trải nghiệm thư pháp đều được hoan nghênh:
1. Fork dự án.
2. Tạo nhánh tính năng mới (`git checkout -b feature/AmazingFeature`).
3. Commit các thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên nhánh của bạn (`git push origin feature/AmazingFeature`).
5. Tạo một **Pull Request** mới.

---

## 📄 Bản Quyền (License)

Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**. Xem file `LICENSE` để biết thêm chi tiết.

---

<div align="center">
  <sub>Xây dựng với tất cả tâm huyết dành cho cộng đồng học tiếng Nhật Việt Nam 🇻🇳 🇯🇵</sub>
</div>
