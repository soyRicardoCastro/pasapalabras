import { Quiz } from './Quiz.js'

export class UI {
  time = 120
  playing = false

  constructor () {
    this.HTMLTime = document.getElementById('time')
    this.quiz = new Quiz()
  }

  /**
   * @param {string} text question to render
   */
  showQuestion (text) {
    const questionTitle = document.getElementById('question')
    questionTitle.innerText = text
  }

  /**
   * @param {string[]} choices
   * @param {function} callback
   */
  showChoices (choices, callback) {
    const choicesContainer = document.getElementById('choices')
    choicesContainer.innerHTML = ''

    choices.map((c, i) => {
      const button = document.createElement('button')
      button.innerText = choices[i]
      button.className = 'button'
      button.addEventListener('click', () => callback(choices[i]))

      return choicesContainer.appendChild(button)
    })
  }

  /**
   * @param {number} score
   */
  showScores (score) {
    const quizEndHTML = /* html */ `
      <div class="summary">
        <div class="container">
          <h2>¡Termino el juego!</h2>
          <p>Felicidades, tu puntuacion es ${score}, es hora de ir al siguiente juego <a href='letter-soup.html'>¡VAMOS!</a></p>
          <hr />
        </div>
      </div>
    `
    const sessionScore = window.sessionStorage.getItem('score')
    sessionScore ? window.sessionStorage.setItem('score', parseInt(sessionScore) + (score * 2)) : window.sessionStorage.setItem('score', (score * 2))

    const body = document.querySelector('body')
    body.innerHTML = quizEndHTML
  }

  /**
   * @param {number} currentIndex
   * @param {number} total
   */
  showProgress (currentIndex, total) {
    const element = document.getElementById('progress')
    element.innerHTML = `Question ${currentIndex} of ${total}`
  }

  renderTime () {
    this.HTMLTime.innerText = this.time
  }

  showTime () {
    const i = setInterval(() => {
      if (!this.time || this.quiz.isEnded()) {
        this.pauseGame()
        this.showScores()
        return clearInterval(i)
      }

      if (this.playing) this.time--
      this.renderTime()
    }, 1000)
  }

  startGame () {
    this.playing = true
  }

  pauseGame () {
    this.playing = false
  }
}
