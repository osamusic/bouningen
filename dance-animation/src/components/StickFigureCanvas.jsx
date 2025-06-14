import { useRef, useEffect } from 'react'

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

  update(audioData, speedMultiplier = 0.1, isSync = false, syncPhase = 0, syncMove = 'idle') {
    const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
    const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
    const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
    const ultraHighFreq = audioData.slice(100, 150).reduce((a, b) => a + b) / 50 / 255
    
    // Update move timer
    this.moveTimer += speedMultiplier
    this.walkTimer += speedMultiplier
    
    // Walking behavior (when not in sync mode)
    if (!isSync) {
      this.updateWalking(speedMultiplier, bassFreq, midFreq)
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
    this.legAngle = Math.sin(adjustedPhase * 1.2 * speedMultiplier * speedVar) * bassFreq * Math.PI / 4
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
    
    // Particle effects for high energy
    if (bassFreq > 0.6 && Math.random() < 0.3) {
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
      this.legAngle = Math.sin(this.freezeTime * 6) * Math.PI / 4
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
    this.legAngle = Math.cos(this.jumpPhase) * intensity * Math.PI / 2
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
    this.legAngle = Math.cos(this.moonwalkPhase) * intensity * Math.PI / 6
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
    this.legAngle = Math.sin(this.spinPhase) * Math.PI / 3
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
    this.legAngle = Math.sin(this.walkPhase + Math.PI) * intensity * Math.PI / 6
    
    // Step height for walking animation
    this.stepHeight = Math.abs(Math.sin(this.stepPhase)) * intensity * 10
    
    // Slight body lean while walking
    this.bodyTilt = Math.sin(this.walkPhase) * intensity * 0.1
  }

  updateWalking(speedMultiplier, bassFreq, midFreq) {
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

  draw(ctx) {
    // Draw trail effect
    this.trailPositions.forEach((pos) => {
      ctx.save()
      ctx.globalAlpha = pos.alpha / 255
      ctx.fillStyle = `hsl(${(this.dancePhase * 50) % 360}, 70%, 60%)`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - 50, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    
    // Draw particles
    this.particles.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.life / 255
      ctx.fillStyle = `hsl(${(this.dancePhase * 100) % 360}, 80%, 70%)`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    
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
        strokeColor = `hsl(${(this.colorHue + this.dancePhase * 30) % 360}, 80%, 40%)`
        headColor = `hsl(${(this.colorHue + this.dancePhase * 30) % 360}, 60%, 90%)`
        lineWidth = 6 * this.sizeVariation
        break
      case 'groove':
        strokeColor = `hsl(${(this.colorHue + this.dancePhase * 20) % 360}, 60%, 50%)`
        headColor = `hsl(${(this.colorHue + this.dancePhase * 20) % 360}, 40%, 85%)`
        lineWidth = 5 * this.sizeVariation
        break
      case 'smooth':
        strokeColor = `hsl(${(this.colorHue + this.dancePhase * 10) % 360}, 40%, 60%)`
        headColor = `hsl(${(this.colorHue + this.dancePhase * 10) % 360}, 30%, 95%)`
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
    
    const headRadius = (25 + this.stretchPhase * 5) * this.sizeVariation
    const bodyLength = (70 + this.stretchPhase * 10) * this.sizeVariation
    const armLength = (50 + this.stretchPhase * 8) * this.sizeVariation
    const legLength = (60 + this.stretchPhase * 12) * this.sizeVariation
    
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
    const kneeFlexion = Math.sin(this.dancePhase * 1.8) * 0.3
    
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
    
    const gestureSize = 8 * this.sizeVariation
    
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

function StickFigureCanvas({ audioData, animationSpeed = 0.1, figureCount = 1, isSync = false, personalityBalance, isDarkMode = false }) {
  const canvasRef = useRef(null)
  const stickFiguresRef = useRef([])
  const p5InstanceRef = useRef(null)
  const syncPhaseRef = useRef(0)
  const syncMoveRef = useRef('idle')
  const syncMoveTimerRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Dynamic canvas size based on figure count
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
    const needsRecreation = stickFiguresRef.current.length !== figureCount
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
        
        if (figureCount <= 8) {
          // Single row for small groups
          const spacing = canvas.width / (figureCount + 1)
          x = spacing * (i + 1)
          y = canvas.height * 0.75
        } else {
          // Multiple rows for larger groups
          const cols = Math.ceil(Math.sqrt(figureCount * (canvas.width / canvas.height)))
          const rows = Math.ceil(figureCount / cols)
          
          const row = Math.floor(i / cols)
          const col = i % cols
          
          const spacingX = canvas.width / (cols + 1)
          const spacingY = canvas.height / (rows + 1)
          
          x = spacingX * (col + 1)
          y = spacingY * (row + 1) + canvas.height * 0.2 // Start lower to leave space at top
        }
        
        // Select personality based on distribution
        const personalityIndex = Math.floor(Math.random() * distribution.length)
        const selectedPersonality = distribution[personalityIndex]
        
        const figure = new StickFigure(x, y, p5InstanceRef.current, i)
        figure.personality = selectedPersonality
        
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
    
    // Dynamic background based on audio energy and mode
    let bgColor = isDarkMode ? '#1a1a1a' : '#f0f0f0'
    if (audioData && audioData.length > 0) {
      const bassFreq = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
      const midFreq = audioData.slice(10, 50).reduce((a, b) => a + b) / 40 / 255
      const highFreq = audioData.slice(50, 100).reduce((a, b) => a + b) / 50 / 255
      const totalEnergy = (bassFreq + midFreq + highFreq) / 3
      
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
        const pulse = Math.sin(Date.now() * 0.01) * 0.1
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
    
    // Create gradient background for more dynamic effect
    if (audioData && audioData.length > 0) {
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
          gradient.addColorStop(1, bgColor)
        } else {
          gradient.addColorStop(0, `hsla(${centerHue}, 60%, 90%, 0.3)`)
          gradient.addColorStop(0.7, `hsla(${edgeHue}, 40%, 95%, 0.1)`)
          gradient.addColorStop(1, bgColor)
        }
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
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
      
      // Floating particles for mids
      if (midEnergy > 0.4) {
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
      if (isSync) {
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
        figure.update(audioData, animationSpeed, isSync, syncPhaseRef.current, syncMoveRef.current)
      })
    }
    
    stickFiguresRef.current.forEach(figure => {
      figure.draw(ctx)
    })
    
  }, [audioData, animationSpeed, figureCount, isSync, personalityBalance, isDarkMode])

  return (
    <canvas 
      ref={canvasRef}
      className="stick-figure-canvas"
    />
  )
}

export default StickFigureCanvas