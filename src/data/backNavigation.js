export function handleAppBack({closeOverlay,closeDialog,menuOpen,closeMenu,view,goHome}) {
  if(closeOverlay())return true
  if(closeDialog())return true
  if(menuOpen){closeMenu();return true}
  if(view!=='main'){goHome();return true}
  return false
}
