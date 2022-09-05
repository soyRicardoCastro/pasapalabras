// @ts-check
// eslint-disable-next-line no-unused-vars
import { Question } from './Question.js'

export class Quiz {
  questionIndex = 0
  score = 0

  /**
   * @param {Question[]} question
   */
  constructor (question) {
    this.questions = question
  }

  /**
   * @returns {Question} the question found
   */
  getQuestionIndex () {
    return this.questions[this.questionIndex]
  }

  isEnded () {
    return this.questions.length === this.questionIndex
  }

  /**
   * @param {string} answer the answer
   */
  guess (answer) {
    // if (this.getQuestionIndex().correctAnswer(answer)) this.score++
    if (this.getQuestionIndex().answer === answer) {
      this.score++
    }
    this.questionIndex++
  }
}
