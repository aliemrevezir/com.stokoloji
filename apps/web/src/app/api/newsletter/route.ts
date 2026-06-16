/**
 * POST /api/newsletter — newsletter / lead-magnet abonelik uç noktası.
 *
 * Tarayıcı formu buraya JSON gönderir; Listmonk token'ı YALNIZ sunucuda kalır
 * (`lib/newsletter/listmonk`). İstemci hiçbir zaman ESP'ye doğrudan dokunmaz.
 *
 * Yanıt sözleşmesi (UI bunu bekler):
 *   200 { status: 'subscribed' | 'already' | 'disabled' }
 *   400 { status: 'invalid' }
 *   502 { status: 'error' }
 */
import { NextResponse } from 'next/server';
import { subscribe, type SubscribeStatus } from '@/lib/newsletter/listmonk';

// ESP çağrısı kişiye özel; statik render'a sokma.
export const dynamic = 'force-dynamic';

const HTTP_STATUS: Record<SubscribeStatus, number> = {
  subscribed: 200,
  already: 200,
  disabled: 200, // env yoksa sessizce başarı (geliştirme/önizleme)
  invalid: 400,
  error: 502,
};

export async function POST(request: Request) {
  let payload: { email?: unknown; name?: unknown; source?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ status: 'invalid' }, { status: 400 });
  }

  const email = typeof payload.email === 'string' ? payload.email : '';
  const name = typeof payload.name === 'string' ? payload.name : undefined;
  const source = typeof payload.source === 'string' ? payload.source : undefined;

  if (!email) {
    return NextResponse.json({ status: 'invalid' }, { status: 400 });
  }

  const result = await subscribe({ email, name, source });
  return NextResponse.json({ status: result.status }, { status: HTTP_STATUS[result.status] });
}
