// Data structure for the Gamified Cyber-Japanese RPG Roadmap
import { KANA_DAILY_MAP, KANA_CURRICULUM_METADATA } from './kanaDailyCurriculum';

export { KANA_DAILY_MAP, KANA_CURRICULUM_METADATA };

export const STAGES_DATA = [
  {
    id: 'stage-1',
    stageNum: 'Ải 1',
    name: 'Khai Môn Hiragana',
    subtitle: 'あいうえお • 46 chữ cơ bản',
    description: 'Nắm vững toàn bộ 46 chữ cái Hiragana, quy tắc biến âm Dakuon, Handakuon và ảo âm Youon chuẩn Tokyo theo lộ trình 8 ngày chi tiết.',
    type: 'main',
    icon: 'あ',
    xp: 100,
    unlockXp: 0,
    progressPercent: 100,
    stars: 3,
    status: 'completed',
    color: 'emerald',
    route: 'kana',
    tags: ['あいうえお', 'かきくけこ', 'さしすせそ', 'Biến âm Dakuon'],
    dailyCurriculumDays: [1, 2, 3, 4, 5, 6, 7, 8],
    cardSide: 'right',
    coords: { x: 22, y: 5 }
  },
  {
    id: 'stage-2',
    stageNum: 'Phụ bản 1',
    name: 'Vĩnh Tự Bát Pháp',
    subtitle: 'Quy tắc 8 nét bút thuận cổ trang',
    description: 'Luyện 8 nét cơ bản cấu thành chữ Hán và chữ mềm theo thư pháp Nhật Bản truyền thống: Nét Điểm, Trắc, Nỗ, Địch, Lặc, Phác, Phất, Triệt.',
    type: 'side',
    icon: '✍️',
    xp: 150,
    unlockXp: 0,
    progressPercent: 100,
    stars: 3,
    status: 'completed',
    color: 'indigo',
    route: 'practice',
    tags: ['Nét ngang', 'Nét sổ', 'Nét phẩy', 'Nét mác'],
    cardSide: 'left',
    coords: { x: 72, y: 16 }
  },
  {
    id: 'stage-3',
    stageNum: 'Ải 2',
    name: 'Đại Phá Katakana',
    subtitle: 'アイウエオ (Gairaigo từ mượn)',
    description: 'Chinh phục 46 chữ cái Katakana và các từ vay mượn tiếng Anh thường gặp nhất trong đời sống hiện đại Nhật Bản theo lộ trình 6 ngày (Ngày 9-14).',
    type: 'main',
    icon: 'ア',
    xp: 150,
    unlockXp: 0,
    progressPercent: 100,
    stars: 3,
    status: 'completed',
    color: 'cyan',
    route: 'kana',
    tags: ['アイウエオ', 'コーヒー', 'テレビ', 'ホテル'],
    dailyCurriculumDays: [9, 10, 11, 12, 13, 14],
    cardSide: 'right',
    coords: { x: 22, y: 28 }
  },
  {
    id: 'stage-4',
    stageNum: 'Ải 3',
    name: 'Chào Hỏi & Giới Thiệu Bản Thân',
    subtitle: 'はじめまして! Học cúi chào Ojigi & văn hóa xưng hô.',
    description: 'Thành thạo mẫu câu はじめまして, học cúi chào Ojigi theo chuẩn văn hóa Nhật và xưng hô lịch thiệp trong giao tiếp.',
    type: 'main',
    icon: '💬',
    xp: 200,
    unlockXp: 0,
    progressPercent: 50,
    stars: 0,
    status: 'active',
    color: 'rose',
    route: 'practice',
    tags: ['はじめまして', 'どうぞよろしく', 'わたしは...'],
    cardSide: 'left',
    coords: { x: 70, y: 40 }
  },
  {
    id: 'stage-5',
    stageNum: 'Ải 4',
    name: 'Đại Náo Siêu Thị & Số Đếm',
    subtitle: 'いくらですか? Đếm đồ vật & thanh toán...',
    description: 'Quy tắc đếm số, tiền tệ Yên Nhật, lượng từ đếm đồ vật và các mẫu câu mua sắm thực chiến tại siêu thị Konbini.',
    type: 'main',
    icon: '🛒',
    xp: 300,
    unlockXp: 500,
    progressPercent: 0,
    stars: 0,
    status: 'locked',
    color: 'slate',
    route: 'grammar',
    tags: ['いくらですか', 'ひとつ, ふたつ', '1000円'],
    cardSide: 'right',
    coords: { x: 22, y: 53 }
  },
  {
    id: 'stage-6',
    stageNum: 'Ải 5',
    name: 'Bức Tường Trợ Từ N5',
    subtitle: 'は, が, を, に... 40+ mẫu câu Minna',
    description: 'Chinh phục các trợ từ then chốt thường gặp nhất trong đề thi JLPT N5, phân biệt cách dùng は và が chuẩn xác.',
    type: 'main',
    icon: '📖',
    xp: 350,
    unlockXp: 800,
    progressPercent: 0,
    stars: 0,
    status: 'locked',
    color: 'slate',
    route: 'grammar',
    tags: ['は vs が', 'を (Tân ngữ)', 'に (Thời gian)'],
    cardSide: 'left',
    coords: { x: 70, y: 65 }
  },
  {
    id: 'stage-7',
    stageNum: 'Phụ bản 2',
    name: '103 Chữ Hán Cốt Lõi N5',
    subtitle: 'Onyomi, Kunyomi & từ ghép chuẩn',
    description: 'Học bộ 103 chữ Hán N5 qua hình ảnh liên tưởng 3D trực quan, nắm vững âm On, âm Kun và từ ghép thông dụng.',
    type: 'side',
    icon: '字',
    xp: 400,
    unlockXp: 1100,
    progressPercent: 0,
    stars: 0,
    status: 'locked',
    color: 'slate',
    route: 'kanji',
    tags: ['日 月 火 水 木', '金 土 人 学 校'],
    cardSide: 'right',
    coords: { x: 25, y: 77 }
  },
  {
    id: 'stage-8',
    stageNum: 'Boss N5',
    name: 'ĐẠI CHIẾN ĐỀ THI THỬ CHUẨN JLPT N5',
    subtitle: 'Luyện áp lực thời gian thực tế với ngân hàng 1000+ câu hỏi chuẩn đề thi thật.',
    description: 'Thi thử phòng máy chuẩn CBT với áp lực đếm ngược thời gian thực, tự động chấm điểm và chữa bài thi chi tiết.',
    type: 'boss',
    icon: '🏆',
    xp: 500,
    unlockXp: 1500,
    progressPercent: 0,
    stars: 0,
    status: 'locked',
    color: 'amber',
    route: 'exam',
    tags: ['Đề thi N5 Chuẩn', '1000+ Câu hỏi', 'CBT Realtime'],
    cardSide: 'center',
    coords: { x: 48, y: 90 }
  }
];

// Branching constellation paths stemming from Boss N5 into future JLPT ranks
export const CONSTELLATION_BRANCHES = [
  {
    id: 'branch-n4',
    level: 'N4',
    title: 'Sơ Trung Cấp N4',
    subtitle: '300 Kanji • 1500 Từ vựng',
    coords: { x: 88, y: 76 },
    locked: true,
    hint: 'Yêu cầu: Chiến thắng Boss N5'
  },
  {
    id: 'branch-n3',
    level: 'N3',
    title: 'Trung Cấp N3',
    subtitle: '650 Kanji • Cầu nối giao tiếp thực thụ',
    coords: { x: 75, y: 84 },
    locked: true,
    hint: 'Yêu cầu: Hoàn thành chặng N4'
  },
  {
    id: 'branch-n2',
    level: 'N2',
    title: 'Thương Mại & Du Học N2',
    subtitle: '1000 Kanji • Đi làm tại công ty Nhật',
    coords: { x: 88, y: 88 },
    locked: true,
    hint: 'Yêu cầu: Hoàn thành chặng N3'
  },
  {
    id: 'branch-n1',
    level: 'N1',
    title: 'Cao Cấp Thượng Thừa N1',
    subtitle: '2000+ Kanji • Tinh hoa ngôn ngữ',
    coords: { x: 76, y: 94 },
    locked: true,
    hint: 'Yêu cầu: Hoàn thành chặng N2'
  }
];

export const USER_PROFILE_DATA = {
  rank: 'Học Viên Sơ Cấp',
  tier: 'Hạng Đồng',
  track: 'Lộ trình JLPT N5 Toàn Diện',
  currentXp: 540,
  nextTierXp: 500,
  streakDays: 3,
  masteredChars: 8,
  activeStageId: 'stage-4',
  activeStageTurn: 'Lượt 2/4',
  activeStageTitle: 'Chào Hỏi & Giới Thiệu Bản Thân',
  activeStageDesc: 'Thành thạo mẫu câu はじめまして, học cúi chào Ojigi theo chuẩn văn hóa Nhật và xưng hô lịch thiệp.',
  dailyQuests: [
    { id: 'q1', text: 'Đăng nhập học bài', xp: 50, completed: true, statusText: 'Đã nhận thưởng hôm nay' },
    { id: 'q2', text: 'Luyện viết 5 chữ Hán', xp: 100, completed: false, statusText: 'Tiến độ: 3/5 chữ' }
  ]
};
