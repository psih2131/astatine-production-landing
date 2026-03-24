import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Плавный скролл Lenis + синхронизация с GSAP ScrollTrigger (scrollerProxy).
 */
export function initLenisScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  const lenis = new Lenis({
    lerp: 0.075,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  })

  window.addEventListener('resize', () => {
    lenis.resize()
  })

  return lenis
}
