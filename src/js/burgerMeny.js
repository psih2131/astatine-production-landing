export function initBurgerMeny() {
  const burger = document.querySelector('.header__burger')
  const headerMobile = document.querySelector('.header-mobile')
  if (!burger || !headerMobile) return

  function closeMenu() {
    headerMobile.classList.remove('is-active')
    burger.classList.remove('is-active-burger')
  }

  function toggleMenu() {
    headerMobile.classList.toggle('is-active')
    burger.classList.toggle('is-active-burger')
  }

  burger.addEventListener('click', toggleMenu)

  headerMobile.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.getAttribute('href') === '#') return
    link.addEventListener('click', closeMenu)
  })
}
