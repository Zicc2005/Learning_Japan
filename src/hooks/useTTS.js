import { useCallback } from 'react';

export function useTTS() {
  const speak = useCallback((text, rate = 0.85) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this environment.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = rate;

      // Ưu tiên chọn giọng người Nhật tự nhiên nếu trình duyệt có sẵn
      const voices = window.speechSynthesis.getVoices();
      const jpVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
      if (jpVoice) {
        utterance.voice = jpVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }, []);

  return { speak };
}
