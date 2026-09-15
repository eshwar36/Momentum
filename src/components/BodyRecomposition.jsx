import { useState } from 'react'
import { useSavedState } from '../hooks/useSavedState'
import { Card, Heading, Icon } from './UI'
import './BodyRecomposition.css'

const fields = [
  { key: 'weight', label: 'Body weight', unit: 'kg', step: '0.1' },
  { key: 'waist', label: 'Waist measurement', unit: 'cm', step: '0.1' },
  { key: 'strength', label: 'Strength benchmark', unit: 'kg', step: '0.5' },
]
const empty = { weight: '', waist: '', strength: '' }

export default function BodyRecomposition() {
  const [baseline, setBaseline] = useSavedState('recomp-baseline',empty)
  const [current, setCurrent] = useSavedState('recomp-current',empty)
  const [exercise, setExercise] = useSavedState('recomp-exercise','Squat · 5 reps')
  const [notes, setNotes] = useSavedState('recomp-notes','')
  const [entries, setEntries] = useSavedState('recomp-entries',[])
 const [editing,setEditing]=useState(null)
  const [message, setMessage] = useState('')

  function logCheckIn(event) {
    event.preventDefault()
    const entry={id:editing||crypto.randomUUID(),date:editing?entries.find(x=>x.id===editing).date:new Date().toLocaleString(),baseline:{...baseline},current:{...current},exercise:exercise.trim(),notes:notes.trim()}
    setEntries(previous=>editing?previous.map(x=>x.id===editing?entry:x):[entry,...previous]);setEditing(null)
    setMessage('Check-in added. Check the save status above.')
  }

  return <Card id="recomposition" className="recomp-card">
    <Heading title="Body recomposition" subtitle="Your measurements, training progress, and weekly reflections."><span className="tile purple"><Icon name="activity" /></span></Heading>
    <div className="recomp-intro"><div><span className="eyebrow">FITNESS · THE LONG VIEW</span><h3>See more than a number on the scale.</h3><p>Keep weight, waist, and a consistent strength benchmark side by side. These logs track changes; they don’t measure muscle gain or fat loss.</p></div><span className="recomp-tag">Weekly check-in</span></div>
    <form onSubmit={logCheckIn}>
      <label className="recomp-exercise">Strength exercise & rep target<input value={exercise} onChange={event => setExercise(event.target.value)} maxLength={80} required placeholder="e.g. Squat · 5 reps" /></label>
      <div className="recomp-metrics">{fields.map(field => {
        const ready = baseline[field.key] !== '' && current[field.key] !== ''
        const delta = ready ? Number(current[field.key]) - Number(baseline[field.key]) : 0
        return <div className="recomp-metric" key={field.key}><h3>{field.label}<span>{field.unit}</span></h3><div className="recomp-inputs">{[['Starting', baseline, setBaseline], ['Current', current, setCurrent]].map(([label, values, setter]) => <label key={label}>{label}<input type="number" aria-label={`${label} ${field.label.toLowerCase()} (${field.unit})`} min={field.key === 'strength' ? '0' : '0.1'} step={field.step} value={values[field.key]} onChange={event => setter(previous => ({ ...previous, [field.key]: event.target.value }))} placeholder="—" required /></label>)}</div><p className="recomp-delta">{ready ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} ${field.unit} from starting point` : 'Add both values to compare'}</p></div>
      })}</div>
      <label className="recomp-notes">Weekly reflection<textarea value={notes} onChange={event => setNotes(event.target.value)} maxLength={1000} rows={3} placeholder="How did training feel? What was consistent? What will you adjust next week?" /></label>
      <div className="recomp-actions"><span>Saved to your account</span><button className="primary" type="submit"><Icon name="plus" size={17} /> {editing?'Save changes':'Log check-in'}</button></div>
      <p className="recomp-status" role="status">{message}</p>
    </form>
    <div className="recomp-history"><h3>Check-in history <span>{entries.length}</span></h3>{entries.length === 0 ? <p className="recomp-empty">Your first check-in starts the story. Add your measurements above.</p> : <ul>{entries.map(entry => <li key={entry.id}><strong>{entry.date}</strong><div className="recomp-history-values">{fields.map(field => <span key={field.key}>{field.label}: <b>{entry.current[field.key]} {field.unit}</b><small>Starting: {entry.baseline[field.key]} {field.unit}</small></span>)}</div><p>{entry.exercise}</p>{entry.notes && <p className="recomp-saved-note">{entry.notes}</p>}</li>)}</ul>}</div>
  </Card>
}

