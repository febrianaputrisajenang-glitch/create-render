import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text3D, Center } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })
  
  return (
    <mesh ref={meshRef} position={[-2, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff" 
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.5) * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial 
        color="#00ff88" 
        emissive="#00ff88" 
        emissiveIntensity={0.1}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  )
}

function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 1.5, 0]}>
      <torusGeometry args={[0.6, 0.2, 16, 100]} />
      <meshStandardMaterial 
        color="#8a2be2" 
        emissive="#8a2be2" 
        emissiveIntensity={0.15}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function Hero3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        className="bg-viewport"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00ffff" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#00ff88" />
        
        <AnimatedCube />
        <AnimatedSphere />
        <AnimatedTorus />
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}