import { quizHTML, saveQuiz, createQuiz } from './panel/quiz.js'
import { lsHTML, saveSquare, createSquare } from './panel/ls.js'
import { memoryHTML, saveMemory } from './panel/memory.js'
import { toast } from 'https://cdn.skypack.dev/wc-toast';

const $ = elem => document.querySelector(elem)

const linkQuiz = $('#quiz')
const linkLS = $('#letter-soup')
const linkMemory = $('#memory')
const form = $('form')
const header = $('h1')

form.innerHTML = quizHTML
const s = $('[data-save]')

header.innerText = 'Q U I Z'
form.addEventListener('submit', e => e.preventDefault())
console.log(s)
s.addEventListener('click', () => {
  saveQuiz()
  console.log('wubmit')
  form.reset()
  toast('¡Pregunta y opciones agregadas con exito!', {
    icon: {
      type: 'success'
    }
  })
})


function saveData () {
  const quiz = $('[data-quiz]')
  if (quiz) {
    quiz.addEventListener('click', () => {
      createQuiz(form)
      form.reset()
      toast('¡Se ha creado exitosamente!', { icon: { type: 'success' } })
    })
  }

  const ls = $('[data-ls]')
  if (ls) {
    ls.addEventListener('click', () => {
      header.innerText = 'L E T T E R S O U P'
      createSquare(form)
      form.reset()
      toast('¡Se ha creado exitosamente!', { icon: { type: 'success' } })
    })
  }
}

saveData()

linkQuiz.addEventListener('click', () => {
  form.innerHTML = quizHTML
  header.innerText = 'Q U I Z'
  saveData()

  form.addEventListener('submit', () => {
    saveQuiz()
    console.log('wubmit')
    form.reset()
    toast('¡Pregunta y opciones agregadas con exito!', {
      icon: {
        type: 'success'
      }
    })
  })
})

linkLS.addEventListener('click', () => {
  form.innerHTML = lsHTML
  header.innerText = 'L E T T E R S O U P'
  saveData()

  form.addEventListener('submit', () => {
    saveSquare()
    form.reset()
    toast('¡Cuadros agregado con exito!', {
      icon: {
        type: 'success'
      }
    })
  })
})

linkMemory.addEventListener('click', () => {
  form.innerHTML = memoryHTML
  header.innerText = 'M E M O R Y'

  form.addEventListener('submit', e => {
    e.preventDefault()
    saveMemory()
    toast('¡Palabras agregadas con exito!', {
      icon: {
        type: 'success'
      }
    })
    form.reset()
  })
})
