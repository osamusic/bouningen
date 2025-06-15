import { useState, useRef, useEffect } from 'react'
import './App.css'
import StickFigureCanvas from './components/StickFigureCanvas'
import AudioControls from './components/AudioControls'
import AudioVisualizer from './components/AudioVisualizer'
import SpeedControl from './components/SpeedControl'
import FigureControl from './components/FigureControl'
import SyncControl from './components/SyncControl'
import PersonalityControl from './components/PersonalityControl'
import VideoRecorder from './components/VideoRecorder'
import { useLanguage } from './contexts/LanguageContext'

function App() {
  const { t, language, changeLanguage } = useLanguage()
  const [_audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState(new Uint8Array(128))
  const [animationSpeed, setAnimationSpeed] = useState(1.0)
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
  const [backgroundPattern, setBackgroundPattern] = useState('default')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [showParticles, setShowParticles] = useState(true)
  const animationRef = useRef()
  const canvasRef = useRef()

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
      <header className="dansabo-header">
        <div className="logo-container">
          <div className="logo">
            <div className="stick-figure-logo">
              <div className="stick-head"></div>
              <div className="stick-body"></div>
              <div className="stick-arm stick-arm-left"></div>
              <div className="stick-arm stick-arm-right"></div>
              <div className="stick-leg stick-leg-left"></div>
              <div className="stick-leg stick-leg-right"></div>
            </div>
            <h1 className="logo-text">
              <span className="logo-main">{t('appTitle')}</span>
              <span className="logo-sub">{t('appSubtitle')}</span>
            </h1>
          </div>
          <div className="header-decoration">
            <div className="language-selector">
              <select 
                value={language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-select"
              >
                <option value="ja">🇯🇵 日本語</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
            <span className="music-note">♪</span>
            <span className="music-note">♫</span>
            <span className="music-note">♪</span>
          </div>
        </div>
      </header>
      
      <main>
        <div className="main-layout">
          <div className="canvas-section">
            <div className="canvas-container">
              <StickFigureCanvas 
                ref={canvasRef}
                audioData={audioData} 
                animationSpeed={animationSpeed}
                figureCount={figureCount}
                isSync={isSync}
                personalityBalance={personalityBalance}
                isDarkMode={isDarkMode}
                backgroundPattern={backgroundPattern}
                aspectRatio={aspectRatio}
                showParticles={showParticles}
              />
              <AudioVisualizer audioData={audioData} />
            </div>
          </div>

          <div className="controls-section">
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
              
              {/* Display Controls */}
              <div className="control-panel">
                <h3>{t('display')}</h3>
                <label className="control-item">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                  />
                  {t('darkMode')}
                </label>
                
                <label className="control-item">
                  <input
                    type="checkbox"
                    checked={showParticles}
                    onChange={(e) => setShowParticles(e.target.checked)}
                  />
                  {t('showParticles')}
                </label>
                
                <div className="background-selector">
                  <label htmlFor="background-pattern">{t('background')}</label>
                  <select
                    id="background-pattern"
                    value={backgroundPattern}
                    onChange={(e) => setBackgroundPattern(e.target.value)}
                  >
                    <option value="default">{t('bgDefault')}</option>
                    <option value="cosmic">{t('bgCosmic')}</option>
                    <option value="dreamlike">{t('bgDreamlike')}</option>
                    <option value="geometric">{t('bgGeometric')}</option>
                    <option value="waves">{t('bgWaves')}</option>
                    <option value="clouds">{t('bgClouds')}</option>
                    <option value="neon">{t('bgNeon')}</option>
                    <option value="matrix">{t('bgMatrix')}</option>
                    <option value="rainbow">{t('bgRainbow')}</option>
                    <option value="fire">{t('bgFire')}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <PersonalityControl 
              onPersonalityBalanceChange={setPersonalityBalance}
              initialBalance={personalityBalance}
            />
          </div>
        </div>
        
        <VideoRecorder 
          canvasRef={canvasRef}
          isPlaying={isPlaying}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <p className="copyright">{t('copyright')}</p>
          <p className="footer-description">{t('footerDesc')}</p>
          <div className="footer-links">
            <a 
              href="https://github.com/osamusic/bouningen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              {t('githubLink')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
