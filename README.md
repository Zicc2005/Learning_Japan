# 🌸 NihonLearn N5 (Learning_Japan)
### Nền Tảng Học Tiếng Nhật & Luyện Viết Bút Thuận Thư Pháp AI Chuẩn Nhật Bản

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![JLPT](https://img.shields.io/badge/JLPT-N5_Standard-FF2D55?style=for-the-badge)](https://www.jlpt.jp/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 📌 Giới Thiệu Dự Án (Overview)

**NihonLearn N5** là nền tảng Web E-learning thế hệ mới dành cho người học tiếng Nhật sơ cấp (JLPT N5), kết hợp giữa nét đẹp nghệ thuật thư pháp cổ điển phương Đông (**Shodo - 書道**) và công nghệ nhận diện nét vẽ thời gian thực (**Real-time AI Stroke Recognition**).

Ứng dụng giải quyết triệt để các rào cản lớn nhất của người mới học tiếng Nhật:
1. **Viết sai thứ tự và hướng nét** (Stroke Order & Direction).
2. **Khó ghi nhớ mặt chữ tượng hình** (Kana & Kanji N5).
3. **Thiếu phản hồi xúc giác và âm thanh đa giác quan** khi tự học tại nhà.
4. **Cần môi trường thi thử trắc nghiệm** chuẩn format kỳ thi JLPT N5.

---

## 🌟 Tính Năng Cốt Lõi (Key Features)

### 1. 🖌️ Xưởng Luyện Viết Bút Thuận 3 Cột (Calligraphy Practice Studio)
- **Bố cục Desktop 3 Cột Chuyên Nghiệp (`12-grid system`)**:
  - **Cột Trái (Identity & Stroke Rules)**: Thẻ định danh chữ cái kích thước lớn, nút loa phát âm Sensei chuẩn, Romaji, JLPT N5, số nét, phân loại bảng chữ, hướng dẫn khẩu hình, sơ đồ chi tiết từng nét với tag trạng thái (`✓ Đã vẽ`, `Đang viết...`, `Chờ vẽ`) và mẹo liên tưởng nhớ chữ.
  - **Cột Giữa (Studio Canvas Center)**: 
    - Thanh công cụ đổi loại bút (*Bút Dạ* đều nét / *Bút Lông Cọ* nhấn nhả thư pháp), đổi cỡ nét (*Mảnh*, *Vừa*, *Đậm*), Bật/Tắt nét mờ hướng dẫn, nút xóa sạch.
    - Khung vẽ vuông chuẩn tỷ lệ thư pháp với **lưới Mễ-tự (米字格)** viền đỏ nét đứt, chip thông tin nét vẽ và độ nhạy `Sens: 90%`, thanh trạng thái phản hồi nét vẽ tức thì.
    - Lớp SVG hướng dẫn gồm: nét mực Sumi đã viết, nét xám mờ liền nét, điểm phát sáng đỏ đánh số thứ tự nét, vòng tròn lan tỏa ping tại điểm kết thúc, và mũi tên vuốt động (animated swipe arrow) khi viết sai từ 3 lần.
    - Phím tắt studio: `[Space]` Xem mẫu, `[Z]` Hoàn tác, `[Enter]` Chấm điểm nét.
  - **Cột Phải (AI Sensei & Character Queue & Hero Next Button)**:
    - **Đánh Giá AI Sensei**: Huy hiệu điểm tổng quát (*Chuẩn 96%*), 3 thanh tiến trình chuyên biệt (*Thứ tự nét*, *Cân đối ô*, *Lực nhấn & Tốc độ*), kèm hộp lời nhắc của Sensei.
    - **Từ Ghép Thường Gặp**: Các từ vựng N5 thông dụng chứa ký tự kèm nút nghe phát âm [🔊].
    - **Thứ Tự Luyện Viết (Scrollable Character Queue)**: Danh sách cuộn toàn bộ 46 chữ cái với nhãn `[● Đang luyện]`, `[✓ Thuộc]`, `[Tiếp ➔]`. Người dùng có thể lăn chuột và bấm chọn để chuyển chữ ngay lập tức.
    - **Tiến độ Lộ Trình Mini**: Hiển thị tiến độ theo ngày học kèm nút `[Xem Lộ Trình ✓]`.
    - **Nút KẾ TIẾP To Và Rõ**: Banner xanh ngọc gradient cỡ lớn nổi bật, hiển thị chữ kế tiếp to rõ, số nét và nút mũi tên tròn `➔`.

### 2. 🔊 Hệ Thống Phản Hồi Đa Giác Quan (Audio & Haptic Sensory Feedback)
- **Âm thanh "tiếng tịch" khi vẽ sai**: Sóng âm sawtooth trầm (150Hz -> 110Hz) đặc trưng cảnh báo khi vẽ ngược chiều hoặc sai thứ tự nét.
- **Rung phản hồi phần cứng (Haptic Vibration)**: Tự động kích hoạt `navigator.vibrate([80, 50, 80])` trên điện thoại/máy tính bảng stylus khi vẽ sai, và rung nhẹ `[40ms]` xác nhận khi vẽ đúng.
- **Hiệu ứng rung lắc khung vẽ (Canvas Visual Shake)**: Kích hoạt class `.animate-shake` kết hợp viền đỏ neon `neon-glow-pink` làm bảng vẽ rung lắc chân thực trong 380ms.
- **Âm thanh Ting & Trống Taiko ăn mừng**: Phát tiếng Ting thanh thoát khi viết đúng nét; phát hồi trống Taiko hào hùng kết hợp hợp âm C Major chord và bắn pháo hoa confetti khi hoàn thành trọn vẹn chữ cái.

### 3. 🌓 Hỗ Trợ Đầy Đủ 2 Chế Độ Sáng / Tối (Light & Dark Mode)
- Tích hợp chuẩn Tailwind CSS v4 class-based variant: `@custom-variant dark (&:where(.dark, .dark *));`.
- **Chế độ Sáng (Light Mode)**: Bảng vẽ màu giấy xuyến thư pháp Washi `#faf8f5`, mực Sumi đen đậm `#1A1D20`, thẻ nền trắng thanh nhã `#ffffff`, viền nhẹ nhàng.
- **Chế độ Tối (Dark Mode)**: Bảng vẽ màu than thạch anh `#0c1017`, nét mực Sumi trắng ngà dạ quang `#ffffff`, nền tối sâu thẳm `#070a11`, thẻ `#0f131d`, bảo vệ mắt khi luyện viết ban đêm.

### 4. 🎴 Thẻ Nhớ 3D Kana (Hiragana & Katakana Studio)
- Trọn bộ 46 ký tự Hiragana và 46 ký tự Katakana.
- Hiệu ứng lật thẻ 3D hai mặt (mặt chữ cái & mặt hình vẽ liên tưởng mnemonic).
- Bộ lọc theo hàng âm (Gyou): Hàng A, Ka, Sa, Ta, Na, Ha, Ma, Ya, Ra, Wa/N.

### 5. 🏮 Khám Phá 103 Kanji N5 & 214 Bộ Thủ Khang Hy
- Phân loại theo chủ đề: *Thời gian & Số đếm*, *Tự nhiên & Vũ trụ*, *Phương hướng & Đời sống*.
- Tra cứu đầy đủ Hán Việt, Nghĩa, Âm On, Âm Kun, Số nét, các từ ghép thực tế trong đề thi JLPT.
- Tích hợp 214 Bộ Thủ phục vụ cho việc phân tích kết cấu chữ Hán chuyên sâu.

### 6. 📖 Cẩm Nang Ngữ Pháp JLPT N5 (Grammar Master)
- Hệ thống trợ từ căn bản: `は`, `が`, `を`, `に`, `で`, `へ`, `と`, `も`, `から`, `まで`...
- Các thể động từ sơ cấp: Thể `て`, Thể `ない`, Thể Từ điển, Thể Lịch sự.
- Ví dụ ngữ cảnh song ngữ Nhật - Hán Việt - Romaji - Dịch nghĩa tiếng Việt.

### 7. 📝 Thi Thử Trắc Nghiệm JLPT N5 (Mock Test Suite)
- Mô phỏng phòng thi trắc nghiệm trên máy tính chuẩn format JLPT N5.
- Đếm ngược thời gian làm bài, điều hướng nhanh danh sách câu hỏi.
- Chấm điểm tự động tức thì kèm bảng giải thích chi tiết đáp án.

### 8. 🗺️ Bản Đồ Lộ Trình 14 Ngày & Hệ Thống Gamification
- Lộ trình học 14 ngày từng bước từ Bảng chữ cái đến Ngữ pháp & Đọc hiểu.
- Tích điểm kinh nghiệm (XP), thăng cấp Võ Sĩ, chuỗi ngày học liên tục (Streak), và Nhiệm vụ hàng ngày (Daily Quests).
- Cơ sở dữ liệu người dùng tích hợp LocalStorage & IndexedDB offline-first, hỗ trợ đăng nhập, đăng ký và đồng bộ tiến độ học tập.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Mục đích |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 6 | Render hiệu năng cao, tối ưu HMR tức thì |
| **Styling** | Tailwind CSS v4 + Vanilla CSS | Hỗ trợ 2 chế độ Sáng/Tối, hiệu ứng Washi Paper, Shake & Neon Glow |
| **Typography** | Google Fonts | Noto Serif JP, Plus Jakarta Sans, Inter |
| **Graphics & Canvas** | HTML5 Canvas 2D + SVG Markers | Nhận diện nét vẽ, vẽ đường cong Bézier, hoạt họa vector chuyển động |
| **Audio Engine** | Web Audio API + Web Speech Synthesis | Phát âm tiếng Nhật bản xứ, bộ hiệu ứng âm thanh thủ tục (procedural audio) |
| **Animation & Haptic** | Navigator Vibrate API + Canvas Confetti | Phản hồi rung xúc giác trên màn cảm ứng, hiệu ứng pháo hoa ăn mừng |
| **Database** | IndexedDB + LocalStorage Offline-first | Lưu tiến độ học tập, huy hiệu chữ đã thuộc, điểm XP bền vững |

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Japan_Elearning/
├── public/                       # Mascot, icons, tài nguyên tĩnh
├── data/                         # Bộ dữ liệu N5 chuẩn hóa
│   ├── kana/                     # Hiragana & Katakana JSON
│   ├── kanji_n5/                 # Dữ liệu 103 Kanji N5 JSON
│   ├── grammar_n5/               # Dữ liệu ngữ pháp N5 JSON
│   ├── mock_tests_n5/            # Bộ đề thi thử JLPT N5 JSON
│   └── vocab_n5/                 # Dữ liệu từ vựng N5 JSON
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navigation.jsx    # Thanh điều hướng đa nền tảng (Sidebar + Mobile Bottom Bar)
│   │   └── quests/
│   │       └── DailyQuestsModal.jsx # Modal nhiệm vụ hàng ngày
│   ├── data/                     # Dữ liệu lộ trình và bộ thủ thư pháp
│   │   ├── kanjiN5Complete.js    # Danh sách 103 Kanji đầy đủ vector bút thuận
│   │   ├── radicals214.js        # 214 Bộ Thủ Khang Hy
│   │   └── roadmapData.js        # Bản đồ lộ trình học 14 ngày
│   ├── pages/                    # 7 Màn hình chính của ứng dụng
│   │   ├── PracticeScreen.jsx    # Phòng luyện viết thư pháp 3 cột chuẩn
│   │   ├── RoadmapScreen.jsx     # Bản đồ lộ trình học tập & Gamification
│   │   ├── KanaStudioScreen.jsx  # Bảng chữ cái & Thẻ nhớ 3D Kana
│   │   ├── KanjiExplorerScreen.jsx # Thư viện tra cứu 103 Kanji N5 & Bộ thủ
│   │   ├── GrammarScreen.jsx     # Cẩm nang ngữ pháp N5
│   │   ├── ExamScreen.jsx        # Phòng thi thử trắc nghiệm JLPT N5
│   │   └── AuthScreen.jsx        # Cổng đăng nhập & xác thực Torii cổ điển
│   ├── services/
│   │   └── authDatabase.js       # Cơ sở dữ liệu IndexedDB/LocalStorage
│   ├── utils/
│   │   ├── audio.js              # Phát âm tiếng Nhật Web Speech Synthesis
│   │   ├── soundEffects.js       # Web Audio API Procedural Engine (Ting, Buzz, Taiko)
│   │   └── strokeMatcher.js      # Thuật toán so khớp tọa độ và thứ tự nét vẽ
│   ├── App.jsx                   # Component gốc điều phối màn hình & Dark Mode
│   ├── index.css                 # Hệ thống theme Tailwind CSS v4 & keyframes
│   └── main.jsx                  # Điểm khởi động ứng dụng React
├── index.html                    # HTML template
├── package.json                  # Cấu hình dự án & dependencies
└── vite.config.js                # Cấu hình Vite build
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Getting Started)

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản `>= 18.0.0`
- **NPM** hoặc **Yarn** / **PNPM**

### 1. Clone Kho Mã Nguồn
```bash
git clone https://github.com/Zicc2005/Learning_Japan.git
cd Learning_Japan
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Chạy Máy Chủ Phát Triển (Development Server)
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 4. Đóng Gói Ứng Dụng (Production Build)
```bash
npm run build
```
Thư mục xuất bản tĩnh sẽ được tạo tại `dist/`.

---

## 📜 Giấy Phép (License)

Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**.
Phát triển bởi đội ngũ NihonLearn với mục tiêu mang đến trải nghiệm học tiếng Nhật hiện đại, truyền cảm hứng và hoàn toàn miễn phí.
