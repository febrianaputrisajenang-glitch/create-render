import { useRef, forwardRef } from 'react'
import * as THREE from 'three'

// Enhanced Player model with joints and facial features
export const EnhancedBasicPlayer = forwardRef<THREE.Group, { 
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color?: string
  isSelected?: boolean
  faceExpression?: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised'
  eyeDirection?: [number, number] // [-1 to 1, -1 to 1]
}>(({ 
  position, 
  rotation, 
  scale, 
  color = '#4A90E2',
  isSelected = false,
  faceExpression = 'neutral',
  eyeDirection = [0, 0]
}, ref) => {
  const headRef = useRef<THREE.Group>(null!)
  const leftArmRef = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)
  const leftLegRef = useRef<THREE.Group>(null!)
  const rightLegRef = useRef<THREE.Group>(null!)

  // Expression configurations
  const getEyeScale = (): [number, number, number] => {
    switch (faceExpression) {
      case 'happy': return [1.2, 0.8, 1]
      case 'surprised': return [1.5, 1.5, 1]
      case 'angry': return [0.8, 1.2, 1]
      case 'sad': return [1, 0.6, 1]
      default: return [1, 1, 1]
    }
  }

  const getMouthRotation = () => {
    switch (faceExpression) {
      case 'happy': return Math.PI / 6
      case 'sad': return -Math.PI / 6
      case 'angry': return -Math.PI / 8
      case 'surprised': return 0
      default: return 0
    }
  }

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Head with joint */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        {/* Head */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.6}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.28, 16, 8]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Eyes */}
        <group>
          <mesh 
            position={[-0.08 + eyeDirection[0] * 0.02, 0.05 + eyeDirection[1] * 0.02, 0.2]} 
            scale={getEyeScale()}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              roughness={0.1}
              wireframe={isSelected}
            />
          </mesh>
          <mesh 
            position={[0.08 + eyeDirection[0] * 0.02, 0.05 + eyeDirection[1] * 0.02, 0.2]} 
            scale={getEyeScale()}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              roughness={0.1}
              wireframe={isSelected}
            />
          </mesh>
          
          {/* Pupils */}
          <mesh position={[-0.08 + eyeDirection[0] * 0.02, 0.05 + eyeDirection[1] * 0.02, 0.22]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial 
              color="#000000" 
              wireframe={isSelected}
            />
          </mesh>
          <mesh position={[0.08 + eyeDirection[0] * 0.02, 0.05 + eyeDirection[1] * 0.02, 0.22]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial 
              color="#000000" 
              wireframe={isSelected}
            />
          </mesh>
        </group>
        
        {/* Nose */}
        <mesh position={[0, 0, 0.22]}>
          <coneGeometry args={[0.02, 0.06, 6]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.6}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Mouth */}
        <mesh 
          position={[0, -0.08, 0.2]} 
          rotation={[0, 0, getMouthRotation()]}
        >
          <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
          <meshStandardMaterial 
            color="#FF6B6B" 
            roughness={0.4}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.22, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.6}
            wireframe={isSelected}
          />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.6}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 1, 0.3]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Left Arm with joint */}
      <group ref={leftArmRef} position={[-0.4, 0.9, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Lower arm */}
        <group position={[0, -0.5, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.12, 0.4, 0.12]} />
            <meshStandardMaterial 
              color="#FFDBAC" 
              roughness={0.8}
              wireframe={isSelected}
            />
          </mesh>
          
          {/* Hand */}
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color="#FFDBAC" 
              roughness={0.8}
              wireframe={isSelected}
            />
          </mesh>
        </group>
      </group>
      
      {/* Right Arm with joint */}
      <group ref={rightArmRef} position={[0.4, 0.9, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Lower arm */}
        <group position={[0, -0.5, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.12, 0.4, 0.12]} />
            <meshStandardMaterial 
              color="#FFDBAC" 
              roughness={0.8}
              wireframe={isSelected}
            />
          </mesh>
          
          {/* Hand */}
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color="#FFDBAC" 
              roughness={0.8}
              wireframe={isSelected}
            />
          </mesh>
        </group>
      </group>
      
      {/* Left Leg with joint */}
      <group ref={leftLegRef} position={[-0.15, 0, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.15]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            roughness={0.7}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Lower leg */}
        <group position={[0, -0.4, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.12]} />
            <meshStandardMaterial 
              color="#2C3E50" 
              roughness={0.7}
              wireframe={isSelected}
            />
          </mesh>
          
          {/* Foot */}
          <mesh position={[0, -0.35, 0.1]}>
            <boxGeometry args={[0.18, 0.1, 0.3]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.9}
              wireframe={isSelected}
            />
          </mesh>
        </group>
      </group>
      
      {/* Right Leg with joint */}
      <group ref={rightLegRef} position={[0.15, 0, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.15]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            roughness={0.7}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Lower leg */}
        <group position={[0, -0.4, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.12]} />
            <meshStandardMaterial 
              color="#2C3E50" 
              roughness={0.7}
              wireframe={isSelected}
            />
          </mesh>
          
          {/* Foot */}
          <mesh position={[0, -0.35, 0.1]}>
            <boxGeometry args={[0.18, 0.1, 0.3]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.9}
              wireframe={isSelected}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
})

// Enhanced Knight with joints and better details
export const EnhancedKnight = forwardRef<THREE.Group, { 
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  isSelected?: boolean
  faceExpression?: 'neutral' | 'angry' | 'determined'
}>(({ 
  position, 
  rotation, 
  scale, 
  isSelected = false,
  faceExpression = 'neutral'
}, ref) => {
  const headRef = useRef<THREE.Group>(null!)
  const leftArmRef = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)

  const getEyeGlow = () => {
    switch (faceExpression) {
      case 'angry': return '#FF0000'
      case 'determined': return '#FFD700'
      default: return '#4169E1'
    }
  }

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Head with joint */}
      <group ref={headRef} position={[0, 1.6, 0]}>
        {/* Helmet */}
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial 
            color="#C0C0C0" 
            metalness={0.9}
            roughness={0.2}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Visor with eyes */}
        <mesh position={[0, 0, 0.25]}>
          <boxGeometry args={[0.35, 0.18, 0.05]} />
          <meshStandardMaterial 
            color="#333333" 
            metalness={0.1}
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Eye glow effect */}
        <mesh position={[-0.08, 0, 0.27]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color={getEyeGlow()}
            emissive={getEyeGlow()}
            emissiveIntensity={0.5}
            wireframe={isSelected}
          />
        </mesh>
        <mesh position={[0.08, 0, 0.27]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color={getEyeGlow()}
            emissive={getEyeGlow()}
            emissiveIntensity={0.5}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Plume */}
        <mesh position={[0, 0.2, -0.1]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.05, 0.3, 8]} />
          <meshStandardMaterial 
            color="#8B0000" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.7, 1.1, 0.4]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.8}
          roughness={0.3}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Left Arm with joint */}
      <group ref={leftArmRef} position={[-0.45, 0.9, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial 
            color="#C0C0C0" 
            metalness={0.7}
            roughness={0.4}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Shield */}
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.5, 0.8, 0.1]} />
          <meshStandardMaterial 
            color="#8B0000" 
            metalness={0.2}
            roughness={0.6}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Right Arm with joint and sword */}
      <group ref={rightArmRef} position={[0.45, 0.9, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial 
            color="#C0C0C0" 
            metalness={0.7}
            roughness={0.4}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Sword */}
        <mesh position={[0.25, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.05, 1, 0.05]} />
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.9}
            roughness={0.1}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Legs */}
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
})

// Enhanced Wizard with joints and magical effects
export const EnhancedWizard = forwardRef<THREE.Group, { 
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  isSelected?: boolean
  faceExpression?: 'neutral' | 'wise' | 'casting'
  magicIntensity?: number
}>(({ 
  position, 
  rotation, 
  scale, 
  isSelected = false,
  faceExpression = 'neutral',
  magicIntensity = 0.3
}, ref) => {
  const headRef = useRef<THREE.Group>(null!)
  const leftArmRef = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)

  const getEyeColor = () => {
    switch (faceExpression) {
      case 'wise': return '#4169E1'
      case 'casting': return '#9932CC'
      default: return '#228B22'
    }
  }

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Head with joint */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        {/* Head */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial 
            color="#FFDBAC" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Eyes with magical glow */}
        <mesh position={[-0.08, 0.05, 0.18]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial 
            color={getEyeColor()}
            emissive={getEyeColor()}
            emissiveIntensity={magicIntensity}
            wireframe={isSelected}
          />
        </mesh>
        <mesh position={[0.08, 0.05, 0.18]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial 
            color={getEyeColor()}
            emissive={getEyeColor()}
            emissiveIntensity={magicIntensity}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Enhanced beard */}
        <mesh position={[0, -0.05, 0.15]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0.9}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Mustache */}
        <mesh position={[0, 0.02, 0.19]}>
          <sphereGeometry args={[0.06, 8, 4]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0.9}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Wizard hat */}
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.18, 0.7, 8]} />
          <meshStandardMaterial 
            color="#4B0082" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Stars on hat */}
        {[...Array(4)].map((_, i) => (
          <mesh 
            key={i}
            position={[
              Math.sin(i * Math.PI * 2 / 4) * 0.14,
              0.4 + i * 0.08,
              Math.cos(i * Math.PI * 2 / 4) * 0.14
            ]}
          >
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700"
              emissiveIntensity={magicIntensity}
              wireframe={isSelected}
            />
          </mesh>
        ))}
      </group>
      
      {/* Robe */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial 
          color="#4B0082" 
          roughness={0.8}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.4, 1, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial 
            color="#4B0082" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Right Arm with staff */}
      <group ref={rightArmRef} position={[0.4, 1, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial 
            color="#4B0082" 
            roughness={0.8}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Staff */}
        <mesh position={[0.2, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.9}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Crystal on staff */}
        <mesh position={[0.2, 1.5, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#00FFFF" 
            emissive="#00FFFF"
            emissiveIntensity={magicIntensity * 2}
            transparent
            opacity={0.8}
            wireframe={isSelected}
          />
        </mesh>
      </group>
    </group>
  )
})

// Enhanced Robot with joints and tech details
export const EnhancedRobot = forwardRef<THREE.Group, { 
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  isSelected?: boolean
  powerLevel?: number
}>(({ 
  position, 
  rotation, 
  scale, 
  isSelected = false,
  powerLevel = 0.8
}, ref) => {
  const headRef = useRef<THREE.Group>(null!)
  const leftArmRef = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Head with joint */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        {/* Head */}
        <mesh>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial 
            color="#36454F" 
            metalness={0.9}
            roughness={0.1}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Eyes with power level glow */}
        <mesh position={[-0.1, 0.05, 0.21]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial 
            color="#FF0000" 
            emissive="#FF0000"
            emissiveIntensity={powerLevel}
            wireframe={isSelected}
          />
        </mesh>
        <mesh position={[0.1, 0.05, 0.21]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial 
            color="#FF0000" 
            emissive="#FF0000"
            emissiveIntensity={powerLevel}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.8}
            roughness={0.2}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Antenna light */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#00FF00" 
            emissive="#00FF00"
            emissiveIntensity={powerLevel}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
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
          emissiveIntensity={powerLevel * 0.5}
          wireframe={isSelected}
        />
      </mesh>
      
      {/* Left Arm with joint */}
      <group ref={leftArmRef} position={[-0.4, 0.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial 
            color="#36454F" 
            metalness={0.9}
            roughness={0.1}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Right Arm with joint */}
      <group ref={rightArmRef} position={[0.4, 0.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial 
            color="#36454F" 
            metalness={0.9}
            roughness={0.1}
            wireframe={isSelected}
          />
        </mesh>
      </group>
      
      {/* Legs */}
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
      
      {/* Feet */}
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
})
