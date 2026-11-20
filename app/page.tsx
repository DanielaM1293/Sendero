import { ExperienceCarousel } from '@/components/ExperienceCarousel'
import { Hero } from '@/components/Hero'
import { Quiz } from '@/components/Quiz'
import { CtaBand, Faq, HowItWorks, Testimonials, TrustStrip } from '@/components/Sections'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ExperienceCarousel />
      <Quiz />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  )
}
