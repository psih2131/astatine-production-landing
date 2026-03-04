import '../scss/main.scss'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import './cursor-plaque.js'
import './video-modal.js'
import { initMarquee } from './marquee-move.js'
import { initNewsSlider } from './news-slider.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hero video — по умолчанию выключен, включается при первом скролле
const heroVideoBg = document.querySelector('.hero__video-bg')
if (heroVideoBg) {
  heroVideoBg.muted = true
  heroVideoBg.playsInline = true
  heroVideoBg.loop = true
  heroVideoBg.pause()

  const startVideoOnScroll = () => {
    heroVideoBg.play().catch(() => {})
    window.removeEventListener('scroll', startVideoOnScroll)
  }
  window.addEventListener('scroll', startVideoOnScroll, { passive: true })
}

// Hero — 2 блока: block2 наезжает на block1, блок1 искажается и сжимается, видео масштабируется до 100%
const hero = document.querySelector('.hero')
if (hero) {
  const heroPin = hero.querySelector('.hero__pin')
  const heroBlock1 = hero.querySelector('.hero__block1')
  const heroBlock2 = hero.querySelector('.hero__block2')
  const heroVideoWrap = hero.querySelector('.hero__video-wrap')

  if (heroPin && heroBlock1 && heroBlock2 && heroVideoWrap) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=250%',
        scrub: 2,
        pin: true,
      },
    })

    // Фаза 1 (0–45% скролла): block2 наезжает; block1 уменьшается и уходит по оси Z (rotateX)
    tl.fromTo(heroBlock2, { top: '100%' }, { top: 0, duration: 0.45, ease: 'none' }, 0)
    tl.fromTo(heroBlock1, { scale: 1, rotateX: 0 }, { scale: 0.82, rotateX: -12, duration: 0.45, ease: 'none' }, 0)
    // Фаза 2 (45–100% скролла): видео расширяется до 1500px
    tl.fromTo(heroVideoWrap, { scale: 0.6, width: '60%', maxWidth: 900 }, { scale: 1, width: '100%', maxWidth: 1500, duration: 0.55, ease: 'none' }, 0.45)

    window.addEventListener('load', () => ScrollTrigger.refresh())
    window.addEventListener('resize', () => ScrollTrigger.refresh())
  }
}

// Header: тёмный фон только после hero (пока шапка над hero — прозрачная)
const header = document.getElementById('header')
if (header) {
  window.addEventListener('scroll', () => {
    // Hero занимает ~250vh скролла (pin), пока над ним — без фона
    const heroScrollEnd = window.innerHeight * 2.5
    header.classList.toggle('header--scrolled', window.scrollY > heroScrollEnd)
  })
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href')
    if (href === '#') return
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.body.classList.remove('menu-open')
    }
  })
})

// Mobile menu
const burger = document.querySelector('.header__burger')
if (burger) {
  burger.addEventListener('click', () => {
    document.body.classList.toggle('menu-open')
  })
}

// Portfolio: horizontal scroll on vertical scroll
// Карточки смещены вправо при входе в секцию, при скролле двигаются справа налево
const portfolio = document.querySelector('.portfolio')
if (portfolio) {
  const track = portfolio.querySelector('.portfolio-track')
  const scrollWrap = portfolio.querySelector('.portfolio-scroll')

  if (track && scrollWrap) {
    const getScrollData = () => {
      const trackWidth = track.scrollWidth
      const viewWidth = scrollWrap.offsetWidth
      const maxScroll = Math.max(0, trackWidth - viewWidth)
      const startOffset = Math.max(0, viewWidth - 808)
      return { maxScroll, startOffset }
    }

    gsap.fromTo(track,
      { x: () => getScrollData().startOffset },
      {
        x: () => -getScrollData().maxScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: portfolio,
          pin: true,
          scrub: 4,
          start: 'top 25%',
          end: () => {
            const { maxScroll, startOffset } = getScrollData()
            return `+=${startOffset + maxScroll}`
          }
        }
      }
    )

    window.addEventListener('load', () => ScrollTrigger.refresh())
    window.addEventListener('resize', () => ScrollTrigger.refresh())
  }
}

// Contact form submit — редирект на страницу благодарности
const contactForm = document.querySelector('#contact .contact-form')
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    window.location.href = '/thank-you.html'
  })
}

AOS.init({
  duration: 700,
  easing: 'ease-out',
  offset: 120,
  once: true,
})

// Fancybox — галерея на странице проекта
const projectGallery = document.querySelector('.project-gallery')
if (projectGallery) {
  Fancybox.bind('[data-fancybox="gallery"]')
}

initMarquee()
initNewsSlider()
