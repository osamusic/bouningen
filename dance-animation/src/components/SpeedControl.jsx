import { useState } from 'react'

function SpeedControl({ onSpeedChange, initialSpeed = 0.1 }) {
  const [speed, setSpeed] = useState(initialSpeed)

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value)
    setSpeed(newSpeed)
    onSpeedChange(newSpeed)
  }

  return (
    <div className="speed-control">
      <label htmlFor="speed-slider">アニメーション速度:</label>
      <div className="speed-slider-container">
        <span>遅い</span>
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
        <span>速い</span>
      </div>
      <div className="speed-value">
        速度: {speed.toFixed(1)}x
      </div>
    </div>
  )
}

export default SpeedControl