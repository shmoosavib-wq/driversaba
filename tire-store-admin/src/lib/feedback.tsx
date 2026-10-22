import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface Feedback {
  toast: (message: string) => void;
  confetti: () => void;
}

const FeedbackContext = createContext<Feedback>({ toast: () => undefined, confetti: () => undefined });
export const useFeedback = () => useContext(FeedbackContext);

const COLORS = ['#00A5B5', '#D6336C', '#F2A93B', '#35C4CE', '#8AD5DE'];

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [pieces, setPieces] = useState<{ key: number; style: React.CSSProperties }[]>([]);
  const toastTimer = useRef<number>();
  const confettiTimer = useRef<number>();

  const toast = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setVisible(false), 2600);
  }, []);

  const confetti = useCallback(() => {
    const next = Array.from({ length: 36 }, (_, i) => ({
      key: Date.now() + i,
      style: {
        left: `${Math.random() * 100}%`,
        background: COLORS[i % 5],
        animationDelay: `${(Math.random() * 0.7).toFixed(2)}s`,
        animationDuration: `${(1.9 + Math.random() * 1.5).toFixed(2)}s`,
        width: `${6 + Math.random() * 6}px`,
        height: `${8 + Math.random() * 9}px`,
        borderRadius: Math.random() < 0.5 ? '50%' : '3px',
      } as React.CSSProperties,
    }));
    setPieces(next);
    window.clearTimeout(confettiTimer.current);
    confettiTimer.current = window.setTimeout(() => setPieces([]), 4200);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    window.clearTimeout(confettiTimer.current);
  }, []);

  return (
    <FeedbackContext.Provider value={{ toast, confetti }}>
      {children}
      <div id="confetti">
        {pieces.map((p) => (
          <i key={p.key} style={p.style} />
        ))}
      </div>
      <div className={`toast${visible ? ' show' : ''}`}>{message}</div>
    </FeedbackContext.Provider>
  );
}
