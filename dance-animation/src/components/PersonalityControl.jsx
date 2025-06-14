import { useState } from 'react'

function PersonalityControl({ onPersonalityBalanceChange, initialBalance }) {
  const personalities = [
    { id: 'breakdancer', name: 'ブレイカー', icon: '🔥', color: '#ef4444' },
    { id: 'waver', name: 'ウェーバー', icon: '🌊', color: '#3b82f6' },
    { id: 'jumper', name: 'ジャンパー', icon: '⚡', color: '#f59e0b' },
    { id: 'spinner', name: 'スピナー', icon: '🌀', color: '#8b5cf6' },
    { id: 'groover', name: 'グルーバー', icon: '🎵', color: '#10b981' }
  ]

  const [balance, setBalance] = useState(initialBalance || {
    breakdancer: 20,
    waver: 20,
    jumper: 20,
    spinner: 20,
    groover: 20
  })

  const handleSliderChange = (personalityId, value) => {
    const newValue = parseInt(value)
    const oldValue = balance[personalityId]
    const difference = newValue - oldValue
    
    // Calculate total of other personalities
    const otherPersonalities = personalities.filter(p => p.id !== personalityId)
    const otherTotal = otherPersonalities.reduce((sum, p) => sum + balance[p.id], 0)
    
    if (otherTotal === 0 && difference < 0) return // Prevent all zeros
    
    // Distribute the difference among other personalities proportionally
    const newBalance = { ...balance }
    newBalance[personalityId] = newValue
    
    if (difference !== 0 && otherTotal > 0) {
      let remaining = -difference
      
      otherPersonalities.forEach((personality, index) => {
        if (index === otherPersonalities.length - 1) {
          // Last personality gets the remainder
          newBalance[personality.id] = Math.max(0, newBalance[personality.id] + remaining)
        } else {
          const proportion = balance[personality.id] / otherTotal
          const adjustment = Math.round(remaining * proportion)
          newBalance[personality.id] = Math.max(0, balance[personality.id] + adjustment)
          remaining -= adjustment
        }
      })
    }
    
    // Ensure total is 100
    const total = Object.values(newBalance).reduce((sum, val) => sum + val, 0)
    if (total !== 100) {
      const adjustment = (100 - total) / personalities.length
      personalities.forEach(p => {
        newBalance[p.id] = Math.max(0, Math.round(newBalance[p.id] + adjustment))
      })
    }
    
    setBalance(newBalance)
    onPersonalityBalanceChange(newBalance)
  }

  const resetBalance = () => {
    const resetBal = {
      breakdancer: 20,
      waver: 20,
      jumper: 20,
      spinner: 20,
      groover: 20
    }
    setBalance(resetBal)
    onPersonalityBalanceChange(resetBal)
  }

  return (
    <div className="personality-control">
      <div className="personality-header">
        <h3>個性バランス</h3>
        <button onClick={resetBalance} className="reset-btn">リセット</button>
      </div>
      
      <div className="personality-sliders">
        {personalities.map(personality => (
          <div key={personality.id} className="personality-item">
            <div className="personality-info">
              <span className="personality-icon">{personality.icon}</span>
              <span className="personality-name">{personality.name}</span>
              <span className="personality-value">{balance[personality.id]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={balance[personality.id]}
              onChange={(e) => handleSliderChange(personality.id, e.target.value)}
              className="personality-slider"
              style={{
                '--slider-color': personality.color
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="personality-total">
        合計: {Object.values(balance).reduce((sum, val) => sum + val, 0)}%
      </div>
    </div>
  )
}

export default PersonalityControl