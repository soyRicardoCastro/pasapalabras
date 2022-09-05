import { quizHTML, saveQuiz, createQuiz } from './panel/quiz.js'
import { lsHTML, saveSquare, createSquare } from './panel/ls.js'
import { memoryHTML, saveMemory } from './panel/memory.js'

const $ = elem => document.querySelector(elem)

const linkQuiz = $('#quiz')
const linkLS = $('#letter-soup')
const linkMemory = $('#memory')
const form = $('form')

form.innerHTML = quizHTML
form.addEventListener('submit', e => e.preventDefault())

function saveData () {
  const quiz = $('[data-quiz]')
  if (quiz) {
    quiz.addEventListener('click', () => {
      console.log('clickig')
      createQuiz(form)
      console.log('qpasa')
    })
  }

  const ls = $('[data-ls]')
  if (ls) {
    ls.addEventListener('click', () => {
      console.log('clickon')
      createSquare(form)
      console.log('qpasa')
    })
  }
}

saveData()

linkQuiz.addEventListener('click', () => {
  form.innerHTML = quizHTML
  saveData()

  form.addEventListener('submit', () => {
    console.log('subit')
    saveQuiz()
    form.reset()
  })
})

linkLS.addEventListener('click', () => {
  form.innerHTML = lsHTML
  saveData()

  form.addEventListener('submit', () => {
    console.log('subit')
    saveSquare()
    form.reset()
  })
})

linkMemory.addEventListener('click', () => {
  form.innerHTML = memoryHTML

  form.addEventListener('submit', e => {
    e.preventDefault()
    console.log('subit')
    saveMemory()
  })
})
