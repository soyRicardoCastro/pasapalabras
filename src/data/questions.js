import { Question } from '../js/models/Question.js'
import { questions as q } from './quiz-questions.js'

export const questions = q.map(
  (q) => new Question(q.question, q.options, q.answer)
)
