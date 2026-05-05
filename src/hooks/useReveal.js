import { useEffect, useRef, useState } from 'react'

// Returns [ref, visible] — `visible` flips to true once the element scrolls
// into view, then stays true. Apply opacity/transform via the returned flag.
export default function useReveal({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  return [ref, visible]
}

export const revealStyle = (visible, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(40px)',
  transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
})
