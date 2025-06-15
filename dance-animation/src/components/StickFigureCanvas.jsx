import { useRef, useEffect, forwardRef } from 'react'

// Formation helper functions
const getFormationType = (figureCount) => {
  if (figureCount <= 3) return 'line'
  if (figureCount <= 6) return 'triangle'
  if (figureCount <= 10) return 'inverted-triangle'
  if (figureCount <= 15) return 'diamond'
  if (figureCount <= 25) return 'circle'
  return 'grid'
}

const getFormationPosition = (index, total, formation, canvas, aspectRatio = '16:9') => {
  const centerX = canvas.width / 2
  const centerY = aspectRatio === '9:16' ? canvas.height * 0.55 : canvas.height * 0.7
  
  switch (formation) {
    case 'line': {
      const spacing = canvas.width / (total + 1)
      return {
        x: spacing * (index + 1),
        y: centerY
      }
    }
      
    case 'triangle':
      return getTrianglePosition(index, total, centerX, centerY, canvas)
      
    case 'inverted-triangle':
      return getInvertedTrianglePosition(index, total, centerX, centerY, canvas)
      
    case 'diamond':
      return getDiamondPosition(index, total, centerX, centerY, canvas)
      
    case 'circle':
      return getCirclePosition(index, total, centerX, centerY, canvas)
      
    case 'grid':
    default:
      return getGridPosition(index, total, canvas, aspectRatio)
  }
}

const getTrianglePosition = (index, total, centerX, centerY, canvas) => {
  // Create triangle formation with more figures at the bottom
  const rows = Math.ceil(Math.sqrt(total * 2))
  let currentIndex = 0
  
  // Adjust centerY for 6-9 people to be even lower
  const adjustedCenterY = total >= 6 && total <= 9 ? centerY + 40 : centerY
  
  for (let row = 0; row < rows; row++) {
    const figuresInRow = Math.min(row + 1, total - currentIndex)
    if (index >= currentIndex && index < currentIndex + figuresInRow) {
      const posInRow = index - currentIndex
      const rowSpacing = (canvas.width * 0.6) / Math.max(1, figuresInRow - 1)
      const startX = centerX - (rowSpacing * (figuresInRow - 1)) / 2
      
      return {
        x: figuresInRow === 1 ? centerX : startX + posInRow * rowSpacing,
        y: adjustedCenterY - (rows - row - 1) * 60 + (canvas.height * 0.05)
      }
    }
    currentIndex += figuresInRow
    if (currentIndex >= total) break
  }
  
  return { x: centerX, y: adjustedCenterY }
}

const getInvertedTrianglePosition = (index, total, centerX, centerY, canvas) => {
  // Create inverted triangle formation with more figures at the top
  const rows = Math.ceil(Math.sqrt(total * 2))
  let currentIndex = 0
  
  // Adjust centerY for 7-9 people to be even lower
  const adjustedCenterY = total >= 7 && total <= 9 ? centerY + 40 : centerY
  
  for (let row = 0; row < rows; row++) {
    const figuresInRow = Math.max(1, Math.min(rows - row, total - currentIndex))
    if (index >= currentIndex && index < currentIndex + figuresInRow) {
      const posInRow = index - currentIndex
      const rowSpacing = (canvas.width * 0.6) / Math.max(1, figuresInRow - 1)
      const startX = centerX - (rowSpacing * (figuresInRow - 1)) / 2
      
      return {
        x: figuresInRow === 1 ? centerX : startX + posInRow * rowSpacing,
        y: adjustedCenterY - (rows - row - 1) * 60 + (canvas.height * 0.05)
      }
    }
    currentIndex += figuresInRow
    if (currentIndex >= total) break
  }
  
  return { x: centerX, y: adjustedCenterY }
}

const getDiamondPosition = (index, total, centerX, centerY, canvas) => {
  // Create diamond formation
  const halfTotal = Math.ceil(total / 2)
  
  if (index < halfTotal) {
    // Top half (triangle)
    return getTrianglePosition(index, halfTotal, centerX, centerY - 40, canvas)
  } else {
    // Bottom half (inverted triangle)
    return getInvertedTrianglePosition(index - halfTotal, total - halfTotal, centerX, centerY + 40, canvas)
  }
}

const getCirclePosition = (index, total, centerX, centerY, canvas) => {
  const angle = (index / total) * Math.PI * 2
  const radius = Math.min(canvas.width, canvas.height) * 0.25
  
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius * 0.6 // Flatten the circle a bit
  }
}

const getGridPosition = (index, total, canvas, aspectRatio) => {
  // Multiple rows for larger groups
  const cols = Math.ceil(Math.sqrt(total * (canvas.width / canvas.height)))
  const rows = Math.ceil(total / cols)
  
  const row = Math.floor(index / cols)
  const col = index % cols
  
  const spacingX = canvas.width / (cols + 1)
  const spacingY = canvas.height / (rows + 1)
  
  const x = spacingX * (col + 1)
  
  let y
  if (aspectRatio === '9:16') {
    // For vertical format, account for drawing offsets
    y = spacingY * (row + 1) + canvas.height * 0.05 // Minimal 5% offset for optimal space usage
  } else {
    // For horizontal format
    y = spacingY * (row + 1) + canvas.height * 0.08 // Original for horizontal
  }
  
  return { x, y }
}

class StickFigure {
  constructor(x, y, p, id = 0) {
    this.x = x
    this.y = y
    this.baseY = y
    this.p = p
    this.id = id
    this.dancePhase = Math.random() * Math.PI * 2
    this.phaseOffset = id * 0.5
    this.speedVariation = 0.8 + Math.random() * 0.4
    this.sizeVariation = 0.9 + Math.random() * 0.2
    this.armAngle = 0
    this.legAngle = 0
    this.bounce = 0
    this.headBob = 0
    this.hipSwing = 0
    this.spinPhase = 0
    this.stretchPhase = 0
    this.swayPhase = 0
    this.rotationMode = false
    this.danceStyle = 'normal'
    this.particles = []
    this.trailPositions = []
    this.colorHue = (id * 60) % 360
    
    // New dance move properties
    this.personality = ['breakdancer', 'waver', 'jumper', 'spinner', 'groover'][id % 5]
    this.moveTimer = 0
    this.currentMove = 'idle'
    this.moveIntensity = 0
    this.jumpPhase = 0
    this.wavePhase = 0
    this.shoulderShrug = 0
    this.handClap = 0
    this.kickPhase = 0
    this.moonwalkPhase = 0
    this.freezeTime = 0
    this.isBreaking = false
    this.robotMode = false
    this.bodyTilt = 0
    this.headNod = 0
    this.leftHandGesture = 'normal'
    this.rightHandGesture = 'normal'
    this.handClappingPhase = 0
    this.pointingDirection = 0
    this.wavingPhase = 0
    this.thumbsUp = false
    this.fistPump = 0
    
    // Walking/Movement properties
    this.walkDirection = Math.random() < 0.5 ? 1 : -1
    this.walkSpeed = 0.5 + Math.random() * 1.5
    this.walkPhase = 0
    this.isWalking = false
    this.walkTimer = 0
    this.boundaryLeft = 50
    this.boundaryRight = 750
    this.originalX = x
    this.stepHeight = 0
    this.stepPhase = 0
  }

  update(audioData, speedMultiplier = 1.0, isSync = false, syncPhase = 0, syncMove = 'idle', showParticles = true) {
    const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
    const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
    const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
    const ultraHighFreq = audioData.slice(100, 150).reduce((a, b) => a + b) / 50 / 255
    
    // Update move timer
    this.moveTimer += speedMultiplier
    this.walkTimer += speedMultiplier
    
    // Walking behavior (when not in sync mode)
    if (!isSync) {
      this.updateWalking(speedMultiplier, bassFreq)
    }
    
    if (isSync) {
      // Synchronized mode - all figures follow the same pattern
      this.dancePhase = syncPhase + this.phaseOffset * 0.1 // Small offset for visual variety
      this.currentMove = syncMove
      this.executeMove(bassFreq, midFreq, highFreq)
    } else {
      // Individual mode - personality-based move selection
      this.selectMove(bassFreq, midFreq, highFreq, ultraHighFreq)
    }
    
    // Dynamic dance style selection based on frequency intensity
    if (bassFreq > 0.7) {
      this.danceStyle = 'energetic'
    } else if (midFreq > 0.6) {
      this.danceStyle = 'groove'
    } else if (highFreq > 0.5) {
      this.danceStyle = 'smooth'
    } else {
      this.danceStyle = 'normal'
    }
    
    // Enhanced movement patterns (adjusted by speed multiplier and individual variation)
    const adjustedPhase = this.dancePhase + (isSync ? 0 : this.phaseOffset)
    const speedVar = isSync ? 1 : this.speedVariation // Use uniform speed in sync mode
    const sizeVar = isSync ? 1 : this.sizeVariation // Use uniform size in sync mode
    
    this.bounce = bassFreq * 45 * (1 + Math.sin(adjustedPhase * 0.2) * 0.3) * sizeVar
    this.armAngle = Math.sin(adjustedPhase * 0.8 * speedMultiplier * speedVar) * midFreq * Math.PI / 1.2
    this.legAngle = Math.sin(adjustedPhase * 1.2 * speedMultiplier * speedVar) * bassFreq * Math.PI / 2.5
    this.headBob = Math.sin(adjustedPhase * 2 * speedMultiplier * speedVar) * highFreq * 6
    this.hipSwing = Math.sin(adjustedPhase * 0.5 * speedMultiplier * speedVar) * midFreq * 12
    
    // New movement variations (adjusted by speed multiplier and individual variation)
    this.spinPhase += ultraHighFreq * 0.3 * speedMultiplier * speedVar
    this.stretchPhase = Math.sin(adjustedPhase * 0.3 * speedMultiplier * speedVar) * bassFreq
    this.swayPhase = Math.cos(adjustedPhase * 0.4 * speedMultiplier * speedVar) * midFreq * 15
    this.rotationMode = ultraHighFreq > 0.4
    
    // Trail effect
    this.trailPositions.push({
      x: this.x + this.hipSwing,
      y: this.baseY - this.bounce,
      alpha: 255
    })
    if (this.trailPositions.length > 15) {
      this.trailPositions.shift()
    }
    
    // Update trail alpha
    this.trailPositions.forEach((pos, i) => {
      pos.alpha = (i / this.trailPositions.length) * 100
    })
    
    // Particle effects for high energy (only if enabled)
    if (showParticles && bassFreq > 0.6 && Math.random() < 0.3) {
      this.particles.push({
        x: this.x + this.hipSwing + this.p.random(-20, 20),
        y: this.baseY - this.bounce + this.p.random(-30, 30),
        vx: this.p.random(-3, 3),
        vy: this.p.random(-5, -1),
        life: 255,
        size: this.p.random(2, 6)
      })
    }
    
    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.1
      particle.life -= 5
      return particle.life > 0
    })
    
    if (!isSync) {
      this.dancePhase += (0.02 + bassFreq * 0.05 + midFreq * 0.025) * speedMultiplier * this.speedVariation
    }
    
    // Update hand gestures based on audio and move
    this.updateHandGestures(bassFreq, midFreq, highFreq, ultraHighFreq)
  }

  selectMove(bassFreq, midFreq, highFreq, ultraHighFreq) {
    const totalEnergy = bassFreq + midFreq + highFreq + ultraHighFreq
    
    // Move transition logic based on personality
    switch (this.personality) {
      case 'breakdancer':
        if (bassFreq > 0.6 && Math.random() < 0.1) {
          this.currentMove = 'breaking'
          this.isBreaking = true
          this.freezeTime = 0
        } else if (this.moveTimer > 3 && totalEnergy > 0.4) {
          this.currentMove = ['windmill', 'freeze', 'toprock'][Math.floor(Math.random() * 3)]
          this.moveTimer = 0
        }
        break
        
      case 'waver':
        if (midFreq > 0.5) {
          this.currentMove = 'wave'
          this.robotMode = Math.random() < 0.3
        } else if (this.moveTimer > 2) {
          this.currentMove = ['bodywave', 'armwave', 'robot'][Math.floor(Math.random() * 3)]
          this.moveTimer = 0
        }
        break
        
      case 'jumper':
        if (bassFreq > 0.5 && Math.random() < 0.2) {
          this.currentMove = 'jump'
        } else if (highFreq > 0.4) {
          this.currentMove = 'bounce'
        } else if (this.moveTimer > 2.5) {
          this.currentMove = ['hop', 'skip', 'leap'][Math.floor(Math.random() * 3)]
          this.moveTimer = 0
        }
        break
        
      case 'spinner':
        if (ultraHighFreq > 0.3) {
          this.currentMove = 'spin'
          this.rotationMode = true
        } else if (this.moveTimer > 3) {
          this.currentMove = ['twirl', 'pirouette', 'turn'][Math.floor(Math.random() * 3)]
          this.moveTimer = 0
        }
        break
        
      case 'groover':
        if (midFreq > 0.4) {
          this.currentMove = 'groove'
        } else if (this.moveTimer > 1.5) {
          this.currentMove = ['sway', 'shimmy', 'moonwalk', 'slide', 'walk'][Math.floor(Math.random() * 5)]
          this.moveTimer = 0
        }
        break
    }
    
    // Execute current move
    this.executeMove(bassFreq, midFreq, highFreq, ultraHighFreq)
  }

  executeMove(bassFreq, midFreq, highFreq) {
    const intensity = (bassFreq + midFreq + highFreq) / 3
    this.moveIntensity = intensity
    
    switch (this.currentMove) {
      case 'breaking':
        this.executeBreaking(intensity)
        break
      case 'wave':
        this.executeWave(intensity)
        break
      case 'jump':
        this.executeJump(intensity)
        break
      case 'spin':
        this.executeSpin(intensity)
        break
      case 'groove':
        this.executeGroove(intensity)
        break
      case 'moonwalk':
        this.executeMoonwalk(intensity)
        break
      case 'robot':
        this.executeRobot(intensity)
        break
      case 'windmill':
        this.executeWindmill(intensity)
        break
      case 'bounce':
        this.executeBounce(intensity)
        break
      case 'sway':
        this.executeSway(intensity)
        break
      case 'walk':
        this.executeWalk(intensity)
        break
      default:
        this.executeIdle(intensity)
    }
  }

  executeBreaking(intensity) {
    this.freezeTime += 0.1
    if (this.freezeTime < 2) {
      this.bodyTilt = Math.sin(this.freezeTime * 10) * intensity * Math.PI / 3
      this.armAngle = Math.cos(this.freezeTime * 8) * Math.PI / 1.5
      this.legAngle = Math.sin(this.freezeTime * 6) * Math.PI / 3
    } else {
      this.isBreaking = false
      this.currentMove = 'idle'
    }
  }

  executeWave(intensity) {
    this.wavePhase += 0.3 * intensity
    this.shoulderShrug = Math.sin(this.wavePhase) * intensity * 20
    this.armAngle = Math.sin(this.wavePhase - Math.PI/4) * intensity * Math.PI / 2.2
    this.bodyTilt = Math.sin(this.wavePhase - Math.PI/2) * intensity * 0.2
  }

  executeJump(intensity) {
    this.jumpPhase += 0.5 * intensity
    this.bounce += Math.sin(this.jumpPhase) * intensity * 80
    this.legAngle = Math.cos(this.jumpPhase) * intensity * Math.PI / 1.8
  }

  executeSpin(intensity) {
    this.spinPhase += intensity * 0.8
    this.rotationMode = true
    this.armAngle = Math.PI / 2.5 * intensity
  }

  executeGroove(intensity) {
    this.hipSwing += Math.sin(this.dancePhase * 2) * intensity * 5
    this.shoulderShrug = Math.cos(this.dancePhase * 1.5) * intensity * 10
    this.headNod = Math.sin(this.dancePhase * 3) * intensity * 8
  }

  executeMoonwalk(intensity) {
    this.moonwalkPhase += 0.2 * intensity
    this.x += Math.sin(this.moonwalkPhase) * intensity * 2
    this.legAngle = Math.cos(this.moonwalkPhase) * intensity * Math.PI / 4
    this.bodyTilt = -intensity * 0.1
  }

  executeRobot(intensity) {
    this.robotMode = true
    const robotTick = Math.floor(this.dancePhase * 4) * 0.5
    this.armAngle = Math.sin(robotTick) * Math.PI / 2.3
    this.headBob = Math.cos(robotTick) * intensity * 5
  }

  executeWindmill(intensity) {
    this.spinPhase += intensity * 1.2
    this.armAngle = this.spinPhase
    this.legAngle = Math.sin(this.spinPhase) * Math.PI / 2.2
    this.bodyTilt = Math.cos(this.spinPhase) * intensity * 0.3
  }

  executeBounce(intensity) {
    this.bounce += Math.abs(Math.sin(this.dancePhase * 4)) * intensity * 30
    this.headBob = Math.sin(this.dancePhase * 4) * intensity * 10
  }

  executeSway(intensity) {
    this.swayPhase += Math.sin(this.dancePhase * 0.8) * intensity * 8
    this.bodyTilt = Math.sin(this.dancePhase * 0.6) * intensity * 0.15
  }

  executeIdle(intensity) {
    // Basic idle movements
    this.headNod = Math.sin(this.dancePhase) * intensity * 3
  }

  executeWalk(intensity) {
    this.isWalking = true
    this.walkPhase += 0.2 * intensity
    this.stepPhase += 0.3 * intensity
    
    // Walking arm swing
    this.armAngle = Math.sin(this.walkPhase) * intensity * Math.PI / 4
    
    // Walking leg movement
    this.legAngle = Math.sin(this.walkPhase + Math.PI) * intensity * Math.PI / 4
    
    // Step height for walking animation
    this.stepHeight = Math.abs(Math.sin(this.stepPhase)) * intensity * 10
    
    // Slight body lean while walking
    this.bodyTilt = Math.sin(this.walkPhase) * intensity * 0.1
  }

  updateWalking(speedMultiplier, bassFreq) {
    // Random walking behavior
    if (this.walkTimer > 3 + Math.random() * 4) {
      // Decide whether to start/stop walking
      if (!this.isWalking && Math.random() < 0.3) {
        this.isWalking = true
        this.walkDirection = Math.random() < 0.5 ? 1 : -1
      } else if (this.isWalking && Math.random() < 0.2) {
        this.isWalking = false
      }
      this.walkTimer = 0
    }
    
    // Walking movement
    if (this.isWalking) {
      const walkSpeed = this.walkSpeed * speedMultiplier * (1 + bassFreq * 0.5)
      this.x += this.walkDirection * walkSpeed
      
      // Bounce when hitting boundaries
      if (this.x <= this.boundaryLeft || this.x >= this.boundaryRight) {
        this.walkDirection *= -1
        this.x = Math.max(this.boundaryLeft, Math.min(this.boundaryRight, this.x))
      }
      
      // Update walking animation
      this.walkPhase += 0.15 * speedMultiplier
      this.stepPhase += 0.2 * speedMultiplier
      this.stepHeight = Math.abs(Math.sin(this.stepPhase)) * 8
    } else {
      // Gradually return to original position when not walking
      const returnSpeed = 0.5 * speedMultiplier
      if (this.x > this.originalX + 5) {
        this.x -= returnSpeed
      } else if (this.x < this.originalX - 5) {
        this.x += returnSpeed
      }
      this.stepHeight = 0
    }
  }

  updateHandGestures(bassFreq, midFreq, highFreq, ultraHighFreq) {
    const totalEnergy = bassFreq + midFreq + highFreq + ultraHighFreq
    
    // Reset gestures
    this.leftHandGesture = 'normal'
    this.rightHandGesture = 'normal'
    this.thumbsUp = false
    
    // Hand clapping for strong beats
    if (bassFreq > 0.6 && Math.random() < 0.3) {
      this.handClappingPhase += 0.5
      if (Math.sin(this.handClappingPhase) > 0.5) {
        this.leftHandGesture = 'clap'
        this.rightHandGesture = 'clap'
      }
    }
    
    // Pointing gestures for mid frequencies
    if (midFreq > 0.5 && Math.random() < 0.2) {
      this.pointingDirection = Math.random() * Math.PI * 2
      if (Math.random() < 0.5) {
        this.leftHandGesture = 'point'
      } else {
        this.rightHandGesture = 'point'
      }
    }
    
    // Waving for high frequencies
    if (highFreq > 0.4) {
      this.wavingPhase += 0.3
      if (Math.sin(this.wavingPhase) > 0.3) {
        this.rightHandGesture = 'wave'
      }
    }
    
    // Fist pump for very energetic moments
    if (totalEnergy > 1.5 && Math.random() < 0.1) {
      this.fistPump = 1
      this.leftHandGesture = 'fist'
      this.rightHandGesture = 'fist'
    } else {
      this.fistPump = Math.max(0, this.fistPump - 0.1)
    }
    
    // Thumbs up for groovy moments
    if (this.currentMove === 'groove' && Math.random() < 0.1) {
      this.thumbsUp = true
      if (Math.random() < 0.5) {
        this.leftHandGesture = 'thumbsUp'
      } else {
        this.rightHandGesture = 'thumbsUp'
      }
    }
    
    // Peace sign for smooth moves
    if (this.currentMove === 'wave' && Math.random() < 0.15) {
      this.rightHandGesture = 'peace'
    }
    
    // Rock horns for energetic moves
    if ((this.currentMove === 'breaking' || this.currentMove === 'jump') && Math.random() < 0.1) {
      this.leftHandGesture = 'rock'
      this.rightHandGesture = 'rock'
    }
    
    // Personality-specific hand gestures
    switch (this.personality) {
      case 'breakdancer':
        if (Math.random() < 0.1) {
          this.leftHandGesture = 'fist'
        }
        break
      case 'waver':
        if (Math.random() < 0.15) {
          this.rightHandGesture = 'wave'
        }
        break
      case 'groover':
        if (Math.random() < 0.1) {
          this.leftHandGesture = 'snap'
          this.rightHandGesture = 'snap'
        }
        break
      case 'spinner':
        if (Math.random() < 0.08) {
          this.rightHandGesture = 'point'
        }
        break
    }
  }

  draw(ctx, showParticles = true) {
    // Draw trail effect
    this.trailPositions.forEach((pos) => {
      ctx.save()
      ctx.globalAlpha = pos.alpha / 255
      ctx.fillStyle = `hsl(${this.colorHue}, 70%, 60%)`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - 50, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    
    // Draw particles (only if enabled)
    if (showParticles) {
      this.particles.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.life / 255
        ctx.fillStyle = `hsl(${this.colorHue}, 80%, 70%)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }
    
    ctx.save()
    
    // Apply rotation if in rotation mode
    if (this.rotationMode) {
      ctx.translate(this.x + this.hipSwing, this.baseY - this.bounce - 50)
      ctx.rotate(this.spinPhase)
      ctx.translate(-(this.x + this.hipSwing), -(this.baseY - this.bounce - 50))
    }
    
    // Apply body tilt for more dynamic poses
    if (this.bodyTilt !== 0) {
      ctx.translate(this.x + this.hipSwing, this.baseY - this.bounce - 50)
      ctx.rotate(this.bodyTilt)
      ctx.translate(-(this.x + this.hipSwing), -(this.baseY - this.bounce - 50))
    }
    
    // Dynamic styling based on dance style and individual color
    let strokeColor = '#333'
    let headColor = '#fff'
    let lineWidth = 4 * this.sizeVariation
    
    switch (this.danceStyle) {
      case 'energetic':
        strokeColor = `hsl(${this.colorHue}, 80%, 40%)`
        headColor = `hsl(${this.colorHue}, 60%, 90%)`
        lineWidth = 6 * this.sizeVariation
        break
      case 'groove':
        strokeColor = `hsl(${this.colorHue}, 60%, 50%)`
        headColor = `hsl(${this.colorHue}, 40%, 85%)`
        lineWidth = 5 * this.sizeVariation
        break
      case 'smooth':
        strokeColor = `hsl(${this.colorHue}, 40%, 60%)`
        headColor = `hsl(${this.colorHue}, 30%, 95%)`
        lineWidth = 3 * this.sizeVariation
        break
      default:
        strokeColor = `hsl(${this.colorHue}, 50%, 40%)`
        headColor = `hsl(${this.colorHue}, 30%, 90%)`
    }
    
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    const headRadius = Math.max(5, (25 + this.stretchPhase * 5) * this.sizeVariation)
    const bodyLength = Math.max(10, (70 + this.stretchPhase * 10) * this.sizeVariation)
    const armLength = Math.max(10, (50 + this.stretchPhase * 8) * this.sizeVariation)
    const legLength = Math.max(10, (60 + this.stretchPhase * 12) * this.sizeVariation)
    
    const currentY = this.baseY - this.bounce
    const hipX = this.x + this.hipSwing + this.swayPhase
    
    // Head with enhanced expressions and head nod
    const headY = currentY - bodyLength - headRadius + this.headBob + this.headNod
    ctx.beginPath()
    ctx.arc(hipX, headY, headRadius, 0, Math.PI * 2)
    ctx.fillStyle = headColor
    ctx.fill()
    ctx.stroke()
    
    // Dynamic eyes based on dance style, move, and personality
    let eyeSize = this.danceStyle === 'energetic' ? 5 : 3
    if (this.robotMode) eyeSize = 2 // Robot eyes are smaller and square-like
    const eyeY = headY - 5
    
    // Personality-based eye expressions (always applied regardless of sync mode)
    if (this.robotMode || this.personality === 'spinner') {
      // Square robot eyes for robots and spinners
      ctx.fillStyle = strokeColor
      ctx.fillRect(hipX - 10, eyeY - 2, 4, 4)
      ctx.fillRect(hipX + 6, eyeY - 2, 4, 4)
    } else if (this.personality === 'breakdancer') {
      // Intense focused eyes
      ctx.beginPath()
      ctx.arc(hipX - 8, eyeY, eyeSize + 1, 0, Math.PI * 2)
      ctx.fillStyle = strokeColor
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(hipX + 8, eyeY, eyeSize + 1, 0, Math.PI * 2)
      ctx.fill()
      
      // Add eyebrows for intensity
      ctx.beginPath()
      ctx.moveTo(hipX - 12, eyeY - 8)
      ctx.lineTo(hipX - 4, eyeY - 6)
      ctx.moveTo(hipX + 4, eyeY - 6)
      ctx.lineTo(hipX + 12, eyeY - 8)
      ctx.stroke()
    } else if (this.personality === 'waver') {
      // Relaxed half-closed eyes
      ctx.beginPath()
      ctx.arc(hipX - 8, eyeY, eyeSize, 0, Math.PI)
      ctx.fillStyle = strokeColor
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(hipX + 8, eyeY, eyeSize, 0, Math.PI)
      ctx.fill()
    } else if (this.personality === 'jumper') {
      // Wide excited eyes
      ctx.beginPath()
      ctx.arc(hipX - 8, eyeY, eyeSize + 2, 0, Math.PI * 2)
      ctx.fillStyle = strokeColor
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(hipX + 8, eyeY, eyeSize + 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Add sparkle effect
      if (Math.random() < 0.3) {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(hipX - 6, eyeY - 2, 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(hipX + 10, eyeY - 2, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      // Default groover eyes - normal round eyes
      ctx.beginPath()
      ctx.arc(hipX - 8, eyeY, eyeSize, 0, Math.PI * 2)
      ctx.fillStyle = strokeColor
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(hipX + 8, eyeY, eyeSize, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Dynamic mouth expressions based on personality and current state
    ctx.beginPath()
    const mouthY = headY + 10
    let mouthWidth = this.danceStyle === 'energetic' ? 12 : 8
    
    // Personality-based mouth expressions (always applied regardless of sync mode)
    if (this.robotMode || this.personality === 'spinner') {
      // Robot mouth line
      ctx.moveTo(hipX - 6, mouthY)
      ctx.lineTo(hipX + 6, mouthY)
    } else if (this.personality === 'breakdancer') {
      if (this.currentMove === 'breaking' || this.currentMove === 'jump') {
        // Open mouth for intense moves
        ctx.arc(hipX, mouthY, mouthWidth, 0, Math.PI)
      } else {
        // Determined expression
        ctx.moveTo(hipX - 8, mouthY)
        ctx.lineTo(hipX + 8, mouthY)
      }
    } else if (this.personality === 'waver') {
      // Gentle smile
      ctx.arc(hipX, mouthY - 2, mouthWidth * 0.5, 0, Math.PI)
    } else if (this.personality === 'jumper') {
      // Big happy smile
      ctx.arc(hipX, mouthY, mouthWidth * 0.9, 0, Math.PI)
    } else if (this.personality === 'groover') {
      // Cool smirk
      ctx.moveTo(hipX - 4, mouthY)
      ctx.quadraticCurveTo(hipX + 2, mouthY + 3, hipX + 8, mouthY)
    } else {
      // Default smile
      ctx.arc(hipX, mouthY, mouthWidth * 0.7, 0, Math.PI)
    }
    ctx.stroke()
    
    // Body with twist
    ctx.beginPath()
    const bodyTwist = Math.sin(this.dancePhase * 0.6) * 0.15
    ctx.moveTo(hipX + bodyTwist * 8, currentY - bodyLength)
    ctx.lineTo(hipX - bodyTwist * 8, currentY)
    ctx.stroke()
    
    // Enhanced arms with secondary motion and shoulder effects
    const armY = currentY - bodyLength + 15 + this.shoulderShrug
    const secondaryArmMotion = Math.sin(this.dancePhase * 1.5) * 0.2
    
    // Left arm with personality-based variations
    ctx.beginPath()
    ctx.moveTo(hipX, armY)
    let leftArmAngle = this.armAngle + secondaryArmMotion
    
    // Modify arm position based on current move
    if (this.currentMove === 'wave') {
      leftArmAngle = Math.sin(this.wavePhase) * Math.PI / 1.8
    } else if (this.currentMove === 'breaking') {
      leftArmAngle = Math.cos(this.freezeTime * 5) * Math.PI / 1.5
    } else if (this.robotMode) {
      leftArmAngle = Math.floor(leftArmAngle * 2) / 2 // Quantized robot movement
    }
    
    ctx.lineTo(
      hipX - Math.sin(leftArmAngle) * armLength * 0.6,
      armY + Math.cos(leftArmAngle) * armLength * 0.6
    )
    const leftElbowX = hipX - Math.sin(leftArmAngle) * armLength * 0.6
    const leftElbowY = armY + Math.cos(leftArmAngle) * armLength * 0.6
    const leftHandX = hipX - Math.sin(leftArmAngle) * armLength
    const leftHandY = armY + Math.cos(leftArmAngle) * armLength + Math.sin(leftArmAngle * 3) * 15
    
    ctx.lineTo(leftElbowX, leftElbowY)
    ctx.lineTo(leftHandX, leftHandY)
    ctx.stroke()
    
    // Draw left hand gesture
    this.drawHandGesture(ctx, leftHandX, leftHandY, this.leftHandGesture)
    
    // Right arm with personality-based variations
    ctx.beginPath()
    ctx.moveTo(hipX, armY)
    let rightArmAngle = -this.armAngle - secondaryArmMotion
    
    // Modify arm position based on current move
    if (this.currentMove === 'wave') {
      rightArmAngle = Math.sin(this.wavePhase - Math.PI/2) * Math.PI / 1.8
    } else if (this.currentMove === 'breaking') {
      rightArmAngle = Math.sin(this.freezeTime * 4) * Math.PI / 1.5
    } else if (this.robotMode) {
      rightArmAngle = Math.floor(rightArmAngle * 2) / 2 // Quantized robot movement
    }
    
    const rightElbowX = hipX + Math.sin(-rightArmAngle) * armLength * 0.6
    const rightElbowY = armY + Math.cos(-rightArmAngle) * armLength * 0.6
    const rightHandX = hipX + Math.sin(-rightArmAngle) * armLength
    const rightHandY = armY + Math.cos(-rightArmAngle) * armLength + Math.sin(-rightArmAngle * 3) * 15
    
    ctx.lineTo(rightElbowX, rightElbowY)
    ctx.lineTo(rightHandX, rightHandY)
    ctx.stroke()
    
    // Draw right hand gesture
    this.drawHandGesture(ctx, rightHandX, rightHandY, this.rightHandGesture)
    
    // Enhanced legs with knee bending
    const kneeFlexion = Math.sin(this.dancePhase * 1.8) * 0.5
    
    // Left leg with walking step height
    ctx.beginPath()
    ctx.moveTo(hipX, currentY)
    const leftLegAngle = this.legAngle + kneeFlexion
    const leftKneeX = hipX - Math.sin(leftLegAngle) * legLength * 0.5
    const leftKneeY = currentY + Math.cos(leftLegAngle) * legLength * 0.5
    ctx.lineTo(leftKneeX, leftKneeY)
    
    // Add step height for walking animation
    const leftFootY = leftKneeY + legLength * 0.5 - (this.isWalking && Math.sin(this.stepPhase) > 0 ? this.stepHeight : 0)
    ctx.lineTo(
      leftKneeX - Math.sin(leftLegAngle + kneeFlexion) * legLength * 0.5,
      leftFootY
    )
    ctx.stroke()
    
    // Right leg with walking step height
    ctx.beginPath()
    ctx.moveTo(hipX, currentY)
    const rightLegAngle = -this.legAngle - kneeFlexion
    const rightKneeX = hipX + Math.sin(-rightLegAngle) * legLength * 0.5
    const rightKneeY = currentY + Math.cos(-rightLegAngle) * legLength * 0.5
    ctx.lineTo(rightKneeX, rightKneeY)
    
    // Add step height for walking animation (opposite phase)
    const rightFootY = rightKneeY + legLength * 0.5 - (this.isWalking && Math.sin(this.stepPhase + Math.PI) > 0 ? this.stepHeight : 0)
    ctx.lineTo(
      rightKneeX + Math.sin(-rightLegAngle - kneeFlexion) * legLength * 0.5,
      rightFootY
    )
    ctx.stroke()
    
    ctx.restore()
  }

  drawHandGesture(ctx, handX, handY, gesture) {
    ctx.save()
    ctx.lineWidth = 2
    
    const gestureSize = Math.max(2, 8 * this.sizeVariation)
    
    switch (gesture) {
      case 'clap':
        // Draw hands coming together
        ctx.beginPath()
        ctx.arc(handX - 3, handY, gestureSize * 0.6, 0, Math.PI * 2)
        ctx.arc(handX + 3, handY, gestureSize * 0.6, 0, Math.PI * 2)
        ctx.stroke()
        break
        
      case 'point': {
        // Draw pointing finger
        ctx.beginPath()
        ctx.moveTo(handX, handY)
        const pointX = handX + Math.cos(this.pointingDirection) * gestureSize
        const pointY = handY + Math.sin(this.pointingDirection) * gestureSize
        ctx.lineTo(pointX, pointY)
        ctx.stroke()
        // Draw small circle for fingertip
        ctx.beginPath()
        ctx.arc(pointX, pointY, 2, 0, Math.PI * 2)
        ctx.fill()
        break
      }
        
      case 'wave': {
        // Draw waving motion
        const waveOffset = Math.sin(this.wavingPhase) * gestureSize * 0.5
        ctx.beginPath()
        ctx.moveTo(handX - gestureSize, handY + waveOffset)
        ctx.quadraticCurveTo(handX, handY - waveOffset, handX + gestureSize, handY + waveOffset)
        ctx.stroke()
        break
      }
        
      case 'fist':
        // Draw closed fist
        ctx.beginPath()
        ctx.arc(handX, handY, gestureSize * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = ctx.strokeStyle
        ctx.fill()
        ctx.stroke()
        break
        
      case 'thumbsUp':
        // Draw thumbs up
        ctx.beginPath()
        ctx.arc(handX, handY, gestureSize * 0.6, 0, Math.PI * 2)
        ctx.stroke()
        // Thumb
        ctx.beginPath()
        ctx.moveTo(handX, handY - gestureSize * 0.6)
        ctx.lineTo(handX, handY - gestureSize * 1.2)
        ctx.stroke()
        break
        
      case 'peace':
        // Draw peace sign (V)
        ctx.beginPath()
        ctx.moveTo(handX - gestureSize * 0.3, handY - gestureSize)
        ctx.lineTo(handX, handY)
        ctx.lineTo(handX + gestureSize * 0.3, handY - gestureSize)
        ctx.stroke()
        break
        
      case 'rock':
        // Draw rock horns
        ctx.beginPath()
        // Pinky
        ctx.moveTo(handX - gestureSize * 0.6, handY)
        ctx.lineTo(handX - gestureSize * 0.8, handY - gestureSize * 0.8)
        // Index finger
        ctx.moveTo(handX + gestureSize * 0.6, handY)
        ctx.lineTo(handX + gestureSize * 0.8, handY - gestureSize * 0.8)
        ctx.stroke()
        break
        
      case 'snap':
        // Draw snapping fingers
        ctx.beginPath()
        ctx.arc(handX, handY, gestureSize * 0.4, 0, Math.PI * 2)
        ctx.stroke()
        // Small sparks for snap effect
        if (Math.random() < 0.3) {
          const sparkles = 3
          for (let i = 0; i < sparkles; i++) {
            const angle = (i / sparkles) * Math.PI * 2
            const sparkX = handX + Math.cos(angle) * gestureSize
            const sparkY = handY + Math.sin(angle) * gestureSize
            ctx.beginPath()
            ctx.arc(sparkX, sparkY, 1, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break
        
      case 'normal':
      default:
        // Draw simple hand
        ctx.beginPath()
        ctx.arc(handX, handY, gestureSize * 0.4, 0, Math.PI * 2)
        ctx.stroke()
        break
    }
    
    ctx.restore()
  }
}

const StickFigureCanvas = forwardRef(({ audioData, animationSpeed = 1.0, figureCount = 1, isSync = false, personalityBalance, isDarkMode = false, backgroundPattern = 'default', aspectRatio = '16:9', showParticles = true }, ref) => {
  const canvasRef = useRef(null)
  const stickFiguresRef = useRef([])
  const p5InstanceRef = useRef(null)
  const syncPhaseRef = useRef(0)
  const syncMoveRef = useRef('idle')
  const syncMoveTimerRef = useRef(0)
  const autoSyncTimerRef = useRef(0)
  const autoSyncStateRef = useRef(false)
  const autoSyncDurationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    // Dynamic canvas size based on figure count and aspect ratio
    if (aspectRatio === '9:16') {
      // Vertical aspect ratio (9:16)
      if (figureCount <= 8) {
        canvas.width = 450
        canvas.height = 800
      } else if (figureCount <= 20) {
        canvas.width = 562
        canvas.height = 1000
      } else if (figureCount <= 50) {
        canvas.width = 675
        canvas.height = 1200
      } else {
        canvas.width = 720
        canvas.height = 1280
      }
    } else {
      // Horizontal aspect ratio (16:9)
      if (figureCount <= 8) {
        canvas.width = 800
        canvas.height = 400
      } else if (figureCount <= 20) {
        canvas.width = 1200
        canvas.height = 500
      } else if (figureCount <= 50) {
        canvas.width = 1600
        canvas.height = 600
      } else {
        canvas.width = 2000
        canvas.height = 800
      }
    }
    
    // Create a mock p5 instance for helper functions
    if (!p5InstanceRef.current) {
      p5InstanceRef.current = {
        random: (min, max) => {
          if (typeof min === 'undefined') return Math.random()
          if (typeof max === 'undefined') return Math.random() * min
          return Math.random() * (max - min) + min
        }
      }
    }
    
    // Create or update stick figures based on figureCount and personality balance
    const needsRecreation = stickFiguresRef.current.length !== figureCount || 
                            !stickFiguresRef.current[0] || 
                            (stickFiguresRef.current[0] && stickFiguresRef.current[0].aspectRatio !== aspectRatio)
    if (needsRecreation) {
      stickFiguresRef.current = []
      
      // Generate personality distribution based on balance
      const personalities = ['breakdancer', 'waver', 'jumper', 'spinner', 'groover']
      const distribution = []
      
      if (personalityBalance) {
        // Create weighted distribution
        personalities.forEach(personality => {
          const weight = personalityBalance[personality] || 20
          for (let i = 0; i < weight; i++) {
            distribution.push(personality)
          }
        })
      } else {
        // Default equal distribution
        personalities.forEach(personality => {
          for (let i = 0; i < 20; i++) {
            distribution.push(personality)
          }
        })
      }
      
      for (let i = 0; i < figureCount; i++) {
        let x, y
        
        // Determine formation type based on figure count
        const formation = getFormationType(figureCount)
        const position = getFormationPosition(i, figureCount, formation, canvas, aspectRatio)
        
        x = position.x
        y = position.y
        
        // Select personality based on distribution
        const personalityIndex = Math.floor(Math.random() * distribution.length)
        const selectedPersonality = distribution[personalityIndex]
        
        const figure = new StickFigure(x, y, p5InstanceRef.current, i)
        figure.personality = selectedPersonality
        figure.aspectRatio = aspectRatio // Store aspect ratio for change detection
        
        // Set walking boundaries based on canvas size
        figure.boundaryLeft = 50
        figure.boundaryRight = canvas.width - 50
        
        // Scale figure size for large groups
        if (figureCount > 20) {
          figure.sizeVariation *= 0.7
        }
        if (figureCount > 50) {
          figure.sizeVariation *= 0.6
        }
        
        stickFiguresRef.current.push(figure)
      }
    }
    
    // Dynamic background based on audio energy, mode, and pattern
    const renderBackground = () => {
      const bassFreq = audioData && audioData.length > 0 ? audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255 : 0
      const midFreq = audioData && audioData.length > 0 ? audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255 : 0
      const highFreq = audioData && audioData.length > 0 ? audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255 : 0
      const totalEnergy = (bassFreq + midFreq + highFreq) / 3
      
      const time = Date.now() * 0.001
      
      switch (backgroundPattern) {
        case 'cosmic':
          renderCosmicBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles)
          break
        case 'dreamlike':
          renderDreamlikeBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles)
          break
        case 'geometric':
          renderGeometricBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode)
          break
        case 'waves':
          renderWavesBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles)
          break
        case 'clouds':
          renderCloudsBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode)
          break
        case 'neon':
          renderNeonBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time)
          break
        case 'matrix':
          renderMatrixBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time)
          break
        case 'rainbow':
          renderRainbowBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles)
          break
        case 'fire':
          renderFireBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, showParticles)
          break
        default:
          renderDefaultBackground(ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode)
      }
    }
    
    const renderDefaultBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode) => {
      let bgColor = isDarkMode ? '#1a1a1a' : '#f0f0f0'
      
      if (audioData && audioData.length > 0) {
        // Color changes based on frequency bands
        let hue = 200 // Default blue
        let saturation = isDarkMode ? 40 : 20
        let lightness = isDarkMode ? 15 : 95
        
        if (bassFreq > 0.5) {
          hue = (bassFreq * 60) % 360 // Red to yellow range for bass
          saturation = Math.min(isDarkMode ? 80 : 60, bassFreq * 100)
          if (isDarkMode) {
            lightness = Math.min(35, 15 + bassFreq * 25)
          } else {
            lightness = Math.max(85, 95 - bassFreq * 20)
          }
        } else if (midFreq > 0.4) {
          hue = (120 + midFreq * 120) % 360 // Green to blue range for mids
          saturation = Math.min(isDarkMode ? 70 : 50, midFreq * 80)
          if (isDarkMode) {
            lightness = Math.min(30, 15 + midFreq * 20)
          } else {
            lightness = Math.max(88, 95 - midFreq * 15)
          }
        } else if (highFreq > 0.3) {
          hue = (240 + highFreq * 120) % 360 // Blue to purple range for highs
          saturation = Math.min(isDarkMode ? 60 : 40, highFreq * 60)
          if (isDarkMode) {
            lightness = Math.min(25, 15 + highFreq * 15)
          } else {
            lightness = Math.max(90, 95 - highFreq * 10)
          }
        }
        
        // Pulse effect for high energy
        if (totalEnergy > 0.6) {
          const pulse = Math.sin(time * 10) * 0.1
          if (isDarkMode) {
            lightness += pulse * 15
            saturation += pulse * 30
          } else {
            lightness += pulse * 10
            saturation += pulse * 20
          }
        }
        
        bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      }
      
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    const renderCosmicBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles = true) => {
      // Deep space base
      const baseHue = 240 + time * 5
      const baseBg = isDarkMode ? '#0a0a1a' : '#1a1a2e'
      ctx.fillStyle = baseBg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Nebula clouds
      if (totalEnergy > 0.2) {
        const nebulaeCount = Math.floor(totalEnergy * 5) + 3
        for (let i = 0; i < nebulaeCount; i++) {
          const x = (time * 10 + i * 100) % (canvas.width + 200) - 100
          const y = (Math.sin(time * 0.5 + i) * 50 + canvas.height / 2)
          const size = 80 + totalEnergy * 120
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
          gradient.addColorStop(0, `hsla(${baseHue + i * 30}, 80%, 60%, ${totalEnergy * 0.4})`)
          gradient.addColorStop(0.7, `hsla(${baseHue + i * 60}, 60%, 40%, ${totalEnergy * 0.2})`)
          gradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      // Stars (only if particles enabled)
      if (showParticles) {
        const starCount = 50 + Math.floor(highFreq * 30)
        for (let i = 0; i < starCount; i++) {
          const x = (time * 2 + i * 23.7) % canvas.width
          const y = (time * 1.5 + i * 17.3) % canvas.height
          const brightness = 0.3 + Math.sin(time * 3 + i) * 0.7
          const size = 1 + highFreq * 3
          
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      // Galaxy spiral (only if particles enabled)
      if (showParticles && bassFreq > 0.4) {
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(time * 0.1)
        
        for (let i = 0; i < 100; i++) {
          const angle = (i / 100) * Math.PI * 4 + time
          const radius = i * 2 + bassFreq * 50
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius * 0.3
          
          ctx.fillStyle = `hsla(${240 + i * 2}, 70%, 60%, ${0.1 + bassFreq * 0.3})`
          ctx.beginPath()
          ctx.arc(x, y, 2 + bassFreq * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }
    
    const renderDreamlikeBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles = true) => {
      // Soft gradient base
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      const baseHue = 300 + Math.sin(time * 0.5) * 60
      
      if (isDarkMode) {
        gradient.addColorStop(0, `hsl(${baseHue}, 40%, 15%)`)
        gradient.addColorStop(0.5, `hsl(${baseHue + 60}, 30%, 10%)`)
        gradient.addColorStop(1, `hsl(${baseHue + 120}, 35%, 12%)`)
      } else {
        gradient.addColorStop(0, `hsl(${baseHue}, 30%, 95%)`)
        gradient.addColorStop(0.5, `hsl(${baseHue + 60}, 25%, 92%)`)
        gradient.addColorStop(1, `hsl(${baseHue + 120}, 28%, 90%)`)
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Floating dream bubbles
      const bubbleCount = 8 + Math.floor(midFreq * 12)
      for (let i = 0; i < bubbleCount; i++) {
        const x = (time * 15 + i * 77) % (canvas.width + 100) - 50
        const y = Math.sin(time * 0.7 + i * 0.5) * (canvas.height * 0.3) + canvas.height / 2
        const size = Math.max(5, 20 + Math.sin(time * 2 + i) * 15 + midFreq * 30)
        
        const bubbleGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
        bubbleGradient.addColorStop(0, `hsla(${baseHue + i * 40}, 60%, 80%, 0.3)`)
        bubbleGradient.addColorStop(0.8, `hsla(${baseHue + i * 40}, 40%, 70%, 0.1)`)
        bubbleGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = bubbleGradient
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Dreamy particles (only if particles enabled)
      if (showParticles && highFreq > 0.3) {
        const particleCount = Math.floor(highFreq * 20)
        for (let i = 0; i < particleCount; i++) {
          const x = Math.sin(time * 2 + i * 0.1) * (canvas.width * 0.4) + canvas.width / 2
          const y = (time * 25 + i * 50) % (canvas.height + 50) - 25
          const size = 1 + Math.sin(time * 4 + i) * 2
          
          ctx.fillStyle = `hsla(${baseHue + i * 20}, 70%, 85%, ${highFreq * 0.8})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      // Soft aurora waves
      if (bassFreq > 0.3) {
        ctx.save()
        ctx.globalCompositeOperation = 'overlay'
        
        for (let wave = 0; wave < 3; wave++) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2)
          
          for (let x = 0; x <= canvas.width; x += 10) {
            const y = canvas.height / 2 + 
              Math.sin((x + time * 100 + wave * 100) * 0.01) * bassFreq * 50 +
              Math.sin((x + time * 150 + wave * 150) * 0.005) * bassFreq * 30
            ctx.lineTo(x, y)
          }
          
          ctx.strokeStyle = `hsla(${baseHue + wave * 120}, 60%, 70%, ${bassFreq * 0.3})`
          ctx.lineWidth = 3 + bassFreq * 5
          ctx.stroke()
        }
        ctx.restore()
      }
    }
    
    const renderGeometricBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode) => {
      // Base color
      const baseColor = isDarkMode ? '#0f0f23' : '#f5f5f5'
      ctx.fillStyle = baseColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Rotating geometric shapes
      const shapeCount = 6 + Math.floor(totalEnergy * 8)
      for (let i = 0; i < shapeCount; i++) {
        ctx.save()
        
        const x = (canvas.width / (shapeCount + 1)) * (i + 1)
        const y = canvas.height / 2 + Math.sin(time * 2 + i) * 100
        const rotation = time * (0.5 + i * 0.1) + bassFreq * 2
        const scale = 0.5 + totalEnergy + Math.sin(time * 3 + i) * 0.3
        
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.scale(scale, scale)
        
        const sides = 3 + i % 5
        const radius = 30 + midFreq * 40
        const hue = (time * 30 + i * 60) % 360
        
        ctx.beginPath()
        for (let s = 0; s < sides; s++) {
          const angle = (s / sides) * Math.PI * 2
          const px = Math.cos(angle) * radius
          const py = Math.sin(angle) * radius
          if (s === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        
        ctx.fillStyle = `hsla(${hue}, 70%, ${isDarkMode ? 60 : 40}%, ${0.3 + totalEnergy * 0.4})`
        ctx.fill()
        
        ctx.strokeStyle = `hsla(${hue}, 80%, ${isDarkMode ? 80 : 20}%, ${0.6 + totalEnergy * 0.4})`
        ctx.lineWidth = 2
        ctx.stroke()
        
        ctx.restore()
      }
      
      // Grid pattern
      if (highFreq > 0.4) {
        const gridSize = 50 - highFreq * 20
        ctx.strokeStyle = `hsla(0, 0%, ${isDarkMode ? 100 : 0}%, ${highFreq * 0.2})`
        ctx.lineWidth = 1
        
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }
    }
    
    const renderWavesBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles = true) => {
      // Ocean gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      const baseHue = 200 + Math.sin(time * 0.3) * 40
      
      if (isDarkMode) {
        gradient.addColorStop(0, `hsl(${baseHue}, 50%, 10%)`)
        gradient.addColorStop(0.7, `hsl(${baseHue + 20}, 60%, 15%)`)
        gradient.addColorStop(1, `hsl(${baseHue + 40}, 70%, 8%)`)
      } else {
        gradient.addColorStop(0, `hsl(${baseHue}, 40%, 90%)`)
        gradient.addColorStop(0.7, `hsl(${baseHue + 20}, 50%, 85%)`)
        gradient.addColorStop(1, `hsl(${baseHue + 40}, 60%, 80%)`)
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Multiple wave layers
      const waveCount = 5
      for (let layer = 0; layer < waveCount; layer++) {
        ctx.beginPath()
        
        const amplitude = 20 + (bassFreq + midFreq) * 40 * (1 - layer * 0.1)
        const frequency = 0.01 + layer * 0.002
        const speed = 50 + layer * 20
        const yOffset = canvas.height * 0.6 + layer * 15
        
        ctx.moveTo(0, yOffset)
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = yOffset + 
            Math.sin((x + time * speed) * frequency) * amplitude +
            Math.sin((x + time * speed * 1.5) * frequency * 2) * amplitude * 0.5
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        
        const alpha = 0.1 + totalEnergy * 0.3
        const layerHue = baseHue + layer * 15
        ctx.fillStyle = `hsla(${layerHue}, 60%, ${isDarkMode ? 40 : 60}%, ${alpha})`
        ctx.fill()
      }
      
      // Foam particles (only if particles enabled)
      if (showParticles && highFreq > 0.3) {
        const foamCount = Math.floor(highFreq * 30)
        for (let i = 0; i < foamCount; i++) {
          const x = (time * 80 + i * 25) % (canvas.width + 20) - 10
          const y = canvas.height * 0.6 + Math.sin(time * 3 + i) * 20 + Math.random() * 30
          const size = 2 + Math.random() * 4
          
          ctx.fillStyle = `rgba(255, 255, 255, ${highFreq * 0.8})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    
    const renderCloudsBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode) => {
      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      if (isDarkMode) {
        skyGradient.addColorStop(0, '#0a0a1a')
        skyGradient.addColorStop(0.5, '#1a1a3a')
        skyGradient.addColorStop(1, '#2a2a4a')
      } else {
        skyGradient.addColorStop(0, '#87CEEB')
        skyGradient.addColorStop(0.5, '#98D8E8')
        skyGradient.addColorStop(1, '#B0E0E6')
      }
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Clouds
      const cloudCount = 8 + Math.floor(bassFreq * 5)
      for (let i = 0; i < cloudCount; i++) {
        ctx.save()
        const x = ((time * 10 + i * 100) % (canvas.width + 300)) - 150
        const y = 50 + i * 60 + Math.sin(time * 0.5 + i) * 20
        const scale = 0.8 + Math.sin(i) * 0.4
        
        ctx.translate(x, y)
        ctx.scale(scale, scale)
        
        // Cloud puffs
        const alpha = isDarkMode ? 0.3 + midFreq * 0.3 : 0.8 + midFreq * 0.2
        ctx.fillStyle = isDarkMode 
          ? `rgba(100, 100, 120, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`
        
        for (let j = 0; j < 5; j++) {
          const puffX = Math.cos(j * 1.2) * 30
          const puffY = Math.sin(j * 0.8) * 15
          const puffSize = Math.max(10, 40 + Math.sin(time * 2 + j) * 10 + bassFreq * 20)
          
          ctx.beginPath()
          ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()
      }
    }
    
    const renderNeonBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time) => {
      // Dark background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Neon grid
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + highFreq * 0.7})`
      ctx.lineWidth = 2
      ctx.shadowBlur = 10 + bassFreq * 20
      ctx.shadowColor = '#00ffff'
      
      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Neon shapes
      const shapeCount = 5 + Math.floor(midFreq * 10)
      for (let i = 0; i < shapeCount; i++) {
        const hue = (time * 50 + i * 60) % 360
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.5 + totalEnergy * 0.5})`
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`
        ctx.shadowBlur = 20 + bassFreq * 30
        ctx.lineWidth = 3
        
        const x = (canvas.width / shapeCount) * i + canvas.width / (shapeCount * 2)
        const y = canvas.height / 2 + Math.sin(time * 2 + i) * 100
        const size = 30 + totalEnergy * 50
        
        ctx.beginPath()
        if (i % 3 === 0) {
          ctx.rect(x - size/2, y - size/2, size, size)
        } else if (i % 3 === 1) {
          ctx.arc(x, y, size/2, 0, Math.PI * 2)
        } else {
          ctx.moveTo(x, y - size/2)
          ctx.lineTo(x + size/2, y + size/2)
          ctx.lineTo(x - size/2, y + size/2)
          ctx.closePath()
        }
        ctx.stroke()
      }
      
      ctx.shadowBlur = 0
    }
    
    const renderMatrixBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time) => {
      // Black background with green tint
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Matrix rain
      ctx.font = '14px monospace'
      const chars = '01アイウエオカキクケコサシスセソタチツテト'
      const columnWidth = 20
      const columns = Math.floor(canvas.width / columnWidth)
      
      for (let i = 0; i < columns; i++) {
        const x = i * columnWidth
        // const charIndex = Math.floor(Math.random() * chars.length)
        const y = ((time * 100 + i * 50) % canvas.height)
        
        // Trail effect
        for (let j = 0; j < 10; j++) {
          const trailY = y - j * 20
          const alpha = (1 - j / 10) * (0.5 + bassFreq * 0.5)
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`
          
          if (trailY > 0 && trailY < canvas.height) {
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, trailY)
          }
        }
      }
    }
    
    const renderRainbowBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, isDarkMode, showParticles = true) => {
      // Base color
      ctx.fillStyle = isDarkMode ? '#0a0a0a' : '#fafafa'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Rainbow waves
      const waveCount = 7
      for (let i = 0; i < waveCount; i++) {
        const hue = (i * 360 / waveCount + time * 30) % 360
        const alpha = 0.3 + totalEnergy * 0.4
        
        ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const waveHeight = Math.sin((x + time * 50) * 0.01 + i) * 50 * (1 + bassFreq)
          const y = canvas.height * (0.3 + i * 0.1) + waveHeight
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()
      }
      
      // Rainbow particles (only if particles enabled)
      if (showParticles) {
        const particleCount = Math.floor(20 + midFreq * 30)
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width
        const y = (time * 50 + i * 30) % canvas.height
        const hue = (x / canvas.width * 360 + time * 50) % 360
        const size = 2 + highFreq * 8
        
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.8})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        }
      }
    }
    
    const renderFireBackground = (ctx, canvas, bassFreq, midFreq, highFreq, totalEnergy, time, showParticles = true) => {
      // Dark background
      ctx.fillStyle = '#0a0000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Fire particles (only if particles enabled)
      if (showParticles) {
        const particleCount = 100 + Math.floor(bassFreq * 100)
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width
        const baseY = canvas.height
        const y = baseY - ((time * 100 + i * 10) % (canvas.height * 0.8))
        const size = Math.random() * 10 + bassFreq * 20
        
        // Fire colors based on height
        const heightRatio = (baseY - y) / canvas.height
        let r, g, b, a
        
        if (heightRatio < 0.3) {
          // Base - white/yellow
          r = 255
          g = 200 + Math.random() * 55
          b = 100 + Math.random() * 50
          a = 0.8
        } else if (heightRatio < 0.6) {
          // Middle - orange
          r = 255
          g = 100 + Math.random() * 100
          b = 0
          a = 0.6
        } else {
          // Top - red/dark
          r = 150 + Math.random() * 105
          g = 0
          b = 0
          a = 0.3
        }
        
        // Wave effect
        const waveX = x + Math.sin(y * 0.02 + time) * 20 * heightRatio
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * (1 - heightRatio)})`
        ctx.beginPath()
        ctx.arc(waveX, y, size * (1 - heightRatio * 0.7), 0, Math.PI * 2)
        ctx.fill()
      }
      }
      
      // Glow effect
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height, 0,
        canvas.width / 2, canvas.height, canvas.height * 0.8
      )
      glowGradient.addColorStop(0, `rgba(255, 100, 0, ${0.3 + bassFreq * 0.3})`)
      glowGradient.addColorStop(0.5, `rgba(255, 50, 0, ${0.1 + bassFreq * 0.1})`)
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = glowGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    renderBackground()
    
    // Default pattern includes gradient overlay for non-default patterns
    if (backgroundPattern === 'default' && audioData && audioData.length > 0) {
      const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
      const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
      const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
      
      if (bassFreq > 0.4 || midFreq > 0.4 || highFreq > 0.4) {
        // Create radial gradient from center
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        )
        
        const centerHue = (bassFreq * 60 + midFreq * 180 + highFreq * 300) % 360
        const edgeHue = (centerHue + 180) % 360
        
        if (isDarkMode) {
          gradient.addColorStop(0, `hsla(${centerHue}, 80%, 40%, 0.4)`)
          gradient.addColorStop(0.7, `hsla(${edgeHue}, 60%, 20%, 0.2)`)
          gradient.addColorStop(1, 'transparent')
        } else {
          gradient.addColorStop(0, `hsla(${centerHue}, 60%, 90%, 0.3)`)
          gradient.addColorStop(0.7, `hsla(${edgeHue}, 40%, 95%, 0.1)`)
          gradient.addColorStop(1, 'transparent')
        }
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
    
    // Add dynamic visual effects for high energy
    if (audioData && audioData.length > 0) {
      const bassEnergy = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
      const midEnergy = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
      const highEnergy = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
      
      // Light rays for bass instead of grid
      if (bassEnergy > 0.6) {
        const rayCount = Math.floor(bassEnergy * 8)
        const lightness = isDarkMode ? 70 : 50
        const alpha = isDarkMode ? bassEnergy * 0.25 : bassEnergy * 0.15
        ctx.strokeStyle = `hsla(${bassEnergy * 360}, 60%, ${lightness}%, ${alpha})`
        ctx.lineWidth = isDarkMode ? 4 : 3
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + Date.now() * 0.002
          const length = bassEnergy * 200
          ctx.beginPath()
          ctx.moveTo(canvas.width / 2, canvas.height / 2)
          ctx.lineTo(
            canvas.width / 2 + Math.cos(angle) * length,
            canvas.height / 2 + Math.sin(angle) * length
          )
          ctx.stroke()
        }
      }
      
      // Floating particles for mids (only if particles enabled)
      if (showParticles && midEnergy > 0.4) {
        for (let i = 0; i < midEnergy * 20; i++) {
          const x = (Date.now() * 0.01 + i * 100) % canvas.width
          const y = (Math.sin(Date.now() * 0.005 + i) * 50 + canvas.height / 2)
          const lightness = isDarkMode ? 70 : 60
          const alpha = isDarkMode ? midEnergy * 0.9 : midEnergy * 0.8
          ctx.fillStyle = `hsla(${120 + midEnergy * 120}, 70%, ${lightness}%, ${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, midEnergy * 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      // Strobe effect for highs
      if (highEnergy > 0.5) {
        const strobeIntensity = Math.sin(Date.now() * 0.1) * highEnergy
        if (strobeIntensity > 0.3) {
          const strobeColor = isDarkMode ? 60 : 100
          const strobeAlpha = isDarkMode ? strobeIntensity * 0.15 : strobeIntensity * 0.2
          ctx.fillStyle = `hsla(0, 0%, ${strobeColor}%, ${strobeAlpha})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
      
      // Circular waves for very high energy
      if (bassEnergy + midEnergy + highEnergy > 1.5) {
        const waveRadius = (Date.now() * 0.01) % 300
        const waveLightness = isDarkMode ? 70 : 60
        const waveAlpha = isDarkMode ? 0.4 : 0.3
        ctx.strokeStyle = `hsla(${(bassEnergy + midEnergy + highEnergy) * 120}, 80%, ${waveLightness}%, ${waveAlpha})`
        ctx.lineWidth = isDarkMode ? 4 : 3
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, waveRadius, 0, Math.PI * 2)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, (waveRadius + 100) % 300, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    
    if (audioData && audioData.length > 0) {
      // Auto sync/unsync logic (only when not manually controlled)
      if (!isSync) {
        autoSyncTimerRef.current += animationSpeed
        
        // Check for high energy moments or beat drops
        const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
        const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
        const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
        const ultraHighFreq = audioData.slice(100, 150).reduce((a, b) => a + b) / 50 / 255
        const totalEnergy = bassFreq + midFreq + highFreq + ultraHighFreq
        
        // Trigger auto-sync on high energy moments
        if (!autoSyncStateRef.current && (totalEnergy > 1.8 || bassFreq > 0.8) && autoSyncTimerRef.current > 5) {
          autoSyncStateRef.current = true
          autoSyncDurationRef.current = 3 + Math.random() * 4 // Sync for 3-7 seconds
          autoSyncTimerRef.current = 0
        }
        
        // End auto-sync after duration or when energy drops
        if (autoSyncStateRef.current && (autoSyncTimerRef.current > autoSyncDurationRef.current || totalEnergy < 0.5)) {
          autoSyncStateRef.current = false
          autoSyncTimerRef.current = 0
        }
      }
      
      const currentSyncState = isSync || autoSyncStateRef.current
      
      if (currentSyncState) {
        // Update synchronized phase and move selection
        const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
        const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
        const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
        const ultraHighFreq = audioData.slice(100, 150).reduce((a, b) => a + b) / 50 / 255
        
        syncPhaseRef.current += (0.02 + bassFreq * 0.05 + midFreq * 0.025) * animationSpeed
        syncMoveTimerRef.current += animationSpeed
        
        // Select synchronized move based on audio intensity
        const totalEnergy = bassFreq + midFreq + highFreq + ultraHighFreq
        if (syncMoveTimerRef.current > 2 || totalEnergy > 1.5) {
          const moves = ['groove', 'wave', 'bounce', 'spin', 'jump', 'sway']
          if (bassFreq > 0.6) {
            syncMoveRef.current = ['jump', 'bounce', 'breaking'][Math.floor(Math.random() * 3)]
          } else if (midFreq > 0.5) {
            syncMoveRef.current = ['wave', 'groove', 'robot'][Math.floor(Math.random() * 3)]
          } else if (ultraHighFreq > 0.3) {
            syncMoveRef.current = 'spin'
          } else {
            syncMoveRef.current = moves[Math.floor(Math.random() * moves.length)]
          }
          syncMoveTimerRef.current = 0
        }
      }
      
      stickFiguresRef.current.forEach(figure => {
        figure.update(audioData, animationSpeed, currentSyncState, syncPhaseRef.current, syncMoveRef.current, showParticles)
      })
    }
    
    stickFiguresRef.current.forEach(figure => {
      figure.draw(ctx, showParticles)
    })
    
  }, [audioData, animationSpeed, figureCount, isSync, personalityBalance, isDarkMode, backgroundPattern, aspectRatio, showParticles])

  return (
    <canvas 
      ref={(element) => {
        canvasRef.current = element
        if (ref) {
          if (typeof ref === 'function') {
            ref(element)
          } else {
            ref.current = element
          }
        }
      }}
      className="stick-figure-canvas"
    />
  )
})

StickFigureCanvas.displayName = 'StickFigureCanvas'

export default StickFigureCanvas