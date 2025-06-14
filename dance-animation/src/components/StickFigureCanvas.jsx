import { useRef, useEffect } from 'react'

class StickFigure {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.baseY = y
    this.dancePhase = 0
    this.armAngle = 0
    this.legAngle = 0
    this.bounce = 0
    this.headBob = 0
    this.hipSwing = 0
  }

  update(audioData) {
    const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
    const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
    const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
    
    this.bounce = bassFreq * 40
    this.armAngle = Math.sin(this.dancePhase) * midFreq * Math.PI / 2
    this.legAngle = Math.sin(this.dancePhase * 1.5) * bassFreq * Math.PI / 4
    this.headBob = Math.sin(this.dancePhase * 2) * highFreq * 5
    this.hipSwing = Math.sin(this.dancePhase * 0.5) * midFreq * 10
    
    this.dancePhase += 0.1 + bassFreq * 0.3
  }

  draw(ctx) {
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    const headRadius = 25
    const bodyLength = 70
    const armLength = 50
    const legLength = 60
    
    const currentY = this.baseY - this.bounce
    const hipX = this.x + this.hipSwing
    
    ctx.save()
    
    ctx.beginPath()
    ctx.arc(hipX, currentY - bodyLength - headRadius + this.headBob, headRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(hipX - 8, currentY - bodyLength - headRadius + this.headBob - 5, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#333'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(hipX + 8, currentY - bodyLength - headRadius + this.headBob - 5, 3, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(hipX, currentY - bodyLength - headRadius + this.headBob + 10, 8, 0, Math.PI)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(hipX, currentY - bodyLength)
    ctx.lineTo(hipX, currentY)
    ctx.stroke()
    
    const armY = currentY - bodyLength + 15
    ctx.beginPath()
    ctx.moveTo(hipX, armY)
    ctx.lineTo(
      hipX - Math.sin(this.armAngle) * armLength * 0.6,
      armY + Math.cos(this.armAngle) * armLength * 0.6
    )
    ctx.lineTo(
      hipX - Math.sin(this.armAngle) * armLength,
      armY + Math.cos(this.armAngle) * armLength + Math.sin(this.armAngle * 2) * 10
    )
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(hipX, armY)
    ctx.lineTo(
      hipX + Math.sin(-this.armAngle) * armLength * 0.6,
      armY + Math.cos(-this.armAngle) * armLength * 0.6
    )
    ctx.lineTo(
      hipX + Math.sin(-this.armAngle) * armLength,
      armY + Math.cos(-this.armAngle) * armLength + Math.sin(-this.armAngle * 2) * 10
    )
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(hipX, currentY)
    ctx.lineTo(
      hipX - Math.sin(this.legAngle) * legLength * 0.5,
      currentY + Math.cos(this.legAngle) * legLength * 0.5
    )
    ctx.lineTo(
      hipX - Math.sin(this.legAngle) * legLength * 0.7,
      currentY + legLength
    )
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(hipX, currentY)
    ctx.lineTo(
      hipX + Math.sin(-this.legAngle) * legLength * 0.5,
      currentY + Math.cos(-this.legAngle) * legLength * 0.5
    )
    ctx.lineTo(
      hipX + Math.sin(-this.legAngle) * legLength * 0.7,
      currentY + legLength
    )
    ctx.stroke()
    
    ctx.restore()
  }
}

function StickFigureCanvas({ audioData }) {
  const canvasRef = useRef(null)
  const stickFigureRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = 600
    canvas.height = 400
    
    if (!stickFigureRef.current) {
      stickFigureRef.current = new StickFigure(canvas.width / 2, canvas.height * 0.75)
    }
    
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    if (audioData && audioData.length > 0) {
      stickFigureRef.current.update(audioData)
    }
    
    stickFigureRef.current.draw(ctx)
    
  }, [audioData])

  return (
    <canvas 
      ref={canvasRef}
      className="stick-figure-canvas"
    />
  )
}

export default StickFigureCanvas