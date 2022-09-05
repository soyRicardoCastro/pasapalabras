import {
  renderLetters,
  playLetter,
  renderTime,
  renderScore,
  startGame,
  pauseGame,
  manipulateTime
} from './models/Rosco.js'

const btnStart = document.getElementById('toggle')
const setGood = document.getElementById('setGood')
const setBad = document.getElementById('setBad')
const setNext = document.getElementById('setNext');

(() => {
  renderLetters()
  renderTime()
  manipulateTime()

  btnStart.addEventListener('click', () => {
    startGame()
  })

  setGood.addEventListener('click', () => {
    playLetter('good')
    renderScore()
  })

  setNext.addEventListener('click', () => {
    playLetter('next')
    pauseGame()
  })

  setBad.addEventListener('click', () => {
    playLetter('bad')
    pauseGame()
  })
})()
