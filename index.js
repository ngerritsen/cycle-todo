import { run } from '@cycle/run'
import xs from 'xstream'
import { makeDOMDriver, div, h1, ul, li } from '@cycle/dom'

function main(sources) {
  const vdom$ = xs.of(false)
    .map(() => 
      div([
        h1('Cycle todo'),
        ul([
          li('Item 1'),
          li('Item 2')
        ])
      ])
    )

  return {
    dom: vdom$
  }
}

const drivers = {
  dom: makeDOMDriver('.app')
}

run(main, drivers)
