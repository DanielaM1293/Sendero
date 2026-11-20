import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ExperienceDetail } from '@/components/ExperienceDetail'
import { EXPERIENCES, getExp } from '@/lib/data'

export function generateStaticParams() {
  return EXPERIENCES.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const exp = getExp(slug)
  return exp ? { title: exp.title.es, description: exp.tagline.es } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getExp(slug)) notFound()
  return <ExperienceDetail slug={slug} />
}
