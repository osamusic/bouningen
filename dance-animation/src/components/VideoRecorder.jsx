import { useState, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function VideoRecorder({ canvasRef, isPlaying, aspectRatio, onAspectRatioChange }) {
  const { t } = useLanguage()
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [videoQuality, setVideoQuality] = useState('720p')
  const [videoFormat, setVideoFormat] = useState('mp4')
  const [recordingMode, setRecordingMode] = useState('manual')
  const [recordingDuration, setRecordingDuration] = useState(5)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const qualitySettings = {
    '480p': { width: 854, height: 480, videoBitsPerSecond: 1000000 },
    '720p': { width: 1280, height: 720, videoBitsPerSecond: 2500000 },
    '1080p': { width: 1920, height: 1080, videoBitsPerSecond: 5000000 },
    '480p-vertical': { width: 480, height: 854, videoBitsPerSecond: 1000000 },
    '720p-vertical': { width: 720, height: 1280, videoBitsPerSecond: 2500000 },
    '1080p-vertical': { width: 1080, height: 1920, videoBitsPerSecond: 5000000 }
  }

  const startRecording = async () => {
    if (!canvasRef.current || !isPlaying) {
      alert(t('alertPlayMusic'))
      return
    }

    try {
      const canvas = canvasRef.current
      const qualityKey = aspectRatio === '9:16' ? `${videoQuality}-vertical` : videoQuality
      const settings = qualitySettings[qualityKey]
      
      // Set canvas recording resolution
      const stream = canvas.captureStream(30) // 30 FPS
      
      const mimeType = videoFormat === 'mp4' 
        ? 'video/mp4' 
        : videoFormat === 'webm' 
        ? 'video/webm' 
        : 'video/webm;codecs=vp9'

      // Check if the browser supports the selected format
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        alert(t('alertUnsupported').replace('{format}', videoFormat))
        return
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: settings.videoBitsPerSecond
      })

      recordedChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mimeType
        })
        setRecordedBlob(blob)
        recordedChunksRef.current = []
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      // Auto-stop timer for timed recording modes
      if (recordingMode !== 'manual') {
        setTimeRemaining(recordingDuration)
        let remainingTime = recordingDuration
        recordingTimerRef.current = setInterval(() => {
          remainingTime -= 1
          setTimeRemaining(remainingTime)
          if (remainingTime <= 0) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop()
              setIsRecording(false)
              setTimeRemaining(0)
              clearInterval(recordingTimerRef.current)
              recordingTimerRef.current = null
            }
          }
        }, 1000)
      }

    } catch (error) {
      console.error('録画開始エラー:', error)
      alert(t('alertRecordingError'))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setTimeRemaining(0)
      
      // Clear timer if exists
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }

  const downloadVideo = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stick-figure-dance-${Date.now()}.${videoFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setRecordedBlob(null)
    }
  }

  const clearRecording = () => {
    setRecordedBlob(null)
  }

  return (
    <div className="control-panel video-recorder">
      <h3>{t('videoRecorder')}</h3>
      
      <div className="recording-controls">
        <div className="control-item">
          <label htmlFor="aspect-ratio">{t('aspectRatio')}</label>
          <select
            id="aspect-ratio"
            value={aspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.value)}
            disabled={isRecording}
          >
            <option value="16:9">{t('aspectRatio16')}</option>
            <option value="9:16">{t('aspectRatio9')}</option>
          </select>
        </div>

        <div className="control-item">
          <label htmlFor="video-quality">{t('quality')}</label>
          <select
            id="video-quality"
            value={videoQuality}
            onChange={(e) => setVideoQuality(e.target.value)}
            disabled={isRecording}
          >
            <option value="480p">{t('quality480')}</option>
            <option value="720p">{t('quality720')}</option>
            <option value="1080p">{t('quality1080')}</option>
          </select>
        </div>

        <div className="control-item">
          <label htmlFor="video-format">{t('format')}</label>
          <select
            id="video-format"
            value={videoFormat}
            onChange={(e) => setVideoFormat(e.target.value)}
            disabled={isRecording}
          >
            <option value="mp4">{t('formatMp4')}</option>
            <option value="webm">{t('formatWebm')}</option>
          </select>
        </div>

        <div className="control-item">
          <label htmlFor="recording-mode">{t('recordingMode')}</label>
          <select
            id="recording-mode"
            value={recordingMode}
            onChange={(e) => setRecordingMode(e.target.value)}
            disabled={isRecording}
          >
            <option value="manual">{t('manualStop')}</option>
            <option value="timed">{t('autoStop')}</option>
          </select>
        </div>

        {recordingMode === 'timed' && (
          <div className="control-item">
            <label htmlFor="recording-duration">{t('recordingDuration')}</label>
            <select
              id="recording-duration"
              value={recordingDuration}
              onChange={(e) => setRecordingDuration(Number(e.target.value))}
              disabled={isRecording}
            >
              <option value={5}>5 {t('seconds')}</option>
              <option value={10}>10 {t('seconds')}</option>
              <option value={15}>15 {t('seconds')}</option>
              <option value={30}>30 {t('seconds')}</option>
            </select>
          </div>
        )}

        <div className="recording-buttons">
          {!isRecording ? (
            <button 
              className="record-button"
              onClick={startRecording}
              disabled={!isPlaying}
            >
              {recordingMode === 'timed' ? `${t('startRecordingTimed')} (${recordingDuration} ${t('seconds')})` : t('startRecording')}
            </button>
          ) : (
            <button 
              className="stop-button"
              onClick={stopRecording}
            >
              {t('stopRecording')}
            </button>
          )}
        </div>

        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-pulse">●</span>
            {recordingMode === 'timed' && timeRemaining > 0 
              ? `${t('recording')} ${t('remaining')} ${timeRemaining} ${t('seconds')}` 
              : t('recording')
            }
          </div>
        )}

        {recordedBlob && (
          <div className="recorded-video-controls">
            <button 
              className="download-button"
              onClick={downloadVideo}
            >
              {t('downloadVideo')}
            </button>
            <button 
              className="clear-button"
              onClick={clearRecording}
            >
              {t('delete')}
            </button>
          </div>
        )}
      </div>

      <div className="recording-info">
        <p>{t('recordingTips')}</p>
        <ul>
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
          <li>{t('tip5')}</li>
        </ul>
      </div>
    </div>
  )
}

export default VideoRecorder