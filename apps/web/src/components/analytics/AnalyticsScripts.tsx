'use client';

import Script from 'next/script';
import { useConsent, isAnalyticsConfigured } from '@/lib/analytics/useConsent';

/**
 * Sağlayıcı script'lerini YALNIZCA onay sonrası ve `lazyOnload` ile yükler.
 * Onay yoksa hiçbir tracker DOM'a girmez (CWV koruması + KVKK uyumu).
 * Env ID'leri boşsa hiçbir şey render edilmez (analytics sessizce kapalı).
 */
export function AnalyticsScripts() {
  const status = useConsent();
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  if (!isAnalyticsConfigured()) return null;
  if (status !== 'granted') return null;

  return (
    <>
      {ga4Id ? (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
              gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
              gtag('config','${ga4Id}',{anonymize_ip:true});
            `}
          </Script>
        </>
      ) : null}

      {clarityId ? (
        <Script id="clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}
    </>
  );
}
