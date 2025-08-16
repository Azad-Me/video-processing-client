import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "tailwindcss";
import Home from './Components/Home';
import ImageProcess from './Components/ImageProcess';
import VideoProcessor from './Components/VideoProcess';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home />
      {/* <VideoProcessor />
      <ImageProcess /> */}

      <p></p>
    </>
  )
}

export default App
