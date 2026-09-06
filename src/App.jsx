import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/layout/Navigation';
import { AuthScreen } from './pages/AuthScreen';
import { RoadmapScreen } from './pages/RoadmapScreen';
import { PracticeScreen } from './pages/PracticeScreen';
import { KanaStudioScreen } from './pages/KanaStudioScreen';
import { KanjiExplorerScreen } from './pages/KanjiExplorerScreen';
import { GrammarScreen } from './pages/GrammarScreen';
import { ExamScreen } from './pages/ExamScreen';
import { playChime } from './utils/audio';
import { authDb } from './services/authDatabase';

const VALID_SCREENS = ['roadmap', 'practice', 'kana', 'kanji', 'grammar', 'exam', 'auth'];

const getScreenFromHash = () => {
  if (typeof window === 'undefined') return 'roadmap';
  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  return VALID_SCREENS.includes(raw) ? raw : 'roadmap';
};

export default function App() {
  const [currentScreen, setCurrentScreenState] = useState(getScreenFromHash);
  const [selectedKanjiId, setSelectedKanjiId] = useState('kanji-1');

  // Dark mode with localStorage
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('nihon_v2_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // User profile connected to authDatabase
  const [user, setUser] = useState(() => {
    try {
      return authDb.getCurrentUser();
    } catch {
      return {
        id: 'user_default',
        name: 'Minh Tuấn',
        email: 'samurai.dev@nihonlearn.jp',
        level: 4,
        xp: 450,
        maxXP: 800,
        totalXP: 450,
        streakDays: 5,
        title: 'Võ Sĩ N5 Tinh Anh'
      };
    }
  });

  // Sync user profile to localStorage and database
  useEffect(() => {
    try {
      localStorage.setItem('nihon_v2_user_profile', JSON.stringify(user));
    } catch {}
  }, [user]);

  // Dark mode effect on root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('nihon_v2_dark_mode', darkMode ? 'true' : 'false');
    } catch {}
  }, [darkMode]);

  // Set active screen and sync hash
  const setCurrentScreen = useCallback((screen) => {
    const valid = VALID_SCREENS.includes(screen) ? screen : 'roadmap';
    setCurrentScreenState(valid);
    if (window.location.hash !== `#/${valid}`) {
      window.location.hash = `#/${valid}`;
    }
  }, []);

  // Listen for browser back/forward and external hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const screen = getScreenFromHash();
      setCurrentScreenState(screen);
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = '#/roadmap';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleDarkMode = () => {
    playChime('wood');
    setDarkMode((prev) => !prev);
  };

  const handleAddXP = (amount) => {
    setUser((prev) => {
      const nextXP = (prev.xp || 0) + amount;
      const nextTotalXP = (prev.totalXP || 0) + amount;
      const currentMax = prev.maxXP || 100;

      let updated;
      if (nextXP >= currentMax) {
        // Level up!
        playChime('success');
        updated = {
          ...prev,
          level: (prev.level || 1) + 1,
          xp: nextXP - currentMax,
          maxXP: Math.round(currentMax * 1.35),
          totalXP: nextTotalXP,
          title: (prev.level + 1) >= 5 ? 'Võ Sĩ N5 Tinh Anh' : (prev.level + 1) >= 3 ? 'Học Viên Chuyên Cần' : 'Tân Thủ N5',
        };
      } else {
        updated = {
          ...prev,
          xp: nextXP,
          totalXP: nextTotalXP,
        };
      }
      try {
        authDb.updateUserProgress(updated.id || prev.id, {
          xp: updated.xp,
          totalXP: updated.totalXP,
          level: updated.level,
          title: updated.title
        });
      } catch {}
      return updated;
    });
  };

  const handleNavigate = (screen) => {
    playChime('wood');
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectKanjiForPractice = (kanjiId) => {
    setSelectedKanjiId(kanjiId);
    setCurrentScreen('practice');
    playChime('wood');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userObj) => {
    if (userObj && typeof userObj === 'object') {
      setUser(userObj);
    } else {
      const current = authDb.getCurrentUser();
      setUser(current);
    }
    setCurrentScreen('roadmap');
  };

  const handleResetProgress = () => {
    playChime('wood');
    try {
      localStorage.removeItem('nihon_v2_user_profile');
      localStorage.removeItem('nihon_v2_completed_days');
    } catch {}
    const fresh = authDb.getCurrentUser();
    setUser(fresh);
    window.location.reload();
  };

  // If Auth screen is selected, render the dedicated Torii landing & authentication portal
  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onBackToApp={() => setCurrentScreen('roadmap')}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#121417] text-white' : 'bg-[#f8f9fd] text-[#191c1f]'}`}>
      {/* NAVIGATION (SIDEBAR + TOPBAR + MOBILE BOTTOM BAR) */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onResetProgress={handleResetProgress}
      />

      {/* MAIN VIEW CONTAINER */}
      <main className="pt-20 transition-all duration-300 min-h-screen pl-0 md:pl-64">
        {currentScreen === 'roadmap' && (
          <RoadmapScreen
            user={user}
            onNavigate={handleNavigate}
            onAddXP={handleAddXP}
          />
        )}

        {currentScreen === 'practice' && (
          <PracticeScreen
            onAddXP={handleAddXP}
            selectedKanjiId={selectedKanjiId}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'kana' && (
          <KanaStudioScreen
            onSelectKanaForPractice={() => {
              setCurrentScreen('practice');
            }}
            onAddXP={handleAddXP}
          />
        )}

        {currentScreen === 'kanji' && (
          <KanjiExplorerScreen
            onSelectKanjiForPractice={handleSelectKanjiForPractice}
            onAddXP={handleAddXP}
          />
        )}

        {currentScreen === 'grammar' && <GrammarScreen />}

        {currentScreen === 'exam' && <ExamScreen onAddXP={handleAddXP} />}
      </main>
    </div>
  );
}
