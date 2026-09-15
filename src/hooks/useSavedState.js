import { useState, useEffect } from 'react'
import { readSaved, writeSaved } from '../data/storage'
export function useSavedState(key, initial) {
  const [value, setValue] = useState(() => {
    return readSaved(key, initial)
  })
  useEffect(() => {
    writeSaved(key, value)
  }, [key, value])
  return [value, setValue]
}
