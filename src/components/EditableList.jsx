import { useState } from 'react'
import { Card, Heading } from './UI'
export default function EditableList({kind,items,setItems}) {
 const isTask=kind==='task'
 const [draft,setDraft]=useState(null),[filter,setFilter]=useState('All')
 const blank={title:'',category:'Personal',priority:'Medium',subtitle:'',icon:'check',done:false,streak:0}
 function save(e){e.preventDefault();if(!draft.title.trim())return;const item={...draft,title:draft.title.trim()};setItems(old=>draft.id?old.map(x=>x.id===draft.id?item:x):[...old,{...item,id:crypto.randomUUID()}]);setDraft(null)}
 return <Card id={isTask?'tasks':'habits'}><Heading title={isTask?'Today’s tasks':'Build your rhythm'} subtitle={isTask?'Your priorities, your way.':'Create habits that fit your life.'}><button className="edit-button" onClick={()=>setDraft(blank)}>+ Add {kind}</button></Heading>
 {isTask&&<div className="tabs">{['All','Pending','Completed'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)} className={filter===f?'active':''}>{f}</button>)}</div>}
 <div>{items.filter(x=>!isTask||filter==='All'||(filter==='Completed'?x.done:!x.done)).map(item=><div className={`task-row ${item.done?'done':''}`} key={item.id}><label className="task-label"><input type="checkbox" checked={item.done} onChange={()=>setItems(old=>old.map(x=>x.id===item.id?{...x,done:!x.done}:x))}/><span><strong>{item.title}</strong><small>{isTask?`${item.category} · ${item.priority}`:item.subtitle}</small></span></label><button className="edit-button" aria-label={`Edit ${item.title}`} onClick={()=>setDraft({...item})}>Edit</button><button className="edit-button" aria-label={`Delete ${item.title}`} onClick={()=>setItems(old=>old.filter(x=>x.id!==item.id))}>Delete</button></div>)}</div>
 {!items.length&&<p className="empty">No {isTask?'tasks':'habits'} yet. Add your first one.</p>}
 {draft&&<form className="editor-form" onSubmit={save}><h3>{draft.id?'Edit':'Add'} {kind}</h3><label>Name<input id={isTask?'task-title':undefined} autoFocus required maxLength={160} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label>{isTask?<><label>Category<input value={draft.category} maxLength={60} onChange={e=>setDraft({...draft,category:e.target.value})}/></label><label>Priority<select value={draft.priority} onChange={e=>setDraft({...draft,priority:e.target.value})}>{['Low','Medium','High'].map(p=><option key={p}>{p}</option>)}</select></label></>:<label>Description<input value={draft.subtitle} maxLength={160} onChange={e=>setDraft({...draft,subtitle:e.target.value})}/></label>}<div className="editor-actions"><button className="primary">Save {kind}</button><button type="button" className="edit-button" onClick={()=>setDraft(null)}>Cancel</button></div></form>}
 </Card>
}
