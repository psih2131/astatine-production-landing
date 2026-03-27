import Swiper from 'swiper'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const MAX_CHARS = 150

function truncateNewsDescriptions() {
  document.querySelectorAll('.news-card__desc[data-max-chars]').forEach((el) => {
    const maxChars = parseInt(el.getAttribute('data-max-chars'), 10) || MAX_CHARS
    const text = el.textContent.trim()
    if (text.length > maxChars) {
      el.textContent = text.slice(0, maxChars) + '...'
    }
  })
}

function equalizeNewsCardHeights() {
  const cards = document.querySelectorAll('.news-swiper .news-card')
  if (!cards.length) return

  cards.forEach((card) => { card.style.minHeight = '' })
  const maxHeight = Math.max(...Array.from(cards).map((c) => c.offsetHeight))
  cards.forEach((card) => { card.style.minHeight = `${maxHeight}px` })
}

export function initNewsSlider() {
  truncateNewsDescriptions()

  const outer = document.querySelector('.news-swiper-outer')
  const el = outer?.querySelector('.news-swiper')
  if (!el || !outer) return

  const prevEl = outer.querySelector('.news-swiper-button--prev')
  const nextEl = outer.querySelector('.news-swiper-button--next')

  const swiper = new Swiper(el, {
    modules: [Pagination, Navigation],
    loop: true,
    slidesPerView: 1,
    spaceBetween: 24,
    breakpoints: {
      761: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      941: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1540: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
    pagination: {
      el: '.news-swiper-pagination',
      clickable: true,
    },
    navigation: {
      prevEl,
      nextEl,
    },
    on: {
      init() {
        requestAnimationFrame(() => equalizeNewsCardHeights())
      },
      slideChange() {
        requestAnimationFrame(() => equalizeNewsCardHeights())
      },
      breakpoint() {
        requestAnimationFrame(() => equalizeNewsCardHeights())
      },
    },
  })

  window.addEventListener('load', () => equalizeNewsCardHeights())

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => equalizeNewsCardHeights())
  })

  const resizeObs = new ResizeObserver(() => {
    requestAnimationFrame(() => equalizeNewsCardHeights())
  })
  resizeObs.observe(el)
}
