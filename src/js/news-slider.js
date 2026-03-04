import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'
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

  const el = document.querySelector('.news-swiper')
  if (!el) return

  const swiper = new Swiper(el, {
    modules: [Pagination],
    slidesPerView: 4,
    spaceBetween: 24,
    pagination: {
      el: '.news-swiper-pagination',
      clickable: true,
    },
    on: {
      init() {
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
