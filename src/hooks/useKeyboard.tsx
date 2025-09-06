import { useEffect, useState } from 'react'

interface KeyboardState {
  w: boolean
  a: boolean
  s: boolean
  d: boolean
  shift: boolean
  space: boolean
}

export function useKeyboard() {
  const [keys, setKeys] = useState<KeyboardState>({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      setKeys(prev => ({
        ...prev,
        w: key === 'w' ? true : prev.w,
        a: key === 'a' ? true : prev.a,
        s: key === 's' ? true : prev.s,
        d: key === 'd' ? true : prev.d,
        shift: key === 'shift' ? true : prev.shift,
        space: key === ' ' ? true : prev.space
      }))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      setKeys(prev => ({
        ...prev,
        w: key === 'w' ? false : prev.w,
        a: key === 'a' ? false : prev.a,
        s: key === 's' ? false : prev.s,
        d: key === 'd' ? false : prev.d,
        shift: key === 'shift' ? false : prev.shift,
        space: key === ' ' ? false : prev.space
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}