export const quizHTML = /* html */`
  <input type='text' placeholder='Pregunta' id='title' />

  <input type='text' placeholder='Opcion 1' id='option1' />

  <input type='text' placeholder='Opcion 2' id='option2' />

  <input type='text' placeholder='Opcion 3' id='option3' />

  <input type='text' placeholder='Opcion 4' id='option4' />

  <input type='text' placeholder='Respuesta (Tiene que ser igual a una opcion)' id='answer' />

  <button data-quiz>Añadir Pregunta</button>

  <input type='submit' value='Guardar todo'>
`

const quiz = []

export function createQuiz (quizForm) {
  const question = quizForm.title
  const option1 = quizForm.option1
  const option2 = quizForm.option2
  const option3 = quizForm.option3
  const option4 = quizForm.option4
  const answer = quizForm.answer

  const one = {
    question: question.value,
    options: [option1.value, option2.value, option3.value, option4.value],
    answer: answer.value
  }

  quiz.push(one)
}

export function saveQuiz () {
  const quizInString = JSON.stringify(quiz)
  window.sessionStorage.setItem('quiz', quizInString)

  const saved = window.sessionStorage.getItem('quiz')
}
