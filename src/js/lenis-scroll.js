import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MQ_NO_LENIS = '(max-width: 940px)'

function applyLenisScrollerProxy(lenis) {
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
}

function applyNativeScrollerProxy() {
  const el = document.scrollingElement || document.documentElement
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        el.scrollTop = value
      }
      return el.scrollTop
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
}

/**
 * Плавный скролл Lenis только при ширине выше 940px + синхронизация с ScrollTrigger.
 * На ширине ≤940px и при prefers-reduced-motion — нативный скролл.
 */
export function initLenisScroll() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mqNoLenis = window.matchMedia(MQ_NO_LENIS)

  let lenis = null
  let tickerFn = null

  const teardownLenis = () => {
    if (lenis) {
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      lenis = null
    }
    if (tickerFn) {
      gsap.ticker.remove(tickerFn)
      tickerFn = null
    }
  }

  const sync = () => {
    teardownLenis()

    if (reduceMotion.matches || mqNoLenis.matches) {
      applyNativeScrollerProxy()
      ScrollTrigger.refresh()
      return
    }

    lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    tickerFn = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    applyLenisScrollerProxy(lenis)
    ScrollTrigger.refresh()
  }

  if (reduceMotion.matches) {
    applyNativeScrollerProxy()
    ScrollTrigger.refresh()
  } else {
    sync()
  }

  const onMqChange = () => sync()
  if (mqNoLenis.addEventListener) {
    mqNoLenis.addEventListener('change', onMqChange)
  } else {
    mqNoLenis.addListener(onMqChange)
  }
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', onMqChange)
  } else {
    reduceMotion.addListener(onMqChange)
  }

  window.addEventListener('resize', () => {
    lenis?.resize()
  })

  return {
    resize() {
      lenis?.resize()
    },
    scrollTo(target, options) {
      if (lenis) {
        lenis.scrollTo(target, options)
        return
      }
      if (target && typeof target.getBoundingClientRect === 'function') {
        const offset = options && typeof options.offset === 'number' ? options.offset : 0
        const top = target.getBoundingClientRect().top + window.scrollY + offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    },
  }
}
