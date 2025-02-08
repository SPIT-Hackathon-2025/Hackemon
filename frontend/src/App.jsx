import { useState } from 'react'
import './App.css'
import Dragndrop from './pages/Dragndrop'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dragndrop/>
    </>
  )
}

export default App
