import {useEffect,useState} from 'react'
import {Capacitor} from '@capacitor/core'
import App from '../App'
import './DeviceApp.css'
const nativeAndroid=Capacitor.isNativePlatform()
export default function DeviceApp(){
 const [install,setInstall]=useState(null),[message,setMessage]=useState(''),[ready,setReady]=useState(false)
 useEffect(()=>{
  const prompt=e=>{e.preventDefault();setInstall(e)}
  window.addEventListener('beforeinstallprompt',prompt)
  if(!nativeAndroid && 'serviceWorker' in navigator && import.meta.env.PROD)navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready).then(()=>setReady(true)).catch(()=>setMessage('Offline installation is not available in this browser.'))
  return()=>window.removeEventListener('beforeinstallprompt',prompt)
 },[])
 return <>{!nativeAndroid&&<div className="device-bar"><span>On this device · No account needed</span><button onClick={async()=>{if(install){await install.prompt();setInstall(null)}else setMessage('Use your browser menu to install Momentum.')}}>Install app</button>{ready&&<small>Ready for offline use</small>}{message&&<p role="status">{message}</p>}</div>}<App /></>
}
