import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function SyncControl({ onSyncChange, initialSync = false, autoSyncControl = false, onAutoSyncChange }) {
  const { t } = useLanguage()
  const [isSync, setIsSync] = useState(initialSync)

  const handleSyncChange = (e) => {
    const newSync = e.target.checked
    setIsSync(newSync)
    onSyncChange(newSync)
  }

  const handleAutoSyncChange = (e) => {
    const newAutoSync = e.target.checked
    onAutoSyncChange(newAutoSync)
  }

  return (
    <div className="control-panel sync-control">
      <h3>{t('sync')}</h3>
      <label htmlFor="sync-toggle" className="sync-label">
        <input
          id="sync-toggle"
          type="checkbox"
          checked={isSync}
          onChange={handleSyncChange}
          className="sync-checkbox"
        />
        <span className="sync-slider"></span>
        <span className="sync-text">
          {isSync ? t('syncOn') : t('syncOff')}
        </span>
      </label>
      <div className="sync-description">
        {isSync ? t('syncOnDesc') : t('syncOffDesc')}
      </div>
      
      <label htmlFor="auto-sync-toggle" className="sync-label">
        <input
          id="auto-sync-toggle"
          type="checkbox"
          checked={autoSyncControl}
          onChange={handleAutoSyncChange}
          className="sync-checkbox"
          disabled={!onAutoSyncChange}
        />
        <span className="sync-slider"></span>
        <span className="sync-text">
          {t('autoSync')}
        </span>
      </label>
      <div className="sync-description">
        {t('autoSyncDesc')}
      </div>
    </div>
  )
}

export default SyncControl