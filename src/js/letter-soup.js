import { words as w } from '../data/letter-soup-words.js'

let score = 0
let time = 120
let isPlaying = false

const timeHTML = document.getElementById('time')
const scoreHTML = document.getElementById('score')

function renderTime () {
  timeHTML.innerText = time
}

export function renderScore () {
  score += 3
  scoreHTML.innerText = score
}

export const manipulateTime = () => {
  const i = setInterval(() => {
    if (!time || isEnded()) {
      pauseGame()
      renderSummary()
      return clearInterval(i)
    }

    if (isPlaying) time--
    renderTime()
  }, 1000)
}

export const renderSummary = () => {
  pauseGame()
  const s = document.querySelector('.summary')
  if (s) return

  const summaryContainer = document.createElement('div')
  summaryContainer.classList.add('summary')

  const body = document.querySelector('body')

  const summary = /* html */ `
    <div class="container">
      <h2>¡Termino el juego!</h2>
      <p>Felicidades, tu puntuacion es ${score}, es hora de ir al siguiente juego <a href='memoria.html'>¡VAMOS!</a></p>
      <hr />
      <button class="close" id="close">X</button>
    </div>
  `
  summaryContainer.innerHTML = summary
  body.appendChild(summaryContainer)

  const sessionScore = window.sessionStorage.getItem('score')
  sessionScore
    ? window.sessionStorage.setItem('score', parseInt(sessionScore) + score)
    : window.sessionStorage.setItem('score', score)

  document
    .getElementById('close')
    .addEventListener('click', () => {
      body.removeChild(summaryContainer)
    })
}

export const startGame = () => (isPlaying = true)
export const pauseGame = () => (isPlaying = false)

export function isEnded (index) {
  const wordsFromSession = window.sessionStorage.getItem('letter-soup')
  const words = JSON.parse(wordsFromSession) ?? w
  return words.length === index
}
