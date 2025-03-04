import React from 'react';

export const metadata = {
  title: 'EduGlowUp',
  generator: 'Next.js',
  applicationName: 'EduGlowUp',
  appleWebApp: true,
  keywords: [
    'educational platform',
    'interactive learning',
    'personalized learning',
    'study help',
    'upload notes',
    'gamified learning',
    'study platform',
    'plataforma educativa',
    'aprendizaje interactivo',
    'aprendizaje personalizado',
    'ayuda para estudiar',
    'subir apuntes',
    'aprendizaje gamificado',
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://eduglowup.com/'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      es: '/es',
    },
  },
  authors: [{ name: 'EduGlowUp' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
