'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';
import type { AnalyticsEventMap, AnalyticsEventName } from '@/lib/analytics';

type Props<K extends AnalyticsEventName> = {
  href: string;
  event: K;
  payload: AnalyticsEventMap[K];
  className?: string;
  children: ReactNode;
  /** Dış bağlantı ise yeni sekmede aç. */
  external?: boolean;
};

/**
 * İzlenebilir bağlantı. Tracking ihtiyacı prop ile gelir; component içinde
 * hardcode gtag/clarity YOKTUR — yalnızca merkezi track() çağrılır.
 */
export function TrackedLink<K extends AnalyticsEventName>({
  href,
  event,
  payload,
  className,
  children,
  external,
}: Props<K>) {
  const handleClick = () => track(event, payload);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-track={event}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} data-track={event} onClick={handleClick}>
      {children}
    </Link>
  );
}
