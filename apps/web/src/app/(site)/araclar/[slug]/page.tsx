import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { strapi } from '@/lib/strapi';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  try {
    const tools = await strapi.listTools();
    return tools.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await strapi.getTool(slug).catch(() => null);
  if (!tool) return {};
  const title = tool.seo?.title ?? tool.ad;
  const description = tool.seo?.description ?? tool.kisaAciklama ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: `/araclar/${tool.slug}` },
    openGraph: { title, description: description ?? undefined, type: 'website' },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await strapi.getTool(slug).catch(() => null);
  if (!tool) notFound();

  return <ToolPageTemplate tool={tool} siteUrl={siteUrl} />;
}
