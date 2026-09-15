import {test} from 'node:test'
import assert from 'node:assert/strict'
import {handleAppBack} from './backNavigation.js'
const base=()=>({closeOverlay:()=>false,closeDialog:()=>false,menuOpen:false,closeMenu:()=>{},view:'main',goHome:()=>{}})
test('each section returns home before allowing Android to leave',()=>{
 for(const view of ['tasks','habits','wellness','recomposition','weekly','focus']){
  let navigated=false
  assert.equal(handleAppBack({...base(),view,goHome:()=>{navigated=true}}),true)
  assert.equal(navigated,true)
 }
 assert.equal(handleAppBack(base()),false)
})
test('overlays and menu close before navigating home',()=>{
 const noHome=()=>assert.fail('must not navigate behind overlay')
 assert.equal(handleAppBack({...base(),view:'focus',closeOverlay:()=>true,goHome:noHome}),true)
 assert.equal(handleAppBack({...base(),view:'tasks',closeDialog:()=>true,goHome:noHome}),true)
 let closed=false
 assert.equal(handleAppBack({...base(),view:'weekly',menuOpen:true,closeMenu:()=>{closed=true},goHome:noHome}),true)
 assert.equal(closed,true)
})
