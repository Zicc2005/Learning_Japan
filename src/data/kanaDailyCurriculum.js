// =========================================================================================
// NIHONLEARN N5 - KANA DAILY CURRICULUM DATA MAP (LỘ TRÌNH 14 NGÀY TINH THÔNG 2 BẢNG CHỮ CÁI)
// Kế hoạch chi tiết theo từng ngày: Số chữ, Luyện nghĩa, Luyện viết, Kiểm tra & Ôn tập ngắt quãng (SRS)
// =========================================================================================

export const KANA_CURRICULUM_METADATA = {
  title: "Lộ Trình Tinh Thông 2 Bảng Chữ Cái Kana Trong 14 Ngày",
  subtitle: "Nền tảng vàng từ con số 0: Hiragana (Ngày 1-8) & Katakana (Ngày 9-14)",
  targetLevel: "N5 Tân Thủ (Zero to Hero)",
  totalDays: 14,
  estimatedMinutesPerDay: "30 - 45 phút",
  stats: {
    totalHiragana: 46,
    totalKatakana: 46,
    totalDakuonHandakuon: 25,
    totalYoon: 33,
    totalVocabApp: 85
  },
  fourStepProtocol: [
    { step: 1, name: "Nhận Diện & Khẩu Hình", desc: "Quan sát mặt chữ, nghe audio Tokyo chuẩn, ghi nhớ mẹo liên tưởng 3D." },
    { step: 2, name: "Luyện Nghĩa Từ Vựng", desc: "Ghép các chữ đã học thành từ vựng thực tế đời sống, hiểu nghĩa và âm Hán-Việt." },
    { step: 3, name: "Bút Thuận & Căn Lề", desc: "Luyện viết chuẩn thư pháp trên ô kẻ Mễ tự (米), chú ý nét móc/dừng/hất, đạt độ chuẩn >= 85%." },
    { step: 4, name: "Khảo Sát & Khóa Bài", desc: "Trắc nghiệm âm thanh phản xạ, ghép từ và viết từ trí nhớ (Blind Canvas) không nhìn mẫu." }
  ]
};

export const KANA_DAILY_MAP = [
  // =========================================================================
  // GIAI ĐOẠN 1: BẢNG CHỮ MỀM HIRAGANA (NGÀY 1 -> NGÀY 8)
  // =========================================================================
  {
    day: 1,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 1: Khai Môn 5 Nguyên Âm Vàng あ・い・う・え・お",
    subtitle: "5 nguyên âm gốc rễ cấu thành toàn bộ ngữ âm tiếng Nhật",
    newCharsCount: 5,
    reviewCharsCount: 0,
    targetChars: ["あ", "い", "う", "え", "お"],
    reviewChars: [],
    characters: [
      {
        char: "あ", romaji: "a", strokeCount: 3,
        rules: ["Nét 1: Ngang ngắn hơi chếch lên từ trái sang phải", "Nét 2: Sổ cong từ trên xuống cắt qua giữa nét 1", "Nét 3: Vòng xoắn tròn lớn sang phải rồi uốn cong xuống dưới"],
        mnemonic: "Quả táo đỏ có cuống lá ở trên, cắn một miếng kêu 'A!' ngon quá.",
        soundGuide: "Mở miệng tự nhiên vừa phải, phát âm tròn và dứt khoát như chữ 'a' trong tiếng Việt."
      },
      {
        char: "い", romaji: "i", strokeCount: 2,
        rules: ["Nét 1: Nét cong bên trái kéo từ trên xuống rồi hất nhẹ lên trên", "Nét 2: Nét ngắn hơn ở bên phải hơi uốn cong hướng vào nét 1"],
        mnemonic: "Hai con lươn (Eels) bơi song song hoặc hai thanh kiếm katana sắc bén.",
        soundGuide: "Kéo nhẹ khóe môi sang hai bên, phát âm ngắn gọn như 'i' trong 'chim non'."
      },
      {
        char: "う", romaji: "u", strokeCount: 2,
        rules: ["Nét 1: Nét chấm phẩy xiên chéo ở trên", "Nét 2: Nét cong lớn uốn lượn hình chữ C ngược"],
        mnemonic: "Một người đau lưng mang vác nặng cúi gập người xuống rên 'U... mệt quá!'.",
        soundGuide: "Môi hơi khép, không chu môi như 'u' tiếng Việt mà nằm giữa 'u' và 'ư'."
      },
      {
        char: "え", romaji: "e", strokeCount: 2,
        rules: ["Nét 1: Nét chấm phẩy nhỏ ở trên đỉnh", "Nét 2: Zíc-zắc ngang ngắn, chéo xuống trái rồi lượn sóng sang phải giống số 5"],
        mnemonic: "Một chú chim bồ câu bay vút lên trời hoặc vận động viên Energetic đang chạy.",
        soundGuide: "Khẩu hình giống âm 'ê' nhưng hơi ngả sang 'e', dứt khoát."
      },
      {
        char: "お", romaji: "o", strokeCount: 3,
        rules: ["Nét 1: Nét ngang ngắn", "Nét 2: Sổ thẳng xuống rồi uốn xoắn tròn lớn sang phải", "Nét 3: Nét chấm nhỏ ở góc trên bên phải"],
        mnemonic: "Vận động viên đánh golf vung gậy đưa bóng vào lỗ reo lên 'Oh!' tuyệt đẹp.",
        soundGuide: "Khẩu hình tròn môi, phát âm trầm ấm như 'ô'."
      }
    ],
    vocabularyPractice: [
      { word: "あい", romaji: "ai", hanviet: "Ái", meaning: "Tình yêu", components: ["あ", "い"], example: "あい が あります。", exampleMeaning: "Có tình yêu thương." },
      { word: "いえ", romaji: "ie", hanviet: "Gia", meaning: "Ngôi nhà", components: ["い", "え"], example: "これ は わたし の いえ です。", exampleMeaning: "Đây là ngôi nhà của tôi." },
      { word: "うえ", romaji: "ue", hanviet: "Thượng", meaning: "Phía trên", components: ["う", "え"], example: "テーブル の うえ。", exampleMeaning: "Ở phía trên bàn." },
      { word: "あお", romaji: "ao", hanviet: "Thanh", meaning: "Màu xanh da trời", components: ["あ", "お"], example: "あおぞら。", exampleMeaning: "Bầu trời xanh ngắt." },
      { word: "いい", romaji: "ii", hanviet: "Giai", meaning: "Tốt / Được", components: ["い", "い"], example: "てんき が いい です。", exampleMeaning: "Thời tiết rất đẹp." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Nét 1 của あ nằm ở nửa trên ô kẻ, nét sổ 2 phải hơi cong sang trái trước khi xuống.",
        "Phân biệt rõ ràng giữa あ (bụng tròn xoắn) và お (bụng mở có nét chấm số 3 bên phải).",
        "Chữ い nét 1 có điểm hất nhẹ (Hane), nét 2 không được chạm vào nét 1."
      ],
      requiredWritesPerChar: 5,
      minAccuracy: 85,
      commonMistakes: "Viết あ nét 3 quá nhỏ khiến chữ méo; quên nét chấm của chữ お."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 5,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Nghe âm thanh và chọn chữ Hiragana tương ứng: âm [a]", options: ["あ", "お", "う", "え"], answer: 0, explain: "あ là nguyên âm 'a'." },
        { q: "Từ vựng 'いえ' mang ý nghĩa là gì?", options: ["Ngôi nhà", "Tình yêu", "Con chó", "Nhà ga"], answer: 0, explain: "いえ (Gia) có nghĩa là ngôi nhà." },
        { q: "Chữ cái nào sau đây có 3 nét và có một nét chấm ở góc trên bên phải?", options: ["お", "あ", "え", "い"], answer: 0, explain: "Chữ お gồm 3 nét với nét chấm số 3 góc phải." }
      ]
    },
    srsPlan: { nextReviewDays: [2, 4, 7], charsToReview: ["あ", "い", "う", "え", "お"] },
    shibaMessage: "Gauf! 5 nguyên âm A-I-U-E-O là chìa khóa mở cánh cổng tiếng Nhật. Luyện viết đủ 5 lần mỗi chữ để tay quen nét nha!",
    xpReward: 100
  },

  {
    day: 2,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 2: Hàng Ka か・き・く・け・こ + Ôn Tập Hàng A",
    subtitle: "Ghép phụ âm K với 5 nguyên âm & thực chiến từ vựng 2 âm tiết",
    newCharsCount: 5,
    reviewCharsCount: 5,
    targetChars: ["か", "き", "く", "け", "こ"],
    reviewChars: ["あ", "い", "う", "え", "お"],
    characters: [
      {
        char: "か", romaji: "ka", strokeCount: 3,
        rules: ["Nét 1: Ngang gập móc xuống", "Nét 2: Sổ cong cắt nét 1", "Nét 3: Nét chấm góc trên bên phải"],
        mnemonic: "Người đang giơ tay đẩy chiếc xe cút kít (Ka) nặng trịch.",
        soundGuide: "Phát âm bật hơi nhẹ 'k-a'."
      },
      {
        char: "き", romaji: "ki", strokeCount: 4,
        rules: ["Nét 1 & 2: Hai nét ngang song song ngắn", "Nét 3: Nét sổ chéo cắt qua 2 nét ngang rồi hất nhẹ", "Nét 4: Nét cong bên dưới đối xứng"],
        mnemonic: "Chiếc chìa khóa Key mở hòm kho báu.",
        soundGuide: "Phát âm 'k-i'."
      },
      {
        char: "く", romaji: "ku", strokeCount: 1,
        rules: ["1 nét duy nhất: Nét chéo xuống trái rồi gập góc nhọn sang phải"],
        mnemonic: "Chiếc mỏ chim Cuckoo đang mở to kêu 'Cúc cu'.",
        soundGuide: "Phát âm 'k-u' ngắn gọn."
      },
      {
        char: "け", romaji: "ke", strokeCount: 3,
        rules: ["Nét 1: Sổ hơi cong có móc nhẹ", "Nét 2: Ngang ngắn bên phải", "Nét 3: Sổ cong vuốt nhẹ xuống"],
        mnemonic: "Thùng bia Kég đặt cạnh bức tường gỗ.",
        soundGuide: "Phát âm 'k-e'."
      },
      {
        char: "こ", romaji: "ko", strokeCount: 2,
        rules: ["Nét 1: Ngang trên uốn móc nhẹ", "Nét 2: Ngang cong dưới nâng đỡ nét 1"],
        mnemonic: "Hai con giun đất ôm lấy nhau hoặc nụ cười em bé Con nít.",
        soundGuide: "Phát âm 'k-o'."
      }
    ],
    vocabularyPractice: [
      { word: "えき", romaji: "eki", hanviet: "Dịch", meaning: "Nhà ga", components: ["え", "き"], example: "とうきょう えき。", exampleMeaning: "Nhà ga Tokyo." },
      { word: "あき", romaji: "aki", hanviet: "Thu", meaning: "Mùa thu", components: ["あ", "き"], example: "あき が すき です。", exampleMeaning: "Tôi thích mùa thu." },
      { word: "かさ", romaji: "kasa", hanviet: "Tán", meaning: "Cây dù / Cái ô", components: ["か"], example: "かさ を さします。", exampleMeaning: "Bung chiếc ô che mưa." },
      { word: "こい", romaji: "koi", hanviet: "Luyến", meaning: "Tình yêu / Cá chép", components: ["こ", "い"], example: "こいびと。", exampleMeaning: "Người yêu." },
      { word: "きく", romaji: "kiku", hanviet: "Văn", meaning: "Nghe / Hoa cúc", components: ["き", "く"], example: "おんがく を ききます。", exampleMeaning: "Nghe âm nhạc." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Chữ き trong font in có thể dính nét 3 và 4, nhưng khi viết tay BẮT BUỘC nét 3 hất lên và nét 4 tách rời bên dưới!",
        "Chữ く góc gập nhọn khoảng 70-80 độ, đối xứng đều giữa trên và dưới.",
        "Chữ こ hai nét song song nằm gọn trong phần giữa ô kẻ."
      ],
      requiredWritesPerChar: 5,
      minAccuracy: 85,
      commonMistakes: "Viết き liền nét giống chữ in máy tính; viết く góc tù quá bè ngang."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 6,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Từ vựng 'えき' ghép từ nguyên âm nào và có nghĩa là gì?", options: ["Ghép từ え và き: Nhà ga", "Ghép từ あ và き: Mùa thu", "Ghép từ い và え: Ngôi nhà", "Ghép từ お và き: Lớn"], answer: 0, explain: "え (e) + き (ki) = えき (Nhà ga tàu điện)." },
        { q: "Chữ cái chỉ gồm 1 nét duy nhất gập góc nhọn là chữ nào?", options: ["く", "こ", "い", "へ"], answer: 0, explain: "く (ku) là chữ đơn giản chỉ có 1 nét gập." }
      ]
    },
    srsPlan: { nextReviewDays: [3, 5, 8], charsToReview: ["か", "き", "く", "け", "こ", "あ", "え"] },
    shibaMessage: "Xuất sắc! Hôm nay ghép được từ 'えき' (nhà ga) rồi đó. Hãy nhớ nét 3 và 4 của chữ き phải rời nhau khi viết tay nhé!",
    xpReward: 120
  },

  {
    day: 3,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 3: Hàng Sa さ・し・す・せ・そ + Tích Lũy 15 Chữ Đầu",
    subtitle: "Phân biệt cặp chữ dễ nhầm & mở rộng vốn từ đời sống Nhật Bản",
    newCharsCount: 5,
    reviewCharsCount: 10,
    targetChars: ["さ", "し", "す", "せ", "そ"],
    reviewChars: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"],
    characters: [
      {
        char: "さ", romaji: "sa", strokeCount: 3,
        rules: ["Nét 1: Ngang hơi chếch lên", "Nét 2: Sổ chéo cắt nét 1 rồi hất nhẹ sang trái", "Nét 3: Nét cong đối xứng bên dưới tách rời"],
        mnemonic: "Một dĩa Sasimi tươi ngon hoặc người đang nhảy Salsa.",
        soundGuide: "Phát âm 's-a'."
      },
      {
        char: "し", romaji: "shi", strokeCount: 1,
        rules: ["1 nét duy nhất: Kéo thẳng từ trên xuống rồi uốn cong móc lên sang phải như lưỡi câu"],
        mnemonic: "Chiếc lưỡi câu cá She (cô ấy) thả xuống biển.",
        soundGuide: "Âm 'shi' nhẹ nhàng, không uốn lưỡi quá gắt như 's' tiếng Việt."
      },
      {
        char: "す", romaji: "su", strokeCount: 2,
        rules: ["Nét 1: Ngang dài vừa phải", "Nét 2: Sổ thẳng xuống, giữa chừng thắt nút xoay vòng tròn sang trái rồi vuốt đuôi thẳng xuống"],
        mnemonic: "Người đu dây nhào lộn làm vòng thắt nút Siêu đẳng (Super).",
        soundGuide: "Phát âm 's-u' mỏng và khẽ."
      },
      {
        char: "せ", romaji: "se", strokeCount: 3,
        rules: ["Nét 1: Ngang dài", "Nét 2: Sổ đứng bên phải uốn gập sang trái", "Nét 3: Sổ đứng bên trái thẳng xuống"],
        mnemonic: "Vận động viên đứng ở vị trí số 1 trong lễ trao giải Thế giới (Sekai).",
        soundGuide: "Phát âm 's-e'."
      },
      {
        char: "そ", romaji: "so", strokeCount: 1,
        rules: ["1 nét liền: Ngang ngắn -> chéo xuống trái -> ngang ngắn sang phải -> uốn cong hình chữ C"],
        mnemonic: "Đường may mũi chỉ zíc zắc của thợ May vá (Sew).",
        soundGuide: "Phát âm 's-o'."
      }
    ],
    vocabularyPractice: [
      { word: "すし", romaji: "sushi", hanviet: "Thọ ti", meaning: "Món Sushi Nhật Bản", components: ["す", "し"], example: "すし を たべます。", exampleMeaning: "Ăn món sushi." },
      { word: "さかな", romaji: "sakana", hanviet: "Ngư", meaning: "Con cá", components: ["さ", "か"], example: "おおきい さかな。", exampleMeaning: "Con cá lớn." },
      { word: "せかい", romaji: "sekai", hanviet: "Thế giới", meaning: "Thế giới", components: ["せ", "か", "い"], example: "ひろい せかい。", exampleMeaning: "Thế giới rộng lớn." },
      { word: "あさ", romaji: "asa", hanviet: "Triêu", meaning: "Buổi sáng", components: ["あ", "さ"], example: "あさごはん。", exampleMeaning: "Bữa sáng." },
      { word: "おそい", romaji: "osoi", hanviet: "Trì", meaning: "Chậm chạp / Muộn", components: ["お", "そ", "い"], example: "じかん が おそい。", exampleMeaning: "Thời gian đã muộn." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BẪY KINH ĐIỂN: Chữ さ (Sa) có 1 nét ngang, chữ き (Ki) có 2 nét ngang! Tuyệt đối không nhầm.",
        "Chữ す vòng tròn thắt nút phải tròn đều, nằm ngay tâm giữa của ô chữ.",
        "Chữ そ là nét liền mạch duy nhất, không nhấc bút giữa chừng."
      ],
      requiredWritesPerChar: 5,
      minAccuracy: 85,
      commonMistakes: "Nhầm さ với き; viết chữ そ thành 2 nét rời rạc."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 6,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Phân biệt: Chữ nào có 1 nét ngang và nét móc cong bên dưới?", options: ["さ", "き", "ち", "ま"], answer: 0, explain: "さ chỉ có 1 nét ngang (khác き có 2 nét ngang)." },
        { q: "Món ăn quốc dân Nhật Bản viết bằng 2 chữ Hiragana là gì?", options: ["すし (sushi)", "さけ (sake)", "そば (soba)", "すき (suki)"], answer: 0, explain: "すし gồm chữ す (su) và し (shi)." }
      ]
    },
    srsPlan: { nextReviewDays: [4, 6, 9], charsToReview: ["さ", "し", "す", "せ", "そ", "き", "か"] },
    shibaMessage: "Nhìn kĩ nha: Chữ さ có 1 gạch, chữ き có 2 gạch! Nhớ mẹo này là không bao giờ bị trừ điểm thi đâu đó!",
    xpReward: 120
  },

  {
    day: 4,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 4: Hàng Ta た・ち・つ・て・と + Quy Tắc Âm Nhỏ Tsu",
    subtitle: "Chinh phục 5 chữ hàng T và hiện tượng âm ngắt (Sokuon) then chốt",
    newCharsCount: 5,
    reviewCharsCount: 15,
    targetChars: ["た", "ち", "つ", "て", "と"],
    reviewChars: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ"],
    characters: [
      {
        char: "た", romaji: "ta", strokeCount: 4,
        rules: ["Nét 1: Ngang ngắn", "Nét 2: Sổ chéo từ trái sang", "Nét 3 & 4: Hai nét như chữ こ thu nhỏ bên phải"],
        mnemonic: "Chữ nhìn giống chữ 'ta' trong bảng chữ cái Latinh.",
        soundGuide: "Phát âm 't-a'."
      },
      {
        char: "ち", romaji: "chi", strokeCount: 2,
        rules: ["Nét 1: Ngang hơi chếch", "Nét 2: Sổ đứng rồi uốn cong bụng tròn lớn sang phải giống số 5"],
        mnemonic: "Cô gái cổ vũ Cheerleader hoặc người hắt xì 'Hắt-xì' (Chi).",
        soundGuide: "Phát âm 'ch-i' (không đọc là ti)."
      },
      {
        char: "つ", romaji: "tsu", strokeCount: 1,
        rules: ["1 nét duy nhất: Cong vồng từ trái lên trên đỉnh rồi uốn vòng xuống phải như ngọn sóng thần"],
        mnemonic: "Ngọn sóng thần Tsunami khổng lồ dâng trào.",
        soundGuide: "Khép răng, đẩy hơi đầu lưỡi bật ra 'ts-u'."
      },
      {
        char: "て", romaji: "te", strokeCount: 1,
        rules: ["1 nét: Ngang rồi uốn cong hình chữ C ngửa bụng"],
        mnemonic: "Cánh bàn tay người uốn cong (Te = Bàn tay trong tiếng Nhật).",
        soundGuide: "Phát âm 't-e'."
      },
      {
        char: "と", romaji: "to", strokeCount: 2,
        rules: ["Nét 1: Sổ chéo ngắn từ trên xuống phải", "Nét 2: Cong chữ C lớn đón nét 1"],
        mnemonic: "Bàn chân bị dẫm phải cây đinh đau nhói ở Ngón chân (Toe).",
        soundGuide: "Phát âm 't-o'."
      }
    ],
    vocabularyPractice: [
      { word: "て", romaji: "te", hanviet: "Thủ", meaning: "Bàn tay", components: ["て"], example: "て を あらいます。", exampleMeaning: "Rửa sạch bàn tay." },
      { word: "つき", romaji: "tsuki", hanviet: "Nguyệt", meaning: "Mặt trăng / Tháng", components: ["つ", "き"], example: "きれい な つき。", exampleMeaning: "Mặt trăng thật đẹp." },
      { word: "ちち", romaji: "chichi", hanviet: "Phụ", meaning: "Bố (của mình)", components: ["ち", "ち"], example: "わたし の ちち。", exampleMeaning: "Bố của tôi." },
      { word: "うた", romaji: "uta", hanviet: "Ca", meaning: "Bài hát", components: ["う", "た"], example: "うた を うたいます。", exampleMeaning: "Hát một bài hát." },
      { word: "とけい", romaji: "tokei", hanviet: "Thời kế", meaning: "Đồng hồ", components: ["と", "け", "い"], example: "あたらしい とけい。", exampleMeaning: "Chiếc đồng hồ mới." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BẪY KINH ĐIỂN: Chữ ち (Chi) có bụng quay sang PHẢI, khác chữ さ (Sa) nét cong quay sang TRÁI!",
        "Chữ つ khi viết bình thường kích thước bằng ô chữ; khi làm âm ngắt (っ) kích thước chỉ bằng 1/4 nằm lệch góc dưới bên trái.",
        "Chữ て nét ngang trên phải thẳng, góc uốn cong dưới mềm mại."
      ],
      requiredWritesPerChar: 5,
      minAccuracy: 85,
      commonMistakes: "Viết ngược bụng chữ ち sang hướng chữ さ."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 6,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Âm đọc chuẩn của chữ 'ち' là gì?", options: ["chi", "ti", "shi", "tsu"], answer: 0, explain: "Hàng T biến âm đặc biệt: た (ta), ち (chi), つ (tsu), て (te), と (to)." },
        { q: "Từ vựng 'つき' (tsuki) có nghĩa là gì?", options: ["Mặt trăng", "Bàn tay", "Con cá", "Quả trứng"], answer: 0, explain: "つき (Nguyệt) có nghĩa là Mặt trăng." }
      ]
    },
    srsPlan: { nextReviewDays: [5, 7, 10], charsToReview: ["た", "ち", "つ", "て", "と", "さ", "す"] },
    shibaMessage: "Chú ý hàng Ta có 2 chữ đọc đặc biệt nha: Chi và Tsu (chứ không phải Ti, Tu)! Luyện phát âm nghe chuẩn người bản xứ nhé!",
    xpReward: 130
  },

  {
    day: 5,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 5: Hàng Na な・に・ぬ・ね・の & Hàng Ha は・ひ・ふ・へ・ほ",
    subtitle: "10 chữ cái quan trọng - Phân biệt nút thắt xoắn và âm 'Fu' Tokyo",
    newCharsCount: 10,
    reviewCharsCount: 20,
    targetChars: ["な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ"],
    reviewChars: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と"],
    characters: [
      { char: "な", romaji: "na", strokeCount: 4, rules: ["Nét ngang -> sổ chéo -> phẩy trên -> thắt nút dưới"], mnemonic: "Bà xơ Nuns quỳ cầu nguyện.", soundGuide: "Phát âm 'n-a'." },
      { char: "に", romaji: "ni", strokeCount: 3, rules: ["Sổ đứng trái -> hai nét ngang phải như chữ こ"], mnemonic: "Kim chỉ may Needle khâu vá.", soundGuide: "Phát âm 'n-i'." },
      { char: "ぬ", romaji: "nu", strokeCount: 2, rules: ["Sổ cong trái -> nét lượn sóng cuộn vòng thắt nút ở đuôi"], mnemonic: "Sợi mì Noodles xoắn tròn ngon lành.", soundGuide: "Phát âm 'n-u'." },
      { char: "ね", romaji: "ne", strokeCount: 2, rules: ["Sổ thẳng trái -> nét zíc-zắc như chữ れ có thắt nút đuôi"], mnemonic: "Chú mèo Neko đuôi xoắn tròn.", soundGuide: "Phát âm 'n-e'." },
      { char: "の", romaji: "no", strokeCount: 1, rules: ["1 nét: Chéo từ tâm rồi xoay vòng tròn lớn bao quanh"], mnemonic: "Biển cấm tròn No Smoking.", soundGuide: "Phát âm 'n-o'." },
      { char: "は", romaji: "ha", strokeCount: 3, rules: ["Sổ đứng trái -> ngang trên phải -> sổ thắt nút tròn"], mnemonic: "Chữ cái Ha-Ha tiếng cười vui nhộn.", soundGuide: "Phát âm 'h-a' (khi làm trợ từ đọc là 'wa')." },
      { char: "ひ", romaji: "hi", strokeCount: 1, rules: ["1 nét: Ngang ngắn -> hõm sâu xuống -> ngoặc lên phải"], mnemonic: "Khuôn mặt cười híp mắt He-He.", soundGuide: "Phát âm 'h-i'." },
      { char: "ふ", romaji: "fu", strokeCount: 4, rules: ["Chấm trên -> nét cong ở giữa -> phẩy trái -> phẩy phải"], mnemonic: "Ngọn núi Phú Sĩ (Fuji) tuyết phủ.", soundGuide: "Môi khép nhẹ thổi hơi ra giữa 'h' và 'ph'." },
      { char: "へ", romaji: "he", strokeCount: 1, rules: ["1 nét: Lên dốc ngắn -> xuống dốc dài như mái nhà"], mnemonic: "Ngọn đồi Hill nhô cao.", soundGuide: "Phát âm 'h-e' (khi làm trợ từ hướng đi đọc là 'e')." },
      { char: "ほ", romaji: "ho", strokeCount: 4, rules: ["Sổ trái -> ngang trên -> ngang dưới -> sổ thắt nút"], mnemonic: "Người đội mũ Hot đứng gác.", soundGuide: "Phát âm 'h-o'." }
    ],
    vocabularyPractice: [
      { word: "いぬ", romaji: "inu", hanviet: "Khuyển", meaning: "Con chó", components: ["い", "ぬ"], example: "かわいい いぬ。", exampleMeaning: "Chú chó đáng yêu." },
      { word: "ねこ", romaji: "neko", hanviet: "Miêu", meaning: "Con mèo", components: ["ね", "こ"], example: "くろい ねこ。", exampleMeaning: "Con mèo đen." },
      { word: "はな", romaji: "hana", hanviet: "Hoa / Tị", meaning: "Bông hoa / Cái mũi", components: ["は", "な"], example: "きれい な はな。", exampleMeaning: "Bông hoa xinh xắn." },
      { word: "ひと", romaji: "hito", hanviet: "Nhân", meaning: "Con người", components: ["ひ", "と"], example: "あの ひと。", exampleMeaning: "Người kia." },
      { word: "ほし", romaji: "hoshi", hanviet: "Tinh", meaning: "Ngôi sao", components: ["ほ", "し"], example: "よる の ほし。", exampleMeaning: "Ngôi sao đêm." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BẪY KINH ĐIỂN 1: Chữ は (Ha) nét sổ KHÔNG thò lên trên nét ngang; Chữ ほ (Ho) có thêm nét ngang trên che đầu!",
        "BẪY KINH ĐIỂN 2: Chữ ぬ (Nu) và ね (Ne) đều có vòng thắt nút xoắn ở đuôi, cẩn thận không bỏ quên!",
        "Chữ ふ (Fu) có 4 nét riêng biệt cân đối 2 bên."
      ],
      requiredWritesPerChar: 4,
      minAccuracy: 85,
      commonMistakes: "Viết は bị thò đầu như ま; quên nét ngang trên cùng của chữ ほ."
    },
    testingProtocol: {
      step1AudioQuizCount: 12,
      step2MeaningMatchCount: 6,
      step3BlindCanvasWrites: 8,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Chữ cái nào có nét ngang che trên đầu nét sổ thắt nút?", options: ["ほ (ho)", "は (ha)", "ま (ma)", "よ (yo)"], answer: 0, explain: "ほ có nét ngang trên che đầu nét sổ, khác は đầu nét sổ trần." },
        { q: "Cặp từ 'con chó' và 'con mèo' trong tiếng Nhật viết là gì?", options: ["いぬ và ねこ", "ねこ và とり", "うま và いぬ", "さかな và むし"], answer: 0, explain: "いぬ (inu - con chó) và ねこ (neko - con mèo)." }
      ]
    },
    srsPlan: { nextReviewDays: [6, 8, 11], charsToReview: ["は", "ほ", "ぬ", "ね", "い", "こ"] },
    shibaMessage: "Gauf! Tớ là Shiba Inu (いぬ) nè! Nhớ phân biệt chữ は và ほ thật kĩ, chỉ khác nhau đúng cái mũ trên đầu thôi đó!",
    xpReward: 150
  },

  {
    day: 6,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 6: Hàng Ma ま・み・む・め・も & Hàng Ya や・ゆ・よ",
    subtitle: "8 chữ cái thanh âm êm dịu & cách ghép âm Ya-Yu-Yo tiền đề cho Ảo âm",
    newCharsCount: 8,
    reviewCharsCount: 30,
    targetChars: ["ま", "み", "む", "め", "も", "や", "ゆ", "よ"],
    reviewChars: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ"],
    characters: [
      { char: "ま", romaji: "ma", strokeCount: 3, rules: ["Hai nét ngang song song -> nét sổ đâm xuyên qua 2 nét ngang rồi thắt nút"], mnemonic: "Mặt nạ Mask hóa trang.", soundGuide: "Phát âm 'm-a'." },
      { char: "み", romaji: "mi", strokeCount: 2, rules: ["Nét zíc-zắc thắt nút kéo sang phải -> nét phẩy chéo cắt qua đuôi"], mnemonic: "Nốt nhạc Mi thứ êm dịu hoặc tuổi 21 (Mi).", soundGuide: "Phát âm 'm-i'." },
      { char: "む", romaji: "mu", strokeCount: 3, rules: ["Ngang ngắn -> sổ thắt nút tròn uốn hất lên -> nét chấm phải"], mnemonic: "Chú bò kêu 'Moooo' (Mu).", soundGuide: "Phát âm 'm-u'." },
      { char: "め", romaji: "me", strokeCount: 2, rules: ["Nét chéo trái -> nét cong vòm bao quanh KHÔNG thắt nút"], mnemonic: "Đôi mắt Me nhắm nghiền mệt mỏi.", soundGuide: "Phát âm 'm-e'." },
      { char: "も", romaji: "mo", strokeCount: 3, rules: ["Nét sổ cong móc như chữ し -> hai nét ngang cắt qua"], mnemonic: "Lưỡi câu cá More bắt được nhiều cá hơn.", soundGuide: "Phát âm 'm-o'." },
      { char: "や", romaji: "ya", strokeCount: 3, rules: ["Nét cong móc bên trái -> nét chấm trên -> nét sổ chéo cắt qua"], mnemonic: "Du thuyền Yacht lướt sóng.", soundGuide: "Phát âm 'y-a'." },
      { char: "ゆ", romaji: "yu", strokeCount: 2, rules: ["Nét vòng số 1 uốn lượn -> nét sổ cong cắt dọc qua"], mnemonic: "Con cá bơi lội hoặc bồn tắm nước nóng Onsen (Yu).", soundGuide: "Phát âm 'y-u'." },
      { char: "よ", romaji: "yo", strokeCount: 2, rules: ["Nét ngang ngắn trên -> nét sổ thắt nút tròn bên phải"], mnemonic: "Đồ chơi Yo-Yo xoay tít.", soundGuide: "Phát âm 'y-o'." }
    ],
    vocabularyPractice: [
      { word: "やま", romaji: "yama", hanviet: "Sơn", meaning: "Ngọn núi", components: ["や", "ま"], example: "ふじさん は やま です。", exampleMeaning: "Núi Phú Sĩ là một ngọn núi." },
      { word: "ゆき", romaji: "yuki", hanviet: "Tuyết", meaning: "Băng tuyết", components: ["ゆ", "き"], example: "しろい ゆき。", exampleMeaning: "Tuyết trắng muốt." },
      { word: "よる", romaji: "yoru", hanviet: "Dạ", meaning: "Ban đêm", components: ["よ"], example: "しずか な よる。", exampleMeaning: "Đêm thanh vắng." },
      { word: "みず", romaji: "mizu", hanviet: "Thủy", meaning: "Nước uống", components: ["み"], example: "つめたい みず。", exampleMeaning: "Nước mát lạnh." },
      { word: "あめ", romaji: "ame", hanviet: "Vũ / Đường", meaning: "Cơn mưa / Kẹo ngọt", components: ["あ", "め"], example: "あめ が ふります。", exampleMeaning: "Trời đổ cơn mưa." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BẪY CỰC NGUY HIỂM: Chữ ま (Ma) nét sổ thò đầu lên trên nét ngang thứ 1 (khác は chỉ có 1 nét ngang và không đâm xuyên).",
        "BẪY CỰC NGUY HIỂM: Chữ め (Me) giống chữ ぬ (Nu) NHƯNG ở đuôi KHÔNG CÓ thắt nút xoắn!",
        "Chữ も viết nét móc chính trước, hai nét ngang thêm vào sau cùng."
      ],
      requiredWritesPerChar: 4,
      minAccuracy: 85,
      commonMistakes: "Viết chữ め thành có xoắn nút đuôi như ぬ; nhầm ま với ほ."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 6,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Điểm khác biệt duy nhất giữa chữ 'め' (me) và chữ 'ぬ' (nu) là gì?", options: ["Chữ め không có vòng xoắn thắt nút ở đuôi", "Chữ め có 3 nét", "Chữ め nét sổ quay sang trái", "Không khác gì nhau"], answer: 0, explain: "め không có vòng xoắn đuôi, ぬ có vòng xoắn đuôi." },
        { q: "Từ vựng 'ngọn núi' trong tiếng Nhật ghép từ 2 chữ cái nào?", options: ["や (ya) + ま (ma)", "ゆ (yu) + き (ki)", "あ (a) + め (me)", "は (ha) + な (na)"], answer: 0, explain: "やま (Sơn) có nghĩa là ngọn núi." }
      ]
    },
    srsPlan: { nextReviewDays: [7, 9, 12], charsToReview: ["ま", "め", "ぬ", "や", "ゆ", "よ"] },
    shibaMessage: "Chỉ còn một chút nữa là hoàn thành bảng Hiragana rồi! Nhớ め là mắt không đuôi, ぬ là mì xoắn có đuôi nhé!",
    xpReward: 140
  },

  {
    day: 7,
    phase: "hiragana",
    stageId: "stage-1",
    title: "Ngày 7: Hàng Ra ら・り・る・れ・ろ + Hàng Wa/N わ・を・ん",
    subtitle: "Cán đích trọn vẹn 46 chữ cái cơ bản & chuẩn hóa âm mũi 'N'",
    newCharsCount: 8,
    reviewCharsCount: 38,
    targetChars: ["ら", "り", "る", "れ", "ろ", "わ", "を", "ん"],
    reviewChars: ["ま", "み", "む", "め", "も", "や", "ゆ", "よ", "は", "ひ", "ふ", "へ", "ほ"],
    characters: [
      { char: "ら", romaji: "ra", strokeCount: 2, rules: ["Nét chấm trên -> nét cong uốn lượn dưới"], mnemonic: "Chú lạc đà Rắn rỏi có cái bướu.", soundGuide: "Đầu lưỡi chạm nướu trên nhẹ, nằm giữa 'r' và 'l'." },
      { char: "り", romaji: "ri", strokeCount: 2, rules: ["Nét sổ ngắn trái có móc -> nét sổ cong dài phải"], mnemonic: "Dải ruy-băng Ribbon thướt tha.", soundGuide: "Phát âm 'r-i'." },
      { char: "る", romaji: "ru", strokeCount: 1, rules: ["1 nét: Ngang -> chéo trái -> uốn tròn có thắt nút tròn ở đáy"], mnemonic: "Viên đá Ruby tròn xoe ở đuôi.", soundGuide: "Phát âm 'r-u'." },
      { char: "れ", romaji: "re", strokeCount: 2, rules: ["Sổ thẳng trái -> zíc-zắc uốn cong hất đuôi nhọn ra ngoài"], mnemonic: "Vận động viên nhảy Rào (Relay) đá chân cao.", soundGuide: "Phát âm 'r-e'." },
      { char: "ろ", romaji: "ro", strokeCount: 1, rules: ["1 nét: Giống hệt chữ る nhưng KHÔNG CÓ thắt nút ở đáy"], mnemonic: "Tên cướp Robber ăn trộm mất viên ngọc của chữ る.", soundGuide: "Phát âm 'r-o'." },
      { char: "わ", romaji: "wa", strokeCount: 2, rules: ["Sổ thẳng trái -> nét cong tròn lớn uốn vào trong"], mnemonic: "Thiên nga trắng uốn cổ tạo hình chữ Wa.", soundGuide: "Phát âm 'w-a'." },
      { char: "を", romaji: "wo", strokeCount: 3, rules: ["Ngang ngắn -> sổ chéo gập chữ C -> nét cong móc dưới"], mnemonic: "Vận động viên ném đĩa reo lên 'Woah!'.", soundGuide: "Phát âm là 'o', CHUYÊN DÙNG LÀM TRỢ TỪ chỉ tân ngữ." },
      { char: "ん", romaji: "n", strokeCount: 1, rules: ["1 nét: Kéo thẳng xuống -> lượn sóng chữ h như chữ 'n' viết thường"], mnemonic: "Chữ 'n' trong bảng chữ cái Latinh.", soundGuide: "Âm mũi khép vòm họng, phát âm 'n/m/ng'." }
    ],
    vocabularyPractice: [
      { word: "さくら", romaji: "sakura", hanviet: "Anh", meaning: "Hoa anh đào", components: ["さ", "く", "ら"], example: "きれい な さくら。", exampleMeaning: "Hoa anh đào rực rỡ." },
      { word: "くるま", romaji: "kuruma", hanviet: "Xa", meaning: "Xe hơi / Ô tô", components: ["く", "る", "ま"], example: "あたらしい くるま。", exampleMeaning: "Chiếc xe ô tô mới." },
      { word: "わたし", romaji: "watashi", hanviet: "Tư", meaning: "Tôi (đại từ nhân xưng)", components: ["わ", "た", "し"], example: "わたし は がくせい です。", exampleMeaning: "Tôi là học sinh." },
      { word: "ほん", romaji: "hon", hanviet: "Bản", meaning: "Quyển sách", components: ["ほ", "ん"], example: "にほんご の ほん。", exampleMeaning: "Sách tiếng Nhật." },
      { word: "にほん", romaji: "nihon", hanviet: "Nhật Bản", meaning: "Đất nước Nhật Bản", components: ["に", "ほ", "ん"], example: "にほん へ いきます。", exampleMeaning: "Đi đến Nhật Bản." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BẪY KINH ĐIỂN 1: Chữ る (Ru) có vòng thắt nút tròn ở đáy; Chữ ろ (Ro) trơn láng KHÔNG CÓ nút!",
        "BẪY KINH ĐIỂN 2: Bộ ba tam sên `わ` (bụng cong tròn vào trong), `れ` (đuôi hất nhọn ra ngoài), `ね` (đuôi thắt nút tròn). Nhìn kĩ nét đuôi!",
        "Chữ を (Wo) luôn là trợ từ trong câu (VD: ごはん を たべます - Ăn cơm)."
      ],
      requiredWritesPerChar: 4,
      minAccuracy: 85,
      commonMistakes: "Viết lộn る và ろ; nhầm lẫn giữa わ, れ, ね."
    },
    testingProtocol: {
      step1AudioQuizCount: 12,
      step2MeaningMatchCount: 6,
      step3BlindCanvasWrites: 8,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Chữ cái nào sau đây có vòng tròn nhỏ thắt nút ở phần đáy đuôi?", options: ["る (ru)", "ろ (ro)", "ら (ra)", "り (ri)"], answer: 0, explain: "る có vòng tròn thắt nút ở đuôi, ろ không có." },
        { q: "Từ vựng 'Tôi' (watashi) được cấu thành từ 3 chữ cái nào?", options: ["わ, た, し", "れ, た, し", "ね, た, す", "わ, な, し"], answer: 0, explain: "わたし = わ (wa) + た (ta) + し (shi)." }
      ]
    },
    srsPlan: { nextReviewDays: [8, 10, 14], charsToReview: ["る", "ろ", "わ", "れ", "ね", "ん", "を"] },
    shibaMessage: "WOOF! Bạn đã chinh phục toàn bộ 46 chữ Hiragana cơ bản rồi! Đỉnh nóc kịch trần! Ngày mai chúng ta sẽ vào Ải Boss Hiragana nhé!",
    xpReward: 160
  },

  {
    day: 8,
    phase: "checkpoint",
    stageId: "stage-1",
    title: "Ngày 8: [BOSS 1] Biến Âm Dakuon, Ảo Âm Youon & Đại Chiến Hiragana",
    subtitle: "Làm chủ 25 âm đục/bán đục + 33 ảo âm + Thi thử tổng hợp 46 chữ cái",
    newCharsCount: 0,
    reviewCharsCount: 46,
    targetChars: ["が", "ざ", "だ", "ば", "ぱ", "きゃ", "しゅ", "ちょ", "っ"],
    reviewChars: ["Toàn bộ 46 chữ cái Hiragana cơ bản"],
    characters: [
      { char: "が", romaji: "ga", strokeCount: 5, rules: ["Hàng Ka thêm dấu Tenten (゛) hóa thành hàng Ga: が, ぎ, ぐ, げ, ご"], mnemonic: "Dấu Tenten biến K thành G.", soundGuide: "Phát âm g-a." },
      { char: "ざ", romaji: "za", strokeCount: 5, rules: ["Hàng Sa thêm dấu Tenten (゛) hóa thành hàng Za: ざ, じ (ji), ず, ぜ, ぞ"], mnemonic: "Dấu Tenten biến S thành Z/J.", soundGuide: "Phát âm z-a, じ đọc là ji." },
      { char: "だ", romaji: "da", strokeCount: 6, rules: ["Hàng Ta thêm dấu Tenten (゛) hóa thành hàng Da: だ, ぢ (ji), づ (zu), で, ど"], mnemonic: "Dấu Tenten biến T thành D.", soundGuide: "Phát âm d-a." },
      { char: "ば", romaji: "ba", strokeCount: 5, rules: ["Hàng Ha thêm dấu Tenten (゛) hóa thành hàng Ba: ば, び, ぶ,べ, ぼ"], mnemonic: "Dấu Tenten biến H thành B.", soundGuide: "Phát âm b-a." },
      { char: "ぱ", romaji: "pa", strokeCount: 4, rules: ["Hàng Ha thêm dấu Maru tròn (゜) hóa thành hàng Pa: ぱ, ぴ, ぷ, ぺ, ぽ"], mnemonic: "Dấu tròn Maru biến H thành P nổ giòn.", soundGuide: "Phát âm p-a mím môi bật hơi." },
      { char: "きゃ", romaji: "kya", strokeCount: 6, rules: ["Chữ cột I (き, し, ち, に, ひ, み, り) + や, ゆ, よ viết nhỏ bằng 1/4"], mnemonic: "Ảo âm Youon kết hợp 2 âm thành 1 âm tiết duy nhất.", soundGuide: "Phát âm lướt nhanh: kya, shu, cho..." }
    ],
    vocabularyPractice: [
      { word: "がくせい", romaji: "gakusei", hanviet: "Học sinh", meaning: "Học sinh / Sinh viên", components: ["が", "く", "せ", "い"], example: "わたし は がくせい です。", exampleMeaning: "Tôi là học sinh." },
      { word: "かぞく", romaji: "kazoku", hanviet: "Gia tộc", meaning: "Gia đình", components: ["か", "ぞ", "く"], example: "わたしの かぞく。", exampleMeaning: "Gia đình của tôi." },
      { word: "きって", romaji: "kitte", hanviet: "Thiết thủ", meaning: "Con tem thư (có âm ngắt)", components: ["き", "っ", "て"], example: "きって を はります。", exampleMeaning: "Dán con tem thư." },
      { word: "とうきょう", romaji: "toukyou", hanviet: "Đông Kinh", meaning: "Thủ đô Tokyo (có ảo âm & trường âm)", components: ["と", "う", "き", "ょ", "う"], example: "とうきょう に すんでいます。", exampleMeaning: "Sống tại Tokyo." },
      { word: "おちゃ", romaji: "ocha", hanviet: "Trà", meaning: "Trà xanh Nhật Bản", components: ["お", "ち", "ゃ"], example: "おちゃ を のみます。", exampleMeaning: "Uống trà xanh." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Dấu Tenten (゛): Hai nét phẩy ngắn song song đặt ở góc trên bên phải của chữ cái.",
        "Dấu Maru (゜): Vòng tròn nhỏ duy nhất nằm ở góc trên bên phải của hàng Ha để biến thành Pa.",
        "Ảo âm (ゃ, ゅ, ょ) và âm ngắt (っ): BẮT BUỘC viết nhỏ bằng 1/4 kích thước ô chữ, lệch về góc dưới bên trái!"
      ],
      requiredWritesPerChar: 3,
      minAccuracy: 90,
      commonMistakes: "Viết chữ ya, yu, yo to bằng chữ chính khiến người đọc hiểu nhầm thành 2 từ riêng biệt."
    },
    testingProtocol: {
      isCheckpointExam: true,
      step1AudioQuizCount: 15,
      step2MeaningMatchCount: 8,
      step3BlindCanvasWrites: 10,
      passingScorePercent: 90,
      sampleQuestions: [
        { q: "Hàng chữ nào khi thêm dấu tròn Maru (゜) sẽ biến thành âm P?", options: ["Hàng Ha (は, ひ, ふ, へ, ほ)", "Hàng Ka (か, き, く, け, こ)", "Hàng Ta (た, ち, つ, て, と)", "Hàng Sa (さ, し, す, せ, そ)"], answer: 0, explain: "Chỉ duy nhất hàng Ha thêm Maru biến thành Pa, Pi, Pu, Pe, Po." },
        { q: "Cách đọc chuẩn của từ 'とうきょう' là gì?", options: ["Tokyo (Đông Kinh)", "Kyoto", "Osaka", "Hokkaido"], answer: 0, explain: "とうきょう gồm ảo âm きょ và 2 trường âm う đọc là Tōkyō." }
      ]
    },
    srsPlan: { nextReviewDays: [9, 11, 14], charsToReview: ["Toàn bộ bảng Hiragana"] },
    shibaMessage: "CHÚC MỪNG BẠN ĐÃ ĐẠT HUY HIỆU VƯỢT ẢI HIRAGANA! Tự hào quá đi! Ngày mai chúng ta sẽ bước sang thế giới Katakana cực ngầu nhé!",
    xpReward: 300
  },

  // =========================================================================
  // GIAI ĐOẠN 2: BẢNG CHỮ CỨNG KATAKANA (NGÀY 9 -> NGÀY 14)
  // =========================================================================
  {
    day: 9,
    phase: "katakana",
    stageId: "stage-3",
    title: "Ngày 9: Katakana Hàng A ア・イ・ウ・エ・オ & Hàng Ka カ・キ・ク・ケ・コ",
    subtitle: "Khám phá phong cách chữ cứng góc cạnh & kho từ mượn Gairaigo quốc tế",
    newCharsCount: 10,
    reviewCharsCount: 10,
    targetChars: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ"],
    reviewChars: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"],
    characters: [
      { char: "ア", romaji: "a", strokeCount: 2, rules: ["Ngang gập móc trái -> sổ cong vuốt"], mnemonic: "Góc chữ A viết in hoa.", soundGuide: "Phát âm 'a' góc cạnh dứt khoát." },
      { char: "イ", romaji: "i", strokeCount: 2, rules: ["Nét phẩy chéo trái -> sổ thẳng đứng"], mnemonic: "Thanh kiếm Easel dựng đứng.", soundGuide: "Phát âm 'i'." },
      { char: "ウ", romaji: "u", strokeCount: 3, rules: ["Chấm trên đỉnh -> sổ ngắn trái -> ngang gập cong"], mnemonic: "Chiếc dù che mưa góc cạnh.", soundGuide: "Phát âm 'u'." },
      { char: "エ", romaji: "e", strokeCount: 3, rules: ["Ngang trên -> sổ giữa -> ngang dưới dài"], mnemonic: "Khung thang nâng kỹ thuật Engineer.", soundGuide: "Phát âm 'e'." },
      { char: "オ", romaji: "o", strokeCount: 3, rules: ["Ngang -> sổ thẳng hất nhẹ -> chéo trái"], mnemonic: "Người dang tay chạy điền kinh Opera.", soundGuide: "Phát âm 'o'." },
      { char: "カ", romaji: "ka", strokeCount: 2, rules: ["Ngang gập móc -> nét phẩy chéo cắt (giống か nhưng không có chấm)"], mnemonic: "Giống hệt chữ か mềm nhưng bỏ nét chấm bên phải.", soundGuide: "Phát âm 'ka'." },
      { char: "キ", romaji: "ki", strokeCount: 3, rules: ["Hai nét ngang -> 1 nét sổ chéo cắt qua (không có nét cong đáy)"], mnemonic: "Giống chữ き nhưng bỏ nét cong tròn ở đáy.", soundGuide: "Phát âm 'ki'." },
      { char: "ク", romaji: "ku", strokeCount: 2, rules: ["Phẩy chéo trái -> ngang gập cong"], mnemonic: "Người đầu bếp Cook cầm muôi.", soundGuide: "Phát âm 'ku'." },
      { char: "ケ", romaji: "ke", strokeCount: 3, rules: ["Phẩy trên -> ngang chéo -> phẩy dài dưới"], mnemonic: "Chữ K góc cạnh cách điệu.", soundGuide: "Phát âm 'ke'." },
      { char: "コ", romaji: "ko", strokeCount: 2, rules: ["Ngang gập xuống -> ngang đáy"], mnemonic: "Góc chiếc hộp vuông Cốc (Box).", soundGuide: "Phát âm 'ko'." }
    ],
    vocabularyPractice: [
      { word: "アイス", romaji: "aisu", hanviet: "Kem", meaning: "Kem que / Kem lạnh (Ice cream)", components: ["ア", "イ"], example: "アイス を たべます。", exampleMeaning: "Ăn kem que mát lạnh." },
      { word: "カメラ", romaji: "kamera", hanviet: "Máy ảnh", meaning: "Máy chụp ảnh (Camera)", components: ["カ"], example: "あたらしい カメラ。", exampleMeaning: "Máy ảnh đời mới." },
      { word: "ケーキ", romaji: "keeki", hanviet: "Bánh kem", meaning: "Bánh ngọt Cake (có dấu trường âm ー)", components: ["ケ", "キ"], example: "おいしい ケーキ。", exampleMeaning: "Bánh kem ngon tuyệt." },
      { word: "コーヒー", romaji: "koohii", hanviet: "Cà phê", meaning: "Cà phê Coffee", components: ["コ"], example: "あつい コーヒー。", exampleMeaning: "Cốc cà phê nóng." },
      { word: "エアコン", romaji: "eakon", hanviet: "Điều hòa", meaning: "Máy điều hòa không khí (Air conditioner)", components: ["エ", "ア", "コ"], example: "エアコン を つけます。", exampleMeaning: "Bật điều hòa không khí." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Quy tắc vàng: Katakana nét dứt khoát, góc cạnh, không uốn lượn mềm như Hiragana.",
        "So sánh cặp đôi: Chữ カ (Katakana) giống chữ か (Hiragana) nhưng BỎ nét chấm số 3!",
        "Chữ キ (Katakana) giống chữ き (Hiragana) nhưng BỎ nét móc cong số 4 bên dưới!",
        "Dấu gạch ngang `ー` là TRƯỜNG ÂM (Chōon), kéo dài âm trước đó 1 phách (VD: ケーキ = Kee-ki)."
      ],
      requiredWritesPerChar: 4,
      minAccuracy: 85,
      commonMistakes: "Viết nét uốn tròn mềm như Hiragana thay vì nét thẳng góc cạnh."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 6,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Từ vựng 'ケーキ' (keeki) mang ý nghĩa gì trong đời sống?", options: ["Bánh kem (Cake)", "Cà phê", "Máy ảnh", "Nhà ga"], answer: 0, explain: "ケーキ là từ mượn tiếng Anh Cake chỉ bánh kem sinh nhật/bánh ngọt." },
        { q: "Chữ カ Katakana khác chữ か Hiragana ở điểm cốt lõi nào?", options: ["Bỏ đi nét chấm ở góc trên bên phải", "Thêm một nét ngang", "Viết ngược sang trái", "Không khác gì nhau"], answer: 0, explain: "カ bỏ nét chấm số 3 của か." }
      ]
    },
    srsPlan: { nextReviewDays: [10, 12, 14], charsToReview: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ"] },
    shibaMessage: "Katakana trông như kiếm sĩ samurai: thẳng tắp và góc cạnh! Học chữ mượn tiếng Anh rất nhanh thuộc đó bạn ơi!",
    xpReward: 150
  },

  {
    day: 10,
    phase: "katakana",
    stageId: "stage-3",
    title: "Ngày 10: Hàng Sa サ・シ・ス・セ・ソ & Hàng Ta タ・チ・ツ・テ・ト",
    subtitle: "CẢNH BÁO ĐỎ: Phá vỡ bẫy tử thần kinh điển nhất tiếng Nhật: シ (Shi) vs ツ (Tsu)",
    newCharsCount: 10,
    reviewCharsCount: 20,
    targetChars: ["サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト"],
    reviewChars: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ"],
    characters: [
      { char: "サ", romaji: "sa", strokeCount: 3, rules: ["Ngang dài -> sổ trái -> sổ phải"], mnemonic: "Ba lưỡi kiếm cắm xuống bàn.", soundGuide: "Phát âm 'sa'." },
      { char: "シ", romaji: "shi", strokeCount: 3, rules: ["2 nét chấm trên dưới nằm dốc đứng -> Nét 3 VUỐT TỪ DƯỚI LÊN TRÊN"], mnemonic: "Cô ấy (She) ngước mắt nhìn lên trên.", soundGuide: "Phát âm 'shi'." },
      { char: "ス", romaji: "su", strokeCount: 2, rules: ["Ngang gập chéo -> nét phẩy chéo cắt qua"], mnemonic: "Đôi giày trượt tuyết Ski băng qua dốc.", soundGuide: "Phát âm 'su'." },
      { char: "セ", romaji: "se", strokeCount: 2, rules: ["Ngang gập móc -> sổ đứng cắt nét 1"], mnemonic: "Giống chữ せ mềm nhưng lược bỏ nét.", soundGuide: "Phát âm 'se'." },
      { char: "ソ", romaji: "so", strokeCount: 2, rules: ["Nét chấm dốc đứng -> Nét 2 VUỐT TỪ TRÊN BỔ XUỐNG DƯỚI"], mnemonic: "Chiếc kim khâu May vá hướng xuống.", soundGuide: "Phát âm 'so'." },
      { char: "タ", romaji: "ta", strokeCount: 3, rules: ["Phẩy trái -> ngang gập cong -> phẩy cắt ngang"], mnemonic: "Giống chữ ク nhưng có thêm nét gạch chéo ở bụng.", soundGuide: "Phát âm 'ta'." },
      { char: "チ", romaji: "chi", strokeCount: 3, rules: ["Ngang phẩy trên -> ngang giữa -> sổ cong vuốt"], mnemonic: "Hình ảnh chú bé Cheerleading.", soundGuide: "Phát âm 'chi'." },
      { char: "ツ", romaji: "tsu", strokeCount: 3, rules: ["2 nét chấm nằm ngang cạnh nhau -> Nét 3 VUỐT TỪ TRÊN BỔ XUỐNG"], mnemonic: "Ngọn sóng thần Tsunami từ trên trời ập xuống.", soundGuide: "Phát âm 'tsu'." },
      { char: "テ", romaji: "te", strokeCount: 3, rules: ["Hai nét ngang song song -> nét sổ cong chéo"], mnemonic: "Cột ăng-ten TV đón sóng.", soundGuide: "Phát âm 'te'." },
      { char: "ト", romaji: "to", strokeCount: 2, rules: ["Sổ thẳng đứng -> nét chéo ngắn sang phải"], mnemonic: "Cột mốc chỉ đường Toe.", soundGuide: "Phát âm 'to'." }
    ],
    vocabularyPractice: [
      { word: "タクシー", romaji: "takushii", hanviet: "Taxi", meaning: "Xe taxi", components: ["タ", "ク", "シ"], example: "タクシー に のります。", exampleMeaning: "Lên xe taxi." },
      { word: "テスト", romaji: "tesuto", hanviet: "Bài test", meaning: "Bài kiểm tra / Thi cử (Test)", components: ["テ", "ス", "ト"], example: "にほんご の テスト。", exampleMeaning: "Bài kiểm tra tiếng Nhật." },
      { word: "シャツ", romaji: "shatsu", hanviet: "Áo sơ mi", meaning: "Áo sơ mi (Shirt - có âm ツ)", components: ["シ", "ツ"], example: "しろい シャツ。", exampleMeaning: "Chiếc áo sơ mi trắng." },
      { word: "トイレ", romaji: "toire", hanviet: "Toilet", meaning: "Nhà vệ sinh (Toilet)", components: ["ト"], example: "トイレ は どこ ですか。", exampleMeaning: "Nhà vệ sinh ở đâu vậy?" },
      { word: "サラダ", romaji: "sarada", hanviet: "Salad", meaning: "Món rau trộn Salad", components: ["サ"], example: "サラダ を たべます。", exampleMeaning: "Ăn món salad." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BÍ KÍP TỬ THẦN 1: CHỮ シ (Shi) vs CHỮ ツ (Tsu):",
        "  - Chữ シ (Shi): 2 nét chấm xếp theo CHIỀU DỌC ĐỨNG, nét thứ 3 vuốt TỪ DƯỚI LÊN TRÊN (nhìn như mặt ngước lên).",
        "  - Chữ ツ (Tsu): 2 nét chấm xếp theo CHIỀU NGANG BẰNG, nét thứ 3 vuốt TỪ TRÊN BỔ XUỐNG DƯỚI (nhìn như nước đổ xuống).",
        "BÍ KÍP TỬ THẦN 2: CHỮ ソ (So) vs CHỮ ン (N):",
        "  - Chữ ソ (So): Nét 2 vuốt TỪ TRÊN XUỐNG DƯỚI.",
        "  - Chữ ン (N): Nét 2 vuốt TỪ DƯỚI HẤT LÊN TRÊN."
      ],
      requiredWritesPerChar: 5,
      minAccuracy: 90,
      commonMistakes: "Viết nét 3 của シ từ trên xuống khiến bị chấm nhầm thành ツ!"
    },
    testingProtocol: {
      step1AudioQuizCount: 12,
      step2MeaningMatchCount: 6,
      step3BlindCanvasWrites: 8,
      passingScorePercent: 90,
      sampleQuestions: [
        { q: "Quy tắc viết nét thứ 3 của chữ 'シ' (shi) là gì?", options: ["Vuốt từ góc dưới bên trái hất lên trên bên phải", "Vuốt từ trên đỉnh bổ chéo xuống dưới", "Kéo ngang từ trái sang phải", "Vòng tròn xoắn nút"], answer: 0, explain: "シ nét 3 BẮT BUỘC vuốt từ dưới lên (khác ツ vuốt từ trên xuống)." },
        { q: "Từ vựng 'xe taxi' viết bằng Katakana là gì?", options: ["タクシー (takushii)", "テスチー", "トクシー", "チクシ"], answer: 0, explain: "タクシー = タ (ta) + ク (ku) + シ (shi) + ー (trường âm)." }
      ]
    },
    srsPlan: { nextReviewDays: [11, 13, 14], charsToReview: ["シ", "ツ", "ソ", "タ", "テ", "ト"] },
    shibaMessage: "CẢNH BÁO ĐỎ! Hãy soi thật kĩ hướng bút của シ (vuốt lên) và ツ (bổ xuống) nhé. Làm chủ được cặp này là bạn vượt qua 80% người học tiếng Nhật rồi!",
    xpReward: 160
  },

  {
    day: 11,
    phase: "katakana",
    stageId: "stage-3",
    title: "Ngày 11: Hàng Na ナ・ニ・ヌ・ネ・ノ & Hàng Ha ハ・ヒ・フ・ヘ・ホ",
    subtitle: "Chinh phục 10 chữ cái & hệ thống từ vựng thức ăn, khách sạn quốc tế",
    newCharsCount: 10,
    reviewCharsCount: 25,
    targetChars: ["ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ"],
    reviewChars: ["サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト"],
    characters: [
      { char: "ナ", romaji: "na", strokeCount: 2, rules: ["Ngang -> sổ chéo vuốt trái"], mnemonic: "Hình thanh kiếm sắc bén Ninja.", soundGuide: "Phát âm 'na'." },
      { char: "ニ", romaji: "ni", strokeCount: 2, rules: ["Hai nét ngang song song giống số 2 chữ Hán (二)"], mnemonic: "Số 2 tiếng Nhật đọc là Ni.", soundGuide: "Phát âm 'ni'." },
      { char: "ヌ", romaji: "nu", strokeCount: 2, rules: ["Ngang gập chéo -> nét phẩy cắt qua"], mnemonic: "Chiếc đũa gắp sợi mì Noodles.", soundGuide: "Phát âm 'nu'." },
      { char: "ネ", romaji: "ne", strokeCount: 4, rules: ["Chấm trên -> phẩy zíc-zắc -> sổ đứng -> phẩy phải"], mnemonic: "Bộ thị trong chữ Hán, chú mèo Neko.", soundGuide: "Phát âm 'ne'." },
      { char: "ノ", romaji: "no", strokeCount: 1, rules: ["1 nét: Phẩy cong dài từ trên phải vuốt xuống trái"], mnemonic: "Chiếc mũi nhọn No.", soundGuide: "Phát âm 'no'." },
      { char: "ハ", romaji: "ha", strokeCount: 2, rules: ["Phẩy trái -> phẩy phải đối xứng như số 8 chữ Hán (八)"], mnemonic: "Mái nhà chòi Ha.", soundGuide: "Phát âm 'ha'." },
      { char: "ヒ", romaji: "hi", strokeCount: 2, rules: ["Ngang ngắn -> sổ đứng gập ngang vuốt lên"], mnemonic: "Người đang cười Hí hí Hero.", soundGuide: "Phát âm 'hi'." },
      { char: "フ", romaji: "fu", strokeCount: 1, rules: ["1 nét: Ngang gập cong vuốt nhẹ"], mnemonic: "Lá cờ bay trong gió Fuji.", soundGuide: "Phát âm 'fu'." },
      { char: "ヘ", romaji: "he", strokeCount: 1, rules: ["1 nét: Giống hệt chữ へ Hiragana"], mnemonic: "Ngọn đồi dốc cao.", soundGuide: "Phát âm 'he'." },
      { char: "ホ", romaji: "ho", strokeCount: 4, rules: ["Ngang -> sổ thẳng có móc nhẹ -> phẩy trái -> phẩy phải"], mnemonic: "Chữ Thập có 2 cánh chống đỡ.", soundGuide: "Phát âm 'ho'." }
    ],
    vocabularyPractice: [
      { word: "ノート", romaji: "nooto", hanviet: "Vở ghi", meaning: "Quyển vở ghi chép (Notebook)", components: ["ノ", "ト"], example: "ノート に かきます。", exampleMeaning: "Viết bài vào trong vở." },
      { word: "ホテル", romaji: "hoteru", hanviet: "Khách sạn", meaning: "Khách sạn (Hotel)", components: ["ホ"], example: "きれい な ホテル。", exampleMeaning: "Khách sạn tiện nghi." },
      { word: "ハンバーガー", romaji: "hanbaagaa", hanviet: "Hamburger", meaning: "Bánh Hamburger", components: ["ハ"], example: "ハンバーガー を たべます。", exampleMeaning: "Ăn bánh hamburger." },
      { word: "バス", romaji: "basu", hanviet: "Xe buýt", meaning: "Xe buýt công cộng (Bus)", components: ["ハ"], example: "バス で いきます。", exampleMeaning: "Đi học bằng xe buýt." },
      { word: "ナイフ", romaji: "naifu", hanviet: "Con dao", meaning: "Con dao ăn (Knife)", components: ["ナ", "イ", "フ"], example: "ナイフ と フォーク。", exampleMeaning: "Dao và dĩa ăn cơm." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Chữ ニ (Ni) gồm 2 nét ngang ngắn trên dài dưới, chính là chữ Nhị (二) trong chữ Hán!",
        "Chữ ハ (Ha) gồm 2 nét phẩy tách rời, chính là chữ Bát (八) số 8.",
        "Chữ ヘ (He) là chữ cái DUY NHẤT có hình dạng giống hệt 100% giữa Hiragana và Katakana!"
      ],
      requiredWritesPerChar: 4,
      minAccuracy: 85,
      commonMistakes: "Viết dính 2 nét của chữ ハ vào nhau như chữ A."
    },
    testingProtocol: {
      step1AudioQuizCount: 10,
      step2MeaningMatchCount: 5,
      step3BlindCanvasWrites: 6,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Chữ cái nào sau đây có hình dạng giống hệt nhau cả ở Hiragana và Katakana?", options: ["へ (he)", "あ (a)", "か (ka)", "し (shi)"], answer: 0, explain: "Chữ へ / ヘ giống hệt nhau ở cả 2 bảng chữ cái." },
        { q: "Từ vựng 'ノート' (nooto) có nghĩa là gì?", options: ["Quyển vở ghi chép", "Khách sạn", "Xe buýt", "Máy ảnh"], answer: 0, explain: "ノート là từ mượn tiếng Anh Notebook (Quyển vở)." }
      ]
    },
    srsPlan: { nextReviewDays: [12, 14], charsToReview: ["ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ホ", "フ"] },
    shibaMessage: "Gauf! Nhớ mẹo này nha: Chữ ニ là số 2, chữ ハ là số 8. Dễ nhớ như ăn kẹo luôn!",
    xpReward: 150
  },

  {
    day: 12,
    phase: "katakana",
    stageId: "stage-3",
    title: "Ngày 12: Hàng Ma マ・ミ・ム・メ・モ, Hàng Ya ヤ・ユ・ヨ & Hàng Ra ラ・リ・ル・レ・ロ",
    subtitle: "Tăng tốc hoàn thành 13 chữ cái & tháo gỡ bẫy thứ hai: ソ (So) vs ン (N)",
    newCharsCount: 13,
    reviewCharsCount: 30,
    targetChars: ["マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ"],
    reviewChars: ["ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ"],
    characters: [
      { char: "マ", romaji: "ma", strokeCount: 2, rules: ["Ngang gập chéo -> chấm phẩy"], mnemonic: "Mặt nạ Mask tam giác.", soundGuide: "Phát âm 'ma'." },
      { char: "ミ", romaji: "mi", strokeCount: 3, rules: ["Ba nét phẩy chéo song song dốc xuống"], mnemonic: "Số 3 chữ Hán (三) hơi nghiêng.", soundGuide: "Phát âm 'mi'." },
      { char: "ム", romaji: "mu", strokeCount: 2, rules: ["Chéo gập ngang -> nét phẩy"], mnemonic: "Chiếc sừng bò nhọn hoắt.", soundGuide: "Phát âm 'mu'." },
      { char: "メ", romaji: "me", strokeCount: 2, rules: ["Phẩy chéo trái -> phẩy chéo phải cắt qua như dấu X"], mnemonic: "Đôi mắt chéo qua nhau.", soundGuide: "Phát âm 'me'." },
      { char: "モ", romaji: "mo", strokeCount: 3, rules: ["Hai nét ngang -> nét sổ đứng gập ngang đáy"], mnemonic: "Khá giống chữ も Hiragana nhưng vuông vức.", soundGuide: "Phát âm 'mo'." },
      { char: "ヤ", romaji: "ya", strokeCount: 2, rules: ["Ngang gập móc -> sổ đứng cắt nét 1"], mnemonic: "Cây cung tên Yah.", soundGuide: "Phát âm 'ya'." },
      { char: "ユ", romaji: "yu", strokeCount: 2, rules: ["Ngang gập sổ -> ngang đáy dài"], mnemonic: "Chiếc móc treo quần áo.", soundGuide: "Phát âm 'yu'." },
      { char: "ヨ", romaji: "yo", strokeCount: 3, rules: ["Ngang gập sổ -> ngang giữa -> ngang đáy (giống chữ E ngược)"], mnemonic: "Chữ E quay ngược lại.", soundGuide: "Phát âm 'yo'." },
      { char: "ラ", romaji: "ra", strokeCount: 2, rules: ["Ngang ngắn -> ngang gập cong vuốt"], mnemonic: "Người kéo xe Ramen.", soundGuide: "Phát âm 'ra'." },
      { char: "リ", romaji: "ri", strokeCount: 2, rules: ["Sổ ngắn trái -> sổ dài phải vuốt (y hệt chữ り mềm)"], mnemonic: "Dải ruy băng.", soundGuide: "Phát âm 'ri'." },
      { char: "ル", romaji: "ru", strokeCount: 2, rules: ["Phẩy trái -> sổ móc phải"], mnemonic: "Đôi chân người chạy.", soundGuide: "Phát âm 'ru'." },
      { char: "レ", romaji: "re", strokeCount: 1, rules: ["1 nét: Sổ xuống rồi hất nhọn sang phải"], mnemonic: "Chiếc thước đo chữ L.", soundGuide: "Phát âm 're'." },
      { char: "ロ", romaji: "ro", strokeCount: 3, rules: ["Sổ trái -> ngang gập xuống -> ngang đáy (hình vuông kín)"], mnemonic: "Chiếc hộp vuông kín Robot.", soundGuide: "Phát âm 'ro'." }
    ],
    vocabularyPractice: [
      { word: "ミルク", romaji: "miruku", hanviet: "Sữa", meaning: "Sữa tươi (Milk)", components: ["ミ", "ル", "ク"], example: "ミルク を のみます。", exampleMeaning: "Uống sữa tươi." },
      { word: "レストラン", romaji: "resutoran", hanviet: "Nhà hàng", meaning: "Nhà hàng ăn uống (Restaurant)", components: ["レ", "ス", "ト", "ラ", "ン"], example: "レストラン で たべます。", exampleMeaning: "Ăn tại nhà hàng." },
      { word: "メロン", romaji: "meron", hanviet: "Dưa lưới", meaning: "Quả dưa lưới Melon", components: ["メ", "ロ", "ン"], example: "あまい メロン。", exampleMeaning: "Quả dưa lưới ngọt lịm." },
      { word: "ラジオ", romaji: "rajio", hanviet: "Đài phát thanh", meaning: "Máy Radio", components: ["ラ", "ジ", "オ"], example: "ラジオ を ききます。", exampleMeaning: "Nghe đài phát thanh." },
      { word: "マスク", romaji: "masuku", hanviet: "Khẩu trang", meaning: "Khẩu trang y tế (Mask)", components: ["マ", "ス", "ク"], example: "マスク を つけます。", exampleMeaning: "Đeo khẩu trang." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Chữ ロ (Ro) là hình vuông khép kín 3 nét (viết giống chữ Khẩu 口 trong Hán tự).",
        "Chữ リ (Ri) gồm 2 nét song song giống hệt chữ り Hiragana.",
        "Chữ ミ (Mi) gồm 3 nét phẩy nghiêng song song đều nhau."
      ],
      requiredWritesPerChar: 3,
      minAccuracy: 85,
      commonMistakes: "Viết chữ ロ thành 1 vòng tròn tròn; viết chữ マ góc đáy bị bè ngang."
    },
    testingProtocol: {
      step1AudioQuizCount: 12,
      step2MeaningMatchCount: 6,
      step3BlindCanvasWrites: 8,
      passingScorePercent: 85,
      sampleQuestions: [
        { q: "Từ vựng 'レストラン' (resutoran) có nghĩa là gì?", options: ["Nhà hàng", "Khách sạn", "Nhà ga", "Bệnh viện"], answer: 0, explain: "レストラン là từ mượn tiếng Anh Restaurant (Nhà hàng)." },
        { q: "Chữ cái hình vuông khép kín 3 nét là chữ nào?", options: ["ロ (ro)", "コ (ko)", "ユ (yu)", "ヨ (yo)"], answer: 0, explain: "ロ là hình vuông khép kín đọc là 'ro'." }
      ]
    },
    srsPlan: { nextReviewDays: [13, 14], charsToReview: ["マ", "ミ", "ム", "メ", "モ", "ラ", "リ", "ル", "レ", "ロ"] },
    shibaMessage: "Quá cừ khôi! Đã học xong gần hết bảng chữ cứng rồi. Mai là ngày cán đích trọn vẹn chữ Wa, N và các âm ghép quốc tế!",
    xpReward: 160
  },

  {
    day: 13,
    phase: "katakana",
    stageId: "stage-3",
    title: "Ngày 13: Hàng Wa/N ワ・ヲ・ン, Biến Âm Katakana & Âm Ghép Ngoại Lai Hiện Đại",
    subtitle: "Chinh phục âm mũi 'N', trường âm 'ー' và các âm đặc biệt: ファ, フィ, フェ, ティ, ディ, シェ, チェ",
    newCharsCount: 3,
    reviewCharsCount: 43,
    targetChars: ["ワ", "ヲ", "ン", "ファ", "ティ", "ディ", "シェ", "チェ", "ー"],
    reviewChars: ["Toàn bộ các chữ Katakana từ ngày 9 đến 12"],
    characters: [
      { char: "ワ", romaji: "wa", strokeCount: 2, rules: ["Sổ ngắn trái -> ngang gập cong vuốt nhẹ"], mnemonic: "Chiếc ly uống rượu Vang Wine.", soundGuide: "Phát âm 'wa'." },
      { char: "ヲ", romaji: "wo", strokeCount: 3, rules: ["Ngang trên -> ngang giữa -> sổ chéo cắt"], mnemonic: "Hiếm khi dùng trong Katakana hiện đại, chủ yếu giữ vai trò ngữ pháp.", soundGuide: "Phát âm 'o'." },
      { char: "ン", romaji: "n", strokeCount: 2, rules: ["1 nét chấm xiên chéo -> Nét 2 VUỐT TỪ DƯỚI HẤT LÊN TRÊN"], mnemonic: "Chiếc mũi cười hất lên reo âm 'N'.", soundGuide: "Âm mũi 'n'." },
      { char: "ファ", romaji: "fa", strokeCount: 3, rules: ["Chữ フ (fu) + ァ nhỏ"], mnemonic: "Âm mượn cho Fashion, Family.", soundGuide: "Phát âm 'f-a'." },
      { char: "ティ", romaji: "ti", strokeCount: 4, rules: ["Chữ テ (te) + ィ nhỏ"], mnemonic: "Âm mượn cho Party (パーティー), Ticket.", soundGuide: "Phát âm 't-i'." },
      { char: "ー", romaji: "trường âm", strokeCount: 1, rules: ["1 nét ngang thẳng dài bằng 1 phách phát âm"], mnemonic: "Dấu kéo dài nguyên âm của Katakana.", soundGuide: "Kéo dài âm đứng trước gấp đôi." }
    ],
    vocabularyPractice: [
      { word: "ワイン", romaji: "wain", hanviet: "Rượu vang", meaning: "Rượu vang (Wine)", components: ["ワ", "イ", "ン"], example: "あかい ワイン。", exampleMeaning: "Rượu vang đỏ." },
      { word: "パーティー", romaji: "paatii", hanviet: "Bữa tiệc", meaning: "Bữa tiệc Party (có âm ghép ティ và trường âm ー)", components: ["パ", "テ", "ィ"], example: "たのしい パーティー。", exampleMeaning: "Bữa tiệc vui vẻ." },
      { word: "スマートフォン", romaji: "sumaatofon", hanviet: "Điện thoại thông minh", meaning: "Smartphone (có âm ghép フォ)", components: ["ス", "マ", "ト", "フ", "ォ", "ン"], example: "あたらしい スマートフォン。", exampleMeaning: "Điện thoại thông minh mới." },
      { word: "カフェ", romaji: "kafe", hanviet: "Quán cà phê", meaning: "Quán Cafe (có âm ghép フェ)", components: ["カ", "フ", "ェ"], example: "おしゃれ な カフェ。", exampleMeaning: "Quán cà phê xinh xắn." },
      { word: "パン", romaji: "pan", hanviet: "Bánh mì", meaning: "Bánh mì (từ gốc Bồ Đào Nha Pão)", components: ["パ", "ン"], example: "まいあさ パン を たべます。", exampleMeaning: "Mỗi sáng đều ăn bánh mì." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "BẪY KINH ĐIỂN: CHỮ ソ (So) vs CHỮ ン (N):",
        "  - Chữ ソ: Nét 1 chấm dốc đứng, nét 2 BẮT ĐẦU TỪ TRÊN BỔ XUỐNG DƯỚI.",
        "  - Chữ ン: Nét 1 chấm nằm ngang hơn, nét 2 BẮT ĐẦU TỪ GÓC DƯỚI VUỐT LÊN TRÊN!",
        "Khi viết từ dọc: Dấu trường âm `ー` xoay thành nét sổ dọc `|`. Khi viết ngang: Dấu trường âm nằm ngang `ー`."
      ],
      requiredWritesPerChar: 4,
      minAccuracy: 90,
      commonMistakes: "Viết chữ ン từ trên xuống khiến bị đọc thành chữ ソ."
    },
    testingProtocol: {
      step1AudioQuizCount: 12,
      step2MeaningMatchCount: 6,
      step3BlindCanvasWrites: 8,
      passingScorePercent: 90,
      sampleQuestions: [
        { q: "Điểm mấu chốt để phân biệt nét vẽ của chữ 'ン' (n) và 'ソ' (so) là gì?", options: ["Nét thứ 2 của chữ ン vuốt từ dưới lên trên", "Chữ ン có 3 nét", "Chữ ン nét chấm nằm thẳng đứng", "Hai chữ giống nhau hoàn toàn"], answer: 0, explain: "Chữ ン nét chính vuốt từ dưới hất lên trên." },
        { q: "Từ vựng 'rượu vang' viết bằng Katakana là gì?", options: ["ワイン (wain)", "ワン (wan)", "ウイン (uin)", "ワレン (waren)"], answer: 0, explain: "ワイン = ワ (wa) + イ (i) + ン (n)." }
      ]
    },
    srsPlan: { nextReviewDays: [14], charsToReview: ["Toàn bộ bảng Katakana"] },
    shibaMessage: "TUYỆT VỜI! 100% hai bảng chữ cái đã nằm trong tay bạn. Ngày mai là Đại Hội Trùm Cuối Boss 2 - Song Kiếm Hợp Bích để nhận Bằng Tinh Thông Kana!",
    xpReward: 180
  },

  {
    day: 14,
    phase: "checkpoint",
    stageId: "stage-8",
    title: "Ngày 14: [ĐẠI HỘI TRÙM CUỐI] Song Kiếm Hợp Bích: Thi Thử & Tốt Nghiệp 2 Bảng Chữ Cái Kana",
    subtitle: "Chuyển đổi chéo Hiragana <-> Katakana, 50 từ vựng thực chiến & Kiểm tra trí nhớ hoàn hảo",
    newCharsCount: 0,
    reviewCharsCount: 92,
    targetChars: ["Toàn bộ 46 Hiragana + 46 Katakana + Biến âm + Âm ghép"],
    reviewChars: ["Tất cả chữ cái đã học trong 13 ngày qua"],
    characters: [],
    vocabularyPractice: [
      { word: "にほん (日本)", romaji: "nihon", meaning: "Đất nước Nhật Bản (Hiragana)", components: ["に", "ほ", "ん"], example: "にほん に いきます。", exampleMeaning: "Đi đến Nhật Bản." },
      { word: "ジャパン (Japan)", romaji: "japan", meaning: "Nhật Bản (Katakana từ mượn)", components: ["ジ", "ャ", "パ", "ン"], example: "メイド イン ジャパン。", exampleMeaning: "Made in Japan." },
      { word: "ともだち (友達)", romaji: "tomodachi", meaning: "Bạn bè thân thiết", components: ["と", "も", "だ", "ち"], example: "わたしの ともだち。", exampleMeaning: "Bạn của tôi." },
      { word: "プレゼント (Present)", romaji: "purezento", meaning: "Món quà tặng", components: ["プ", "レ", "ゼ", "ン", "ト"], example: "プレゼント を あげます。", exampleMeaning: "Tặng một món quà." },
      { word: "ありがとう", romaji: "arigatou", meaning: "Xin cảm ơn bạn rất nhiều", components: ["あ", "り", "が", "と", "う"], example: "どうも ありがとう。", exampleMeaning: "Cảm ơn bạn rất nhiều." }
    ],
    writingFocus: {
      gridType: "mizi",
      keyTechniques: [
        "Bài thi viết từ trí nhớ (Blind Canvas Challenge):",
        "  - Hệ thống đọc âm thanh ngẫu nhiên 10 chữ cái (5 Hiragana, 5 Katakana).",
        "  - Học viên tự viết vào ô kẻ thư pháp mà KHÔNG ĐƯỢC nhìn nét gợi ý.",
        "  - Thuật toán tự động chấm điểm độ chính xác vị trí nét và thứ tự nét bút thuận.",
        "Độ chuẩn xác yêu cầu: >= 90% để được cấp Huy Hiệu Tinh Thông Kana."
      ],
      requiredWritesPerChar: 2,
      minAccuracy: 90,
      commonMistakes: "Viết lẫn lộn giữa nét mềm Hiragana và nét cứng Katakana trong cùng một từ."
    },
    testingProtocol: {
      isCheckpointExam: true,
      isGrandFinal: true,
      step1AudioQuizCount: 20,
      step2MeaningMatchCount: 10,
      step3BlindCanvasWrites: 10,
      passingScorePercent: 90,
      sampleQuestions: [
        { q: "Cặp chữ Hiragana và Katakana nào sau đây tương ứng cùng âm đọc 'A'?", options: ["あ và ア", "お và オ", "い và イ", "え và エ"], answer: 0, explain: "あ (Hiragana) và ア (Katakana) đều phát âm là 'a'." },
        { q: "Cặp chữ Hiragana và Katakana nào sau đây tương ứng cùng âm đọc 'KA'?", options: ["か và カ", "き và キ", "く và ク", "け và ケ"], answer: 0, explain: "か (Hiragana) và カ (Katakana) đều phát âm là 'ka'." },
        { q: "Chuyển từ 'カメラ' (kamera) sang Hiragana tương ứng:", options: ["かめら", "きめら", "くめら", "こめら"], answer: 0, explain: "カ = か, メ = め, ラ = ら -> かめら." }
      ]
    },
    srsPlan: { nextReviewDays: [21, 30, 60], charsToReview: ["Hệ thống SRS tự động nạp toàn bộ 92 thẻ vào bộ nhớ dài hạn"] },
    shibaMessage: "🎉 VẠN TUẾ! BẠN ĐÃ CHÍNH THỨC TỐT NGHIỆP CẢ 2 BẢNG CHỮ CÁI TIẾNG NHẬT! Bây giờ bạn đã có đầy đủ nội công để tiến vào Ải Kanji và Ngữ Pháp N5 cùng tớ rồi!",
    xpReward: 500
  }
];

// =========================================================================
// HELPER QUERY FUNCTIONS FOR INTEGRATION
// =========================================================================

/**
 * Lấy toàn bộ kế hoạch 14 ngày
 */
export function getAllKanaDailyPlans() {
  return KANA_DAILY_MAP;
}

/**
 * Lấy chi tiết ngày học theo số ngày (1 - 14)
 */
export function getDailyPlanByDay(dayNumber) {
  return KANA_DAILY_MAP.find((d) => d.day === Number(dayNumber)) || KANA_DAILY_MAP[0];
}

/**
 * Lấy các ngày học theo giai đoạn: 'hiragana' | 'katakana' | 'checkpoint'
 */
export function getDailyPlansByPhase(phase) {
  if (phase === 'all') return KANA_DAILY_MAP;
  return KANA_DAILY_MAP.filter((d) => d.phase === phase);
}

/**
 * Tính toán tỷ lệ phần trăm hoàn thành lộ trình Kana
 * @param {Array<number>} completedDays - Mảng các ngày đã hoàn thành (VD: [1, 2, 3])
 */
export function calculateKanaCurriculumProgress(completedDays = []) {
  const total = KANA_DAILY_MAP.length;
  const completedCount = completedDays.length;
  const percent = Math.min(100, Math.round((completedCount / total) * 100));
  return {
    totalDays: total,
    completedDays: completedCount,
    percent,
    currentDay: Math.min(total, completedCount + 1),
    isGraduated: completedCount >= total
  };
}
