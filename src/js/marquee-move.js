/**
 * Бесконечная горизонтальная прокрутка полоски marquee
 */
export function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track')
  if (!tracks.length) return

  tracks.forEach((track) => {
    const wrap = track.closest('.marquee-wrap')
    if (!wrap) return

    const getLoopWidth = () => track.scrollWidth / 2
    let position = 0
    const speed = 2 // px per frame

    function tick() {
      position -= speed
      const loopWidth = getLoopWidth()
      if (position <= -loopWidth) {
        position += loopWidth
      }
      track.style.transform = `translateX(${position}px)`
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}
