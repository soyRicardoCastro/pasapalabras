// import { saveWordsToString } from '../game-instance.js'

export const memoryHTML = /* html */`
  <input type='text' placeholder='Palabra 1' id='option1' />
  <input type='text' placeholder='Palabra 2' id='option2' />
  <input type='text' placeholder='Palabra 3' id='option3' />
  <input type='text' placeholder='Palabra 4' id='option4' />
  <input type='text' placeholder='Palabra 5' id='option5' />
  <input type='text' placeholder='Palabra 6' id='option6' />
  <input type='text' placeholder='Palabra 7' id='option7' />
  <input type='text' placeholder='Palabra 8' id='option8' />
  <input type='text' placeholder='Palabra 9' id='option9' />

  <input type='submit' value='Guardar todo'>
`

export function saveMemory () {
  const form = document.querySelector('form')
  const palabra1 = form.option1
  const palabra2 = form.option2
  const palabra3 = form.option3
  const palabra4 = form.option4
  const palabra5 = form.option5
  const palabra6 = form.option6
  const palabra7 = form.option7
  const palabra8 = form.option8
  const palabra9 = form.option9

  const words = [
    palabra1.value,
    palabra2.value,
    palabra3.value,
    palabra4.value,
    palabra5.value,
    palabra6.value,
    palabra7.value,
    palabra8.value,
    palabra9.value
  ]

  const memory = words.toString(words)
  window.localStorage.setItem('memory', memory)

  // saveWordsToString(memory)
}
