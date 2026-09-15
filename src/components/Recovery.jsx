import {useState} from 'react'
async function accountRequest(route,body={}) {
  const response=await fetch(`/api/auth/${route}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(12000)})
  const result=await response.json()
  if(!response.ok) throw new Error(result.error || 'Request failed. Try again.')
  return result
}
export function Verification({user}) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false)
  if(user.verified) return <span>Email verified</span>
  return <><button disabled={busy} onClick={async()=>{setBusy(true);try{const data=await accountRequest('send-verification');setMessage(data.message)}catch(e){setMessage(e.message)}finally{setBusy(false)}}}>Verify email</button>{message&&<span role="status">{message}</span>}</>
}
export default function Recovery({mode,token,onBack}) {
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[done,setDone]=useState(false)
  async function submit(e) {
    e.preventDefault();setMessage('')
    if(mode==='reset' && password!==confirm){setMessage('The passwords do not match.');return}
    setBusy(true)
    try {const data=await accountRequest(mode,{email,password,token});setMessage(data.message);setDone(true);setPassword('');setConfirm('')}
    catch(error){setMessage(error.message)}finally{setBusy(false)}
  }
  return <div className="account-screen"><section className="account-card"><div className="account-brand">momentum.</div><h1>{mode==='forgot'?'Reset your password':mode==='reset'?'Choose a new password':'Verify your email'}</h1><form onSubmit={submit}>{mode==='forgot'&&<label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label>}{mode==='reset'&&!done&&<><label>New password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirm new password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label></>}{message&&<p role="status">{message}</p>}{!done&&<button className="account-submit" disabled={busy}>{busy?'Please wait…':mode==='forgot'?'Send reset link':mode==='reset'?'Save new password':'Confirm email'}</button>}</form><button className="account-switch" onClick={onBack}>Back to Momentum</button></section></div>
}

