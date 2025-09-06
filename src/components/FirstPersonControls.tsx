import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useKeyboard } from '@/hooks/useKeyboard'
import * as THREE from 'three'

interface FirstPersonControlsProps {
  enabled: boolean
  speed?: number
}

export default function FirstPersonControls({ 
  enabled = true, 
  speed = 5 
}: FirstPersonControlsProps) {
  const { camera, gl } = useThree()
  const keys = useKeyboard()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  
  // Mouse look
  useEffect(() => {
    if (!enabled) return

    let isLocked = false
    const canvas = gl.domElement

    const onMouseMove = (event: MouseEvent) => {
      if (!isLocked) return
      
      const movementX = event.movementX || 0
      const movementY = event.movementY || 0
      
      euler.current.setFromQuaternion(camera.quaternion)
      euler.current.y -= movementX * 0.002
      euler.current.x -= movementY * 0.002
      euler.current.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, euler.current.x))
      
      camera.quaternion.setFromEuler(euler.current)
    }

    const onPointerLockChange = () => {
      isLocked = document.pointerLockElement === canvas
    }

    const onCanvasClick = () => {
      if (!isLocked) {
        canvas.requestPointerLock()
      }
    }

    canvas.addEventListener('click', onCanvasClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('click', onCanvasClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [camera, gl, enabled])

  // Movement
  useFrame((state, delta) => {
    if (!enabled) return

    const speedMultiplier = keys.shift ? 2 : 1
    const moveSpeed = speed * speedMultiplier * delta

    direction.current.set(0, 0, 0)
    
    if (keys.w) direction.current.z -= 1
    if (keys.s) direction.current.z += 1
    if (keys.a) direction.current.x -= 1
    if (keys.d) direction.current.x += 1
    if (keys.space) direction.current.y += 1

    direction.current.normalize()
    direction.current.multiplyScalar(moveSpeed)
    
    // Apply camera rotation to movement direction
    const cameraDirection = direction.current.clone()
    cameraDirection.applyQuaternion(camera.quaternion)
    
    // Only apply Y movement from space, not from camera rotation
    cameraDirection.y = direction.current.y
    
    camera.position.add(cameraDirection)
  })

  return null
}