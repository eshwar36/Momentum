import {freshDevice,rollDay,record,summarize,validateBackup,dayKey} from './deviceModel'
let db, data=freshDevice(), pending=Promise.resolve(), failed=false
const notify=()=>window.dispatchEvent(new CustomEvent('momentum-save-status',{detail:failed?'Could not save on this device. Keep the app open and try editing again.':'Saved on this device'}))
function commit(value){return new Promise((resolve,reject)=>{const tx=db.transaction('device','readwrite');tx.objectStore('device').put(value,'workspace');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Save interrupted'))})}
export async function initializeStorage(){
 db=await new Promise((resolve,reject)=>{const request=indexedDB.open('momentum-offline',1);request.onupgradeneeded=()=>request.result.createObjectStore('device');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})
 const stored=await new Promise((resolve,reject)=>{const request=db.transaction('device').objectStore('device').get('workspace');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})
 data=rollDay(stored?validateBackup(stored):freshDevice())
 await commit(data)
}
export function readSaved(key,initial){return Object.hasOwn(data.state,key)?data.state[key]:initial}
export function writeSaved(key,value){
 if(dayKey()!==data.day){window.dispatchEvent(new CustomEvent('momentum-new-day'));return}
 if(JSON.stringify(data.state[key])===JSON.stringify(value)&&!failed)return
 data=record(data,key,value)
 const snapshot=structuredClone(data)
 window.dispatchEvent(new CustomEvent('momentum-save-status',{detail:'Saving on this device…'}))
 pending=pending.then(async()=>{try{await commit(snapshot);failed=false}catch{failed=true}notify()})
}
export async function flushStorage(){await pending;if(failed)throw new Error('Saving failed. Keep the app open and try editing again.')}
export function getHistory(){if(dayKey()!==data.day)window.dispatchEvent(new CustomEvent('momentum-new-day'));return summarize(data)}
export async function exportBackup(){await pending;return JSON.stringify(data,null,2)}
export async function importBackup(text){if(text.length>10000000)throw new Error('Backup is too large.');const imported=rollDay(validateBackup(JSON.parse(text)));await pending;await commit(imported);data=imported;failed=false}

