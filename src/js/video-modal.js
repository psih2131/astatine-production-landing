import MicroModal from 'micromodal'

const VIDEO_MODAL_ID = 'videoModal'
const FORM_MODAL_ID = 'formModal'
const iframe = document.getElementById('videoModalIframe')
const videoCards = document.querySelectorAll('.videos-card--img[data-video-url], .videos-card--text[data-video-url]')
const videoModalContainer = document.querySelector('#videoModal .modal-container')
const formModalContainer = document.querySelector('#formModal .modal-container')

MicroModal.init({
  awaitCloseAnimation: true,
  disableScroll: true,
})

// Клик по контенту модалки не закрывает (крестик и overlay — закрывают)
if (videoModalContainer) {
  videoModalContainer.addEventListener('click', (e) => e.stopPropagation())
}
if (formModalContainer) {
  formModalContainer.addEventListener('click', (e) => {
    if (!e.target.closest('[data-micromodal-close]')) e.stopPropagation()
  })
}

// Закрытие — вручную (MicroModal.close глючит с двумя модалками)
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return
  modal.classList.remove('is-open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
  if (modalId === VIDEO_MODAL_ID && iframe) iframe.src = ''
}

// Крестик — всегда закрывает
document.querySelectorAll('.modal__close').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    const modal = btn.closest('.modal-base')
    if (modal?.id) closeModal(modal.id)
  })
})

// Overlay — закрывает только при клике именно по overlay (тёмной области), не по контенту
document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (e) => {
    if (e.target !== overlay) return // клик по дочерним элементам (контейнер, форма) — не закрываем
    const modal = overlay.closest('.modal-base')
    if (modal?.id) closeModal(modal.id)
  })
})

// Video modal
const appendAutoplay = (url) => {
  if (!url) return ''
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}autoplay=1`
}

if (iframe && videoCards.length) {
  videoCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault()
      if (card.classList.contains('videos-card--text') && !e.target.closest('.videos-readmore')) return
      const url = card.getAttribute('data-video-url')
      if (!url) return
      iframe.src = appendAutoplay(url)
      MicroModal.show(VIDEO_MODAL_ID, {
        onClose: () => {
          iframe.src = ''
        },
      })
    })
  })
}

// Form modal: кнопки portfolio-btn с data-micromodal-trigger="formModal" открывают форму (атрибут в HTML)

// Form submit — закрыть модалку и редирект на страницу благодарности
const formModalForm = document.querySelector('#formModal .form-modal__form')
if (formModalForm) {
  formModalForm.addEventListener('submit', (e) => {
    e.preventDefault()
    closeModal(FORM_MODAL_ID)
    window.location.href = '/thank-you.html'
  })
}
