import { useState } from 'react'

function FigureControl({ onFigureCountChange, initialCount = 1 }) {
  const [figureCount, setFigureCount] = useState(initialCount)

  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    setFigureCount(newCount)
    onFigureCountChange(newCount)
  }

  return (
    <div className="figure-control">
      <label htmlFor="figure-count-slider">棒人間の数:</label>
      <div className="figure-slider-container">
        <span>1人</span>
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
        <span>100人</span>
      </div>
      <div className="figure-value">
        {figureCount}人でダンス
      </div>
    </div>
  )
}

export default FigureControl