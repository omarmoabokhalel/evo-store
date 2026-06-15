import Hero from '@/sections/Hero'
import Features from '@/sections/Features'
import NewArrivals from '@/sections/NewArrivals'
import AIGeneratorSection from '@/sections/AIGeneratorSection'

export default function Home() {
  return (
    <main>
      <Hero />
      <NewArrivals />
      <AIGeneratorSection />
      <Features />
    </main>
  )
}
