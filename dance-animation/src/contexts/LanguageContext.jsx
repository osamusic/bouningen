import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const translations = {
  ja: {
    // Header
    appTitle: 'DansaBo',
    appSubtitle: 'ダンスする棒人間たち',
    
    // Audio Controls
    audioControls: '🎧 音楽コントロール',
    selectMusic: '音楽ファイルを選択してください',
    fileHint: 'MP3, WAV, M4A など',
    play: '▶️ 再生',
    stop: '⏹️ 停止',
    volume: '音量',
    
    // Controls
    speed: '⚡ アニメーション速度',
    speedLabel: 'アニメーション速度:',
    slow: '遅い',
    fast: '速い',
    speedValue: '速度',
    figureCount: '👥 棒人間の数',
    figureCountLabel: '棒人間の数:',
    sync: '🔄 ダンス同期',
    syncOn: 'Sync ON',
    syncOff: 'Sync OFF',
    syncOnDesc: '全員が同期してダンス',
    syncOffDesc: '個別にランダムなダンス',
    display: '🌙 表示',
    darkMode: 'ダークモード',
    showParticles: 'パーティクル表示',
    background: '背景:',
    
    // Background patterns
    bgDefault: 'Default',
    bgCosmic: '🌌 Cosmic',
    bgDreamlike: '💫 Dreamlike',
    bgGeometric: '🔷 Geometric',
    bgWaves: '🌊 Waves',
    bgClouds: '☁️ Clouds',
    bgNeon: '💡 Neon',
    bgMatrix: '🔢 Matrix',
    bgRainbow: '🌈 Rainbow',
    bgFire: '🔥 Fire',
    
    // Personality Control
    personalityControl: '🎭 個性バランス（上級者向け）',
    breakdancer: 'ブレイカー',
    waver: 'ウェーバー',
    jumper: 'ジャンパー',
    spinner: 'スピナー',
    groover: 'グルーバー',
    total: '合計',
    reset: 'リセット',
    
    // Video Recorder
    videoRecorder: '🎥 動画録画',
    aspectRatio: 'アスペクト比:',
    aspectRatio16: '16:9 (横長)',
    aspectRatio9: '9:16 (縦長)',
    quality: '画質:',
    quality480: '480p (軽量)',
    quality720: '720p (標準)',
    quality1080: '1080p (高画質)',
    format: 'フォーマット:',
    formatMp4: 'MP4 (推奨)',
    formatWebm: 'WebM',
    recordingMode: '録画モード:',
    manualStop: '手動停止',
    autoStop: '自動停止',
    recordingDuration: '録画時間:',
    seconds: '秒',
    startRecording: '🔴 録画開始',
    startRecordingTimed: '🔴 録画開始',
    stopRecording: '⏹️ 録画停止',
    recording: '録画中...',
    remaining: '残り',
    downloadVideo: '💾 動画をダウンロード',
    delete: '🗑️ 削除',
    
    // Recording Info
    recordingTips: '📝 録画のヒント:',
    tip1: '音楽を再生してから録画ボタンを押してください',
    tip2: 'ダンスが最も盛り上がる瞬間を狙って録画しましょう',
    tip3: '録画中は他のタブに移動しないでください',
    tip4: '自動停止モードを使うと短いクリップを簡単に作成できます',
    tip5: '長時間の録画はファイルサイズが大きくなります',
    
    // Alerts
    alertPlayMusic: '音楽を再生してからダンスを録画してください',
    alertUnsupported: 'ブラウザが{format}フォーマットをサポートしていません',
    alertRecordingError: '録画を開始できませんでした',
    alertAudioError: '音楽ファイルの読み込みに失敗しました',
    
    // Footer
    copyright: '© 2025 osamusic. All rights reserved.',
    footerDesc: 'DansaBo - 音楽と一緒に棒人間たちのダンスを楽しもう！',
    githubLink: 'GitHub',
    
    // Language
    language: '言語'
  },
  
  en: {
    // Header
    appTitle: 'DansaBo',
    appSubtitle: 'Dancing Stick Figures',
    
    // Audio Controls
    audioControls: '🎧 Audio Controls',
    selectMusic: 'Select music file',
    fileHint: 'MP3, WAV, M4A, etc.',
    play: '▶️ Play',
    stop: '⏹️ Stop',
    volume: 'Volume',
    
    // Controls
    speed: '⚡ Animation Speed',
    speedLabel: 'Animation Speed:',
    slow: 'Slow',
    fast: 'Fast',
    speedValue: 'Speed',
    figureCount: '👥 Figure Count',
    figureCountLabel: 'Figure Count:',
    sync: '🔄 Dance Sync',
    syncOn: 'Sync ON',
    syncOff: 'Sync OFF',
    syncOnDesc: 'All figures dance in sync',
    syncOffDesc: 'Individual random dancing',
    display: '🌙 Display',
    darkMode: 'Dark Mode',
    showParticles: 'Show Particles',
    background: 'Background:',
    
    // Background patterns
    bgDefault: 'Default',
    bgCosmic: '🌌 Cosmic',
    bgDreamlike: '💫 Dreamlike',
    bgGeometric: '🔷 Geometric',
    bgWaves: '🌊 Waves',
    bgClouds: '☁️ Clouds',
    bgNeon: '💡 Neon',
    bgMatrix: '🔢 Matrix',
    bgRainbow: '🌈 Rainbow',
    bgFire: '🔥 Fire',
    
    // Personality Control
    personalityControl: '🎭 Personality Balance (Advanced)',
    breakdancer: 'Breakdancer',
    waver: 'Waver',
    jumper: 'Jumper',
    spinner: 'Spinner',
    groover: 'Groover',
    total: 'Total',
    reset: 'Reset',
    
    // Video Recorder
    videoRecorder: '🎥 Video Recording',
    aspectRatio: 'Aspect Ratio:',
    aspectRatio16: '16:9 (Landscape)',
    aspectRatio9: '9:16 (Portrait)',
    quality: 'Quality:',
    quality480: '480p (Light)',
    quality720: '720p (Standard)',
    quality1080: '1080p (High)',
    format: 'Format:',
    formatMp4: 'MP4 (Recommended)',
    formatWebm: 'WebM',
    recordingMode: 'Recording Mode:',
    manualStop: 'Manual Stop',
    autoStop: 'Auto Stop',
    recordingDuration: 'Duration:',
    seconds: 'sec',
    startRecording: '🔴 Start Recording',
    startRecordingTimed: '🔴 Start Recording',
    stopRecording: '⏹️ Stop Recording',
    recording: 'Recording...',
    remaining: 'remaining',
    downloadVideo: '💾 Download Video',
    delete: '🗑️ Delete',
    
    // Recording Info
    recordingTips: '📝 Recording Tips:',
    tip1: 'Start playing music before pressing the record button',
    tip2: 'Aim to record during the most exciting dance moments',
    tip3: 'Do not switch to other tabs while recording',
    tip4: 'Use auto-stop mode to easily create short clips',
    tip5: 'Long recordings will result in larger file sizes',
    
    // Alerts
    alertPlayMusic: 'Please start playing music before recording dance',
    alertUnsupported: 'Browser does not support {format} format',
    alertRecordingError: 'Could not start recording',
    alertAudioError: 'Failed to load music file',
    
    // Footer
    copyright: '© 2025 osamusic. All rights reserved.',
    footerDesc: 'DansaBo - Enjoy dancing stick figures with your music!',
    githubLink: 'GitHub',
    
    // Language
    language: 'Language'
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // ブラウザの言語設定から初期値を決定
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith('ja') ? 'ja' : 'en'
  })

  const t = (key) => {
    return translations[language][key] || key
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('dansabo-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}