import { useState, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function AudioControls({ setAudioContext, setAnalyser, setIsPlaying, isPlaying }) {
  const { t } = useLanguage()
  const [audioBuffer, setAudioBuffer] = useState(null)
  const [fileName, setFileName] = useState('')
  const [volume, setVolume] = useState(50)
  const audioSourceRef = useRef(null)
  const gainNodeRef = useRef(null)
  const audioContextRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)

    try {
      const arrayBuffer = await file.arrayBuffer()
      
      if (!audioContextRef.current) {
        const context = new (window.AudioContext || window.webkitAudioContext)()
        audioContextRef.current = context
        setAudioContext(context)
        
        const analyserNode = context.createAnalyser()
        analyserNode.fftSize = 256
        setAnalyser(analyserNode)
        
        gainNodeRef.current = context.createGain()
        gainNodeRef.current.gain.value = volume / 100
        gainNodeRef.current.connect(analyserNode)
        analyserNode.connect(context.destination)
      }
      
      const decodedBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      setAudioBuffer(decodedBuffer)
      
    } catch (error) {
      console.error('Audio loading error:', error)
      alert(t('alertAudioError'))
    }
  }

  const handlePlay = () => {
    if (!audioBuffer || !audioContextRef.current) return
    
    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect()
    }
    
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(gainNodeRef.current)
    
    source.start(0)
    audioSourceRef.current = source
    setIsPlaying(true)
    
    source.onended = () => {
      setIsPlaying(false)
      audioSourceRef.current = null
    }
  }

  const handleStop = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop()
      audioSourceRef.current = null
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume / 100
    }
  }

  return (
    <div className="audio-controls">
      <h3>{t('audioControls')}</h3>
      <div className="file-input-wrapper">
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileUpload}
          id="audio-file"
        />
        <label htmlFor="audio-file" className="file-input-label">
          <span className="file-icon">🎵</span>
          <span className="file-text">
            {fileName || t('selectMusic')}
          </span>
          <span className="file-hint">{t('fileHint')}</span>
        </label>
      </div>
      
      <div className="playback-controls">
        <button 
          onClick={handlePlay} 
          disabled={!audioBuffer || isPlaying}
          className="play-button"
        >
          {t('play')}
        </button>
        <button 
          onClick={handleStop} 
          disabled={!isPlaying}
          className="stop-button"
        >
          {t('stop')}
        </button>
      </div>
      
      <div className="volume-control">
        <label htmlFor="volume">{t('volume')}: {volume}%</label>
        <input 
          type="range" 
          id="volume"
          min="0" 
          max="100" 
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  )
}

export default AudioControls