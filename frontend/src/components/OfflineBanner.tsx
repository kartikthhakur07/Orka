import React from 'react'
import { AlertTriangle } from 'lucide-react'

export function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3">
      <AlertTriangle size={18} />
      <div>
        <p style={{ fontWeight: 600, marginBottom: 2 }}>Connecting to Live Backend (Render)</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>
          If backend is sleeping on free tier, it takes ~30s to wake up. Retrying automatically...
        </p>
      </div>
    </div>
  )
}

export default OfflineBanner

