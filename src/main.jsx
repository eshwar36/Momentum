import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import DeviceApp from './components/DeviceApp'
import {initializeStorage} from './data/storage'
const root=createRoot(document.getElementById('root'))
async function start(){root.render(<p style={{padding:32}}>Opening your device storage…</p>);try{await initializeStorage();root.render(<StrictMode><DeviceApp/></StrictMode>)}catch{root.render(<div style={{padding:32}}><h1>Device storage is unavailable</h1><p>Use a regular browser window and allow app storage, then try again.</p><button onClick={start}>Try again</button></div>)}}
start()
