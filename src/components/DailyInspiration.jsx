import { useEffect, useState } from 'react'
import { Card } from './UI'
import { getDailyMessage } from '../data/dailyMessages'

export default function DailyInspiration({ compact = false }) {
  const [message, setMessage] = useState(() => getDailyMessage())
  useEffect(() => {
    let timer
    function refresh() {
      clearTimeout(timer)
      setMessage(getDailyMessage())
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = setTimeout(refresh, midnight - now + 100)
    }
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return <Card id={compact ? 'overview-inspiration' : 'inspiration'} className={`motivation ${compact ? 'compact-inspiration' : ''}`}>
    <div className="eyebrow">{compact ? 'DAILY INSPIRATION' : 'A LITTLE PERSPECTIVE'}</div>
    <div className="quote-mark" aria-hidden="true">“</div>
    <blockquote>{message.quote}</blockquote>
    {!compact && <p>{message.note}</p>}
    <div className="quote-footer">{!compact && <><strong>M</strong><span>Small steps. Big progress.</span></>}<span className="inspiration-day">Day {message.day} of 365</span></div>
  </Card>
}

