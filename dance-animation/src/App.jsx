import { useState, useRef, useEffect } from 'react'
import './App.css'
import StickFigureCanvas from './components/StickFigureCanvas'
import AudioControls from './components/AudioControls'
import AudioVisualizer from './components/AudioVisualizer'

function App() {
  const [audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState(new Uint8Array(128))
  const animationRef = useRef()

  useEffect(() => {
    if (analyser && isPlaying) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      const updateAudioData = () => {
        analyser.getByteFrequencyData(dataArray)
        setAudioData([...dataArray])
        animationRef.current = requestAnimationFrame(updateAudioData)
      }
      
      updateAudioData()
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [analyser, isPlaying])

  return (
    <div className="app">
      <header>
        <h1>棒人間ダンスアニメーション</h1>
      </header>
      
      <main>
        <AudioControls 
          setAudioContext={setAudioContext}
          setAnalyser={setAnalyser}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
        />
        
        <div className="canvas-container">
          <StickFigureCanvas audioData={audioData} />
          <AudioVisualizer audioData={audioData} />
        </div>
      </main>
    </div>
  )
}

export default App
