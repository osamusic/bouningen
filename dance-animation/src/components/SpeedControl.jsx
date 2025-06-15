import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function SpeedControl({ onSpeedChange, initialSpeed = 0.1 }) {
  const { t } = useLanguage()
  const [speed, setSpeed] = useState(initialSpeed)

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value)
    setSpeed(newSpeed)
    onSpeedChange(newSpeed)
  }

  return (
    <div className="control-panel speed-control">
      <h3>{t('speed')}</h3>
      <label htmlFor="speed-slider">{t('speedLabel')}</label>
      <div className="speed-slider-container">
        <span>{t('slow')}</span>
        <input
          id="speed-slider"
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className="speed-slider"
        />
        <span>{t('fast')}</span>
      </div>
      <div className="speed-value">
        {t('speedValue')}: {speed.toFixed(1)}x
      </div>
    </div>
  )
}

export default SpeedControl