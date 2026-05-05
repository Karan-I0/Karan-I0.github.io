import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Stack from './components/Stack'
import Showcase from './components/Showcase'
import Contact from './components/Contact'

const SECTION_IDS = ['About', 'Work', 'Stack', 'Showcase', 'Contact']

export default function App() {
  const [active, setActive] = useState('About')

  const onNav = (id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Scrollspy
  useEffect(() => {
    const onScroll = () => {
      const offset = 140
      let current = 'About'
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Nav active={active} onNav={onNav} />
      <main>
        <Hero />
        <Work />
        <Stack />
        <Showcase />
        <Contact />
      </main>
    </>
  )
}
