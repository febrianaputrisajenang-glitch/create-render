import { useRef } from 'react'
import * as THREE from 'three'

// Player/Character model components
export function BasicPlayer({ 
  position, 
  rotation, 
  scale, 
  color = '#4A90E2',
  isSelected = false 
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color?: string
  isSelected?: boolean
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#FFDBAC" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 1, 0.3]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.4, 0.9, 0]}>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial 
          color="#FFDBAC" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.4, 0.9, 0]}>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial 
          color="#FFDBAC" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          roughness={0.7}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          roughness={0.7}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.15, -0.4, 0.1]}>
        <boxGeometry args={[0.18, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.15, -0.4, 0.1]}>
        <boxGeometry args={[0.18, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          wireframe={isSelected}
        />
      </mesh>
    </group>
  )
}

export function Knight({ 
  position, 
  rotation, 
  scale, 
  isSelected = false 
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  isSelected?: boolean
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Body - Armored */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.7, 1.1, 0.4]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.8}
          roughness={0.3}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.9}
          roughness={0.2}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Visor */}
      <mesh position={[0, 1.6, 0.22]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.1}
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Arms - Armored */}
      <mesh position={[-0.45, 0.9, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.7}
          roughness={0.4}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.45, 0.9, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.7}
          roughness={0.4}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Shield */}
      <mesh position={[-0.6, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.5, 0.8, 0.1]} />
        <meshStandardMaterial 
          color="#8B0000" 
          metalness={0.2}
          roughness={0.6}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Sword */}
      <mesh position={[0.7, 1.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.05, 1, 0.05]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.9}
          roughness={0.1}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Legs - Armored */}
      <mesh position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.7}
          roughness={0.4}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.7}
          roughness={0.4}
          wireframe={isSelected}
        />
      </mesh>
    </group>
  )
}

export function Wizard({
  position, 
  rotation, 
  scale, 
  isSelected = false 
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  isSelected?: boolean
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#FFDBAC" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Beard */}
      <mesh position={[0, 1.3, 0.15]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.9}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Hat */}
      <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.15, 0.6, 8]} />
        <meshStandardMaterial 
          color="#4B0082" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Stars on hat */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.sin(i * Math.PI * 2 / 3) * 0.12,
            1.6 + i * 0.1,
            Math.cos(i * Math.PI * 2 / 3) * 0.12
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700"
            emissiveIntensity={0.3}
            wireframe={isSelected}
          />
        </mesh>
      ))}
      
      {/* Robe */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial 
          color="#4B0082" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.4, 1, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial 
          color="#4B0082" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.4, 1, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial 
          color="#4B0082" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Staff */}
      <mesh position={[0.6, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Crystal on staff */}
      <mesh position={[0.6, 2.5, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#00FFFF" 
          emissive="#00FFFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          wireframe={isSelected}
        />
      </mesh>
    </group>
  )
}

export function Robot({
  position, 
  rotation, 
  scale, 
  isSelected = false 
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  isSelected?: boolean
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial 
          color="#36454F" 
          metalness={0.9}
          roughness={0.1}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 1.55, 0.21]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000"
          emissiveIntensity={0.8}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.1, 1.55, 0.21]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000"
          emissiveIntensity={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8}
          roughness={0.2}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 1, 0.4]} />
        <meshStandardMaterial 
          color="#36454F" 
          metalness={0.8}
          roughness={0.2}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Chest Panel */}
      <mesh position={[0, 0.9, 0.21]}>
        <boxGeometry args={[0.3, 0.5, 0.02]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00"
          emissiveIntensity={0.3}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Arms - Mechanical */}
      <mesh position={[-0.4, 0.9, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial 
          color="#36454F" 
          metalness={0.9}
          roughness={0.1}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.4, 0.9, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial 
          color="#36454F" 
          metalness={0.9}
          roughness={0.1}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Legs - Mechanical */}
      <mesh position={[-0.15, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial 
          color="#36454F" 
          metalness={0.8}
          roughness={0.2}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial 
          color="#36454F" 
          metalness={0.8}
          roughness={0.2}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Feet - Tank treads */}
      <mesh position={[-0.15, -0.4, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.9}
          wireframe={isSelected}
        />
      </mesh>
      <mesh position={[0.15, -0.4, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.9}
          wireframe={isSelected}
        />
      </mesh>
    </group>
  )
}