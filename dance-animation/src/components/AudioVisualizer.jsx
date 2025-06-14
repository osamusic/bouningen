import { useRef, useEffect } from 'react'

function AudioVisualizer({ audioData }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = 600
    canvas.height = 150
    
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    if (!audioData || audioData.length === 0) return
    
    const barWidth = (canvas.width / audioData.length) * 2.5
    let x = 0
    
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
    gradient.addColorStop(0, '#ff006e')
    gradient.addColorStop(0.5, '#8338ec')
    gradient.addColorStop(1, '#3a86ff')
    
    ctx.fillStyle = gradient
    
    for (let i = 0; i < audioData.length; i++) {
      const barHeight = (audioData[i] / 255) * canvas.height * 0.8
      
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight)
      
      x += barWidth
    }
    
    ctx.globalAlpha = 0.3
    ctx.filter = 'blur(10px)'
    
    x = 0
    for (let i = 0; i < audioData.length; i++) {
      const barHeight = (audioData[i] / 255) * canvas.height * 0.8
      
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight)
      
      x += barWidth
    }
    
    ctx.globalAlpha = 1
    ctx.filter = 'none'
    
  }, [audioData])

  return (
    <canvas 
      ref={canvasRef}
      className="audio-visualizer"
    />
  )
}

export default AudioVisualizer