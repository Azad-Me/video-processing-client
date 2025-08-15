import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "tailwindcss";
import VideoProcess from './Components/VideoProcess';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <VideoProcess />
      <p></p>
    </>
  )
}

export default App
