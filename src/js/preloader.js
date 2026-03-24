const TITLE = 'ASTATINE'
const SUB = 'PRODUCTION'
const CHAR_MS = 40
const PAUSE_BEFORE_SUB_MS = 90
const PAUSE_BEFORE_FADE_MS = 320

export function initPreloader() {
  const root = document.getElementById('preloader')
  if (!root) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fadeMs = reduceMotion ? 150 : 450

  document.body.classList.add('preloader-lock')

  const titleEl = root.querySelector('.preloader__title')
  const subEl = root.querySelector('.preloader__sub')
  const lineEl = root.querySelector('.preloader__line')

  if (!titleEl || !subEl || !lineEl) return

  const runFadeOut = () => {
    root.classList.add('preloader--fade-out')
    root.setAttribute('aria-hidden', 'true')
  }

  const runRemove = () => {
    document.body.classList.remove('preloader-lock')
    root.classList.add('preloader--done')
    root.remove()
    window.dispatchEvent(new CustomEvent('preloader:done'))
  }

  const finish = () => {
    runFadeOut()
    window.setTimeout(runRemove, fadeMs)
  }

  const startLogoAnimation = () => {
    const wrap = root.querySelector('.preloader__logo-wrap')
    if (wrap) void wrap.offsetWidth
    root.classList.add('preloader--start')
  }

  if (reduceMotion) {
    requestAnimationFrame(() => {
      startLogoAnimation()
      titleEl.textContent = TITLE
      lineEl.classList.add('preloader__line--visible')
      subEl.textContent = SUB
    })
    window.setTimeout(finish, 500)
    return
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      startLogoAnimation()
    })
  })

  const wait = (ms) => new Promise((r) => window.setTimeout(r, ms))

  const typeString = async (el, text) => {
    for (let i = 1; i <= text.length; i++) {
      el.textContent = text.slice(0, i)
      await wait(CHAR_MS)
    }
  }

  ;(async () => {
    await wait(260)
    await typeString(titleEl, TITLE)
    lineEl.classList.add('preloader__line--visible')
    await wait(PAUSE_BEFORE_SUB_MS)
    await typeString(subEl, SUB)
    await wait(PAUSE_BEFORE_FADE_MS)
    finish()
  })()
}
