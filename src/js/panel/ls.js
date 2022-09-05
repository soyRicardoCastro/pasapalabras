export const lsHTML = /* html */`
  <input type='text' placeholder='Tema' id='title' />

  <input type='text' placeholder='Palabra 1' id='option1' />

  <input type='text' placeholder='Palabra 2' id='option2' />

  <input type='text' placeholder='Palabra 3' id='option3' />

  <button data-ls>Añadir Cuadro</button>

  <input type='submit' value='Guardar todo'>
`

const ls = []

export function createSquare (lsForm) {
  const title = lsForm.title
  const option1 = lsForm.option1
  const option2 = lsForm.option2
  const option3 = lsForm.option3

  const one = {
    title: title.value,
    words: [option1.value, option2.value, option3.value]
  }

  ls.push(one)
}

export function saveSquare () {
  const letterSoup = JSON.stringify(ls)
  window.sessionStorage.setItem('letter-soup', letterSoup)
}
