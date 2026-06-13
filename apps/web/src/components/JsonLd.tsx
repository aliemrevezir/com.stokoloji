/** schema.org JSON-LD'yi sayfaya basar. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify güvenli; içerik bizim ürettiğimiz nesnelerden gelir.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
