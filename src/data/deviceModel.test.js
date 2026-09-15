import {test} from 'node:test'
import assert from 'node:assert/strict'
import {freshDevice,record,rollDay,summarize,validateBackup} from './deviceModel.js'
test('offline history and streaks persist through serialization and daily rollover',()=>{
 let data=freshDevice('2026-09-14')
 data=record(data,'habits',[{id:'read',title:'Read',done:true}])
 data=record(data,'tasks',[{id:'a',title:'Done',priority:'Low',done:true},{id:'b',title:'Pending',priority:'Low',done:false}])
 data=record(data,'sleep',8)
 assert.equal(summarize(data).current,1)
 assert.equal(summarize(data).habitStreaks.read,1)
 data=validateBackup(JSON.parse(JSON.stringify(data)))
 data=rollDay(data,'2026-09-15')
 assert.equal(data.state.tasks.length,1)
 assert.equal(data.state.tasks[0].id,'b')
 assert.equal(data.state.sleep,0)
 assert.equal(data.state.habits[0].done,false)
 assert.equal(data.days.length,1)
 data=record(data,'sleep',8)
 assert.equal(summarize(data).current,2)
 assert.equal(summarize(rollDay(data,'2026-09-18')).current,0)
 assert.equal(summarize(data).best,2)
})
test('invalid backups are rejected before replacement',()=>{
 assert.throws(()=>validateBackup({version:2}))
 assert.throws(()=>validateBackup({...freshDevice(),state:{tasks:[{title:'Bad'}]}}))
 assert.throws(()=>validateBackup({...freshDevice(),state:{'water-goal':0}}))
 assert.throws(()=>validateBackup({...freshDevice(),days:[{day:'bad',score:999,habits:[]}]}))
})
