import { run } from '@cycle/run'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { makeDOMDriver, div, h1, ul, li, input, button, form } from '@cycle/dom'

function main(sources) {
  const { todo$, input$ } = intent(sources.dom)
  const state$ = model(todo$, input$)
  const vdom$ = view(state$)

  return {
    dom: vdom$
  }
}

function view(state$) {
  return state$
    .startWith({ todos: [], inputValue: '' })
    .map(({ todos, inputValue }) => 
      div([
        h1('Cycle todo'),
        form('.form.js-form', [
          input('.input.js-input', { value: inputValue }),
          button('.add', 'Add')
        ]),
        ul(todos.map(todo => li(todo.title)))
      ])
    )
}

function model(todo$, input$) {
  const inputValue$ = xs.merge(input$, todo$.mapTo(''))
  const todos$ = todo$.fold((todos, todo) => [...todos, { title: todo }], [])

  return xs.combine(todos$, inputValue$)
    .map(([todos, inputValue]) => ({ todos, inputValue }))
}

function intent(domSource) {
  const input$ = domSource
    .select('.js-input')
    .events('input')
    .map(e => e.currentTarget.value)

  const add$ = domSource
    .select('.js-form')
    .events('submit')
    .map(e => e.preventDefault())

  const todo$ = add$
    .compose(sampleCombine(input$))
    .map(([_, title]) => title)

  return { input$, todo$ }
}

const drivers = {
  dom: makeDOMDriver('.js-app')
}

run(main, drivers)
