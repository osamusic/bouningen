import { useState, useRef, useEffect } from 'react'
import './App.css'
import StickFigureCanvas from './components/StickFigureCanvas'
import AudioControls from './components/AudioControls'
import AudioVisualizer from './components/AudioVisualizer'
import SpeedControl from './components/SpeedControl'
import FigureControl from './components/FigureControl'
import SyncControl from './components/SyncControl'
import PersonalityControl from './components/PersonalityControl'

function App() {
  const [_audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState(new Uint8Array(128))
  const [animationSpeed, setAnimationSpeed] = useState(0.1)
  const [figureCount, setFigureCount] = useState(1)
  const [isSync, setIsSync] = useState(false)
  const [personalityBalance, setPersonalityBalance] = useState({
    breakdancer: 20,
    waver: 20,
    jumper: 20,
    spinner: 20,
    groover: 20
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
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
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
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
        
        <div className="controls-container">
          <SpeedControl 
            onSpeedChange={setAnimationSpeed}
            initialSpeed={animationSpeed}
          />
          
          <FigureControl 
            onFigureCountChange={setFigureCount}
            initialCount={figureCount}
          />
          
          <SyncControl 
            onSyncChange={setIsSync}
            initialSync={isSync}
          />
          
          {/* Dark Mode Toggle */}
          <div className="control-panel">
            <h3>🌙 Display</h3>
            <label className="control-item">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              Dark Mode
            </label>
          </div>
        </div>
        
        <PersonalityControl 
          onPersonalityBalanceChange={setPersonalityBalance}
          initialBalance={personalityBalance}
        />
        
        <div className="canvas-container">
          <StickFigureCanvas 
            audioData={audioData} 
            animationSpeed={animationSpeed}
            figureCount={figureCount}
            isSync={isSync}
            personalityBalance={personalityBalance}
            isDarkMode={isDarkMode}
          />
          <AudioVisualizer audioData={audioData} />
        </div>
      </main>
    </div>
  )
}

export default App
