import { consent } from 'nextjs-google-analytics';

export type ConsentValue = 'denied' | 'granted';

declare global {
  interface Window {
    clarity: (command: string, value?: boolean) => void;
  }
}

export function analyticsConsent(consentValue: ConsentValue) {
  consent({
    arg: 'update',
    params: {
      analytics_storage: consentValue,
    },
  });

  if (!window.clarity) {
    return;
  }

  if (consentValue === 'granted') {
    window.clarity('consent');
  } else {
    window.clarity('consent', false);
  }
}
