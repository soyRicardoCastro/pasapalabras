// @ts-check
import { questions as q } from '../data/questions.js'
import { Quiz } from './models/Quiz.js'
import { UI } from './models/UI-quiz.js'

const btnStart = document.querySelector('#btnStart')
const htmlBtn = document.querySelector('.btnStart')
const htmlTime = document.querySelector('#time')
const body = document.querySelector('body')

/**
 * @param {Quiz} quiz
 * @param {UI} ui
 */
const renderPage = (quiz, ui) => {
  if (quiz.isEnded()) ui.showScores(quiz.score)
  else {
    ui.showQuestion(quiz.getQuestionIndex().question)
    ui.showChoices(quiz.getQuestionIndex().options, (currentChoice) => {
      console.log(currentChoice)
      quiz.guess(currentChoice)
      renderPage(quiz, ui)
    })
    ui.showProgress(quiz.questionIndex + 1, quiz.questions.length)
  }
};

(() => {
  const qq = window.sessionStorage.getItem('quiz')
  console.log(qq)
  const questions = JSON.parse(qq) ?? q
  console.log(questions)
  const quiz = new Quiz(questions)
  const ui = new UI()
  let playing = false
  let time = 120

  function renderTime () {
    htmlTime.innerText = time
  }

  function showTime () {
    const i = setInterval(() => {
      if (!time || quiz.isEnded()) {
        pauseGame()
        ui.showScores(quiz.score)
        return clearInterval(i)
      }

      if (playing) time--
      renderTime()
    }, 1000)
  }

  function startGame () {
    playing = true
  }

  function pauseGame () {
    playing = false
  }

  btnStart.addEventListener('click', () => {
    startGame()
    showTime()
    body?.removeChild(htmlBtn)
    const dialog = document.querySelector('dialog')
    dialog.removeAttribute('open')
  })

  renderPage(quiz, ui)
})()
