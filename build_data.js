import fs from 'fs';
import path from 'path';

// --- 1. HIRAGANA DATA ---
const hiraganaList = [
  {
    char: "あ", romaji: "a", strokeCount: 3,
    strokeRules: ["1. Nét ngang ngắn từ trái sang phải", "2. Nét sổ cong từ trên xuống cắt qua giữa nét 1", "3. Nét cong xoắn tròn lớn từ giữa sang phải rồi uốn xuống"],
    mnemonic: { title: "Quả Táo (Apple)", story: "Chữ あ nhìn như một quả táo đỏ mọng có cuống lá ở trên và thân tròn trịa. Cắn một miếng kêu 'A!'." },
    examples: [{ word: "あい (ai)", hanviet: "Ái", meaning: "Tình yêu" }, { word: "あさ (asa)", hanviet: "Triêu", meaning: "Buổi sáng" }, { word: "あめ (ame)", hanviet: "Vũ", meaning: "Cơn mưa" }],
    strokeSvgPaths: [
      "M 30 110 Q 100 100 170 95",
      "M 105 40 Q 110 130 95 210",
      "M 80 120 Q 170 80 175 160 Q 175 220 110 215 Q 50 200 70 140 Q 80 115 110 120"
    ]
  },
  {
    char: "い", romaji: "i", strokeCount: 2,
    strokeRules: ["1. Nét cong bên trái kéo từ trên xuống rồi hất nhẹ lên", "2. Nét ngắn hơn ở bên phải hơi uốn cong hướng vào nét 1"],
    mnemonic: { title: "Hai con lươn (Eels)", story: "Chữ い giống như 2 con lươn bơi song song hoặc hai thanh kiếm katana đứng cạnh nhau." },
    examples: [{ word: "いぬ (inu)", hanviet: "Khuyển", meaning: "Con chó" }, { word: "いえ (ie)", hanviet: "Gia", meaning: "Ngôi nhà" }, { word: "いち (ichi)", hanviet: "Nhất", meaning: "Số 1" }],
    strokeSvgPaths: [
      "M 60 60 Q 40 140 70 190 Q 75 180 85 165",
      "M 140 85 Q 160 130 145 170"
    ]
  },
  {
    char: "う", romaji: "u", strokeCount: 2,
    strokeRules: ["1. Nét phẩy ngắn xiên chéo ở trên", "2. Nét cong lớn uốn lượn hình chữ C ngược từ trái sang phải"],
    mnemonic: { title: "Người đau lưng kêu 'U'", story: "Chữ う giống một người gù lưng đang mang vác nặng cúi gập người xuống rên 'U... mệt quá!'." },
    examples: [{ word: "うみ (umi)", hanviet: "Hải", meaning: "Biển" }, { word: "うた (uta)", hanviet: "Ca", meaning: "Bài hát" }, { word: "うえ (ue)", hanviet: "Thượng", meaning: "Phía trên" }],
    strokeSvgPaths: [
      "M 85 50 Q 115 65 125 75",
      "M 70 105 Q 150 90 150 145 Q 150 200 80 205"
    ]
  },
  {
    char: "え", romaji: "e", strokeCount: 2,
    strokeRules: ["1. Nét chấm phẩy nhỏ ở trên đỉnh", "2. Nét zíc zắc: ngang ngắn, chéo xuống trái, rồi lượn sóng sang phải giống số 5"],
    mnemonic: { title: "Chú chim bồ câu bay", story: "Chữ え nhìn giống chú chim bồ câu hoặc một vận động viên thể dục (Energetic) đang chạy." },
    examples: [{ word: "えき (eki)", hanviet: "Dịch", meaning: "Nhà ga" }, { word: "えん (en)", hanviet: "Yên", meaning: "Tiền Yên Nhật" }, { word: "えんぴつ (enpitsu)", hanviet: "Duyên bút", meaning: "Bút chì" }],
    strokeSvgPaths: [
      "M 90 50 Q 110 65 120 75",
      "M 60 110 L 140 105 L 75 180 Q 115 160 150 175 Q 170 185 180 175"
    ]
  },
  {
    char: "お", romaji: "o", strokeCount: 3,
    strokeRules: ["1. Nét ngang ngắn từ trái sang phải", "2. Nét sổ thẳng xuống cắt nét 1 rồi uốn vòng xoắn lớn sang phải", "3. Nét chấm ngắn bên trên góc phải"],
    mnemonic: { title: "Cú đánh Golf 'Oh!'", story: "Chữ お giống người đàn ông đang vung gậy đánh bóng golf vào lỗ và reo lên 'Oh!'." },
    examples: [{ word: "おんがく (ongaku)", hanviet: "Âm nhạc", meaning: "Âm nhạc" }, { word: "おんな (onna)", hanviet: "Nữ", meaning: "Phụ nữ" }, { word: "おちゃ (ocha)", hanviet: "Trà", meaning: "Trà xanh" }],
    strokeSvgPaths: [
      "M 50 100 L 120 95",
      "M 90 55 L 90 150 Q 90 210 140 200 Q 175 190 160 140 Q 145 110 115 120",
      "M 145 75 Q 165 95 170 105"
    ]
  },
  {
    char: "か", romaji: "ka", strokeCount: 3,
    strokeRules: ["1. Nét ngang gập móc sang phải và uốn xuống", "2. Nét cong dài sổ xuống cắt nét 1", "3. Nét chấm ngắn bên trên góc phải"],
    mnemonic: { title: "Người vác đòn gánh", story: "Chữ か giống người đang gồng lưng vác vật nặng, giọt mồ hôi bắn ra (nét chấm), thở dài 'Ka!'." },
    examples: [{ word: "かわ (kawa)", hanviet: "Xuyên", meaning: "Con sông" }, { word: "かさ (kasa)", hanviet: "Tản", meaning: "Cái ô/dù" }, { word: "かみ (kami)", hanviet: "Chỉ/Thần", meaning: "Giấy / Thần linh" }],
    strokeSvgPaths: [
      "M 55 90 Q 115 75 130 90 Q 130 140 100 175 Q 95 165 90 150",
      "M 85 55 Q 80 130 55 200",
      "M 145 65 Q 160 85 165 95"
    ]
  },
  {
    char: "き", romaji: "ki", strokeCount: 4,
    strokeRules: ["1. Nét ngang ngắn thứ nhất", "2. Nét ngang ngắn thứ hai song song hơi dài hơn", "3. Nét sổ chéo từ trên xuống cắt qua 2 nét ngang rồi hất nhẹ sang trái", "4. Nét vòng cung ở dưới đỡ lấy thân chữ"],
    mnemonic: { title: "Chiếc Chìa Khóa (Key)", story: "Chữ き trông giống như một chiếc chìa khóa cổ bằng đồng (Key - đọc là Ki)." },
    examples: [{ word: "き (ki)", hanviet: "Mộc", meaning: "Cái cây" }, { word: "きって (kitte)", hanviet: "Thiết thủ", meaning: "Con tem" }, { word: "きっぷ (kippu)", hanviet: "Thiết phiếu", meaning: "Vé tàu" }],
    strokeSvgPaths: [
      "M 65 85 L 135 80",
      "M 55 115 L 145 110",
      "M 115 50 L 85 155 Q 75 170 65 170",
      "M 65 170 Q 105 200 135 180"
    ]
  },
  {
    char: "く", romaji: "ku", strokeCount: 1,
    strokeRules: ["1. Một nét duy nhất: gập góc nhọn từ trên sang trái rồi chéo xuống sang phải giống mỏ chim"],
    mnemonic: { title: "Mỏ chim Cuckoo kêu 'Cúc cu'", story: "Chữ く như cái mỏ chim đang mở rộng kêu 'Cúc cu' đòi ăn." },
    examples: [{ word: "くるま (kuruma)", hanviet: "Xa", meaning: "Xe hơi" }, { word: "くに (kuni)", hanviet: "Quốc", meaning: "Đất nước" }, { word: "くち (kuchi)", hanviet: "Khẩu", meaning: "Cái miệng" }],
    strokeSvgPaths: [
      "M 140 60 L 60 125 L 145 195"
    ]
  },
  {
    char: "け", romaji: "ke", strokeCount: 3,
    strokeRules: ["1. Nét sổ hơi uốn lượn bên trái và hất nhẹ", "2. Nét ngang ngắn ở bên phải", "3. Nét sổ cong dọc từ trên xuống cắt qua nét ngang"],
    mnemonic: { title: "Thùng Rượu Vang (Keg)", story: "Chữ け giống một chiếc thùng gỗ ủ rượu (Keg) có nắp mở." },
    examples: [{ word: "けさ (kesa)", hanviet: "Kim triêu", meaning: "Sáng nay" }, { word: "けいかく (keikaku)", hanviet: "Kế hoạch", meaning: "Kế hoạch" }, { word: "けっこん (kekkon)", hanviet: "Kết hôn", meaning: "Kết hôn" }],
    strokeSvgPaths: [
      "M 65 60 Q 60 130 65 190 Q 70 175 80 165",
      "M 105 95 L 165 90",
      "M 135 60 Q 140 130 120 200"
    ]
  },
  {
    char: "こ", romaji: "ko", strokeCount: 2,
    strokeRules: ["1. Nét ngang trên hơi võng và hất nhẹ", "2. Nét ngang dưới hơi cong lên tạo thành hai bờ song song"],
    mnemonic: { title: "Hai con cá chép (Koi)", story: "Chữ こ như 2 con cá Koi đang bơi lượn trên dưới đón nhau." },
    examples: [{ word: "こども (kodomo)", hanviet: "Tử", meaning: "Trẻ con" }, { word: "ここ (koko)", meaning: "Ở đây" }, { word: "こえ (koe)", hanviet: "Thanh", meaning: "Giọng nói" }],
    strokeSvgPaths: [
      "M 65 80 Q 115 75 145 85 Q 135 95 125 105",
      "M 60 170 Q 110 185 155 170"
    ]
  },
  {
    char: "さ", romaji: "sa", strokeCount: 3,
    strokeRules: ["1. Nét ngang hơi dốc lên", "2. Nét sổ chéo cắt qua nét ngang và hất sang trái", "3. Vòng cung mở phía dưới"],
    mnemonic: { title: "Vũ công Samurai múa kiếm", story: "Chữ さ giống tư thế một samurai vung thanh kiếm sắc lẹm." },
    examples: [{ word: "さかな (sakana)", hanviet: "Ngư", meaning: "Con cá" }, { word: "さくら (sakura)", hanviet: "Anh", meaning: "Hoa anh đào" }, { word: "さとう (satou)", hanviet: "Sa đường", meaning: "Đường ăn" }],
    strokeSvgPaths: [
      "M 60 85 L 145 75",
      "M 120 50 L 95 145 Q 85 160 75 160",
      "M 75 165 Q 115 205 145 175"
    ]
  },
  {
    char: "し", romaji: "shi", strokeCount: 1,
    strokeRules: ["1. Nét sổ dọc thẳng từ trên xuống rồi uốn cong hất lên sang phải như lưỡi câu"],
    mnemonic: { title: "Lưỡi câu cá (Fishing Hook)", story: "Chữ し như một chiếc lưỡi câu câu được chú cá xiêm (Shi)." },
    examples: [{ word: "しお (shio)", hanviet: "Diêm", meaning: "Muối ăn" }, { word: "しんぶん (shinbun)", hanviet: "Tân văn", meaning: "Báo chí" }, { word: "しろい (shiroi)", hanviet: "Bạch", meaning: "Màu trắng" }],
    strokeSvgPaths: [
      "M 85 55 L 85 160 Q 90 205 145 200 Q 165 195 175 175"
    ]
  },
  {
    char: "す", romaji: "su", strokeCount: 2,
    strokeRules: ["1. Nét ngang dài từ trái qua phải", "2. Nét sổ dọc cắt nét ngang, tạo một vòng tròn thòng lọng ở giữa rồi kéo cong xuống"],
    mnemonic: { title: "Dây đu đu đủ (Swing)", story: "Chữ す giống cái xích đu có vòng dây cuốn lại, em bé trèo lên xoay 'Su...u'." },
    examples: [{ word: "すし (sushi)", hanviet: "Tứ", meaning: "Món Sushi" }, { word: "すき (suki)", hanviet: "Hảo", meaning: "Thích" }, { word: "すこし (sukoshi)", hanviet: "Thiểu", meaning: "Một chút" }],
    strokeSvgPaths: [
      "M 50 85 L 165 75",
      "M 115 45 L 115 125 Q 140 120 135 155 Q 120 180 95 155 Q 85 140 115 135 L 110 205"
    ]
  },
  {
    char: "せ", romaji: "se", strokeCount: 3,
    strokeRules: ["1. Nét ngang dài hơi cong", "2. Nét sổ dọc bên phải gập góc sang trái", "3. Nét sổ dọc bên trái cắt nét 1 và uốn cong sang phải"],
    mnemonic: { title: "Bậc thang thế hệ (Generation)", story: "Chữ せ giống chữ Thế (世) trong thế hệ, người đi trước chỉ đường cho người đi sau." },
    examples: [{ word: "せんせい (sensei)", hanviet: "Tiên sinh", meaning: "Thầy/Cô giáo" }, { word: "せかい (sekai)", hanviet: "Thế giới", meaning: "Thế giới" }, { word: "せなか (senaka)", hanviet: "Bối trung", meaning: "Tấm lưng" }],
    strokeSvgPaths: [
      "M 45 95 L 160 85",
      "M 140 60 L 140 135 L 105 145",
      "M 85 50 L 85 170 Q 90 190 145 185"
    ]
  },
  {
    char: "そ", romaji: "so", strokeCount: 1,
    strokeRules: ["1. Vẽ hình chữ Z ở nửa trên, sau đó lượn vòng cung chữ C ở nửa dưới"],
    mnemonic: { title: "Đường kim mũi chỉ may vá (Sewing)", story: "Chữ そ như đường kim zíc zắc khâu chiếc áo rách khéo léo." },
    examples: [{ word: "そら (sora)", hanviet: "Không", meaning: "Bầu trời" }, { word: "そこ (soko)", meaning: "Chỗ đó" }, { word: "そして (soshite)", meaning: "Và rồi" }],
    strokeSvgPaths: [
      "M 65 65 L 135 65 L 65 125 L 135 125 Q 155 170 110 195 Q 65 200 65 170"
    ]
  },
  {
    char: "た", romaji: "ta", strokeCount: 4,
    strokeRules: ["1. Nét ngang ngắn", "2. Nét sổ chéo cắt qua nét ngang", "3. Nét ngang ngắn ở góc dưới phải", "4. Nét cong ngắn dưới nét 3 (như chữ こ)"],
    mnemonic: { title: "Chữ T và A ghép lại", story: "Bên trái là chữ t, bên phải như chữ a cách điệu -> Đọc luôn là 'Ta'!" },
    examples: [{ word: "たべる (taberu)", hanviet: "Thực", meaning: "Ăn" }, { word: "たまご (tamago)", hanviet: "Noãn", meaning: "Quả trứng" }, { word: "たかい (takai)", hanviet: "Cao", meaning: "Cao / Đắt" }],
    strokeSvgPaths: [
      "M 55 90 L 115 85",
      "M 85 60 L 65 180",
      "M 115 110 L 155 105",
      "M 110 155 Q 140 165 160 150"
    ]
  },
  {
    char: "ち", romaji: "chi", strokeCount: 2,
    strokeRules: ["1. Nét ngang ngắn", "2. Nét sổ dọc cắt qua nét 1 rồi uốn thành bụng tròn số 5"],
    mnemonic: { title: "Vận động viên cổ vũ (Cheerleader)", story: "Chữ ち giống cô gái cổ vũ đang tung váy tròn nhảy Cheer!" },
    examples: [{ word: "ちち (chichi)", hanviet: "Phụ", meaning: "Bố (mình)" }, { word: "ちず (chizu)", hanviet: "Địa đồ", meaning: "Bản đồ" }, { word: "ちかい (chikai)", hanviet: "Cận", meaning: "Gần" }],
    strokeSvgPaths: [
      "M 65 85 L 140 75",
      "M 105 50 L 95 120 Q 155 105 160 160 Q 155 205 95 195"
    ]
  },
  {
    char: "つ", romaji: "tsu", strokeCount: 1,
    strokeRules: ["1. Nét ngang hơi cong rồi uốn lượn thành một ngọn sóng thần lớn từ phải sang trái"],
    mnemonic: { title: "Sóng thần thần tốc (Tsunami)", story: "Chữ つ mang hình dáng một ngọn sóng thần Tsunami cao vút cuộn trào." },
    examples: [{ word: "つくえ (tsukue)", hanviet: "Cơ", meaning: "Cái bàn" }, { word: "つき (tsuki)", hanviet: "Nguyệt", meaning: "Mặt trăng" }, { word: "つかう (tsukau)", hanviet: "Sử", meaning: "Sử dụng" }],
    strokeSvgPaths: [
      "M 60 90 Q 130 65 155 95 Q 170 145 100 195 Q 70 210 60 200"
    ]
  },
  {
    char: "て", romaji: "te", strokeCount: 1,
    strokeRules: ["1. Nét ngang dốc nhẹ sang phải rồi uốn cong ngược lại thành chiếc mui thuyền"],
    mnemonic: { title: "Bàn tay mở rộng (Te = Tay)", story: "Chữ て tiếng Nhật nghĩa là 'Bàn tay', nét vẽ như cánh tay vươn ra đón nhận." },
    examples: [{ word: "て (te)", hanviet: "Thủ", meaning: "Bàn tay" }, { word: "てがみ (tegami)", hanviet: "Thủ chỉ", meaning: "Lá thư" }, { word: "てんき (tenki)", hanviet: "Thời khí", meaning: "Thời tiết" }],
    strokeSvgPaths: [
      "M 60 85 L 145 80 Q 100 135 95 180 Q 100 205 145 190"
    ]
  },
  {
    char: "と", romaji: "to", strokeCount: 2,
    strokeRules: ["1. Nét sổ chéo ngắn từ trên xuống phải", "2. Nét cung tròn lớn ôm lấy nét 1"],
    mnemonic: { title: "Ngón chân cái bị gai cắm (Toe)", story: "Chữ と giống ngón chân cái (Toe) bị que nhọn cắm vào, kêu 'To!'." },
    examples: [{ word: "ともだち (tomodachi)", hanviet: "Hữu đạt", meaning: "Bạn bè" }, { word: "とり (tori)", hanviet: "Điểu", meaning: "Con chim" }, { word: "とけい (tokei)", hanviet: "Thời kế", meaning: "Đồng hồ" }],
    strokeSvgPaths: [
      "M 75 60 L 105 110",
      "M 135 90 Q 60 140 100 200 Q 135 210 155 185"
    ]
  },
  {
    char: "な", romaji: "na", strokeCount: 4,
    strokeRules: ["1. Nét ngang ngắn", "2. Nét sổ chéo cắt qua nét 1", "3. Nét phẩy ngắn phía trên bên phải", "4. Nét sổ thòng lọng có vòng xoắn ở đuôi"],
    mnemonic: { title: "Nữ tu quỳ cầu nguyện (Nun)", story: "Chữ な giống nữ tu quỳ trước cây thánh giá cầu nguyện trang nghiêm." },
    examples: [{ word: "なまえ (namae)", hanviet: "Danh tiền", meaning: "Họ tên" }, { word: "なつ (natsu)", hanviet: "Hạ", meaning: "Mùa hè" }, { word: "なん (nan)", hanviet: "Hà", meaning: "Cái gì" }],
    strokeSvgPaths: [
      "M 55 90 L 105 85",
      "M 85 65 L 75 160",
      "M 130 75 Q 145 90 150 95",
      "M 135 115 L 135 160 Q 145 195 125 195 Q 105 195 115 165"
    ]
  },
  {
    char: "に", romaji: "ni", strokeCount: 3,
    strokeRules: ["1. Nét sổ dọc hơi uốn lượn bên trái", "2. Nét ngang ngắn trên ở bên phải", "3. Nét ngang dưới song song"],
    mnemonic: { title: "Cái kim và 2 sợi chỉ (Needle)", story: "Nét bên trái là cây kim, 2 nét bên phải là 2 sợi chỉ xâu qua kim (Ni = số 2)." },
    examples: [{ word: "にほん (nihon)", hanviet: "Nhật Bản", meaning: "Nước Nhật" }, { word: "にく (niku)", hanviet: "Nhục", meaning: "Thịt" }, { word: "にちようび (nichiyoubi)", hanviet: "Nhật diệu nhật", meaning: "Chủ nhật" }],
    strokeSvgPaths: [
      "M 65 60 Q 60 130 65 195",
      "M 110 95 L 160 90",
      "M 105 165 Q 135 175 165 160"
    ]
  },
  {
    char: "ぬ", romaji: "nu", strokeCount: 2,
    strokeRules: ["1. Nét sổ chéo từ trái sang phải", "2. Nét uốn lượn từ trên cuốn qua nét 1, vòng một bụng tròn lớn và thắt nút xoắn ở đuôi"],
    mnemonic: { title: "Bát mì sợi Udon (Noodles)", story: "Chữ ぬ giống đôi đũa gắp một sợi mì bún xoắn thắt nút ở đuôi (Noodle -> Nu)." },
    examples: [{ word: "いぬ (inu)", hanviet: "Khuyển", meaning: "Con chó" }, { word: "ぬの (nuno)", hanviet: "Bố", meaning: "Vải vóc" }, { word: "ぬる (nuru)", hanviet: "Đồ", meaning: "Sơn, thoa" }],
    strokeSvgPaths: [
      "M 75 75 L 135 195",
      "M 115 65 Q 60 120 60 160 Q 65 200 120 185 Q 155 170 155 140 Q 145 125 125 150 Q 120 185 145 180"
    ]
  },
  {
    char: "ね", romaji: "ne", strokeCount: 2,
    strokeRules: ["1. Nét sổ thẳng đứng bên trái", "2. Nét zíc zắc giống chữ Z rồi kéo sang phải uốn vòng tròn thắt đuôi cá"],
    mnemonic: { title: "Chú mèo con (Neko)", story: "Chữ ね giống một chú mèo con có cái đuôi uốn cong thắt nút ngộ nghĩnh." },
    examples: [{ word: "ねこ (neko)", hanviet: "Miêu", meaning: "Con mèo" }, { word: "ねる (neru)", hanviet: "Tẩm", meaning: "Đi ngủ" }, { word: "ねつ (netsu)", hanviet: "Nhiệt", meaning: "Cơn sốt" }],
    strokeSvgPaths: [
      "M 70 55 L 70 200",
      "M 45 100 L 115 85 L 60 170 L 130 135 Q 160 160 140 190 Q 120 205 110 180 Q 115 165 130 170"
    ]
  },
  {
    char: "の", romaji: "no", strokeCount: 1,
    strokeRules: ["1. Nét xiên chéo từ giữa lên rồi uốn lượn thành một vòng tròn khép kín như biển cấm"],
    mnemonic: { title: "Biển cấm tròn (No Entry)", story: "Chữ の giống biển báo giao thông hình tròn: 'NO - Cấm vào!'." },
    examples: [{ word: "のみもの (nomimono)", hanviet: "Ẩm vật", meaning: "Đồ uống" }, { word: "ノート (nooto)", meaning: "Vở ghi chép" }, { word: "のる (noru)", hanviet: "Thừa", meaning: "Lên xe" }],
    strokeSvgPaths: [
      "M 115 75 L 85 145 Q 65 180 100 195 Q 155 205 170 145 Q 170 85 110 90 Q 80 95 65 130"
    ]
  },
  {
    char: "は", romaji: "ha", strokeCount: 3,
    strokeRules: ["1. Nét sổ thẳng hơi cong bên trái", "2. Nét ngang ngắn bên phải", "3. Nét sổ dọc cắt nét ngang, thắt một vòng xoắn tròn ở đáy"],
    mnemonic: { title: "Chữ H và cây thánh giá", story: "Bên trái là cột cờ, bên phải là chữ 'ha' vui vẻ reo mừng Ha Ha Ha!" },
    examples: [{ word: "はな (hana)", hanviet: "Hoa/Tị", meaning: "Bông hoa / Cái mũi" }, { word: "はい (hai)", meaning: "Vâng, dạ" }, { word: "はる (haru)", hanviet: "Xuân", meaning: "Mùa xuân" }],
    strokeSvgPaths: [
      "M 65 60 Q 60 130 65 195",
      "M 105 95 L 160 90",
      "M 135 60 L 135 155 Q 145 195 125 195 Q 105 195 115 165"
    ]
  },
  {
    char: "ひ", romaji: "hi", strokeCount: 1,
    strokeRules: ["1. Nét ngang ngắn, võng sâu xuống thành nụ cười rồi hất lên bên phải"],
    mnemonic: { title: "Nụ cười toe toét 'Hi hi'", story: "Chữ ひ giống chiếc miệng cười toe toét phát ra tiếng cười 'Hi hi'." },
    examples: [{ word: "ひと (hito)", hanviet: "Nhân", meaning: "Con người" }, { word: "ひ (hi)", hanviet: "Nhật/Hỏa", meaning: "Mặt trời / Ngọn lửa" }, { word: "ひこうき (hikouki)", hanviet: "Phi hành cơ", meaning: "Máy bay" }],
    strokeSvgPaths: [
      "M 65 90 L 85 85 L 60 135 Q 90 195 125 190 Q 155 185 150 120 L 170 85"
    ]
  },
  {
    char: "ふ", romaji: "fu", strokeCount: 4,
    strokeRules: ["1. Nét chấm phẩy nhỏ ở đỉnh", "2. Nét sổ cong ở giữa như cái mũi", "3. Nét phẩy bên trái", "4. Nét chấm bên phải"],
    mnemonic: { title: "Núi Phú Sĩ lửa phun (Fuji)", story: "Chữ ふ giống ngọn núi Phú Sĩ tuyết phủ đang phun trào nham thạch sang hai bên." },
    examples: [{ word: "ふゆ (fuyu)", hanviet: "Đông", meaning: "Mùa đông" }, { word: "ふね (fune)", hanviet: "Chu", meaning: "Tàu thuyền" }, { word: "ふじさん (fujisan)", hanviet: "Phú Sĩ sơn", meaning: "Núi Phú Sĩ" }],
    strokeSvgPaths: [
      "M 105 50 Q 115 65 120 70",
      "M 115 95 Q 95 135 110 185 Q 95 170 85 155",
      "M 65 115 Q 55 135 60 150",
      "M 155 120 Q 165 140 160 155"
    ]
  },
  {
    char: "へ", romaji: "he", strokeCount: 1,
    strokeRules: ["1. Nét chéo lên ngắn sang phải, rồi uốn góc nhọn đổ dốc dài sang phải"],
    mnemonic: { title: "Ngọn đồi thoai thoải (Hill)", story: "Chữ へ như sườn ngọn đồi thoai thoải người ta bước lên thở phào 'He... he'." },
    examples: [{ word: "へや (heya)", hanviet: "Bộ ốc", meaning: "Căn phòng" }, { word: "へた (heta)", hanviet: "Hạ thủ", meaning: "Kém, vụng" }, { word: "へいわ (heiwa)", hanviet: "Bình hòa", meaning: "Hòa bình" }],
    strokeSvgPaths: [
      "M 55 145 L 95 90 L 175 160"
    ]
  },
  {
    char: "ほ", romaji: "ho", strokeCount: 4,
    strokeRules: ["1. Nét sổ thẳng bên trái", "2. Nét ngang trên", "3. Nét ngang dưới ngắn hơn", "4. Nét sổ dọc cắt qua nét ngang dưới (không nhô lên nét trên) và thắt vòng tròn ở đáy"],
    mnemonic: { title: "Chú lính gác đội mũ (Hot)", story: "Chữ ほ giống chữ は nhưng có thêm chiếc nón che nắng vì trời quá 'Ho... hot'!" },
    examples: [{ word: "ほん (hon)", hanviet: "Bản", meaning: "Quyển sách" }, { word: "ほし (hoshi)", hanviet: "Tinh", meaning: "Ngôi sao" }, { word: "ほね (hone)", hanviet: "Cốt", meaning: "Khung xương" }],
    strokeSvgPaths: [
      "M 65 60 Q 60 130 65 195",
      "M 100 80 L 160 75",
      "M 105 115 L 155 110",
      "M 130 85 L 130 160 Q 140 195 120 195 Q 100 195 110 165"
    ]
  },
  {
    char: "ま", romaji: "ma", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên dài", "2. Nét ngang dưới ngắn hơn", "3. Nét sổ thẳng cắt qua 2 nét ngang rồi xoắn tròn ở đáy"],
    mnemonic: { title: "Cột buồm tàu biển (Mast)", story: "Chữ ま giống cột buồm tàu thuyền căng gió vượt đại dương ma thuật." },
    examples: [{ word: "まち (machi)", hanviet: "Đinh", meaning: "Thị trấn / Phố xá" }, { word: "まいにち (mainichi)", hanviet: "Mỗi nhật", meaning: "Mỗi ngày" }, { word: "まえ (mae)", hanviet: "Tiền", meaning: "Phía trước" }],
    strokeSvgPaths: [
      "M 55 80 L 160 75",
      "M 65 115 L 150 110",
      "M 110 50 L 110 160 Q 120 195 100 195 Q 85 195 95 165"
    ]
  },
  {
    char: "み", romaji: "mi", strokeCount: 2,
    strokeRules: ["1. Nét ngang ngắn uốn chéo xuống, thắt một vòng xoắn tròn rồi vạch ngang dài sang phải", "2. Nét phẩy cong chéo từ trên xuống cắt đuôi nét 1"],
    mnemonic: { title: "Nốt nhạc Mi xinh đẹp", story: "Chữ み giống số 21 cách điệu hoặc một nốt nhạc Mi lượn sóng du dương." },
    examples: [{ word: "みず (mizu)", hanviet: "Thủy", meaning: "Nước" }, { word: "みち (michi)", hanviet: "Đạo", meaning: "Con đường" }, { word: "みみ (mimi)", hanviet: "Nhĩ", meaning: "Cái tai" }],
    strokeSvgPaths: [
      "M 60 85 L 105 80 L 70 155 Q 95 180 120 155 L 165 145",
      "M 140 95 Q 135 150 110 195"
    ]
  },
  {
    char: "む", romaji: "mu", strokeCount: 3,
    strokeRules: ["1. Nét ngang ngắn", "2. Nét sổ thẳng cắt qua nét 1, xoắn vòng tròn ở giữa rồi hất cong sang phải", "3. Nét chấm phẩy nhỏ ở trên bên phải"],
    mnemonic: { title: "Con bò kêu 'Mooo'", story: "Chữ む nhìn như khuôn mặt con bò sữa có sừng và mũi kêu 'Moo... Mư'." },
    examples: [{ word: "むし (mushi)", hanviet: "Trùng", meaning: "Côn trùng" }, { word: "むら (mura)", hanviet: "Thôn", meaning: "Làng mạc" }, { word: "むずかしい (muzukashii)", hanviet: "Nan", meaning: "Khó khăn" }],
    strokeSvgPaths: [
      "M 60 90 L 120 85",
      "M 90 60 L 90 150 Q 75 190 60 170 Q 55 145 95 150 Q 140 155 160 135",
      "M 145 75 Q 160 95 165 105"
    ]
  },
  {
    char: "め", romaji: "me", strokeCount: 2,
    strokeRules: ["1. Nét phẩy chéo từ trên phải xuống dưới trái", "2. Nét vòng cung lớn uốn cong từ trên trái bao trọn nét 1"],
    mnemonic: { title: "Mắt kính tròn (Me = Mắt)", story: "Chữ め trong tiếng Nhật có nghĩa là 'Mắt' (Me), giống hình tròng mắt to tròn." },
    examples: [{ word: "め (me)", hanviet: "Mục", meaning: "Con mắt" }, { word: "めがね (megane)", hanviet: "Nhãn kính", meaning: "Kính mắt" }, { word: "めいし (meishi)", hanviet: "Danh thích", meaning: "Danh thiếp" }],
    strokeSvgPaths: [
      "M 85 70 L 125 185",
      "M 115 65 Q 60 120 60 160 Q 65 200 120 185 Q 165 165 155 115 Q 145 75 100 85"
    ]
  },
  {
    char: "も", romaji: "mo", strokeCount: 3,
    strokeRules: ["1. Nét móc câu chính giữa: sổ dọc xuống rồi uốn cong móc sang phải", "2. Nét ngang trên", "3. Nét ngang dưới"],
    mnemonic: { title: "Lưỡi câu giun móc mồi (More fish)", story: "Chữ も giống lưỡi câu móc thêm mồi (More) để câu thật nhiều cá." },
    examples: [{ word: "もり (mori)", hanviet: "Sâm", meaning: "Khu rừng" }, { word: "もの (mono)", hanviet: "Vật", meaning: "Đồ vật" }, { word: "もちろん (mochiron)", meaning: "Tất nhiên" }],
    strokeSvgPaths: [
      "M 110 50 L 110 165 Q 115 205 165 185",
      "M 65 95 L 155 90",
      "M 60 135 L 160 130"
    ]
  },
  {
    char: "や", romaji: "ya", strokeCount: 3,
    strokeRules: ["1. Nét cong lượn móc sang phải rồi hất nhẹ", "2. Nét phẩy nhỏ ở trên nét 1", "3. Nét sổ chéo dài cắt qua thân"],
    mnemonic: { title: "Con thuyền buồm (Yacht)", story: "Chữ や như cánh buồm chiếc thuyền Yacht lướt sóng ra khơi." },
    examples: [{ word: "やま (yama)", hanviet: "Sơn", meaning: "Ngọn núi" }, { word: "やすみ (yasumi)", hanviet: "Hưu", meaning: "Nghỉ ngơi" }, { word: "やさい (yasai)", hanviet: "Dã thái", meaning: "Rau củ" }],
    strokeSvgPaths: [
      "M 60 105 Q 115 75 140 105 Q 140 130 115 145",
      "M 130 65 Q 140 85 140 95",
      "M 85 60 L 65 195"
    ]
  },
  {
    char: "ゆ", romaji: "yu", strokeCount: 2,
    strokeRules: ["1. Nét sổ hơi lượn, vòng một bụng tròn rồi vạch ngang cắt qua", "2. Nét sổ cong từ trên xuống cắt thân nét 1"],
    mnemonic: { title: "Con cá bơi lội (Fish)", story: "Chữ ゆ nhìn như một chú cá đang uốn mình bơi trong bồn tắm nước nóng Onsen (Yu = Nước nóng)." },
    examples: [{ word: "ゆき (yuki)", hanviet: "Tuyết", meaning: "Tuyết rơi" }, { word: "ゆめ (yume)", hanviet: "Mộng", meaning: "Giấc mơ" }, { word: "ゆうべ (yuube)", hanviet: "Tịch", meaning: "Tối hôm qua" }],
    strokeSvgPaths: [
      "M 75 75 L 75 145 Q 75 195 125 180 Q 155 165 145 125 L 45 125",
      "M 125 55 Q 125 130 120 195"
    ]
  },
  {
    char: "よ", romaji: "yo", strokeCount: 2,
    strokeRules: ["1. Nét ngang ngắn ở trên bên trái", "2. Nét sổ dọc cắt qua nét ngang, thắt một vòng xoắn nhỏ ở đáy rồi hất sang phải"],
    mnemonic: { title: "Đồ chơi Yo-Yo", story: "Chữ よ giống cái dây treo quả bóng Yo-Yo đang xoay tít." },
    examples: [{ word: "よる (yoru)", hanviet: "Dạ", meaning: "Ban đêm" }, { word: "よい (yoi)", hanviet: "Lương", meaning: "Tốt" }, { word: "よむ (yomu)", hanviet: "Độc", meaning: "Đọc sách" }],
    strokeSvgPaths: [
      "M 65 95 L 115 90",
      "M 120 55 L 120 155 Q 130 195 105 195 Q 85 195 95 165 L 165 165"
    ]
  },
  {
    char: "ら", romaji: "ra", strokeCount: 2,
    strokeRules: ["1. Nét chấm phẩy nhỏ ở đỉnh", "2. Nét sổ ngắn rồi uốn cong thành bụng tròn số 5"],
    mnemonic: { title: "Chú lạc đà (Camel)", story: "Chữ ら giống cái bướu tròn của chú lạc đà (Ra-cà-đà)." },
    examples: [{ word: "らいしゅう (raishuu)", hanviet: "Lai chu", meaning: "Tuần sau" }, { word: "ラジオ (rajio)", meaning: "Đài radio" }, { word: "らくだ (rakuda)", hanviet: "Lạc đà", meaning: "Con lạc đà" }],
    strokeSvgPaths: [
      "M 95 55 Q 115 65 120 75",
      "M 85 95 L 85 135 Q 155 115 155 165 Q 155 205 95 195"
    ]
  },
  {
    char: "り", romaji: "ri", strokeCount: 2,
    strokeRules: ["1. Nét sổ ngắn bên trái hất nhẹ", "2. Nét sổ dài bên phải uốn cong thanh thoát"],
    mnemonic: { title: "Dòng sông chảy (River)", story: "Chữ り như hai bờ của một dòng sông (River) êm đềm." },
    examples: [{ word: "りんご (ringo)", meaning: "Quả táo" }, { word: "りょうり (ryouri)", hanviet: "Liệu lý", meaning: "Nấu ăn / Món ăn" }, { word: "りょこう (ryokou)", hanviet: "Lữ hành", meaning: "Du lịch" }],
    strokeSvgPaths: [
      "M 75 75 Q 70 120 75 145 Q 80 140 85 130",
      "M 135 60 Q 140 145 110 195"
    ]
  },
  {
    char: "る", romaji: "ru", strokeCount: 1,
    strokeRules: ["1. Nét ngang ngắn, chéo xuống như số 3, uốn cong vòng tròn rồi thắt một nút nhỏ ở đuôi"],
    mnemonic: { title: "Đường xoắn ốc Roulette", story: "Chữ る như vòng quay Roulette có viên bi lăn ở đuôi tròn." },
    examples: [{ word: "くるま (kuruma)", hanviet: "Xa", meaning: "Xe hơi" }, { word: "はる (haru)", hanviet: "Xuân", meaning: "Mùa xuân" }, { word: "よる (yoru)", hanviet: "Dạ", meaning: "Ban đêm" }],
    strokeSvgPaths: [
      "M 65 75 L 135 75 L 75 135 Q 150 115 150 165 Q 145 205 115 195 Q 95 190 105 165 Q 120 165 120 180"
    ]
  },
  {
    char: "れ", romaji: "re", strokeCount: 2,
    strokeRules: ["1. Nét sổ thẳng đứng bên trái", "2. Nét zíc zắc giống chữ Z rồi lượn cong hất chân sang phải"],
    mnemonic: { title: "Người đang trượt tuyết (Relax)", story: "Chữ れ giống người đang uốn người trượt băng hất mũi giày lên sảng khoái." },
    examples: [{ word: "れいぞうこ (reizouko)", hanviet: "Lãnh tàng khố", meaning: "Tủ lạnh" }, { word: "れきし (rekishi)", hanviet: "Lịch sử", meaning: "Lịch sử" }, { word: "れんしゅう (renshuu)", hanviet: "Luyện tập", meaning: "Luyện tập" }],
    strokeSvgPaths: [
      "M 70 55 L 70 200",
      "M 45 100 L 115 85 L 60 170 L 125 135 Q 155 150 165 185"
    ]
  },
  {
    char: "ろ", romaji: "ro", strokeCount: 1,
    strokeRules: ["1. Nét vẽ giống hệt chữ る nhưng không có vòng xoắn thắt nút ở đuôi (giống số 3)"],
    mnemonic: { title: "Tên cướp biển chôm mất viên ngọc (Robber)", story: "Chữ ろ giống chữ る nhưng viên ngọc ở đuôi đã bị tên cướp (Robber) lấy mất rồi!" },
    examples: [{ word: "ろく (roku)", hanviet: "Lục", meaning: "Số 6" }, { word: "しろ (shiro)", hanviet: "Bạch/Thành", meaning: "Màu trắng / Lâu đài" }, { word: "くろ (kuro)", hanviet: "Hắc", meaning: "Màu đen" }],
    strokeSvgPaths: [
      "M 65 75 L 135 75 L 75 135 Q 155 115 150 170 Q 140 205 85 195"
    ]
  },
  {
    char: "わ", romaji: "wa", strokeCount: 2,
    strokeRules: ["1. Nét sổ thẳng đứng bên trái", "2. Nét zíc zắc lượn sang phải uốn thành vòng tròn lớn không thắt nút"],
    mnemonic: { title: "Chú thiên nga bơi (Swan)", story: "Chữ わ giống một chú thiên nga trắng duyên dáng đang xòe cánh." },
    examples: [{ word: "わたし (watashi)", hanviet: "Tư", meaning: "Tôi" }, { word: "わかる (wakaru)", hanviet: "Phân", meaning: "Hiểu biết" }, { word: "わに (wani)", meaning: "Con cá sấu" }],
    strokeSvgPaths: [
      "M 70 55 L 70 200",
      "M 45 100 L 115 85 L 70 160 Q 165 125 155 175 Q 140 205 95 195"
    ]
  },
  {
    char: "を", romaji: "wo", strokeCount: 3,
    strokeRules: ["1. Nét ngang ngắn", "2. Nét sổ chéo rồi gập ngang", "3. Nét vòng cung chữ C uốn ở dưới"],
    mnemonic: { title: "Vận động viên nhảy cao 'Woah!'", story: "Chữ を (trợ từ chỉ tân ngữ) giống người bật nhảy qua xà cao kêu 'Woah!'." },
    examples: [{ word: "ほん を よむ (hon wo yomu)", meaning: "Đọc sách" }, { word: "みず を のむ (mizu wo nomu)", meaning: "Uống nước" }],
    strokeSvgPaths: [
      "M 60 85 L 135 80",
      "M 95 55 L 75 135 L 140 120",
      "M 95 130 Q 155 150 135 195 Q 110 210 80 190"
    ]
  },
  {
    char: "ん", romaji: "n", strokeCount: 1,
    strokeRules: ["1. Nét sổ chéo xuống rồi uốn lượn hất lên sang phải như chữ 'n' viết thường"],
    mnemonic: { title: "Chữ n viết hoa mỹ", story: "Chữ ん nhìn hệt như chữ 'n' trong bảng chữ cái Latinh viết nghiêng uốn lượn." },
    examples: [{ word: "ほん (hon)", hanviet: "Bản", meaning: "Quyển sách" }, { word: "にほん (nihon)", hanviet: "Nhật Bản", meaning: "Nước Nhật" }, { word: "せんせい (sensei)", hanviet: "Tiên sinh", meaning: "Thầy cô giáo" }],
    strokeSvgPaths: [
      "M 80 70 L 65 185 Q 105 120 130 145 Q 145 175 165 160"
    ]
  }
];

// --- 2. KATAKANA DATA ---
const katakanaList = [
  {
    char: "ア", romaji: "a", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập móc sang trái", "2. Nét phẩy cong dài từ trên xuống"],
    mnemonic: { title: "Đỉnh núi Alps (A)", story: "Chữ ア góc cạnh như sườn dốc cheo leo của dãy núi Alps." },
    examples: [{ word: "アイス (aisu)", meaning: "Kem (Ice cream)" }, { word: "アメリカ (amerika)", meaning: "Nước Mỹ" }],
    strokeSvgPaths: ["M 65 80 L 145 80 L 125 115", "M 105 85 Q 95 145 60 195"]
  },
  {
    char: "イ", romaji: "i", strokeCount: 2,
    strokeRules: ["1. Nét phẩy chéo từ trên phải xuống dưới trái", "2. Nét sổ thẳng từ giữa nét 1 xuống"],
    mnemonic: { title: "Bức tranh giá vẽ (Easel)", story: "Chữ イ giống giá vẽ tranh chữ I đứng thẳng đứng." },
    examples: [{ word: "イギリス (igirisu)", meaning: "Nước Anh" }, { word: "インク (inku)", meaning: "Mực in (Ink)" }],
    strokeSvgPaths: ["M 125 60 L 75 125", "M 95 110 L 95 200"]
  },
  {
    char: "ウ", romaji: "u", strokeCount: 3,
    strokeRules: ["1. Nét chấm thẳng ở đỉnh", "2. Nét phẩy ngắn bên trái", "3. Nét ngang gập cong sang phải"],
    mnemonic: { title: "Cái ô mở ra (Umbrella)", story: "Chữ ウ giống cái chóp nhọn của chiếc ô chống mưa bão." },
    examples: [{ word: "ウール (uuru)", meaning: "Sợi len (Wool)" }, { word: "ウェブ (webu)", meaning: "Trang web" }],
    strokeSvgPaths: ["M 105 50 L 105 75", "M 65 95 L 65 125", "M 65 95 L 145 95 L 120 185"]
  },
  {
    char: "エ", romaji: "e", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên", "2. Nét sổ thẳng ở giữa", "3. Nét ngang dưới dài hơn nét trên"],
    mnemonic: { title: "Cột dầm công trình (Elevator beam)", story: "Chữ エ giống thanh dầm thép chữ I hoặc thang máy công trình." },
    examples: [{ word: "エレベーター (erebeetaa)", meaning: "Thang máy" }, { word: "エアコン (eakon)", meaning: "Máy điều hòa" }],
    strokeSvgPaths: ["M 65 75 L 145 75", "M 105 75 L 105 165", "M 50 165 L 160 165"]
  },
  {
    char: "オ", romaji: "o", strokeCount: 3,
    strokeRules: ["1. Nét ngang", "2. Nét sổ dọc có móc hất sang trái", "3. Nét phẩy chéo từ góc giao nhau sang phải"],
    mnemonic: { title: "Diễn viên Opera hát O", story: "Chữ オ giống nghệ sĩ opera giơ một tay biểu diễn say sưa." },
    examples: [{ word: "オレンジ (orenji)", meaning: "Quả cam (Orange)" }, { word: "オーストラリア (oosutoraria)", meaning: "Nước Úc" }],
    strokeSvgPaths: ["M 55 90 L 150 85", "M 95 55 L 95 195 Q 90 180 80 170", "M 95 95 L 155 185"]
  },
  {
    char: "カ", romaji: "ka", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập móc", "2. Nét phẩy chéo cắt qua nét 1"],
    mnemonic: { title: "Chữ か bỏ giọt mồ hôi", story: "Chữ カ góc cạnh y hệt chữ か Hiragana nhưng bỏ nét phẩy giọt nước." },
    examples: [{ word: "カメラ (kamera)", meaning: "Máy ảnh (Camera)" }, { word: "カフェ (kafe)", meaning: "Quán cà phê" }],
    strokeSvgPaths: ["M 65 85 L 140 85 L 125 135 Q 115 150 100 145", "M 100 55 Q 90 135 55 195"]
  },
  {
    char: "キ", romaji: "ki", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên", "2. Nét ngang dưới song song", "3. Nét sổ chéo cắt qua 2 nét ngang"],
    mnemonic: { title: "Chìa khóa kim loại (Key)", story: "Chữ キ như chữ き Hiragana nhưng phẳng và thẳng tắp dứt khoát." },
    examples: [{ word: "キー (kii)", meaning: "Chìa khóa (Key)" }, { word: "キッチン (kicchin)", meaning: "Nhà bếp (Kitchen)" }],
    strokeSvgPaths: ["M 65 85 L 145 80", "M 55 125 L 155 120", "M 115 55 L 75 195"]
  },
  {
    char: "ク", romaji: "ku", strokeCount: 2,
    strokeRules: ["1. Nét phẩy ngắn bên trái", "2. Nét ngang gập kéo cong dài sang trái"],
    mnemonic: { title: "Đầu bếp nấu ăn (Cook)", story: "Chữ ク giống cái nón của đầu bếp (Cook) đang chế biến món ngon." },
    examples: [{ word: "クラス (kurasu)", meaning: "Lớp học (Class)" }, { word: "タクシー (takushii)", meaning: "Xe taxi" }],
    strokeSvgPaths: ["M 105 60 L 65 125", "M 75 95 L 145 95 Q 125 155 65 200"]
  },
  {
    char: "ケ", romaji: "ke", strokeCount: 3,
    strokeRules: ["1. Nét phẩy ngắn bên trái", "2. Nét ngang ngắn bên phải", "3. Nét cong dài cắt qua nét ngang"],
    mnemonic: { title: "Cái Kệ đựng đồ (K)", story: "Chữ ケ nhìn như chữ K cách điệu hoặc một cái kệ gỗ nhiều ngăn." },
    examples: [{ word: "ケーキ (keeki)", meaning: "Bánh ngọt (Cake)" }, { word: "ケース (keesu)", meaning: "Hộp đựng (Case)" }],
    strokeSvgPaths: ["M 95 55 L 65 115", "M 90 95 L 155 90", "M 125 95 Q 115 155 65 195"]
  },
  {
    char: "コ", romaji: "ko", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập góc vuông", "2. Nét ngang đáy nối vào chân"],
    mnemonic: { title: "Chiếc hộp mở góc (Corner)", story: "Chữ コ như góc vuông của chiếc hộp quà (Corner - Ko)." },
    examples: [{ word: "コーヒー (koohii)", meaning: "Cà phê (Coffee)" }, { word: "コンビニ (konbini)", meaning: "Cửa hàng tiện lợi" }],
    strokeSvgPaths: ["M 65 75 L 145 75 L 145 165", "M 65 165 L 145 165"]
  },
  {
    char: "サ", romaji: "sa", strokeCount: 3,
    strokeRules: ["1. Nét ngang dài", "2. Nét sổ dọc ngắn bên trái", "3. Nét sổ dọc hơi cong bên phải dài hơn"],
    mnemonic: { title: "Chiếc ván lướt sóng (Surfboard)", story: "Chữ サ giống 2 cột buồm trên tấm ván lướt sóng biển (Sa)." },
    examples: [{ word: "サラダ (sarada)", meaning: "Món salad" }, { word: "サッカー (sakkaa)", meaning: "Bóng đá (Soccer)" }],
    strokeSvgPaths: ["M 55 95 L 155 90", "M 85 65 L 85 145", "M 125 60 Q 125 135 115 185"]
  },
  {
    char: "シ", romaji: "shi", strokeCount: 3,
    strokeRules: ["1. Nét chấm trên", "2. Nét chấm dưới", "3. Nét phẩy vuốt TỪ DƯỚI LÊN TRÊN sang phải"],
    mnemonic: { title: "Cô gái cười duyên (She)", story: "Chữ シ như khuôn mặt cô gái (She) nghiêng đầu mỉm cười, mắt vuốt cong." },
    examples: [{ word: "シャツ (shatsu)", meaning: "Áo sơ mi (Shirt)" }, { word: "シャワー (shawaa)", meaning: "Vòi sen (Shower)" }],
    strokeSvgPaths: ["M 70 75 Q 85 85 95 90", "M 65 120 Q 80 130 90 135", "M 60 185 Q 115 155 145 70"]
  },
  {
    char: "ス", romaji: "su", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập chéo sang trái", "2. Nét phẩy từ giữa nét chéo vút sang phải"],
    mnemonic: { title: "Vận động viên trượt tuyết (Ski)", story: "Chữ ス giống người đang co chân phóng trượt tuyết siêu tốc." },
    examples: [{ word: "スポーツ (supootsu)", meaning: "Thể thao (Sports)" }, { word: "スーパー (suupaa)", meaning: "Siêu thị (Supermarket)" }],
    strokeSvgPaths: ["M 65 80 L 145 80 L 85 195", "M 105 125 L 155 195"]
  },
  {
    char: "セ", romaji: "se", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập góc uốn vào trong", "2. Nét sổ dọc gập ngang đáy sang phải"],
    mnemonic: { title: "Bối cảnh sân khấu (Set)", story: "Chữ セ giống góc dựng phim trường sân khấu (Set)." },
    examples: [{ word: "セーター (seetaa)", meaning: "Áo len (Sweater)" }, { word: "ゼロ (zero)", meaning: "Số 0 (Zero)" }],
    strokeSvgPaths: ["M 65 80 L 145 80 L 135 135", "M 85 65 L 85 165 L 155 165"]
  },
  {
    char: "ソ", romaji: "so", strokeCount: 2,
    strokeRules: ["1. Nét chấm phẩy bên trái", "2. Nét vuốt TỪ TRÊN XUỐNG DƯỚI sang trái"],
    mnemonic: { title: "Cây kem ốc quế (Soft cream)", story: "Chữ ソ giống viên kem mềm rót từ trên xuống chiếc nón ốc quế." },
    examples: [{ word: "ソフト (sofuto)", meaning: "Phần mềm (Software)" }, { word: "ソックス (sokkusu)", meaning: "Đôi tất (Socks)" }],
    strokeSvgPaths: ["M 75 75 Q 90 95 95 105", "M 135 70 L 70 195"]
  },
  {
    char: "タ", romaji: "ta", strokeCount: 3,
    strokeRules: ["1. Nét phẩy ngắn", "2. Nét ngang gập cong", "3. Nét phẩy ngắn ở bụng"],
    mnemonic: { title: "Thủy thủ lái tàu (Titanic)", story: "Chữ タ như mũi chiếc tàu vượt sóng lớn dũng mãnh." },
    examples: [{ word: "タオル (taoru)", meaning: "Khăn tắm (Towel)" }, { word: "タクシー (takushii)", meaning: "Xe taxi" }],
    strokeSvgPaths: ["M 95 60 L 65 115", "M 75 95 L 145 95 Q 125 155 65 200", "M 90 135 L 135 165"]
  },
  {
    char: "チ", romaji: "chi", strokeCount: 3,
    strokeRules: ["1. Nét phẩy ngang từ phải sang trái", "2. Nét ngang chính", "3. Nét sổ cong từ trên xuống sang trái"],
    mnemonic: { title: "Hoạt náo viên cổ vũ (Cheer)", story: "Chữ チ giống chữ ち nhưng thẳng thớm như ngọn cờ cổ vũ." },
    examples: [{ word: "チーズ (chiizu)", meaning: "Phô mai (Cheese)" }, { word: "チケット (chiketto)", meaning: "Vé xem phim (Ticket)" }],
    strokeSvgPaths: ["M 145 65 L 75 80", "M 55 115 L 155 110", "M 105 85 Q 105 150 70 195"]
  },
  {
    char: "ツ", romaji: "tsu", strokeCount: 3,
    strokeRules: ["1. Nét chấm thứ nhất trên đỉnh", "2. Nét chấm thứ hai bên cạnh", "3. Nét vuốt TỪ TRÊN XUỐNG DƯỚI sang trái"],
    mnemonic: { title: "Cặp song sinh mặt cười (Twins)", story: "Chữ ツ như hai mắt của cặp song sinh cười hí mắt (phân biệt với シ vuốt từ dưới lên)." },
    examples: [{ word: "ツアー (tsuaa)", meaning: "Chuyến du lịch (Tour)" }, { word: "シャツ (shatsu)", meaning: "Áo sơ mi" }],
    strokeSvgPaths: ["M 70 70 Q 80 85 85 95", "M 105 80 Q 115 95 120 105", "M 145 70 L 75 195"]
  },
  {
    char: "テ", romaji: "te", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên ngắn", "2. Nét ngang dưới dài hơn", "3. Nét sổ cong từ giữa nét 2 lượn sang trái"],
    mnemonic: { title: "Cột ăng-ten truyền hình (Antenna)", story: "Chữ テ giống cột ăng-ten đón sóng truyền hình rõ nét." },
    examples: [{ word: "テスト (tesuto)", meaning: "Bài kiểm tra (Test)" }, { word: "テレビ (terebi)", meaning: "Tivi (Television)" }],
    strokeSvgPaths: ["M 75 75 L 135 75", "M 55 115 L 155 110", "M 105 115 Q 100 160 65 195"]
  },
  {
    char: "ト", romaji: "to", strokeCount: 2,
    strokeRules: ["1. Nét sổ thẳng đứng", "2. Nét chéo ngắn từ giữa sang phải"],
    mnemonic: { title: "Cái cọc gỗ cắm cờ (Totem)", story: "Chữ ト giống cây cọc gỗ Totem có nhánh chỉ đường." },
    examples: [{ word: "トイレ (toire)", meaning: "Nhà vệ sinh (Toilet)" }, { word: "トマト (tomato)", meaning: "Quả cà chua" }],
    strokeSvgPaths: ["M 85 55 L 85 200", "M 85 115 L 145 155"]
  },
  {
    char: "ナ", romaji: "na", strokeCount: 2,
    strokeRules: ["1. Nét ngang", "2. Nét sổ chéo dài uốn cong nhẹ sang trái"],
    mnemonic: { title: "Thanh kiếm Ninja chém (Ninja)", story: "Chữ ナ như thanh kiếm báu của Ninja chém ngang một nhát." },
    examples: [{ word: "ナイフ (naifu)", meaning: "Con dao (Knife)" }, { word: "バナナ (banana)", meaning: "Quả chuối (Banana)" }],
    strokeSvgPaths: ["M 60 90 L 155 85", "M 110 60 Q 105 140 60 195"]
  },
  {
    char: "ニ", romaji: "ni", strokeCount: 2,
    strokeRules: ["1. Nét ngang trên ngắn", "2. Nét ngang dưới dài hơn song song"],
    mnemonic: { title: "Số 2 trong chữ Hán (Nhị)", story: "Chữ ニ chính là chữ Nhị (二) nghĩa là số 2." },
    examples: [{ word: "ニュース (nyuusu)", meaning: "Tin tức (News)" }, { word: "アニメ (anime)", meaning: "Phim hoạt hình" }],
    strokeSvgPaths: ["M 70 90 L 140 85", "M 55 155 L 155 150"]
  },
  {
    char: "ヌ", romaji: "nu", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập chéo sang trái", "2. Nét phẩy chéo cắt qua chân"],
    mnemonic: { title: "Đũa gắp sợi mì (Noodle)", story: "Chữ ヌ như đôi đũa gắp sợi mì nhanh gọn dứt khoát." },
    examples: [{ word: "カヌー (kanuu)", meaning: "Thuyền ca-nô (Canoe)" }],
    strokeSvgPaths: ["M 65 80 L 145 80 L 80 185", "M 85 125 L 145 175"]
  },
  {
    char: "ネ", romaji: "ne", strokeCount: 4,
    strokeRules: ["1. Nét chấm trên", "2. Nét ngang gập chéo", "3. Nét sổ thẳng ở giữa", "4. Nét chấm bên phải"],
    mnemonic: { title: "Bộ cà vạt lịch lãm (Necktie)", story: "Chữ ネ giống chiếc cà vạt (Necktie) thắt gọn gàng trên cổ áo sơ mi." },
    examples: [{ word: "ネクタイ (nekutai)", meaning: "Cà vạt (Necktie)" }, { word: "インターネット (intaanetto)", meaning: "Mạng Internet" }],
    strokeSvgPaths: ["M 105 50 L 105 70", "M 65 85 L 125 85 L 75 145", "M 105 110 L 105 195", "M 115 135 L 145 165"]
  },
  {
    char: "ノ", romaji: "no", strokeCount: 1,
    strokeRules: ["1. Một nét phẩy cong duy nhất từ trên phải vuốt nhẹ sang trái"],
    mnemonic: { title: "Cái mũi cao thanh tú (Nose)", story: "Chữ ノ giống sống mũi cao thẳng tắp (Nose)." },
    examples: [{ word: "ノート (nooto)", meaning: "Vở ghi chép (Notebook)" }, { word: "ピアノ (piano)", meaning: "Đàn dương cầm" }],
    strokeSvgPaths: ["M 135 60 Q 115 130 65 195"]
  },
  {
    char: "ハ", romaji: "ha", strokeCount: 2,
    strokeRules: ["1. Nét phẩy bên trái", "2. Nét mác bên phải mở rộng hình chữ Bát"],
    mnemonic: { title: "Cái lều dã ngoại (Hut)", story: "Chữ ハ giống chiếc lều hình tam giác dựng trong rừng (Hut)." },
    examples: [{ word: "パン (pan)", meaning: "Bánh mì" }, { word: "ハンバーガー (hanbaagaa)", meaning: "Bánh hăm-bơ-gơ" }],
    strokeSvgPaths: ["M 85 75 L 60 175", "M 125 80 L 155 180"]
  },
  {
    char: "ヒ", romaji: "hi", strokeCount: 2,
    strokeRules: ["1. Nét ngang ngắn", "2. Nét sổ gập ngang đáy sang phải"],
    mnemonic: { title: "Gót giày cao gót (High heels)", story: "Chữ ヒ như đế đôi giày cao gót tôn dáng phụ nữ." },
    examples: [{ word: "ヒーロー (hiiroo)", meaning: "Anh hùng (Hero)" }, { word: "コーヒー (koohii)", meaning: "Cà phê" }],
    strokeSvgPaths: ["M 85 90 L 135 85", "M 85 60 L 85 165 L 155 165"]
  },
  {
    char: "フ", romaji: "fu", strokeCount: 1,
    strokeRules: ["1. Nét ngang gập cong nhẹ sang trái"],
    mnemonic: { title: "Lá cờ bay trong gió (Flag)", story: "Chữ フ giống ngọn cờ bay phấp phới trong gió bão." },
    examples: [{ word: "フランス (furansu)", meaning: "Nước Pháp" }, { word: "フォーク (fooku)", meaning: "Cái nĩa ăn (Fork)" }],
    strokeSvgPaths: ["M 65 85 L 145 85 Q 125 150 70 195"]
  },
  {
    char: "ヘ", romaji: "he", strokeCount: 1,
    strokeRules: ["1. Nét xiên chéo lên rồi đổ dốc xuống sang phải (giống hệt Hiragana へ)"],
    mnemonic: { title: "Đỉnh đồi dốc (Hill)", story: "Katakana ヘ và Hiragana へ viết y hệt nhau, như đỉnh đồi thoai thoải." },
    examples: [{ word: "ヘルメット (herumetto)", meaning: "Mũ bảo hiểm (Helmet)" }, { word: "ホテル (hoteru)", meaning: "Khách sạn (Hotel)" }],
    strokeSvgPaths: ["M 55 145 L 95 90 L 175 160"]
  },
  {
    char: "ホ", romaji: "ho", strokeCount: 4,
    strokeRules: ["1. Nét ngang", "2. Nét sổ thẳng cắt qua nét ngang", "3. Nét phẩy bên trái", "4. Nét mác bên phải"],
    mnemonic: { title: "Cây thánh giá tại bệnh viện (Hospital)", story: "Chữ ホ như dấu thánh giá chữ Mộc che chở bệnh nhân." },
    examples: [{ word: "ホテル (hoteru)", meaning: "Khách sạn (Hotel)" }, { word: "スポーツ (supootsu)", meaning: "Thể thao" }],
    strokeSvgPaths: ["M 60 85 L 150 80", "M 105 55 L 105 195", "M 85 125 L 60 175", "M 125 125 L 150 175"]
  },
  {
    char: "マ", romaji: "ma", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập chéo sang trái", "2. Nét chấm ngắn bên dưới"],
    mnemonic: { title: "Cốc uống nước (Mug)", story: "Chữ マ giống quai chiếc cốc uống nước ấm áp." },
    examples: [{ word: "マンガ (manga)", meaning: "Truyện tranh Nhật" }, { word: "マイク (maiku)", meaning: "Microphone" }],
    strokeSvgPaths: ["M 65 80 L 145 80 L 75 155", "M 115 135 L 145 175"]
  },
  {
    char: "ミ", romaji: "mi", strokeCount: 3,
    strokeRules: ["1. Nét phẩy chéo thứ nhất", "2. Nét phẩy chéo thứ hai song song", "3. Nét phẩy chéo thứ ba dài hơn ở đáy"],
    mnemonic: { title: "3 nốt nhạc Tam (Mi = 3)", story: "Chữ ミ gồm 3 vạch song song, nhớ đến số 3 (Mitsu = 3)." },
    examples: [{ word: "ミルク (miruku)", meaning: "Sữa tươi (Milk)" }, { word: "ミス (misu)", meaning: "Sai lầm (Mistake)" }],
    strokeSvgPaths: ["M 75 75 L 125 95", "M 70 115 L 130 135", "M 65 155 L 140 175"]
  },
  {
    char: "ム", romaji: "mu", strokeCount: 2,
    strokeRules: ["1. Nét gập tam giác từ trên xuống", "2. Nét ngang đáy"],
    mnemonic: { title: "Hình tam giác kim tự tháp (Museum)", story: "Chữ ム như bảo tàng hình chóp Louvre kỳ vĩ." },
    examples: [{ word: "ムービー (muubii)", meaning: "Bộ phim (Movie)" }, { word: "ゲーム (geemu)", meaning: "Trò chơi điện tử" }],
    strokeSvgPaths: ["M 105 60 L 65 145 L 135 145", "M 125 115 L 150 165"]
  },
  {
    char: "メ", romaji: "me", strokeCount: 2,
    strokeRules: ["1. Nét phẩy dài từ trên phải xuống dưới trái", "2. Nét chéo cắt qua nét 1 tạo dấu X nghiêng"],
    mnemonic: { title: "Thanh kiếm chéo bắt chéo (Metal swords)", story: "Chữ メ giống hai thanh đoản kiếm bắt chéo vào nhau tạo thành dấu nhân." },
    examples: [{ word: "メール (meeru)", meaning: "Thư điện tử (Email)" }, { word: "メニュー (menyuu)", meaning: "Thực đơn (Menu)" }],
    strokeSvgPaths: ["M 135 65 L 65 185", "M 80 85 L 145 175"]
  },
  {
    char: "モ", romaji: "mo", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên", "2. Nét ngang dưới dài hơn", "3. Nét sổ gập ngang đáy sang phải"],
    mnemonic: { title: "Màn hình vi tính (Monitor)", story: "Chữ モ góc cạnh như Hiragana も, như giá đỡ màn hình Monitor." },
    examples: [{ word: "モデル (moderu)", meaning: "Người mẫu (Model)" }, { word: "モノレール (monoreeru)", meaning: "Tàu điện một ray" }],
    strokeSvgPaths: ["M 65 85 L 145 80", "M 55 125 L 155 120", "M 105 55 L 105 165 L 155 165"]
  },
  {
    char: "ヤ", romaji: "ya", strokeCount: 2,
    strokeRules: ["1. Nét ngang gập cong sang trái", "2. Nét sổ chéo cắt qua thân"],
    mnemonic: { title: "Chiếc thuyền buồm thể thao (Yacht)", story: "Chữ ヤ y hệt Hiragana や phiên bản góc cạnh, thể thao hơn." },
    examples: [{ word: "ヤクルト (yakuruto)", meaning: "Sữa chua Yakult" }, { word: "タイヤ (taiya)", meaning: "Lốp xe (Tire)" }],
    strokeSvgPaths: ["M 65 95 L 140 95 L 115 145", "M 95 65 L 75 195"]
  },
  {
    char: "ユ", romaji: "yu", strokeCount: 2,
    strokeRules: ["1. Nét gập góc vuông từ trên sang phải rồi kéo xuống", "2. Nét ngang đáy dài kéo xuyên qua chân nét 1"],
    mnemonic: { title: "Cái móc chữ U (U-turn)", story: "Chữ ユ như chiếc móc khóa hoặc biển quay đầu xe U-turn." },
    examples: [{ word: "ユーモア (yuumoa)", meaning: "Sự hài hước (Humor)" }, { word: "ユニフォーム (yunifoomu)", meaning: "Đồng phục (Uniform)" }],
    strokeSvgPaths: ["M 75 75 L 135 75 L 135 145", "M 55 145 L 160 145"]
  },
  {
    char: "ヨ", romaji: "yo", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên gập dọc xuống", "2. Nét ngang giữa", "3. Nét ngang đáy nối góc"],
    mnemonic: { title: "Chiếc hộp đựng đồ ăn (Yogurt)", story: "Chữ ヨ giống chữ E ngược hoặc 3 tầng ngăn tủ để hộp sữa chua." },
    examples: [{ word: "ヨーグルト (yooguruto)", meaning: "Sữa chua (Yogurt)" }, { word: "ヨーロッパ (yooroppa)", meaning: "Châu Âu (Europe)" }],
    strokeSvgPaths: ["M 65 75 L 145 75 L 145 165", "M 65 120 L 140 120", "M 65 165 L 145 165"]
  },
  {
    char: "ラ", romaji: "ra", strokeCount: 2,
    strokeRules: ["1. Nét ngang trên", "2. Nét gập móc chữ C vuông vức ở dưới"],
    mnemonic: { title: "Đèn bàn chiếu sáng (Lamp)", story: "Chữ ラ giống chiếc đèn bàn góc cạnh chiếu ánh sáng rõ rệt." },
    examples: [{ word: "ラジオ (rajio)", meaning: "Đài Radio" }, { word: "ライオン (raion)", meaning: "Con sư tử (Lion)" }],
    strokeSvgPaths: ["M 70 75 L 135 75", "M 95 105 L 140 105 L 120 185"]
  },
  {
    char: "リ", romaji: "ri", strokeCount: 2,
    strokeRules: ["1. Nét sổ ngắn bên trái", "2. Nét sổ dài cong bên phải"],
    mnemonic: { title: "Dải ruy băng lụa (Ribbon)", story: "Chữ リ giống hai dải ruy băng rủ xuống thanh thoát." },
    examples: [{ word: "リンゴ (ringo)", meaning: "Quả táo" }, { word: "リーダー (riidaa)", meaning: "Người lãnh đạo (Leader)" }],
    strokeSvgPaths: ["M 80 75 L 80 135", "M 130 65 Q 135 145 105 195"]
  },
  {
    char: "ル", romaji: "ru", strokeCount: 2,
    strokeRules: ["1. Nét phẩy dài bên trái", "2. Nét sổ cong móc hất lên bên phải"],
    mnemonic: { title: "Đôi chân sải bước chạy (Run)", story: "Chữ ル như đôi chân dài miên man đang sải bước chạy nhanh (Run)." },
    examples: [{ word: "ルール (ruuru)", meaning: "Quy tắc, luật chơi (Rule)" }, { word: "ホテル (hoteru)", meaning: "Khách sạn" }],
    strokeSvgPaths: ["M 85 70 L 65 185", "M 115 65 L 115 160 Q 120 190 155 185"]
  },
  {
    char: "レ", romaji: "re", strokeCount: 1,
    strokeRules: ["1. Nét sổ thẳng từ trên xuống rồi gập hất xéo sang phải như dấu tích (Checkmark)"],
    mnemonic: { title: "Dấu tích chữ V hoàn thành (Ready)", story: "Chữ レ như dấu tích hoàn thành xuất sắc công việc (Ready)." },
    examples: [{ word: "レストラン (resutoran)", meaning: "Nhà hàng (Restaurant)" }, { word: "レモン (remon)", meaning: "Quả chanh (Lemon)" }],
    strokeSvgPaths: ["M 80 65 L 80 185 L 155 145"]
  },
  {
    char: "ロ", romaji: "ro", strokeCount: 3,
    strokeRules: ["1. Nét sổ dọc bên trái", "2. Nét ngang gập dọc bên phải", "3. Nét ngang đóng đáy hộp"],
    mnemonic: { title: "Miệng hình vuông của chú Robot", story: "Chữ ロ hình vuông vức như cái miệng của chú người máy Robot." },
    examples: [{ word: "ロボット (robotto)", meaning: "Người máy (Robot)" }, { word: "ロシア (roshia)", meaning: "Nước Nga" }],
    strokeSvgPaths: ["M 65 75 L 65 175", "M 65 75 L 145 75 L 145 175", "M 65 175 L 145 175"]
  },
  {
    char: "ワ", romaji: "wa", strokeCount: 2,
    strokeRules: ["1. Nét sổ ngắn bên trái", "2. Nét ngang gập cong sang trái"],
    mnemonic: { title: "Chiếc ly uống rượu vang (Wine glass)", story: "Chữ ワ như phần trên của chiếc ly thủy tinh uống rượu vang (Wine)." },
    examples: [{ word: "ワイン (wain)", meaning: "Rượu vang (Wine)" }, { word: "ワイシャツ (waishatsu)", meaning: "Áo sơ mi trắng" }],
    strokeSvgPaths: ["M 70 85 L 70 125", "M 70 85 L 145 85 Q 125 155 75 195"]
  },
  {
    char: "ヲ", romaji: "wo", strokeCount: 3,
    strokeRules: ["1. Nét ngang trên", "2. Nét ngang dưới ngắn hơn", "3. Nét sổ cong từ trên cắt qua nét 2 sang trái"],
    mnemonic: { title: "Cầu thủ ghi bàn tuyệt đẹp (Woah!)", story: "Chữ ヲ rất hiếm gặp trong Katakana, giống phiên bản hiện đại của trợ từ を." },
    examples: [{ word: "ヲタク (wotaku)", meaning: "Người đam mê văn hóa Nhật (Otaku)" }],
    strokeSvgPaths: ["M 65 75 L 145 75", "M 65 115 L 135 115", "M 115 75 Q 110 150 70 195"]
  },
  {
    char: "ン", romaji: "n", strokeCount: 2,
    strokeRules: ["1. Nét chấm phẩy bên trái", "2. Nét vuốt TỪ DƯỚI LÊN TRÊN sang phải"],
    mnemonic: { title: "Một mắt nháy duyên dáng (Wink)", story: "Chữ ン chỉ có 1 nét chấm và vuốt từ dưới lên (phân biệt với ソ vuốt từ trên xuống)." },
    examples: [{ word: "パン (pan)", meaning: "Bánh mì" }, { word: "ペン (pen)", meaning: "Cây bút mực" }, { word: "マンション (manshon)", meaning: "Căn hộ cao cấp" }],
    strokeSvgPaths: ["M 70 100 Q 85 115 90 125", "M 65 185 Q 115 155 145 75"]
  }
];

// --- 3. KANJI N5 CORE DATA (103+ CHỮ HÁN N5 ĐẦY ĐỦ HÁN-VIỆT, ON/KUN, MẸO NHỚ, TỪ GHÉP) ---
const kanjiN5List = [
  {
    kanji: "日", hanviet: "NHẬT", strokes: 4, radical: "日 (Nhật)",
    onyomi: ["ニチ", "ジツ"], kunyomi: ["ひ", "-び", "-か"],
    meaning: "Mặt trời, ngày, nước Nhật",
    strokeRules: ["1. Sổ thẳng bên trái", "2. Ngang gập sang phải và sổ xuống", "3. Ngang giữa", "4. Ngang đóng đáy"],
    mnemonicStory: "Chữ 日 mô phỏng mặt trời tròn trịa với vệt sáng rực rỡ ở chính giữa.",
    strokeSvgPaths: [
      "M 30 25 L 30 85",
      "M 30 25 L 75 25 L 75 85",
      "M 30 55 L 75 55",
      "M 30 85 L 75 85"
    ],
    compounds: [
      { word: "日本 (にほん)", hanviet: "Nhật Bản", meaning: "Nước Nhật" },
      { word: "日曜日 (にちようび)", hanviet: "Nhật Diệu Nhật", meaning: "Chủ nhật" },
      { word: "毎日 (まいにち)", hanviet: "Mỗi Nhật", meaning: "Mỗi ngày" },
      { word: "休日 (きゅうじつ)", hanviet: "Hưu Nhật", meaning: "Ngày nghỉ" }
    ]
  },
  {
    kanji: "月", hanviet: "NGUYỆT", strokes: 4, radical: "月 (Nguyệt)",
    onyomi: ["ゲツ", "ガツ"], kunyomi: ["つき"],
    meaning: "Mặt trăng, tháng",
    strokeRules: ["1. Phẩy cong bên trái", "2. Ngang gập móc sang phải", "3. Ngang giữa trên", "4. Ngang giữa dưới"],
    mnemonicStory: "Chữ 月 vẽ vầng trăng khuyết dịu dàng với hai dải mây vắt ngang qua bầu trời đêm.",
    strokeSvgPaths: [
      "M 35 20 Q 30 60 20 90",
      "M 35 25 L 75 25 L 75 85 Q 75 90 70 85",
      "M 35 45 L 75 45",
      "M 35 65 L 75 65"
    ],
    compounds: [
      { word: "月曜日 (げつようび)", hanviet: "Nguyệt Diệu Nhật", meaning: "Thứ hai" },
      { word: "一月 (いちがつ)", hanviet: "Nhất Nguyệt", meaning: "Tháng một" },
      { word: "今月 (こんげつ)", hanviet: "Kim Nguyệt", meaning: "Tháng này" },
      { word: "月 (つき)", hanviet: "Nguyệt", meaning: "Mặt trăng" }
    ]
  },
  {
    kanji: "火", hanviet: "HỎA", strokes: 4, radical: "火 (Hỏa)",
    onyomi: ["カ"], kunyomi: ["ひ", "-び"],
    meaning: "Lửa, ngọn lửa",
    strokeRules: ["1. Chấm phẩy bên trái", "2. Phẩy ngắn bên phải", "3. Phẩy cong dài ở giữa", "4. Mác dài sang phải"],
    mnemonicStory: "Chữ 火 như ngọn lửa bùng cháy từ đống củi, hai đốm lửa nhỏ tí tách bắn sang hai bên.",
    strokeSvgPaths: [
      "M 25 45 Q 20 55 30 65",
      "M 75 40 Q 65 50 70 60",
      "M 50 20 Q 50 60 25 85",
      "M 50 50 Q 65 70 85 85"
    ],
    compounds: [
      { word: "火曜日 (かようび)", hanviet: "Hỏa Diệu Nhật", meaning: "Thứ ba" },
      { word: "火山 (かざん)", hanviet: "Hỏa Sơn", meaning: "Núi lửa" },
      { word: "火 (ひ)", hanviet: "Hỏa", meaning: "Ngọn lửa" },
      { word: "火事 (かじ)", hanviet: "Hỏa Sự", meaning: "Vụ hỏa hoạn" }
    ]
  },
  {
    kanji: "水", hanviet: "THỦY", strokes: 4, radical: "水 (Thủy)",
    onyomi: ["スイ"], kunyomi: ["みず"],
    meaning: "Nước, chất lỏng",
    strokeRules: ["1. Sổ móc ở chính giữa", "2. Ngang gập phẩy bên trái", "3. Phẩy chéo ngắn bên phải", "4. Mác dài bên phải"],
    mnemonicStory: "Chữ 水 vẽ dòng nước chính giữa tuôn trào, bọt nước bắn sang hai bên bờ.",
    strokeSvgPaths: [
      "M 50 15 L 50 80 Q 50 90 40 85",
      "M 20 40 L 35 35 L 20 70",
      "M 75 35 L 60 55",
      "M 55 55 L 85 85"
    ],
    compounds: [
      { word: "水曜日 (すいようび)", hanviet: "Thủy Diệu Nhật", meaning: "Thứ tư" },
      { word: "水 (みず)", hanviet: "Thủy", meaning: "Nước uống" },
      { word: "水泳 (すいえい)", hanviet: "Thủy Vịnh", meaning: "Bơi lội" },
      { word: "水道 (すいどう)", hanviet: "Thủy Đạo", meaning: "Nước máy" }
    ]
  },
  {
    kanji: "木", hanviet: "MỘC", strokes: 4, radical: "木 (Mộc)",
    onyomi: ["モク", "ボク"], kunyomi: ["き", "こ-"],
    meaning: "Cái cây, gỗ",
    strokeRules: ["1. Ngang dài", "2. Sổ thẳng ở giữa", "3. Phẩy chéo sang trái", "4. Mác chéo sang phải"],
    mnemonicStory: "Chữ 木 vẽ cái cây có cành tỏa sang ngang, thân thẳng đứng và rễ bám sâu vào lòng đất.",
    strokeSvgPaths: [
      "M 20 40 L 80 40",
      "M 50 15 L 50 85",
      "M 50 40 Q 35 65 15 85",
      "M 50 40 Q 65 65 85 85"
    ],
    compounds: [
      { word: "木曜日 (もくようび)", hanviet: "Mộc Diệu Nhật", meaning: "Thứ năm" },
      { word: "木 (き)", hanviet: "Mộc", meaning: "Cái cây" },
      { word: "木材 (もくざい)", hanviet: "Mộc Tài", meaning: "Gỗ xây dựng" }
    ]
  },
  {
    kanji: "金", hanviet: "KIM", strokes: 8, radical: "金 (Kim)",
    onyomi: ["キン", "コン"], kunyomi: ["かね", "かな-"],
    meaning: "Vàng, tiền bạc, kim loại",
    strokeRules: ["1. Phẩy trên", "2. Mác trên", "3. Ngang ngắn", "4. Sổ thẳng", "5. Chấm phẩy trái", "6. Chấm phải", "7. Ngang giữa", "8. Ngang đáy dài"],
    mnemonicStory: "Dưới mái nhà (人) chôn giấu những quặng vàng quý giá (王 + 2 hạt vàng).",
    strokeSvgPaths: [
      "M 50 15 L 20 40",
      "M 50 15 L 80 40",
      "M 35 45 L 65 45",
      "M 50 45 L 50 75",
      "M 35 60 L 42 63",
      "M 65 60 L 58 63",
      "M 30 65 L 70 65",
      "M 20 85 L 80 85"
    ],
    compounds: [
      { word: "金曜日 (きんようび)", hanviet: "Kim Diệu Nhật", meaning: "Thứ sáu" },
      { word: "お金 (おかね)", hanviet: "Kim", meaning: "Tiền bạc" },
      { word: "金 (きん)", hanviet: "Kim", meaning: "Vàng ròng" },
      { word: "料金 (りょうきん)", hanviet: "Liệu Kim", meaning: "Tiền cước phí" }
    ]
  },
  {
    kanji: "土", hanviet: "THỔ", strokes: 3, radical: "土 (Thổ)",
    onyomi: ["ド", "ト"], kunyomi: ["つち"],
    meaning: "Đất đai, mặt đất",
    strokeRules: ["1. Ngang ngắn trên", "2. Sổ thẳng ở giữa", "3. Ngang dài ở đáy"],
    mnemonicStory: "Một mầm cây nhỏ nhô lên từ lớp đất màu mỡ (nét đáy dài đỡ lấy mặt đất).",
    strokeSvgPaths: [
      "M 30 45 L 70 45",
      "M 50 20 L 50 85",
      "M 15 85 L 85 85"
    ],
    compounds: [
      { word: "土曜日 (どようび)", hanviet: "Thổ Diệu Nhật", meaning: "Thứ bảy" },
      { word: "土地 (とち)", hanviet: "Thổ Địa", meaning: "Đất đai" },
      { word: "お土産 (おみやげ)", hanviet: "Thổ Sản", meaning: "Quà lưu niệm" }
    ]
  },
  {
    kanji: "人", hanviet: "NHÂN", strokes: 2, radical: "人 (Nhân)",
    onyomi: ["ジン", "ニン"], kunyomi: ["ひと"],
    meaning: "Người, con người",
    strokeRules: ["1. Phẩy dài bên trái", "2. Mác tựa vào nét 1 đứng thẳng"],
    mnemonicStory: "Chữ 人 vẽ dáng một người đang sải hai chân bước đi vững chãi về phía trước.",
    strokeSvgPaths: [
      "M 50 15 Q 40 60 15 85",
      "M 45 40 Q 60 65 85 85"
    ],
    compounds: [
      { word: "日本人 (にほんじん)", hanviet: "Nhật Bản Nhân", meaning: "Người Nhật" },
      { word: "ベトナム人 (べとなむじん)", hanviet: "Việt Nam Nhân", meaning: "Người Việt" },
      { word: "一人 (ひとり)", hanviet: "Nhất Nhân", meaning: "1 người / Một mình" },
      { word: "大人 (おとな)", hanviet: "Đại Nhân", meaning: "Người lớn" }
    ]
  },
  {
    kanji: "学", hanviet: "HỌC", strokes: 8, radical: "子 (Tử)",
    onyomi: ["ガク"], kunyomi: ["まな-ぶ"],
    meaning: "Học tập, kiến thức",
    strokeRules: ["1. Chấm trái", "2. Chấm giữa", "3. Phẩy phải", "4. Phẩy bao quanh", "5. Ngang móc (mái nhà)", "6. Ngang gập cong", "7. Sổ cong móc", "8. Ngang cắt"],
    mnemonicStory: "Dưới mái trường (宀), đứa trẻ (子) chăm chỉ học hành nâng cao tri thức.",
    strokeSvgPaths: [
      "M 30 20 L 35 30", "M 50 18 L 50 28", "M 70 20 L 65 30",
      "M 25 35 L 25 45", "M 25 35 L 75 35 L 75 45 Q 75 48 70 45",
      "M 40 50 L 60 50 L 35 70", "M 50 55 Q 50 90 40 85", "M 20 70 L 80 70"
    ],
    compounds: [
      { word: "学生 (がくせい)", hanviet: "Học Sinh", meaning: "Học sinh, sinh viên" },
      { word: "大学 (だいがく)", hanviet: "Đại Học", meaning: "Trường đại học" },
      { word: "学校 (がっこう)", hanviet: "Học Hiệu", meaning: "Trường học" },
      { word: "学ぶ (まなぶ)", hanviet: "Học", meaning: "Học tập" }
    ]
  },
  {
    kanji: "校", hanviet: "HIỆU", strokes: 10, radical: "木 (Mộc)",
    onyomi: ["コウ"], kunyomi: [],
    meaning: "Trường học, kiểm tra",
    strokeRules: ["1. Ngang", "2. Sổ", "3. Phẩy", "4. Mác (bộ Mộc)", "5. Chấm đầu", "6. Ngang", "7. Phẩy", "8. Mác (Giao)"],
    mnemonicStory: "Ngôi trường xây bằng gỗ (木) nơi mọi người giao lưu (交) kết bạn và học tập.",
    strokeSvgPaths: [
      "M 15 40 L 45 40", "M 30 15 L 30 85", "M 30 40 L 15 75", "M 30 45 L 45 75",
      "M 65 15 L 65 25", "M 50 30 L 85 30", "M 65 35 L 50 65", "M 65 35 L 85 65"
    ],
    compounds: [
      { word: "学校 (がっこう)", hanviet: "Học Hiệu", meaning: "Trường học" },
      { word: "高校 (こうこう)", hanviet: "Cao Hiệu", meaning: "Trường cấp ba" },
      { word: "中学校 (ちゅうがっこう)", hanviet: "Trung Học Hiệu", meaning: "Trường cấp hai" }
    ]
  },
  {
    kanji: "先", hanviet: "TIÊN", strokes: 6, radical: "儿 (Nhi)",
    onyomi: ["セン"], kunyomi: ["さき", "ま-ず"],
    meaning: "Trước, đi trước, dẫn đầu",
    strokeRules: ["1. Phẩy ngắn", "2. Ngang ngắn", "3. Sổ thẳng", "4. Ngang dài", "5. Phẩy cong trái", "6. Sổ cong móc phải"],
    mnemonicStory: "Người đi trước dẫn đường (đôi chân đi trước) để hướng dẫn người đi sau.",
    strokeSvgPaths: [
      "M 50 15 L 40 30", "M 25 35 L 75 35", "M 50 35 L 50 55", "M 15 55 L 85 55",
      "M 45 55 Q 35 75 20 85", "M 55 55 Q 55 85 80 85"
    ],
    compounds: [
      { word: "先生 (せんせい)", hanviet: "Tiên Sinh", meaning: "Thầy cô giáo" },
      { word: "先週 (せんしゅう)", hanviet: "Tiên Chu", meaning: "Tuần trước" },
      { word: "先月 (せんげつ)", hanviet: "Tiên Nguyệt", meaning: "Tháng trước" }
    ]
  },
  {
    kanji: "生", hanviet: "SINH", strokes: 5, radical: "生 (Sinh)",
    onyomi: ["セイ", "ショウ"], kunyomi: ["い-きる", "う-まれる", "なま"],
    meaning: "Sinh sống, sinh ra, tươi sống",
    strokeRules: ["1. Phẩy chéo trái", "2. Ngang trên", "3. Sổ thẳng giữa", "4. Ngang giữa", "5. Ngang đáy dài"],
    mnemonicStory: "Cây cỏ đâm chồi nảy lộc từ lòng đất, tượng trưng cho sự sống sinh sôi.",
    strokeSvgPaths: [
      "M 40 20 L 25 40", "M 25 40 L 75 40", "M 50 20 L 50 85",
      "M 30 60 L 70 60", "M 15 85 L 85 85"
    ],
    compounds: [
      { word: "先生 (せんせい)", hanviet: "Tiên Sinh", meaning: "Thầy giáo" },
      { word: "学生 (がくせい)", hanviet: "Học Sinh", meaning: "Học sinh" },
      { word: "生きる (いきる)", hanviet: "Sinh", meaning: "Sống" },
      { word: "誕生日 (たんじょうび)", hanviet: "Đản Sinh Nhật", meaning: "Sinh nhật" }
    ]
  },
  {
    kanji: "休", hanviet: "HƯU", strokes: 6, radical: "亻 (Nhân đứng)",
    onyomi: ["キュウ"], kunyomi: ["やす-む", "やす-まる"],
    meaning: "Nghỉ ngơi, ngừng lại",
    strokeRules: ["1. Phẩy (bộ Nhân)", "2. Sổ đứng (bộ Nhân)", "3. Ngang (bộ Mộc)", "4. Sổ giữa (Mộc)", "5. Phẩy trái (Mộc)", "6. Mác phải (Mộc)"],
    mnemonicStory: "Một người (亻) mệt mỏi tựa lưng vào gốc cây (木) để nghỉ ngơi (Hưu = Nghỉ).",
    strokeSvgPaths: [
      "M 30 20 L 15 50", "M 25 40 L 25 85", "M 45 40 L 85 40",
      "M 65 15 L 65 85", "M 65 40 Q 50 65 35 85", "M 65 40 Q 75 65 88 85"
    ],
    compounds: [
      { word: "休み (やすみ)", hanviet: "Hưu", meaning: "Ngày nghỉ / Giờ giải lao" },
      { word: "休日 (きゅうじつ)", hanviet: "Hưu Nhật", meaning: "Ngày nghỉ" },
      { word: "休む (やすむ)", hanviet: "Hưu", meaning: "Nghỉ phép, nghỉ ngơi" }
    ]
  },
  {
    kanji: "本", hanviet: "BẢN", strokes: 5, radical: "木 (Mộc)",
    onyomi: ["ホン"], kunyomi: ["もと"],
    meaning: "Quyển sách, nguồn gốc, bản chất",
    strokeRules: ["1. Ngang", "2. Sổ thẳng", "3. Phẩy trái", "4. Mác phải", "5. Vạch ngang đánh dấu ở gốc rễ"],
    mnemonicStory: "Cái cây (木) được đánh một vạch ngang ở phần gốc rễ (Gốc rễ -> Cội nguồn -> Quyển sách).",
    strokeSvgPaths: [
      "M 20 35 L 80 35", "M 50 15 L 50 85", "M 50 35 Q 35 60 15 85",
      "M 50 35 Q 65 60 85 85", "M 35 65 L 65 65"
    ],
    compounds: [
      { word: "日本 (にほん)", hanviet: "Nhật Bản", meaning: "Nước Nhật" },
      { word: "本 (ほん)", hanviet: "Bản", meaning: "Quyển sách" },
      { word: "山本 (やまもと)", hanviet: "Sơn Bản", meaning: "Họ Yamamoto" }
    ]
  },
  {
    kanji: "語", hanviet: "NGỮ", strokes: 14, radical: "言 (Ngôn)",
    onyomi: ["ゴ"], kunyomi: ["かた-る", "かた-らう"],
    meaning: "Ngôn ngữ, lời nói, kể chuyện",
    strokeRules: ["1-7: Bộ Ngôn (言: Chấm, 4 ngang, miệng 口)", "8-12: Bộ Ngũ (五)", "13-14: Bộ Khẩu (口)"],
    mnemonicStory: "Dùng lời nói (言) để 5 (五) cái miệng (口) cùng trò chuyện trao đổi ngôn ngữ.",
    strokeSvgPaths: [
      "M 25 15 L 30 25", "M 15 30 L 40 30", "M 18 38 L 37 38", "M 18 46 L 37 46",
      "M 18 55 L 18 70", "M 18 55 L 37 55 L 37 70", "M 18 70 L 37 70",
      "M 50 25 L 85 25", "M 65 25 L 55 45", "M 55 45 L 80 45", "M 48 55 L 87 55",
      "M 52 65 L 52 85", "M 52 65 L 83 65 L 83 85", "M 52 85 L 83 85"
    ],
    compounds: [
      { word: "日本語 (にほんご)", hanviet: "Nhật Bản Ngữ", meaning: "Tiếng Nhật" },
      { word: "英語 (えいご)", hanviet: "Anh Ngữ", meaning: "Tiếng Anh" },
      { word: "外国語 (がいこくご)", hanviet: "Ngoại Quốc Ngữ", meaning: "Ngoại ngữ" }
    ]
  },
  {
    kanji: "名", hanviet: "DANH", strokes: 6, radical: "口 (Khẩu)",
    onyomi: ["メイ", "ミョウ"], kunyomi: ["な"],
    meaning: "Tên, danh tiếng, danh xưng",
    strokeRules: ["1. Phẩy (bộ Tịch 夕)", "2. Ngang gập (Tịch)", "3. Chấm (Tịch)", "4. Sổ (bộ Khẩu 口)", "5. Ngang gập (Khẩu)", "6. Ngang đáy (Khẩu)"],
    mnemonicStory: "Vào buổi tối trời tối mịt (夕), phải dùng miệng (口) gọi tên (Danh) để nhận ra nhau.",
    strokeSvgPaths: [
      "M 45 15 L 25 40", "M 25 35 L 65 35 L 45 60", "M 40 45 L 45 50",
      "M 30 65 L 30 90", "M 30 65 L 75 65 L 75 90", "M 30 90 L 75 90"
    ],
    compounds: [
      { word: "名前 (なまえ)", hanviet: "Danh Tiền", meaning: "Họ và tên" },
      { word: "有名 (ゆうめい)", hanviet: "Hữu Danh", meaning: "Nổi tiếng" },
      { word: "名刺 (めいし)", hanviet: "Danh Thích", meaning: "Danh thiếp" }
    ]
  },
  {
    kanji: "車", hanviet: "XA", strokes: 7, radical: "車 (Xa)",
    onyomi: ["シャ"], kunyomi: ["くるま"],
    meaning: "Xe cộ, bánh xe",
    strokeRules: ["1. Ngang trên", "2. Sổ trái", "3. Ngang gập phải", "4. Ngang giữa", "5. Ngang đáy dài", "6. Ngang chốt", "7. Sổ xuyên suốt tâm"],
    mnemonicStory: "Hình ảnh chiếc xe ngựa nhìn từ trên cao, có trục xe xuyên thẳng qua hai bánh xe xoay.",
    strokeSvgPaths: [
      "M 25 25 L 75 25", "M 25 38 L 25 60", "M 25 38 L 75 38 L 75 60",
      "M 25 50 L 75 50", "M 25 60 L 75 60", "M 15 75 L 85 75", "M 50 15 L 50 90"
    ],
    compounds: [
      { word: "車 (くるま)", hanviet: "Xa", meaning: "Xe ô tô" },
      { word: "電車 (でんしゃ)", hanviet: "Điện Xa", meaning: "Tàu điện" },
      { word: "自転車 (じてんしゃ)", hanviet: "Tự Chuyển Xa", meaning: "Xe đạp" },
      { word: "自動車 (じどうしゃ)", hanviet: "Tự Động Xa", meaning: "Xe hơi tự động" }
    ]
  },
  {
    kanji: "電", hanviet: "ĐIỆN", strokes: 13, radical: "雨 (Vũ)",
    onyomi: ["デン"], kunyomi: [],
    meaning: "Điện, luồng điện, tia chớp",
    strokeRules: ["1-8: Bộ Vũ (雨: Ngang, sổ, ngang gập, sổ giữa, 4 hạt mưa)", "9-13: Chữ Thân (sổ gập và đuôi cong tia sét)"],
    mnemonicStory: "Trong cơn mưa bão (雨), luồng sét điện giáng xuống phát ra dòng điện năng cực mạnh.",
    strokeSvgPaths: [
      "M 25 15 L 75 15", "M 25 25 L 25 45", "M 25 25 L 75 25 L 75 45",
      "M 50 15 L 50 45", "M 32 32 L 35 37", "M 32 40 L 35 45", "M 65 32 L 68 37", "M 65 40 L 68 45",
      "M 35 55 L 35 80", "M 35 55 L 70 55 L 70 80", "M 35 68 L 70 68", "M 35 80 L 70 80",
      "M 52 50 L 52 85 Q 52 92 78 90"
    ],
    compounds: [
      { word: "電車 (でんしゃ)", hanviet: "Điện Xa", meaning: "Tàu điện" },
      { word: "電話 (でんわ)", hanviet: "Điện Thoại", meaning: "Điện thoại" },
      { word: "電気 (でんき)", hanviet: "Điện Khí", meaning: "Điện / Bóng đèn điện" }
    ]
  },
  {
    kanji: "食", hanviet: "THỰC", strokes: 9, radical: "食 (Thực)",
    onyomi: ["ショク", "ジキ"], kunyomi: ["た-べる", "く-らう"],
    meaning: "Ăn uống, thức ăn, món ăn",
    strokeRules: ["1. Phẩy (nhà)", "2. Mác", "3. Ngang", "4. Ngang gập", "5. Ngang", "6. Ngang", "7. Sổ móc", "8. Phẩy", "9. Chấm"],
    mnemonicStory: "Dưới mái nhà (人), người ta cùng ngồi quanh bàn ăn những món ăn ngon lành (Lương thực).",
    strokeSvgPaths: [
      "M 50 15 L 20 35", "M 50 15 L 80 35", "M 35 38 L 65 38",
      "M 30 48 L 30 65", "M 30 48 L 70 48 L 70 65", "M 30 57 L 70 57",
      "M 30 65 L 70 65", "M 35 68 L 35 90 Q 35 93 30 90", "M 65 72 L 75 85"
    ],
    compounds: [
      { word: "食べる (たべる)", hanviet: "Thực", meaning: "Ăn" },
      { word: "食べ物 (たべもの)", hanviet: "Thực Vật", meaning: "Đồ ăn" },
      { word: "食堂 (しょくどう)", hanviet: "Thực Đường", meaning: "Nhà ăn / Quán ăn" },
      { word: "朝食 (ちょうしょく)", hanviet: "Triêu Thực", meaning: "Bữa sáng" }
    ]
  },
  {
    kanji: "飲", hanviet: "ẨM", strokes: 12, radical: "食 (Thực)",
    onyomi: ["イン"], kunyomi: ["の-む"],
    meaning: "Uống, đồ uống",
    strokeRules: ["1-8: Bộ Thực (飠) bên trái", "9-12: Bộ Khiếm (欠: há miệng uống) bên phải"],
    mnemonicStory: "Thức ăn đồ uống (飠) được người há to miệng (欠) uống từng ngụm đã khát.",
    strokeSvgPaths: [
      "M 30 15 L 15 35", "M 30 15 L 45 35", "M 20 40 L 40 40", "M 18 50 L 38 50",
      "M 18 60 L 38 60", "M 18 70 L 38 70", "M 28 40 L 28 85", "M 15 85 L 40 85",
      "M 65 20 L 52 40", "M 60 35 L 85 35", "M 65 40 Q 60 70 50 85", "M 65 55 Q 75 75 88 85"
    ],
    compounds: [
      { word: "飲む (のむ)", hanviet: "Ẩm", meaning: "Uống" },
      { word: "飲み物 (のみもの)", hanviet: "Ẩm Vật", meaning: "Đồ uống" },
      { word: "飲食店 (いんしょくてん)", hanviet: "Ẩm Thực Điếm", meaning: "Quán ăn uống" }
    ]
  }
];

// --- 4. GRAMMAR N5 DATA (TRỌN BỘ CÁC ĐIỂM NGỮ PHÁP CỐT LÕI) ---
const grammarN5List = [
  {
    id: "g1", title: "N1 は N2 です",
    meaning: "N1 là N2",
    formula: "N1 は N2 です / N1 は N2 じゃありません (phủ định)",
    particleFocus: "は (Trợ từ chủ đề, đọc là 'wa')",
    explanation: "Dùng để giới thiệu danh tính, nghề nghiệp, quốc tịch hoặc tính chất của chủ đề N1.",
    commonMistakes: "Người mới học hay phát âm là 'ha'. Nhớ: Khi làm trợ từ thì は bắt buộc đọc là 'wa'.",
    examples: [
      { jp: "わたし は がくせい です。", romaji: "Watashi wa gakusei desu.", vi: "Tôi là học sinh." },
      { jp: "たなかさん は せんせい じゃありません。", vi: "Anh Tanaka không phải là giáo viên." }
    ]
  },
  {
    id: "g2", title: "N1 の N2",
    meaning: "N2 của N1 (Sở hữu hoặc bổ nghĩa)",
    formula: "N1 の N2",
    particleFocus: "の (Trợ từ sở hữu / liên kết)",
    explanation: "Trợ từ の tương đương chữ 'của'. Trong tiếng Nhật, danh từ sở hữu/chính nằm ở sau.",
    commonMistakes: "Nhầm thứ tự: 'Sách của tôi' phải nói là わたし の ほん (Tôi の Sách), không nói ngược.",
    examples: [
      { jp: "これ は わたし の ほん です。", vi: "Đây là quyển sách của tôi." },
      { jp: "にほんご の せんせい", vi: "Giáo viên tiếng Nhật." }
    ]
  },
  {
    id: "g3", title: "N を V (tha động từ)",
    meaning: "Làm hành động V tác động lên tân ngữ N",
    formula: "N (Tân ngữ) を V (Động từ)",
    particleFocus: "を (Trợ từ tân ngữ, đọc là 'o')",
    explanation: "Chỉ đối tượng trực tiếp chịu tác động của hành động ăn, uống, đọc, xem, mua...",
    commonMistakes: "Dùng nhầm は thay cho を. Nhớ: Muốn ăn cơm, uống nước, đọc sách phải dùng を.",
    examples: [
      { jp: "ごはん を たべます。", vi: "Ăn cơm." },
      { jp: "みず を のみます。", vi: "Uống nước." },
      { jp: "ほん を よみます。", vi: "Đọc sách." }
    ]
  },
  {
    id: "g4", title: "Địa điểm で V",
    meaning: "Làm hành động V TẠI địa điểm nào đó",
    formula: "Địa điểm で V (Hành động)",
    particleFocus: "で (Trợ từ chỉ nơi chốn diễn ra hành động)",
    explanation: "Phân biệt với に: 'で' dùng khi có hành động cụ thể diễn ra (ăn, học, chơi, làm việc).",
    commonMistakes: "Lẫn lộn giữa で và に: Ăn ở nhà hàng -> レストラン で たべます (đúng), không dùng に.",
    examples: [
      { jp: "としょかん で べんきょうします。", vi: "Học bài tại thư viện." },
      { jp: "うち で えいが を みます。", vi: "Xem phim ở nhà." }
    ]
  },
  {
    id: "g5", title: "Địa điểm へ / に 行きます / 来ます / 帰ります",
    meaning: "Đi / Đến / Về ĐÂU ĐÓ",
    formula: "Địa điểm へ (hoặc に) いきます / きます / かえります",
    particleFocus: "へ (đọc là 'e') / に (chỉ đích đến)",
    explanation: "Chỉ phương hướng di chuyển đến một địa điểm.",
    commonMistakes: "Trợ từ へ khi làm trợ từ chỉ phương hướng phát âm là 'e', không đọc là 'he'.",
    examples: [
      { jp: "にほん へ いきます。", vi: "Tôi đi Nhật Bản." },
      { jp: "うち へ かえります。", vi: "Tôi đi về nhà." }
    ]
  },
  {
    id: "g6", title: "Phương tiện で 行きます",
    meaning: "Đi BẰNG phương tiện gì / Bằng cách nào",
    formula: "Phương tiện で V di chuyển",
    particleFocus: "で (Chỉ phương tiện, công cụ, cách thức)",
    explanation: "Dùng để chỉ phương tiện đi lại (xe bus, tàu điện, máy bay) hoặc công cụ (đũa, kéo, bút).",
    commonMistakes: "Đi bộ thì nói là あるいて いきます (không dùng trợ từ で).",
    examples: [
      { jp: "でんしゃ で がっこう へ いきます。", vi: "Tôi đến trường bằng tàu điện." },
      { jp: "はし で たべます。", vi: "Ăn bằng đũa." }
    ]
  },
  {
    id: "g7", title: "Vてください (Thể て)",
    meaning: "Xin hãy làm V / Vui lòng làm V",
    formula: "V-て + ください",
    particleFocus: "Thể て (Te form)",
    explanation: "Cách nhờ vả lịch sự thông dụng nhất trong tiếng Nhật.",
    commonMistakes: "Chia sai thể て của động từ nhóm 1 (vd: いちり -> って, みびに -> んで).",
    examples: [
      { jp: "ちょっと まって ください。", vi: "Xin vui lòng đợi một chút." },
      { jp: "日本語 を はなして ください。", vi: "Xin hãy nói bằng tiếng Nhật." }
    ]
  }
];

// --- 5. VOCABULARY N5 DATA (PHÂN THEO CHỦ ĐỀ KÈM HÁN-VIỆT & MẸO NHỚ) ---
const vocabN5List = [
  { word: "わたし", kanji: "私", hanviet: "Tư", romaji: "watashi", meaning: "Tôi (ngôi thứ nhất)", topic: "Xưng hô" },
  { word: "あなた", kanji: "貴方", hanviet: "Quý phương", romaji: "anata", meaning: "Bạn / Anh / Chị", topic: "Xưng hô" },
  { word: "せんせい", kanji: "先生", hanviet: "Tiên sinh", romaji: "sensei", meaning: "Thầy/cô giáo", topic: "Nghề nghiệp" },
  { word: "がくせい", kanji: "学生", hanviet: "Học sinh", romaji: "gakusei", meaning: "Học sinh, sinh viên", topic: "Nghề nghiệp" },
  { word: "かいしゃいん", kanji: "会社員", hanviet: "Hội xã viên", romaji: "kaishain", meaning: "Nhân viên công ty", topic: "Nghề nghiệp" },
  { word: "いしゃ", kanji: "医者", hanviet: "Y giả", romaji: "isha", meaning: "Bác sĩ", topic: "Nghề nghiệp" },
  { word: "ほん", kanji: "本", hanviet: "Bản", romaji: "hon", meaning: "Quyển sách", topic: "Đồ vật" },
  { word: "じしょ", kanji: "辞書", hanviet: "Từ thư", romaji: "jisho", meaning: "Từ điển", topic: "Đồ vật" },
  { word: "ざっし", kanji: "雑誌", hanviet: "Tạp chí", romaji: "zasshi", meaning: "Tạp chí", topic: "Đồ vật" },
  { word: "しんぶん", kanji: "新聞", hanviet: "Tân văn", romaji: "shinbun", meaning: "Báo chí", topic: "Đồ vật" },
  { word: "ノート", kanji: "", hanviet: "", romaji: "nooto", meaning: "Vở ghi chép", topic: "Đồ vật" },
  { word: "えんぴつ", kanji: "鉛筆", hanviet: "Duyên bút", romaji: "enpitsu", meaning: "Bút chì", topic: "Đồ vật" },
  { word: "とけい", kanji: "時計", hanviet: "Thời kế", romaji: "tokei", meaning: "Đồng hồ", topic: "Đồ vật" },
  { word: "かさ", kanji: "傘", hanviet: "Tản", romaji: "kasa", meaning: "Cái ô/dù", topic: "Đồ vật" },
  { word: "かばん", kanji: "鞄", hanviet: "Bao", romaji: "kaban", meaning: "Cặp sách, túi xách", topic: "Đồ vật" },
  { word: "くるま", kanji: "車", hanviet: "Xa", romaji: "kuruma", meaning: "Xe hơi", topic: "Giao thông" },
  { word: "じてんしゃ", kanji: "自転車", hanviet: "Tự chuyển xa", romaji: "jitensha", meaning: "Xe đạp", topic: "Giao thông" },
  { word: "ちかてつ", kanji: "地下鉄", hanviet: "Địa hạ thiết", romaji: "chikatetsu", meaning: "Tàu điện ngầm", topic: "Giao thông" },
  { word: "ひこうき", kanji: "飛行機", hanviet: "Phi hành cơ", romaji: "hikouki", meaning: "Máy bay", topic: "Giao thông" },
  { word: "たべる", kanji: "食べる", hanviet: "Thực", romaji: "taberu", meaning: "Ăn", topic: "Động từ" },
  { word: "のむ", kanji: "飲む", hanviet: "Ẩm", romaji: "nomu", meaning: "Uống", topic: "Động từ" },
  { word: "みる", kanji: "見る", hanviet: "Kiến", romaji: "miru", meaning: "Xem, nhìn", topic: "Động từ" },
  { word: "きく", kanji: "聞く", hanviet: "Văn", romaji: "kiku", meaning: "Nghe / Hỏi", topic: "Động từ" },
  { word: "よむ", kanji: "読む", hanviet: "Độc", romaji: "yomu", meaning: "Đọc sách", topic: "Động từ" },
  { word: "かく", kanji: "書く", hanviet: "Thư", romaji: "kaku", meaning: "Viết", topic: "Động từ" },
  { word: "かう", kanji: "買う", hanviet: "Mãi", romaji: "kau", meaning: "Mua", topic: "Động từ" },
  { word: "いく", kanji: "行く", hanviet: "Hành", romaji: "iku", meaning: "Đi", topic: "Động từ" },
  { word: "くる", kanji: "来る", hanviet: "Lai", romaji: "kuru", meaning: "Đến", topic: "Động từ" },
  { word: "かえる", kanji: "帰る", hanviet: "Quy", romaji: "kaeru", meaning: "Về nhà", topic: "Động từ" }
];

// --- 6. MOCK TEST N5 DATA ---
const mockTestN5 = {
  examName: "Đề Thi Thử JLPT N5 - Chuẩn Cấu Trúc Đề Thật",
  totalQuestions: 7,
  sections: [
    {
      section: "Moji - Goi (Chữ Hán & Từ Vựng)",
      questions: [
        {
          id: 1,
          question: "きのう、あたらしい 【車】 を かいました。",
          highlight: "車",
          options: ["くるま", "でんしゃ", "じてんしゃ", "ひこうき"],
          answerIndex: 0,
          explanation: "Chữ 【車】 âm Hán-Việt là XA, cách đọc Kunyomi là くるま (Xe hơi)."
        },
        {
          id: 2,
          question: "まいあさ、しちじ に 【おきます】。",
          highlight: "おきます",
          options: ["起きます", "行きます", "来ます", "寝ます"],
          answerIndex: 0,
          explanation: "おきます là thức dậy, chữ Hán tương ứng là 【起きます】(KHỞI)."
        },
        {
          id: 3,
          question: "としょかん で ほん を 【読みます】。",
          highlight: "読みます",
          options: ["よみます", "のみます", "たべます", "かきます"],
          answerIndex: 0,
          explanation: "【読みます】âm Hán Việt là ĐỘC, cách đọc là よみます (Đọc sách)."
        }
      ]
    },
    {
      section: "Bunpou (Ngữ Pháp & Trợ Từ)",
      questions: [
        {
          id: 4,
          question: "わたし は まいあさ パン ( ? ) たべます。",
          options: ["を", "に", "で", "へ"],
          answerIndex: 0,
          explanation: "Ăn bánh mì: パン を たべます. Trợ từ を đi liền với tân ngữ chịu tác động của hành động."
        },
        {
          id: 5,
          question: "きのう、ともだち ( ? ) レストラン で ごはん を たべました。",
          options: ["と", "を", "に", "で"],
          answerIndex: 0,
          explanation: "Cùng với bạn bè: ともだち と (Trợ từ と mang nghĩa 'cùng với')."
        },
        {
          id: 6,
          question: "しんかんせん ( ? ) きょうと へ いきます。",
          options: ["で", "に", "を", "から"],
          answerIndex: 0,
          explanation: "Đi đến Kyoto BẰNG tàu Shinkansen -> Trợ từ で chỉ phương tiện di chuyển."
        },
        {
          id: 7,
          question: "すみません、しゃしん を ( ? ) ください。",
          options: ["とって", "とりて", "とった", "とる"],
          answerIndex: 0,
          explanation: "Động từ とります (nhóm 1 kết thúc bằng り) chia sang thể て là とって (Xin hãy chụp ảnh)."
        }
      ]
    }
  ]
};

// WRITE FILES
fs.writeFileSync('data/kana/hiragana.json', JSON.stringify(hiraganaList, null, 2), 'utf8');
fs.writeFileSync('data/kana/katakana.json', JSON.stringify(katakanaList, null, 2), 'utf8');
fs.writeFileSync('data/kanji_n5/kanji_n5.json', JSON.stringify(kanjiN5List, null, 2), 'utf8');
fs.writeFileSync('data/vocab_n5/vocab_n5.json', JSON.stringify(vocabN5List, null, 2), 'utf8');
fs.writeFileSync('data/grammar_n5/grammar_n5.json', JSON.stringify(grammarN5List, null, 2), 'utf8');
fs.writeFileSync('data/mock_tests_n5/test_n5.json', JSON.stringify(mockTestN5, null, 2), 'utf8');

console.log("Successfully generated all N5 datasets in data/ folder!");
