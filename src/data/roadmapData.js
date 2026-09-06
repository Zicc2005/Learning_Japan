// Data structure for the Gamified Cyber-Japanese RPG Roadmap
import { KANA_DAILY_MAP, KANA_CURRICULUM_METADATA } from './kanaDailyCurriculum';

export { KANA_DAILY_MAP, KANA_CURRICULUM_METADATA };

export const STAGES_DATA = [
  {
    id: 'stage-1',
    stageNum: 'Ải 1',
    name: 'Khai Môn Hiragana',
    subtitle: 'あいうえお • 46 chữ cái nền tảng',
    description: 'Nắm vững toàn bộ 46 chữ cái Hiragana, quy tắc biến âm Dakuon, Handakuon và ảo âm Youon chuẩn Tokyo theo lộ trình 8 ngày chi tiết.',
    type: 'main',
    icon: 'あ',
    xp: 100,
    unlockXp: 0,
    progressPercent: 0,
    stars: 0,
    status: 'active',
    color: 'emerald',
    route: 'kana',
    tags: ['あいうえお', 'かきくけこ', 'さしすせそ', 'Biến âm Dakuon'],
    dailyCurriculumDays: [1, 2, 3, 4, 5, 6, 7, 8],
    cardSide: 'right',
    coords: { x: 22, y: 9 }
  },
  {
    id: 'stage-side-radicals',
    stageNum: 'Phụ bản (Tùy chọn)',
    name: '214 Bộ Thủ & Bút Thuận',
    subtitle: 'Gốc rễ chữ Hán & 8 nét thư pháp cổ',
    description: 'Khám phá 214 Bộ thủ Khang Hy (Nhân, Mộc, Thủy, Hỏa...) & Vĩnh Tự Bát Pháp (8 nét thư pháp cổ). Phụ bản học bổ trợ tùy chọn bất kỳ lúc nào!',
    type: 'side',
    icon: '部',
    xp: 150,
    unlockXp: 0,
    progressPercent: 0,
    stars: 0,
    status: 'unlocked',
    color: 'indigo',
    route: 'practice',
    tags: ['214 Bộ Thủ', 'Vĩnh Tự Bát Pháp', 'Tùy chọn học', 'Bút thuận'],
    cardSide: 'left',
    coords: { x: 72, y: 32 }
  },
  {
    id: 'stage-2',
    stageNum: 'Ải 2',
    name: 'Đại Phá Katakana',
    subtitle: 'アイウエオ (Gairaigo từ mượn)',
    description: 'Chinh phục 46 chữ cái Katakana và các từ vay mượn tiếng Anh thường gặp nhất trong đời sống hiện đại Nhật Bản theo lộ trình 6 ngày (Ngày 9-14).',
    type: 'main',
    icon: 'ア',
    xp: 150,
    unlockXp: 100,
    progressPercent: 0,
    stars: 0,
    status: 'locked',
    color: 'cyan',
    route: 'kana',
    tags: ['アイウエオ', 'コーヒー', 'テレビ', 'ホテル'],
    dailyCurriculumDays: [9, 10, 11, 12, 13, 14],
    cardSide: 'right',
    coords: { x: 22, y: 56 }
  },
  {
    id: 'stage-3',
    stageNum: 'Ải 3',
    name: '103 Chữ Hán Cốt Lõi N5',
    subtitle: 'Hán tự N5 • Âm On, Kun & Nét Bút Thuận',
    description: 'Làm quen và thuần thục trọn bộ 103 chữ Hán N5 nền tảng: Số đếm, ngày tháng, tự nhiên, trường học và đời sống qua hình ảnh trực quan và thư pháp.',
    type: 'boss',
    icon: '漢',
    xp: 250,
    unlockXp: 250,
    progressPercent: 0,
    stars: 0,
    status: 'locked',
    color: 'rose',
    route: 'kanji',
    tags: ['日 月 火 水 木', '金 土 人 学 校', 'Onyomi & Kunyomi', '103 Kanji N5'],
    cardSide: 'center',
    coords: { x: 50, y: 80 }
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
  rank: 'Tân Thủ (Chưa biết chữ)',
  tier: 'Hạng Đồng',
  track: 'Lộ trình JLPT N5 Toàn Diện',
  currentXp: 0,
  nextTierXp: 100,
  streakDays: 1,
  masteredChars: 0,
  activeStageId: 'stage-1',
  activeStageTurn: 'Lộ trình Ngày 1/8',
  activeStageTitle: 'Khai Môn Hiragana',
  activeStageDesc: 'Bắt đầu với 5 nguyên âm あ - い - う - え - お, chuẩn hóa phát âm và nét bút thuận thư pháp.',
  dailyQuests: [
    { id: 'q1', text: 'Học 5 chữ cái Hiragana đầu tiên', xp: 50, completed: false, statusText: 'Tiến độ: 0/5 chữ' },
    { id: 'q2', text: 'Luyện viết 1 nét trên ô Mễ tự', xp: 50, completed: false, statusText: 'Chưa bắt đầu' }
  ]
};
