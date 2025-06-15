import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function FigureControl({ onFigureCountChange, initialCount = 1, autoFigureMode = false, onAutoFigureModeChange }) {
  const { t, language } = useLanguage()
  const [figureCount, setFigureCount] = useState(initialCount)

  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    setFigureCount(newCount)
    onFigureCountChange(newCount)
  }

  const handleAutoFigureModeChange = (e) => {
    const newAutoFigureMode = e.target.checked
    onAutoFigureModeChange(newAutoFigureMode)
  }

  return (
    <div className="control-panel figure-control">
      <h3>{t('figureCount')}</h3>
      <label htmlFor="figure-count-slider">{t('figureCountLabel')}</label>
      <div className="figure-slider-container">
        <span>{language === 'ja' ? '1人' : '1'}</span>
        <input
          id="figure-count-slider"
          type="range"
          min="1"
          max="100"
          step="1"
          value={figureCount}
          onChange={handleCountChange}
          className="figure-slider"
        />
        <span>{language === 'ja' ? '100人' : '100'}</span>
      </div>
      <div className="figure-value">
        {language === 'ja' ? `${figureCount}人でダンス` : `${figureCount} figures dancing`}
      </div>
      
      <label htmlFor="auto-figure-toggle" className="sync-label">
        <input
          id="auto-figure-toggle"
          type="checkbox"
          checked={autoFigureMode}
          onChange={handleAutoFigureModeChange}
          className="sync-checkbox"
          disabled={!onAutoFigureModeChange}
        />
        <span className="sync-slider"></span>
        <span className="sync-text">
          {t('autoFigure')}
        </span>
      </label>
      <div className="sync-description">
        {t('autoFigureDesc')}
      </div>
    </div>
  )
}

export default FigureControl