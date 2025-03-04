'use client';

import { useEffect, useState, useRef } from 'react';

export default function TimeTracker() {
  useTimeTracker();
  return null;
}

function useTimeTracker() {
  const [minutes, setMinutes] = useState(1);

  const intervalRef = useRef<number | null>(null);
  const sendIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setMinutes((prev) => prev + 1);
    }, 60 * 1000);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    sendIntervalRef.current = window.setInterval(
      () => {
        sendTimeToBackend(minutes);
        setMinutes(1);
      },
      5 * 60 * 1000,
    );

    return () => {
      if (sendIntervalRef.current !== null)
        clearInterval(sendIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sendTimeToBackend(minutes);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [minutes]);

  const sendTimeToBackend = (minutes: number) => {
    if (minutes === 0) return;

    const data = {
      minutes: minutes.toString(),
    };

    fetch('/api/auth/user/update-time', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(console.error);
  };
}
