import {Capacitor} from '@capacitor/core'
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem'
import {Share} from '@capacitor/share'
export const nativeAndroid=Capacitor.isNativePlatform()
export async function shareBackup(content){
 const name=`momentum-backup-${Date.now()}.json`
 const file=await Filesystem.writeFile({path:name,data:content,directory:Directory.Cache,encoding:Encoding.UTF8})
 await Share.share({title:'Momentum backup',url:file.uri,dialogTitle:'Save your Momentum backup'})
}
