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
  const [autoSyncControl, setAutoSyncControl] = useState(false)
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
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false)
  const animationRef = useRef()
  const canvasRef = useRef()
  const lastAudioDataRef = useRef([])
  const syncChangeCountdownRef = useRef(0)
  const currentSyncStateRef = useRef(false)

  const autoSyncBasedOnMusic = (newAudioData) => {
    if (lastAudioDataRef.current.length === 0) {
      lastAudioDataRef.current = newAudioData
      return
    }

    // Calculate current audio characteristics
    const bassFreq = newAudioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
    const midFreq = newAudioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
    const highFreq = newAudioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
    const totalEnergy = bassFreq + midFreq + highFreq

    // Calculate previous audio characteristics
    const prevBassFreq = lastAudioDataRef.current.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
    const prevMidFreq = lastAudioDataRef.current.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
    const prevHighFreq = lastAudioDataRef.current.slice(50, 100).reduce((a, b) => a + b) / 50 / 255

    // Detect significant changes in music
    const bassChange = Math.abs(bassFreq - prevBassFreq)
    const midChange = Math.abs(midFreq - prevMidFreq)
    const highChange = Math.abs(highFreq - prevHighFreq)
    const totalChange = bassChange + midChange + highChange

    // Detect beat drops, breakdowns, or major musical changes
    const isBeatDrop = bassFreq > 0.7 && bassChange > 0.3
    const isBreakdown = totalEnergy < 0.3 && totalChange > 0.2
    const isBuildUp = totalEnergy > 0.6 && totalChange > 0.25
    const isMusicalChange = totalChange > 0.4
    
    // Detect volume changes (more common than silence)
    const prevTotalEnergy = prevBassFreq + prevMidFreq + prevHighFreq
    
    // Detect significant volume drops and increases
    const isVolumeDropSignificant = totalEnergy < prevTotalEnergy * 0.6 && prevTotalEnergy > 0.3
    const isVolumeIncreaseSignificant = totalEnergy > prevTotalEnergy * 1.5 && totalEnergy > 0.3
    const isSongBreak = isVolumeDropSignificant || isVolumeIncreaseSignificant
    
    // Detect tempo/rhythm changes
    const rhythmChange = Math.abs(bassFreq - prevBassFreq) > 0.4
    const isTempoChange = rhythmChange && totalEnergy > 0.3

    // Countdown system to prevent too frequent changes
    if (syncChangeCountdownRef.current > 0) {
      syncChangeCountdownRef.current--
    }

    // Decide when to toggle sync
    if (syncChangeCountdownRef.current === 0) {
      if (isBeatDrop || isBuildUp) {
        // High energy moments favor sync
        const syncProbability = 0.8
        const newSyncState = Math.random() < syncProbability
        if (newSyncState !== currentSyncStateRef.current) {
          setIsSync(newSyncState)
          currentSyncStateRef.current = newSyncState
          syncChangeCountdownRef.current = 60 // 1 second at 60fps
        }
      } else if (isBreakdown) {
        // Breakdowns favor individual movement
        const syncProbability = 0.2
        const newSyncState = Math.random() < syncProbability
        if (newSyncState !== currentSyncStateRef.current) {
          setIsSync(newSyncState)
          currentSyncStateRef.current = newSyncState
          syncChangeCountdownRef.current = 60
        }
      } else if (isSongBreak) {
        // Volume changes are good moments to change sync
        let syncProbability = 0.6
        
        // Volume drops favor individual movement (like quiet verses)
        if (isVolumeDropSignificant) {
          syncProbability = 0.3
        }
        // Volume increases favor sync (like choruses)
        else if (isVolumeIncreaseSignificant) {
          syncProbability = 0.8
        }
        
        const newSyncState = Math.random() < syncProbability
        if (newSyncState !== currentSyncStateRef.current) {
          setIsSync(newSyncState)
          currentSyncStateRef.current = newSyncState
          syncChangeCountdownRef.current = 30 // Shorter cooldown for volume changes
        }
      } else if (isTempoChange) {
        // Tempo changes suggest new musical section
        const syncProbability = 0.7 // Favor sync for tempo changes
        const newSyncState = Math.random() < syncProbability
        if (newSyncState !== currentSyncStateRef.current) {
          setIsSync(newSyncState)
          currentSyncStateRef.current = newSyncState
          syncChangeCountdownRef.current = 45 // Medium cooldown
        }
      } else if (isMusicalChange) {
        // General musical changes have balanced probability
        const syncProbability = 0.5
        const newSyncState = Math.random() < syncProbability
        if (newSyncState !== currentSyncStateRef.current) {
          setIsSync(newSyncState)
          currentSyncStateRef.current = newSyncState
          syncChangeCountdownRef.current = 90 // 1.5 seconds
        }
      }
    }

    lastAudioDataRef.current = newAudioData
  }

  useEffect(() => {
    if (analyser && isPlaying) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      const updateAudioData = () => {
        analyser.getByteFrequencyData(dataArray)
        const newAudioData = [...dataArray]
        setAudioData(newAudioData)
        
        // Auto sync control based on music changes
        if (autoSyncControl) {
          autoSyncBasedOnMusic(newAudioData)
        }
        
        animationRef.current = requestAnimationFrame(updateAudioData)
      }
      
      updateAudioData()
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [analyser, isPlaying, autoSyncControl])

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
              <div 
                className="canvas-wrapper"
                onClick={() => setIsCanvasModalOpen(true)}
                title={t('clickToEnlarge')}
              >
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
              </div>
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
                autoSyncControl={autoSyncControl}
                onAutoSyncChange={setAutoSyncControl}
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
        
        {/* Canvas Modal */}
        {isCanvasModalOpen && (
          <div className="canvas-modal" onClick={() => setIsCanvasModalOpen(false)}>
            <div className="canvas-modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="canvas-modal-close"
                onClick={() => setIsCanvasModalOpen(false)}
                title={t('close')}
              >
                ×
              </button>
              <div className="canvas-modal-canvas">
                <StickFigureCanvas 
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
              </div>
            </div>
          </div>
        )}
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
