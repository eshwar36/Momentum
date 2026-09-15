import { useRef, useState } from 'react'
import { useSavedState } from '../hooks/useSavedState'
import './Profile.css'

export default function Profile() {
  const [profile, setProfile] = useSavedState('profile', { name: 'My profile', bio: '', goal: '' })
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  const dialog = useRef(null)
  const initials = profile.name.trim().split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase() || 'ES'
  function open() { setDraft(profile); setSaved(false); dialog.current.showModal() }
  function save(event) {
    event.preventDefault()
    if (!draft.name.trim()) return
    setProfile({ name: draft.name.trim(), bio: draft.bio.trim(), goal: draft.goal.trim() })
    setSaved(true)
  }
  return <>
    <button className="avatar small profile-trigger" aria-label="Open my profile" aria-haspopup="dialog" onClick={open}>{profile.name === 'Eshwar' ? 'ES' : initials}</button>
    <dialog className="profile-dialog" ref={dialog} aria-labelledby="profile-title" onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current.close() } }}>
      <div className="profile-dialog-heading"><div><div className="eyebrow">PERSONAL WORKSPACE</div><h2 id="profile-title">My profile</h2></div><button type="button" className="icon-button" aria-label="Close profile" onClick={() => dialog.current.close()}>✕</button></div>
      <p className="profile-description">A little about you and what you’re working toward.</p>
      <form onSubmit={save} onChange={() => setSaved(false)}>
        <label>Your name<input autoFocus required maxLength={80} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} autoComplete="name" /></label>
        <label>About me <span>Optional</span><textarea rows={3} maxLength={500} placeholder="Your interests, studies, or work…" value={draft.bio} onChange={event => setDraft({ ...draft, bio: event.target.value })} /></label>
        <label>My main goal <span>Optional</span><input maxLength={200} placeholder="What would you like to make progress on?" value={draft.goal} onChange={event => setDraft({ ...draft, goal: event.target.value })} /></label>
        <p className="profile-local">Stored on this browser only.</p>
        <div className="profile-dialog-actions"><span role="status">{saved ? 'Profile saved.' : ''}</span><button className="primary" type="submit">Save profile</button></div>
      </form>
    </dialog>
  </>
}

