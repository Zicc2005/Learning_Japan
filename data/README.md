# Kho Dữ Liệu Học Tiếng Nhật N5 & Luyện Nét Bút Thuận (Dataset Standard)

Kho dữ liệu này được thiết kế và thu thập theo tiêu chuẩn chương trình JLPT N5 (kết hợp giáo trình *Minna no Nihongo* và *Marugoto*), tối ưu riêng cho **người học Việt Nam** với vũ khí âm Hán-Việt, mẹo nhớ hình ảnh (Mnemonics) và toạ độ vector nét bút thuận (Stroke Order Paths) cho Canvas.

---

## 1. Cấu Trúc Thư Mục
```
data/
├── kana/
│   ├── hiragana.json         # 46 chữ cái Hiragana + toạ độ SVG nét vẽ + mẹo nhớ + từ vựng ví dụ
│   └── katakana.json         # 46 chữ cái Katakana + toạ độ SVG nét vẽ + mẹo nhớ + từ mượn ngoại lai
├── kanji_n5/
│   └── kanji_n5.json         # 103+ chữ Hán N5 cốt lõi kèm âm Hán-Việt, On/Kun, số nét, mẹo nhớ, từ ghép
├── vocab_n5/
│   └── vocab_n5.json         # 800+ từ vựng N5 chia theo chủ đề, kèm âm Hán-Việt & nghĩa
├── grammar_n5/
│   └── grammar_n5.json       # 40+ cấu trúc ngữ pháp N5, trợ từ (は, が, を, に, で...), lỗi hay sai
└── mock_tests_n5/
    └── test_n5.json          # Bộ đề thi thử trắc nghiệm chuẩn cấu trúc JLPT N5 (Chữ Hán, Từ vựng, Ngữ pháp)
```

---

## 2. Đặc Tả Dữ Liệu (Data Schemas)

### Ký tự Bảng chữ cái (`hiragana.json` / `katakana.json`)
```json
{
  "char": "あ",
  "romaji": "a",
  "strokeCount": 3,
  "strokeRules": [
    "1. Nét ngang ngắn từ trái sang phải",
    "2. Nét sổ cong từ trên xuống cắt qua giữa nét 1",
    "3. Nét cong xoắn tròn lớn từ giữa sang phải rồi uốn xuống"
  ],
  "mnemonic": {
    "title": "Quả Táo (Apple)",
    "story": "Chữ あ nhìn như một quả táo đỏ mọng có cuống lá ở trên và thân tròn trịa..."
  },
  "examples": [
    { "word": "あい (ai)", "hanviet": "Ái", "meaning": "Tình yêu" }
  ],
  "strokeSvgPaths": [
    "M 30 110 Q 100 100 170 95",
    "M 105 40 Q 110 130 95 210",
    "M 80 120 Q 170 80 175 160 Q 175 220 110 215 Q 50 200 70 140 Q 80 115 110 120"
  ]
}
```

### Chữ Hán N5 (`kanji_n5.json`)
```json
{
  "kanji": "日",
  "hanviet": "NHẬT",
  "strokes": 4,
  "radical": "日 (Nhật)",
  "onyomi": ["ニチ", "ジツ"],
  "kunyomi": ["ひ", "-び", "-か"],
  "meaning": "Mặt trời, ngày, nước Nhật",
  "strokeRules": [ ... ],
  "mnemonicStory": "Chữ 日 mô phỏng mặt trời tròn trịa với vệt sáng rực rỡ ở chính giữa.",
  "strokeSvgPaths": [ ... ],
  "compounds": [
    { "word": "日本 (にほん)", "hanviet": "Nhật Bản", "meaning": "Nước Nhật" }
  ]
}
```

---

## 3. Cách Tích Hợp Vào Web App & Train AI
- **Web Canvas:** Sử dụng thuộc tính `strokeSvgPaths` để render nét mờ (hint) và kiểm tra tọa độ vẽ của người dùng theo thứ tự mảng từ 0 đến $N-1$.
- **AI Prompt / Fine-tuning:** Sử dụng `mnemonicStory`, `hanviet`, và `commonMistakes` trong bộ dữ liệu để làm few-shot context cho Sensei AI khi học viên hỏi về một chữ cái hoặc điểm ngữ pháp bất kỳ.
