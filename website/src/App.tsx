
import React, { Fragment } from "react";
import { useReducer } from "react";

export default function App() {
  const [counter, plus] = useReducer(c => c + 1, 0)
  return (
    <Fragment>
      <p>Hello, Fucking World</p>
      <button onClick={plus}>Counter: {counter}</button>
    </Fragment>
  )
}
