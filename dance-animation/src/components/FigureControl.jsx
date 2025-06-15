import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function FigureControl({ onFigureCountChange, initialCount = 1 }) {
  const { t, language } = useLanguage()
  const [figureCount, setFigureCount] = useState(initialCount)

  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    setFigureCount(newCount)
    onFigureCountChange(newCount)
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
    </div>
  )
}

export default FigureControl