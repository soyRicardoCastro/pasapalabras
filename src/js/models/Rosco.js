import { lettersArray } from '../../data/letters.js'

const container = document.getElementById('container')

let letterIndex = 0
let l = lettersArray
let score = 0
let time = 80
let isPlaying = false

const sessionScore = window.sessionStorage.getItem('score')
if (sessionScore) {
  const acumulatedScore = parseInt(sessionScore)
  time += acumulatedScore
}

export const manipulateTime = () => {
  const i = setInterval(() => {
    if (!time || !l.length) {
      pauseGame()
      renderSummary()
      return clearInterval(i)
    }

    if (isPlaying) time--
    renderTime()
  }, 1000)
}

export const startGame = () => (isPlaying = true)
export const pauseGame = () => (isPlaying = false)

export const renderScore = () => {
  if (score === 27) return
  score++
  document.getElementById('words').innerText = score
}

export const renderTime = () =>
  (document.getElementById('time').innerText = time)

export const getCurrentLetter = () => {
  if (letterIndex > l.length - 1) letterIndex = 0
  const letter = l[letterIndex].letter

  if (!letter) {
    letterIndex = 0
    const letter = l[letterIndex].letter
    return letter
  }
  return letter
}

export const removeLetter = (letter) => {
  const arrayFiltered = l.filter(
    (l) => l.letter.toLowerCase() !== letter.toLowerCase()
  )
  l = arrayFiltered
}

export const mapLetters = () => letterIndex++

export const renderLetters = () => {
  return l.map((l, i) => {
    const p = document.createElement('p')
    const a = document.createElement('a')

    a.textContent = l.letter
    p.setAttribute('style', `--i: ${i}; --e: ${l.rotate};`)
    p.appendChild(a)

    return container.appendChild(p)
  })
}

const findLetter = (letter) =>
  l.find((l) => l.letter.toLowerCase() === letter.toLowerCase())

export const playLetter = (bg) => {
  if (!l.length) return

  const L = findLetter(getCurrentLetter())

  if (L) {
    const index = L.rotate - 7
    renderLetter(bg, L.letter, index, L.rotate)
  } else {
    letterIndex = 0
    const L = findLetter(getCurrentLetter())
    const index = L.rotate - 7
    renderLetter(bg, L.letter, index, L.rotate)
  }

  if (bg === 'next') return mapLetters()

  removeLetter(getCurrentLetter())
}

export const renderLetter = (bg, letter, index, rotate) => {
  const p = document.createElement('p')
  const a = document.createElement('a')

  a.textContent = letter
  p.setAttribute('style', `--i: ${index}; --e: ${rotate};`)
  p.classList.add(bg)
  p.appendChild(a)

  container.appendChild(p)
}

export const renderSummary = () => {
  const s = document.querySelector('.summary')
  if (s) return

  const summaryContainer = document.createElement('div')
  summaryContainer.classList.add('summary')

  const body = document.querySelector('body')

  const summary = /* html */ `
    <dialog open>
  <article>
    <h3>¡Ha terminado el juego!</h3>
    <p>
      Felicidades, tu puntuacion es ${score}
    </p>
    <footer>
      <a href="index.html" role="button" class="secondary">Menu</a>
      <a href="panel.html" role="button">Panel</a>
    </footer>
  </article>
</dialog>
  `

  summaryContainer.innerHTML = summary
  body.appendChild(summaryContainer)

  const btnClose = document.getElementById('close')
  btnClose.addEventListener('click', () => {
    body.removeChild(summaryContainer)
  })
}
