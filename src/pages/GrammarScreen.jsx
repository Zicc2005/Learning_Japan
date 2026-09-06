import { useState } from "react";
import { playChime, speakJapanese } from "../utils/audio";
export const GrammarScreen = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const grammarItems = [
    {
      id: "g1",
      pattern: "N1 \u306F N2 \u3067\u3059",
      meaning: "N1 l\xE0 N2 (C\xE2u kh\u1EB3ng \u0111\u1ECBnh danh t\u1EEB)",
      explanation: "Tr\u1EE3 t\u1EEB \u306F (\u0111\u1ECDc l\xE0 wa) \u0111\xE1nh d\u1EA5u ch\u1EE7 ng\u1EEF; \u3067\u3059 bi\u1EC3u th\u1ECB s\u1EF1 trang tr\u1ECDng, l\u1ECBch s\u1EF1.",
      category: "basics",
      exampleJa: "\u308F\u305F\u3057 \u306F \u304C\u304F\u305B\u3044 \u3067\u3059\u3002",
      exampleRomaji: "Watashi wa gakusei desu.",
      exampleVn: "T\xF4i l\xE0 h\u1ECDc sinh / sinh vi\xEAn."
    },
    {
      id: "g2",
      pattern: "N1 \u306F N2 \u3058\u3083\u3042\u308A\u307E\u305B\u3093",
      meaning: "N1 kh\xF4ng ph\u1EA3i l\xE0 N2 (C\xE2u ph\u1EE7 \u0111\u1ECBnh danh t\u1EEB)",
      explanation: "D\u1EA1ng ph\u1EE7 \u0111\u1ECBnh l\u1ECBch s\u1EF1 c\u1EE7a \u3067\u3059. Trong v\u0103n vi\u1EBFt c\xF3 th\u1EC3 d\xF9ng \u3067\u306F\u3042\u308A\u307E\u305B\u3093.",
      category: "basics",
      exampleJa: "\u304B\u308C \u306F \u305B\u3093\u305B\u3044 \u3058\u3083\u3042\u308A\u307E\u305B\u3093\u3002",
      exampleRomaji: "Kare wa sensei jaarimasen.",
      exampleVn: "Anh \u1EA5y kh\xF4ng ph\u1EA3i l\xE0 gi\xE1o vi\xEAn."
    },
    {
      id: "g3",
      pattern: "N \u3092 V-\u307E\u3059",
      meaning: "L\xE0m h\xE0nh \u0111\u1ED9ng V \u0111\u1ED1i v\u1EDBi t\xE2n ng\u1EEF N",
      explanation: "Tr\u1EE3 t\u1EEB \u3092 (\u0111\u1ECDc l\xE0 o) \u0111\u1EE9ng sau danh t\u1EEB ch\u1EC9 \u0111\u1ED1i t\u01B0\u1EE3ng ch\u1ECBu t\xE1c \u0111\u1ED9ng tr\u1EF1c ti\u1EBFp c\u1EE7a ngo\u1EA1i \u0111\u1ED9ng t\u1EEB.",
      category: "particles",
      exampleJa: "\u307B\u3093 \u3092 \u3088\u307F\u307E\u3059\u3002",
      exampleRomaji: "Hon o yomimasu.",
      exampleVn: "T\xF4i \u0111\u1ECDc s\xE1ch."
    },
    {
      id: "g4",
      pattern: "V-\u3066 \u304F\u3060\u3055\u3044",
      meaning: "Xin h\xE3y l\xE0m V (C\xE2u y\xEAu c\u1EA7u l\u1ECBch s\u1EF1)",
      explanation: "\u0110\u1ED9ng t\u1EEB chia th\u1EC3 Te (\u3066) k\u1EBFt h\u1EE3p \u304F\u3060\u3055\u3044 \u0111\u1EC3 nh\u1EDD v\u1EA3, ch\u1EC9 d\u1EABn m\u1ED9t c\xE1ch l\u1ECBch thi\u1EC7p.",
      category: "verbs",
      exampleJa: "\u3053\u3053\u306B \u306A\u307E\u3048 \u3092 \u304B\u3044\u3066 \u304F\u3060\u3055\u3044\u3002",
      exampleRomaji: "Koko ni namae o kaite kudasai.",
      exampleVn: "Xin h\xE3y vi\u1EBFt t\xEAn v\xE0o \u0111\xE2y."
    },
    {
      id: "g5",
      pattern: "\u0110\u1ECBa \u0111i\u1EC3m \u3067 V-\u307E\u3059",
      meaning: "L\xE0m h\xE0nh \u0111\u1ED9ng V t\u1EA1i m\u1ED9t \u0111\u1ECBa \u0111i\u1EC3m",
      explanation: "Tr\u1EE3 t\u1EEB \u3067 ch\u1EC9 n\u01A1i ch\u1ED1n di\u1EC5n ra h\xE0nh \u0111\u1ED9ng.",
      category: "particles",
      exampleJa: "\u3068\u3057\u3087\u304B\u3093 \u3067 \u3079\u3093\u304D\u3087\u3046\u3057\u307E\u3059\u3002",
      exampleRomaji: "Toshokan de benkyoushimasu.",
      exampleVn: "T\xF4i h\u1ECDc b\xE0i \u1EDF th\u01B0 vi\u1EC7n."
    },
    {
      id: "g6",
      pattern: "N \u304C \u3042\u308A\u307E\u3059 / \u3044\u307E\u3059",
      meaning: "C\xF3 N \u1EDF \u0111\xE2u \u0111\xF3 (S\u1EF1 t\u1ED3n t\u1EA1i)",
      explanation: "D\xF9ng \u3042\u308A\u307E\u3059 cho \u0111\u1ED3 v\u1EADt, th\u1EF1c v\u1EADt v\xF4 tri; d\xF9ng \u3044\u307E\u3059 cho ng\u01B0\u1EDDi v\xE0 \u0111\u1ED9ng v\u1EADt s\u1ED1ng.",
      category: "verbs",
      exampleJa: "\u3078\u3084 \u306B \u306D\u3053 \u304C \u3044\u307E\u3059\u3002",
      exampleRomaji: "Heya ni neko ga imasu.",
      exampleVn: "Trong ph\xF2ng c\xF3 m\u1ED9t ch\xFA m\xE8o."
    }
  ];
  const filteredGrammar = grammarItems.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = searchQuery === "" || item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) || item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 flex flex-col gap-6">
      {
    /* HEADER BANNER */
  }
      <div className="bg-gradient-to-r from-[#202428] via-[#291e1d] to-[#1c1716] rounded-3xl p-6 sm:p-8 text-white shadow-md border border-[#983224]/30">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#983224] text-white text-[10px] font-bold tracking-wider">
            NGỮ PHÁP N5
          </span>
          <span className="text-xs uppercase tracking-wider text-[#ffb4a9]">
            30 MẪU CÂU THEN CHỐT JLPT
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
          Sổ Tay Ngữ Pháp Trọng Tâm JLPT N5
        </h1>
        <p className="text-white/70 text-xs sm:text-sm max-w-2xl leading-relaxed mt-1">
          Hệ thống hóa ngữ pháp Minna no Nihongo &amp; Marugoto từ bài 1 đến bài 25 với ví dụ thực tiễn và phát âm bản xứ.
        </p>
      </div>

      {
    /* FILTER & SEARCH */
  }
      <div className="bg-white dark:bg-[#1A1D20] rounded-3xl p-5 shadow-sm border border-[#eceef2] dark:border-[#2e3134] flex flex-col sm:flex-row items-center justify-between gap-4">
        {
    /* Category Pills */
  }
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
    { id: "all", label: "T\u1EA5t c\u1EA3 m\u1EABu c\xE2u" },
    { id: "basics", label: "C\u0103n b\u1EA3n (\u3067\u3059/\u3060)" },
    { id: "particles", label: "Tr\u1EE3 t\u1EEB (\u306F, \u3092, \u3067, \u306B)" },
    { id: "verbs", label: "Th\u1EC3 \u0111\u1ED9ng t\u1EEB (\u307E\u3059, \u3066, \u306A\u3044)" }
  ].map((cat) => <button
    key={cat.id}
    onClick={() => {
      setActiveCategory(cat.id);
      playChime("wood");
    }}
    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat.id ? "bg-[#983224] text-white shadow-sm" : "bg-[#f2f3f8] dark:bg-[#25282c] text-[#57423e] dark:text-[#c7c6c6]"}`}
  >
              {cat.label}
            </button>)}
        </div>

        {
    /* Search */
  }
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-2 text-[#8C8C8C] text-[18px]">
            search
          </span>
          <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Tìm mẫu câu..."
    className="w-full bg-[#f8f9fd] dark:bg-[#25282c] border border-[#eceef2] dark:border-[#2e3134] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#191c1f] dark:text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#983224]"
  />
        </div>
      </div>

      {
    /* GRAMMAR CARDS LIST */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGrammar.map((item) => <div
    key={item.id}
    className="bg-white dark:bg-[#1A1D20] rounded-3xl p-6 shadow-sm border border-[#eceef2] dark:border-[#2e3134] flex flex-col justify-between gap-4"
  >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-[#ffdad4] text-[#983224] text-[11px] font-bold">
                  Công thức
                </span>
                <button
    onClick={() => speakJapanese(item.exampleJa)}
    className="p-1.5 rounded-xl hover:bg-[#f2f3f8] dark:hover:bg-[#25282c] text-[#8C8C8C] hover:text-[#983224]"
    title="Nghe câu ví dụ"
  >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </div>

              <h3 className="font-headline text-lg font-bold text-[#983224] mt-2">
                {item.pattern}
              </h3>
              <div className="text-xs font-semibold text-[#191c1f] dark:text-white mt-1">
                {item.meaning}
              </div>
              <p className="text-xs text-[#57423e] dark:text-[#c7c6c6] mt-2 leading-relaxed">
                {item.explanation}
              </p>
            </div>

            {
    /* Example Block */
  }
            <div
    onClick={() => speakJapanese(item.exampleJa)}
    className="bg-[#f8f9fd] dark:bg-[#25282c] p-3.5 rounded-2xl border border-[#eceef2] dark:border-[#2e3134] cursor-pointer hover:border-[#983224] transition-colors group"
  >
              <div className="flex items-center justify-between">
                <span className="font-jp text-sm font-bold text-[#191c1f] dark:text-white group-hover:text-[#983224]">
                  {item.exampleJa}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#8C8C8C] group-hover:text-[#983224]">
                  volume_up
                </span>
              </div>
              <div className="text-[11px] text-[#8C8C8C] mt-0.5">{item.exampleRomaji}</div>
              <div className="text-xs text-[#57423e] dark:text-[#c7c6c6] mt-1 italic">
                👉 {item.exampleVn}
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
