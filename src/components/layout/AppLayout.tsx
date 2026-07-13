import { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../store';
import { Focus, Menu } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);

  const {
    timerMode,
    timerTime,
    timerDurations,
    timerIsActive,
    timerSessionName,
    setTimerTime,
    setTimerIsActive,
    setTimerMode,
    addTimeSession
  } = useAppStore();

  // Wall-clock anchor: records the real timestamp when the timer was last started/resumed,
  // along with the timerTime value at that moment. This lets us compute elapsed time from
  // Date.now() instead of relying on setInterval increment accuracy.
  const anchorRef = useRef<{ wallTime: number; timerValue: number } | null>(null);

  // Set anchor when timer starts or resumes
  useEffect(() => {
    if (timerIsActive) {
      // Only set anchor if not already set (avoid resetting on every render)
      if (!anchorRef.current) {
        anchorRef.current = { wallTime: Date.now(), timerValue: timerTime };
      }
    } else {
      anchorRef.current = null;
    }
  }, [timerIsActive]); // intentionally only depends on timerIsActive

  // Handle countdown completion
  const handleCountdownComplete = useCallback(() => {
    setTimerIsActive(false);

    if (timerMode === 'Focus') {
      // Save the session
      addTimeSession({
        name: timerSessionName || 'Untitled Session',
        duration: timerDurations.Focus,
        date: new Date().toISOString()
      });
      // Auto-switch to break
      setTimerMode('Break');
      setTimerTime(timerDurations.Break);
    } else if (timerMode === 'Break') {
      // Auto-switch to focus
      setTimerMode('Focus');
      setTimerTime(timerDurations.Focus);
    } else if (timerMode === 'Timer') {
      // Timer countdown finished
      setTimerTime(timerDurations.Timer);
    }
  }, [timerMode, timerSessionName, timerDurations, addTimeSession, setTimerIsActive, setTimerMode, setTimerTime]);

  // Main tick effect — runs a fast interval (250ms) and computes the correct
  // timer value from the wall clock. This is immune to JS timer drift and
  // React re-render delays. The interval does NOT depend on timerTime,
  // so it is never torn down/recreated during counting.
  useEffect(() => {
    if (!timerIsActive) return;

    const isCountdown = timerMode !== 'Stopwatch';

    const tick = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const elapsedSeconds = Math.floor((Date.now() - anchor.wallTime) / 1000);

      if (isCountdown) {
        const newTime = Math.max(0, anchor.timerValue - elapsedSeconds);
        setTimerTime(newTime);
        if (newTime === 0) {
          handleCountdownComplete();
        }
      } else {
        // Stopwatch counts up
        setTimerTime(anchor.timerValue + elapsedSeconds);
      }
    };

    // Tick immediately, then every 250ms for smooth & accurate updates
    tick();
    const interval = setInterval(tick, 250);

    return () => clearInterval(interval);
  }, [timerIsActive, timerMode, handleCountdownComplete, setTimerTime]);

  return (
    <div className="flex h-screen bg-bg-app text-text-main overflow-hidden font-sans relative">
      {!settings?.focusMode && <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />}
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {!settings?.focusMode && (
          <header className="md:hidden flex items-center justify-between p-4 border-b border-border-subtle bg-bg-app shrink-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-text-main scale-125 flex-shrink-0" style={{ WebkitMaskImage: `url(${logoImg})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(${logoImg})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
              <span className="font-bold tracking-tight text-text-main">WORKBENCH</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 text-text-muted hover:text-text-main bg-bg-card rounded-md border border-border-subtle"
            >
              <Menu className="w-5 h-5" />
            </button>
          </header>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {settings?.focusMode && (
            <button 
              onClick={() => updateSettings({ focusMode: false })}
              className="fixed top-4 left-4 z-50 p-2.5 bg-bg-card border border-border-subtle rounded-full text-text-muted hover:text-text-main shadow-lg backdrop-blur-sm"
              title="Exit Focus Mode"
            >
              <Focus className="w-5 h-5" />
            </button>
          )}
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
