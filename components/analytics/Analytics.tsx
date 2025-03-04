'use client';

import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import ClarityAnalytics from '@/components/analytics/ClarityAnalytics';

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <ClarityAnalytics />
    </>
  );
}
