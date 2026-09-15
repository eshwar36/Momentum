import {useEffect,useState} from 'react'
import {getHistory} from '../data/storage'
export function useHistory(){
 const [history,setHistory]=useState(getHistory)
 useEffect(()=>{const refresh=()=>setHistory(getHistory());window.addEventListener('momentum-save-status',refresh);const timer=setInterval(refresh,60000);return()=>{clearInterval(timer);window.removeEventListener('momentum-save-status',refresh)}},[])
 return history
}
