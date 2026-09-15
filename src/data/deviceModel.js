export const dayKey=()=>new Date().toLocaleDateString('en-CA')
const shift=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10)
export function freshDevice(day=dayKey()){return {version:1,day,state:{},days:[]}}
export function rollDay(data,day=dayKey()) {
  if(day<=data.day)return data
  return {...data,day,state:{...data.state,tasks:(data.state.tasks||[]).filter(t=>!t.done),habits:(data.state.habits||[]).map(h=>({...h,done:false,streak:0})),'water-ml':0,sleep:0,'workout-complete':false}}
}
export function record(data,key,value) {
  const next={...data,state:{...data.state,[key]:value}}
  if(!['tasks','habits','water-ml','water-goal','sleep','workout-complete'].includes(key))return next
  const s=next.state,fraction=a=>(a||[]).filter(x=>x.done).length/Math.max(1,(a||[]).length)
  const score=Math.round((fraction(s.tasks)+fraction(s.habits)+Math.min((s['water-ml']||0)/(s['water-goal']||2000),1)+Number(!!s['workout-complete'])+Math.min((s.sleep||0)/8,1))/5*100)
  next.days=[...data.days.filter(d=>d.day!==data.day),{day:data.day,score,habits:(s.habits||[]).filter(h=>h.done).map(h=>String(h.id))}].sort((a,b)=>a.day.localeCompare(b.day))
  return next
}
export function summarize(data) {
  const byDay=new Map(data.days.map(d=>[d.day,d]))
  const streak=predicate=>{let day=data.day,count=0;if(!predicate(byDay.get(day)))day=shift(day,-1);while(predicate(byDay.get(day))){count++;day=shift(day,-1)}return count}
  let best=0,run=0,previous=''
  for(const row of data.days){run=row.score>0?(previous===shift(row.day,-1)?run+1:1):0;best=Math.max(best,run);previous=row.day}
  return {day:data.day,zone:Intl.DateTimeFormat().resolvedOptions().timeZone,days:data.days,current:streak(d=>d?.score>0),best,habitStreaks:Object.fromEntries((data.state.habits||[]).map(h=>[h.id,streak(d=>d?.habits.includes(String(h.id)))]))}
}
export function validateBackup(data) {
  const object=v=>v&&typeof v==='object'&&!Array.isArray(v)
  const text=v=>typeof v==='string'
  const date=v=>text(v)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))
  if(!object(data)||data.version!==1||!date(data.day)||!object(data.state)||!Array.isArray(data.days))throw new Error('This is not a Momentum device backup.')
  for(const key of ['tasks','habits'])if(data.state[key]!==undefined&&(!Array.isArray(data.state[key])||!data.state[key].every(v=>object(v)&&text(v.title)&&typeof v.done==='boolean'&&(key!=='tasks'||['Low','Medium','High'].includes(v.priority)))))throw new Error('Invalid tasks or habits in backup.')
  for(const key of ['water-ml','water-goal','sleep'])if(data.state[key]!==undefined&&(typeof data.state[key]!=='number'||!Number.isFinite(data.state[key])||data.state[key]<0||(key==='water-goal'&&data.state[key]===0)))throw new Error('Invalid wellness values in backup.')
  for(const key of ['dark','workout-complete'])if(data.state[key]!==undefined&&typeof data.state[key]!=='boolean')throw new Error('Invalid setting in backup.')
  for(const key of ['recomp-baseline','recomp-current'])if(data.state[key]!==undefined&&(!object(data.state[key])||!['weight','waist','strength'].every(k=>text(data.state[key][k])||typeof data.state[key][k]==='number')))throw new Error('Invalid measurements in backup.')
  if(data.state.profile&&!['name','bio','goal'].every(k=>text(data.state.profile[k])))throw new Error('Invalid profile in backup.')
  for(const key of ['recomp-notes','recomp-exercise'])if(data.state[key]!==undefined&&!text(data.state[key]))throw new Error('Invalid notes in backup.')
  if(data.state['recomp-entries']!==undefined&&(!Array.isArray(data.state['recomp-entries'])||!data.state['recomp-entries'].every(v=>object(v)&&object(v.current)&&object(v.baseline)&&text(v.date)&&text(v.exercise))))throw new Error('Invalid check-ins in backup.')
  if(!data.days.every(d=>object(d)&&date(d.day)&&Number.isFinite(d.score)&&d.score>=0&&d.score<=100&&Array.isArray(d.habits)&&d.habits.every(text)))throw new Error('Invalid daily history in backup.')
  return data
}
