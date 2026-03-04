const cursorPlaque = document.getElementById('cursorPlaque')
const plaqueText = cursorPlaque?.querySelector('.cursor-plaque-text')
const portfolioCards = document.querySelectorAll('.portfolio-card')
const videosImgCards = document.querySelectorAll('.videos-card--img')

if (cursorPlaque && plaqueText) {
  let mouseX = 0
  let mouseY = 0
  let plaqueX = 0
  let plaqueY = 0

  const showPlaque = (text) => {
    plaqueText.textContent = text
    cursorPlaque.classList.add('is-visible')
  }

  const hidePlaque = () => {
    cursorPlaque.classList.remove('is-visible')
  }

  const updatePlaque = () => {
    plaqueX += (mouseX - plaqueX) * 0.15
    plaqueY += (mouseY - plaqueY) * 0.15
    cursorPlaque.style.left = plaqueX + 'px'
    cursorPlaque.style.top = plaqueY + 'px'
    requestAnimationFrame(updatePlaque)
  }
  updatePlaque()

  portfolioCards.forEach((card) => {
    card.addEventListener('mouseenter', () => showPlaque('View photo'))
    card.addEventListener('mouseleave', hidePlaque)
  })

  videosImgCards.forEach((card) => {
    card.addEventListener('mouseenter', () => showPlaque('Watch video'))
    card.addEventListener('mouseleave', hidePlaque)
  })

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })
}
