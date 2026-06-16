'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { track } from '@/lib/analytics';
import { useNewsletterSubscribe } from '@/lib/newsletter/useNewsletterSubscribe';
import type { SubscribeStatus } from '@/lib/newsletter/listmonk';

/**
 * Tek reusable abonelik formu. Tüm e-posta toplama noktaları bunu kullanır
 * (anasayfa lead magnet, footer, ileride pop-up). İstek mantığı
 * `useNewsletterSubscribe`'da, ESP erişimi sunucuda; burası yalnız sunum + onay.
 *
 * Başarıda merkezi `track('newsletter_submit')` atılır (kaynak + ESP sonucu);
 * çağıran ek bir funnel event'i istiyorsa `onSuccess` ile kendi `track()`'ini
 * yapar. Component asla doğrudan gtag/clarity çağırmaz (mimari kural 5).
 */
export interface NewsletterFormProps {
  /** Kaynak etiketi (abone attribs.source + event payload'ına gider). */
  source: string;
  buttonLabel?: string;
  placeholder?: string;
  /** Form sarmalayıcı sınıfı (varsayılan `lm-form`). */
  className?: string;
  style?: CSSProperties;
  /** Başarı/zaten-kayıtlı mesajı (double opt-in vurgusuyla). */
  successMessage?: string;
  /** Başarıda ek funnel event'i atmak için (örn. lead_magnet_submit). */
  onSuccess?: (status: SubscribeStatus) => void;
}

const DEFAULT_SUCCESS = 'Teşekkürler! Onay için e-postanı kontrol et.';

export function NewsletterForm({
  source,
  buttonLabel = 'Katıl',
  placeholder = 'E-posta adresin',
  className = 'lm-form',
  style,
  successMessage = DEFAULT_SUCCESS,
  onSuccess,
}: NewsletterFormProps) {
  const { phase, submit } = useNewsletterSubscribe(source);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shownMessage, setShownMessage] = useState(successMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? '';
    if (!email) return;

    const status = await submit(email);
    if (status && status !== 'error' && status !== 'invalid') {
      track('newsletter_submit', { source, status });
      onSuccess?.(status);
      setShownMessage(
        status === 'already' ? 'Bu e-posta zaten kayıtlı. Teşekkürler!' : successMessage,
      );
    }
  };

  if (phase === 'success') {
    return (
      <p className="lm-thanks" role="status">
        {shownMessage}
      </p>
    );
  }

  return (
    <form className={className} style={style} onSubmit={handleSubmit} noValidate>
      <input
        ref={inputRef}
        className="input"
        type="email"
        required
        placeholder={placeholder}
        aria-label="E-posta"
        disabled={phase === 'loading'}
      />
      <button className="btn btn-primary" type="submit" disabled={phase === 'loading'}>
        {phase === 'loading' ? 'Gönderiliyor…' : buttonLabel}
      </button>
      {phase === 'error' && (
        <p className="lm-error" role="alert" style={{ flexBasis: '100%', margin: 0 }}>
          Bir şeyler ters gitti, tekrar dener misin?
        </p>
      )}
    </form>
  );
}
