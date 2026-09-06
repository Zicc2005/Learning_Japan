import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { NavigationBar } from './components/layout/NavigationBar';
import { BottomNavigation } from './components/layout/BottomNavigation';

// Pages (organized cleanly by route/path)
import { RoadmapPage } from './pages/RoadmapPage';
import { PracticePage } from './pages/PracticePage';
import { KanaPage } from './pages/KanaPage';
import { KanjiPage } from './pages/KanjiPage';
import { GrammarPage } from './pages/GrammarPage';
import { ExamPage } from './pages/ExamPage';
import { SenseiPage } from './pages/SenseiPage';

// Components
import { DailyQuestsModal } from './components/quests/DailyQuestsModal';

// Hooks & Utilities
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTTS } from './hooks/useTTS';
import { sounds } from './utils/soundEffects';

// Datasets
import hiraganaList from '../data/kana/hiragana.json';
import katakanaList from '../data/kana/katakana.json';
import kanjiN5List from '../data/kanji_n5/kanji_n5.json';
import grammarList from '../data/grammar_n5/grammar_n5.json';
import mockTestSet1 from '../data/mock_tests_n5/test_n5.json';
import mockTestSet2 from '../data/mock_tests_n5/test_n5_set2.json';
import mockTestSet3 from '../data/mock_tests_n5/test_n5_set3.json';
import examTypesData from '../data/mock_tests_n5/exam_n5_types.json';

const VALID_PAGES = ['roadmap', 'practice', 'kana', 'kanji'];

const getPageFromHash = () => {
  if (typeof window === 'undefined') return 'roadmap';
  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  return VALID_PAGES.includes(raw) ? raw : 'roadmap';
};

export default function App() {
  const [activePage, setActivePageState] = useState(getPageFromHash);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [masteredArray, setMasteredArray] = useLocalStorage('nihon_v2_mastered', []);
  const [xp, setXp] = useLocalStorage('nihon_v2_xp', 0);
  const [streak, setStreak] = useLocalStorage('nihon_v2_streak', 1);
  const [soundMuted, setSoundMuted] = useLocalStorage('nihon_sound_muted', false);

  // Clear all old test data to prepare for clean deploy test
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('nihon_deploy_cleaned_v3') !== 'true') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('nihon') || key.startsWith('quest'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('nihon_deploy_cleaned_v3', 'true');
      setMasteredArray([]);
      setXp(0);
      setStreak(1);
    }
  }, [setMasteredArray, setXp, setStreak]);

  const handleResetProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('nihon') || key.startsWith('quest'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('nihon_deploy_cleaned_v3', 'true');
    }
    setMasteredArray([]);
    setXp(0);
    setStreak(1);
    sounds.playClick();
    window.location.reload();
  }, [setMasteredArray, setXp, setStreak]);

  const { speak } = useTTS();

  // Set active page and update window hash for deep-linking
  const setActivePage = useCallback((page) => {
    const valid = VALID_PAGES.includes(page) ? page : 'roadmap';
    setActivePageState(valid);
    if (window.location.hash !== `#/${valid}`) {
      window.location.hash = `#/${valid}`;
    }
  }, []);

  // Listen for browser Back/Forward button and external hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setActivePageState(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Ensure initial hash exists
    if (!window.location.hash) {
      window.location.hash = '#/roadmap';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Enforce dark mode by default to match the user's template
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  }, []);

  // Sync sound muted state
  useEffect(() => {
    sounds.setMuted(soundMuted);
  }, [soundMuted]);

  const toggleSound = () => {
    setSoundMuted((prev) => !prev);
  };

  // Mastered characters set
  const masteredChars = new Set(masteredArray);
  const setMasteredChars = (updater) => {
    if (typeof updater === 'function') {
      const nextSet = updater(masteredChars);
      setMasteredArray(Array.from(nextSet));
    } else {
      setMasteredArray(Array.from(updater));
    }
  };

  // Jump to Practice page with specific character
  const [initialPracticeChar, setInitialPracticeChar] = useState(null);
  const handleJumpToPractice = (characterItem) => {
    setInitialPracticeChar(characterItem);
    setActivePage('practice');
  };

  // Complete exam reward
  const handleCompleteExam = (score) => {
    setXp((prev) => prev + score * 15);
  };

  // Immersive Full-Screen Calligraphy Studio for Practice Writing
  if (activePage === 'practice') {
    return (
      <PracticePage
        hiraganaList={hiraganaList}
        katakanaList={katakanaList}
        kanjiN5List={kanjiN5List}
        masteredChars={masteredChars}
        setMasteredChars={setMasteredChars}
        xp={xp}
        setXp={setXp}
        streak={streak}
        soundMuted={soundMuted}
        toggleSound={toggleSound}
        speak={speak}
        initialChar={initialPracticeChar}
        onNavigate={setActivePage}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050811] flex justify-center text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Responsive Container: Full-width on mobile, expanding up to max-w-7xl on desktop */}
      <div className="w-full max-w-7xl bg-[#080d1a] min-h-screen flex flex-col shadow-2xl relative border-x border-slate-800/50 pb-20 md:pb-8">
        
        {/* ================= TOP GAMIFICATION HEADER & FLOATING PILL NAV ================= */}
        <Header
          xp={xp}
          streak={streak}
          masteredCount={masteredChars.size}
          soundMuted={soundMuted}
          toggleSound={toggleSound}
          onOpenQuests={() => setIsQuestsOpen(true)}
          onResetProgress={handleResetProgress}
        />
        <NavigationBar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        {/* ================= TAB CONTAINER SCREENS ================= */}
        <main className="flex-1 flex flex-col w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
          {/* Path: #/roadmap - Bản Đồ N5 S-Curve */}
          {activePage === 'roadmap' && (
            <RoadmapPage
              onNavigate={setActivePage}
              onOpenQuests={() => setIsQuestsOpen(true)}
              xp={xp}
              setXp={setXp}
              streak={streak}
              masteredCount={masteredChars.size}
              masteredChars={masteredChars}
              setMasteredChars={setMasteredChars}
            />
          )}

          {/* Path: #/practice - Luyện Viết Bút Thuận */}
          {activePage === 'practice' && (
            <PracticePage
              hiraganaList={hiraganaList}
              katakanaList={katakanaList}
              kanjiN5List={kanjiN5List}
              masteredChars={masteredChars}
              setMasteredChars={setMasteredChars}
              setXp={setXp}
              speak={speak}
              initialChar={initialPracticeChar}
              onNavigate={setActivePage}
            />
          )}

          {/* Path: #/kana - Bảng Chữ Cái & Thẻ Nhớ 3D */}
          {activePage === 'kana' && (
            <KanaPage
              hiraganaList={hiraganaList}
              katakanaList={katakanaList}
              speak={speak}
              onNavigatePractice={handleJumpToPractice}
            />
          )}

          {/* Path: #/kanji - Kho 103 Chữ Hán */}
          {activePage === 'kanji' && (
            <KanjiPage
              kanjiN5List={kanjiN5List}
              speak={speak}
              onJumpToPractice={handleJumpToPractice}
            />
          )}
        </main>

        {/* ================= DAILY QUESTS MODAL ================= */}
        <DailyQuestsModal
          isOpen={isQuestsOpen}
          onClose={() => setIsQuestsOpen(false)}
          onNavigate={setActivePage}
        />

        {/* ================= BOTTOM NAVIGATION BAR (Mobile Only) ================= */}
        <BottomNavigation
          activePage={activePage}
          setActivePage={setActivePage}
        />

      </div>
    </div>
  );
}
