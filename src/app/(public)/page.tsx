import { PublicHeader, HeroSection, SocialLinks, WhatsAppFAB } from '@/components/layout/public-layout'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />
      <HeroSection />
      <SocialLinks />
      <WhatsAppFAB />
    </main>
  )
}
