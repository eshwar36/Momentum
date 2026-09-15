import { useEffect, useState } from 'react'
import App from '../App'
import { initializeStorage, flushStorage } from '../data/storage'
import './Account.css'
import Recovery, {Verification} from './Recovery'
export default function Account() {
  const [recoveryMode,setRecoveryMode]=useState(()=>/^(reset|verify)=/.test(window.location.hash.slice(1))?window.location.hash.slice(1).split('=')[0]:'')
  const [actionToken]=useState(()=>window.location.hash.slice(1).split('=')[1]||'')
  const [user,setUser] = useState(null), [loading,setLoading] = useState(true), [busy,setBusy] = useState(false)
  const [mode,setMode] = useState('login'), [first,setFirst] = useState(false), [error,setError] = useState('')
  const [email,setEmail] = useState(''), [password,setPassword] = useState('')
  async function load() {
    try {
      const response = await fetch('/api/auth/me', {signal:AbortSignal.timeout(8000)})
      if (!response.ok) throw new Error('Momentum couldn’t connect. Start the backend and try again.')
      const data = await response.json()
      setFirst(data.firstAccount)
      if (data.firstAccount) setMode('register')
      if (data.user) { if(data.mailMode!=='email'||data.user.verified) await initializeStorage(data.user.id); setUser({...data.user,needsVerification:data.mailMode==='email'&&!data.user.verified}) }
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  // State changes in load happen after the session request completes.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(()=>{load()},[])
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const response = await fetch(`/api/auth/${mode}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password}),signal:AbortSignal.timeout(10000)})
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.')
      setPassword(''); await load()
    } catch(e) { setError(e.message) }
    finally { setBusy(false) }
  }
  async function logout() {
    setBusy(true); setError('')
    try {
      await flushStorage()
      const response = await fetch('/api/auth/logout', {method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(8000)})
      if (!response.ok) throw new Error('Sign out failed. Try again.')
      window.location.reload()
    } catch(e) { setError(e.message); setBusy(false) }
  }
  if (recoveryMode) return <Recovery mode={recoveryMode} token={actionToken} onBack={()=>{window.location.hash='main';window.location.reload()}}/>
  if (loading) return <div className="account-screen"><p role="status">Connecting to Momentum…</p></div>
  if (user) return <><div className="account-bar"><span>{user.email}</span><Verification user={user}/><button disabled={busy} onClick={logout}>Sign out</button>{error&&<span role="alert">{error}</span>}</div>{user.needsVerification?<div className="account-screen"><p>Verify your email to open your workspace, then refresh this page.</p></div>:<App />}</>
  return <div className="account-screen"><section className="account-card"><div className="account-brand">momentum<span>.</span></div><h1>{mode==='register'?'Your next chapter starts here.':'Welcome back.'}</h1><p>{mode==='register'?'Create your personal account to save your progress.':'Sign in to your personal workspace.'}</p>{first&&<p className="account-note">Your first account will keep the progress already saved on this computer.</p>}<form onSubmit={submit}><label>Email<input type="email" autoComplete="username" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete={mode==='register'?'new-password':'current-password'} required minLength={12} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label><small>Use 12 to 128 characters.</small>{error&&<p role="alert" className="account-error">{error}</p>}<button className="account-submit" disabled={busy}>{busy?'Please wait…':mode==='register'?'Create account':'Sign in'}</button></form><button className="account-switch" disabled={busy} onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setPassword('')}}>{mode==='register'?'Already have an account? Sign in':'New here? Create an account'}</button>{error&&<button className="account-switch" onClick={load}>Check connection again</button>}<button className="account-switch" onClick={()=>setRecoveryMode('forgot')}>Forgot password?</button><small className="account-local">Accounts are stored on this computer.</small></section></div>
}

