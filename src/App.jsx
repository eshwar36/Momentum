import { useState, useEffect } from 'react'
import { useSavedState } from './hooks/useSavedState'
import { Sidebar, Topbar, Card, Icon } from './components/UI'
import { Tasks, Habits, Wellness, Weekly } from './components/Trackers'
import { initialTasks, initialHabits } from './data/dashboard'
import BodyRecomposition from './components/BodyRecomposition'
import DailyInspiration from './components/DailyInspiration'
import FocusTimer from './components/FocusTimer'
import './App.css'
import {useHistory} from './hooks/useHistory'
import {weekDates} from './data/calendar'
import {handleAppBack} from './data/backNavigation'
const views={main:'Overview',tasks:'Daily tasks',habits:'My habits',wellness:'Health & wellness',recomposition:'Body recomposition',weekly:'Weekly insights',focus:'Focus timer'}
function currentView(){const hash=window.location.hash.slice(1);const key=hash==='inspiration'?'focus':hash;return Object.hasOwn(views,key)?key:'main'}
export default function App(){
 const history=useHistory()
 const [newDay,setNewDay]=useState(false)
 useEffect(()=>{const update=()=>setNewDay(true);window.addEventListener('momentum-new-day',update);return()=>window.removeEventListener('momentum-new-day',update)},[])
 const [view,setView]=useState(currentView)


 const [tasks,setTasks]=useSavedState('tasks',initialTasks),[habits,setHabits]=useSavedState('habits',initialHabits)
 const [water,setWater]=useSavedState('water-ml',0),[waterGoal,setWaterGoal]=useSavedState('water-goal',2000)
 const [sleep,setSleep]=useSavedState('sleep',0)
 const [workout,setWorkout]=useSavedState('workout-complete',false)
 const [menu,setMenu]=useState(false),[dark,setDark]=useSavedState('dark',false),[saveStatus,setSaveStatus]=useState('Saved on this device')
 useEffect(()=>{
  window.momentumHandleBack=()=>handleAppBack({
   closeOverlay:()=>!window.dispatchEvent(new Event('momentum-back-overlay',{cancelable:true})),
   closeDialog:()=>{const dialog=document.querySelector('dialog[open]');if(!dialog)return false;dialog.close();return true},
   menuOpen:menu,closeMenu:()=>setMenu(false),view:currentView(),goHome:()=>{window.location.hash='main'}
  })
  return()=>{delete window.momentumHandleBack}
 },[menu])
 useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'})},[view])
 useEffect(()=>{const status=e=>setSaveStatus(e.detail);window.addEventListener('momentum-save-status',status);return()=>window.removeEventListener('momentum-save-status',status)},[])
 useEffect(()=>{const navigate=()=>{setView(currentView());setMenu(false)};window.addEventListener('hashchange',navigate);return()=>window.removeEventListener('hashchange',navigate)},[])
 const complete=tasks.filter(t=>t.done).length
 const score=Math.round((complete/Math.max(1,tasks.length)+habits.filter(h=>h.done).length/Math.max(1,habits.length)+Math.min(water/waterGoal,1)+Number(workout)+Math.min(sleep/8,1))/5*100)
 return <div className={`app ${dark?'dark':''}`}><a className="skip" href="#main">Skip to dashboard</a><Sidebar active={view} open={menu} close={()=>setMenu(false)}/><div className="workspace"><Topbar title={views[view]} toggle={()=>setMenu(!menu)} menu={menu} dark={dark} theme={()=>setDark(!dark)}/><main id="main" className="page-workspace"><section className="welcome"><div><div className="eyebrow">YOUR DAILY RESET</div><h1>{view==='main'?'Make today count':views[view]}<span>.</span></h1><p>{view==='main'?'Small steps today. A stronger you tomorrow.':'Your space to focus on one thing at a time.'}</p></div></section><p className="sample" role="status">{newDay?<>A new day has started. <button onClick={()=>window.location.reload()}>Load today</button></>:saveStatus}</p><div className="view-content"><div hidden={view!=='main'}><section className="overview" aria-label="Daily overview"><div className="score-card"><div><div className="eyebrow">TODAY’S MOMENTUM</div><h2>{score>=80?'You’re on a roll.':'Keep showing up.'}</h2><p>Every little win moves you forward.</p><small>Your daily goals, all in one score</small></div><div className="ring" role="img" aria-label={`${score}% daily progress`}><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="51"/><circle className="fill" cx="60" cy="60" r="51" strokeDasharray={`${score*3.2044} 320.44`}/></svg><div><strong>{score}<small>%</small></strong><span>of daily goals</span></div></div></div><DailyInspiration compact/><Card className="stat"><span className="tile orange"><Icon name="flame"/></span><p>Current streak</p><strong>{history?.current??0} <small>days</small></strong><div className="streak-days">{'MTWTFSS'.split('').map((d,i)=><span key={i} className={history?.days.some(d=>d.day===weekDates(history.day)[i]&&d.score>0)?'active':''}>{d}</span>)}</div><small>Personal best: {history?.best??0} days · Any recorded progress counts</small></Card></section><div className="overview-links">{Object.entries(views).filter(([key])=>key!=='main').map(([key,title])=><a key={key} href={'#'+key}><span>{title}</span><Icon name="arrow" size={17}/></a>)}</div></div><div className="separate-views"><div hidden={view!=='tasks'}><Tasks tasks={tasks} setTasks={setTasks}/></div><div hidden={view!=='habits'}><Habits habits={habits} setHabits={setHabits} history={history}/></div><div hidden={view!=='wellness'}><Wellness {...{water,setWater,waterGoal,setWaterGoal,workout,setWorkout,sleep,setSleep}}/></div><div hidden={view!=='recomposition'}><BodyRecomposition/></div><div hidden={view!=='weekly'}><Weekly history={history}/></div><div hidden={view!=='focus'}><FocusTimer/></div></div></div><footer>Built around your better everyday.<span>One step at a time ↗</span></footer></main></div></div>
}











