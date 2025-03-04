'use client';

import { useEffect } from 'react';

export default function ChangeUrlWebView() {
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const url = window.location.href;
    if (
      userAgent.includes('Mobile') &&
      (userAgent.includes('iPhone') || userAgent.includes('iPad')) &&
      userAgent.includes('LinkedInApp')
    ) {
      window.location.href = 'x-safari-' + url;
      return;
    }
  }, []);

  return null;
}
