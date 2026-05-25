import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { CandyButton } from './CandyButton';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isiOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !('MSStream' in window);
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PWAPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisterError(error) {
      console.warn('SW registration failed', error);
    }
  });

  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('imposter-install-dismissed') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isStandalone() || dismissed) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (isiOS()) {
      const t = setTimeout(() => setShowIosHint(true), 3500);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  function dismiss() {
    setInstallEvent(null);
    setShowIosHint(false);
    setDismissed(true);
    try {
      sessionStorage.setItem('imposter-install-dismissed', '1');
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === 'accepted') {
      setInstallEvent(null);
    }
  }

  if (needRefresh) {
    return (
      <PromptShell>
        <div style={{ color: 'white', fontWeight: 600, fontSize: 14, flex: 1 }}>
          New version ready
        </div>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          style={dismissBtn}
          aria-label="dismiss update"
        >
          ×
        </button>
        <CandyButton color="green" size="sm" onClick={() => updateServiceWorker(true)}>
          Update
        </CandyButton>
      </PromptShell>
    );
  }

  if (installEvent) {
    return (
      <PromptShell>
        <div style={{ color: 'white', fontWeight: 600, fontSize: 14, flex: 1 }}>
          Install for offline play
        </div>
        <button type="button" onClick={dismiss} style={dismissBtn} aria-label="dismiss install">
          ×
        </button>
        <CandyButton color="pink" size="sm" onClick={install}>
          Install
        </CandyButton>
      </PromptShell>
    );
  }

  if (showIosHint) {
    return (
      <PromptShell>
        <div style={{ color: 'white', fontWeight: 600, fontSize: 13, flex: 1, lineHeight: 1.3 }}>
          Tap <strong>Share</strong> then <strong>Add to Home Screen</strong> to install
        </div>
        <button type="button" onClick={dismiss} style={dismissBtn} aria-label="dismiss hint">
          ×
        </button>
      </PromptShell>
    );
  }

  return null;
}

function PromptShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: `calc(12px + env(safe-area-inset-bottom))`,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 20,
        background: 'linear-gradient(180deg, #6741d9, #3a1a8a)',
        border: '2px solid #2d1b6b',
        boxShadow: '0 8px 0 #2d1b6b, 0 14px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
        animation: 'fadeIn 320ms ease'
      }}
    >
      {children}
    </div>
  );
}

const dismissBtn: React.CSSProperties = {
  background: 'transparent',
  border: 0,
  color: 'rgba(255,255,255,0.6)',
  fontSize: 22,
  width: 28,
  height: 28,
  cursor: 'pointer',
  lineHeight: 1,
  padding: 0
};
