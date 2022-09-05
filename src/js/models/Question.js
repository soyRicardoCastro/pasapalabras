export class Question {
  /**
   * @param {string} text the text of the question
   * @param {string[]} options the options of the question
   * @param {string} answer the answer of the question
   */
  constructor (question, options, answer) {
    this.question = question
    this.options = options
    this.answer = answer
  }

  /**
   * @param {string} choice some question to guess
   * @returns {boolean} return true if the answer is correct
   */
  correctAnswer (choice) {
    return choice === this.answer
  }
}
