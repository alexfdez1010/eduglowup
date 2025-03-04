import Script from 'next/script';

export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const link = `https://www.googletagmanager.com/gtag/js?id=${id}`;

  return (
    <>
      <Script async src={link} strategy="afterInteractive" />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}');
            
            function getCookieConsent(name) {
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    let [key, value] = cookie.trim().split('=');
                    if (key === name) {
                        return value;
                    }
                }
                return 'denied';
            }
            
            const consentCookie = getCookieConsent('analytics_consent');
            
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': consentCookie,
            });
          `,
        }}
        strategy="afterInteractive"
      />
    </>
  );
}
