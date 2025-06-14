import { useState } from 'react'

function SyncControl({ onSyncChange, initialSync = false }) {
  const [isSync, setIsSync] = useState(initialSync)

  const handleSyncChange = (e) => {
    const newSync = e.target.checked
    setIsSync(newSync)
    onSyncChange(newSync)
  }

  return (
    <div className="sync-control">
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
          {isSync ? 'Manual Sync' : 'Auto Sync'}
        </span>
      </label>
      <div className="sync-description">
        {isSync 
          ? 'Always synchronized dancing' 
          : 'Auto-sync on beat drops & high energy'
        }
      </div>
    </div>
  )
}

export default SyncControl