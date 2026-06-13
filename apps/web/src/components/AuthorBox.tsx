import Image from 'next/image';

export interface Author {
  ad: string;
  unvan?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

/** E-E-A-T yazar kutusu. */
export function AuthorBox({ author }: { author: Author }) {
  return (
    <div className="mt-10 flex items-start gap-4 rounded-lg border border-line bg-canvas p-5">
      {author.avatarUrl ? (
        <Image
          src={author.avatarUrl}
          alt={author.ad}
          width={56}
          height={56}
          className="rounded-full"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
          {author.ad.charAt(0)}
        </div>
      )}
      <div>
        <p className="font-semibold text-brand-900">{author.ad}</p>
        {author.unvan && <p className="text-sm text-accent-600">{author.unvan}</p>}
        {author.bio && <p className="mt-1 text-sm text-muted">{author.bio}</p>}
      </div>
    </div>
  );
}
