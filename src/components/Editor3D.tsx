import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls, Clouds, Line } from '@react-three/drei'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Box, 
  Circle, 
  Cylinder,
  Move,
  RotateCcw,
  Maximize2,
  Trash2,
  Download,
  Upload,
  Home,
  Grid3X3,
  Eye,
  Trees,
  Mountain,
  Navigation,
  MousePointer,
  Car,
  Route,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { Link } from "react-router-dom"
import * as THREE from 'three'
import CameraControls, { CameraKeyframe } from './CameraControls'
import MaterialEditor, { MaterialProperties } from './MaterialEditor'
import SkyControls, { SkySettings } from './SkyControls'
import FirstPersonControls from './FirstPersonControls'
import SceneExporter from './SceneExporter'
import { CollapsibleSection } from './CollapsibleSection'
import { AnimationControls, AnimationKeyframe, ObjectAnimation } from './AnimationControls'
import { BasicPlayer, Knight, Wizard, Robot } from './PlayerModels'
import EnhancedExporter from './EnhancedExporter'
import { ShaderPresets } from './ShaderPresets'

type ObjectType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'tree' | 'ground' | 'house' | 'mountain' | 'car' | 'road' | 'player' | 'knight' | 'wizard' | 'robot'
type TransformMode = 'translate' | 'rotate' | 'scale'

interface SceneObject {
  id: string
  type: ObjectType
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  material: MaterialProperties
  animations?: string[] // IDs of animations applied to this object
}

function SceneObject({ 
  object, 
  isSelected, 
  onSelect,
  meshRef 
}: { 
  object: SceneObject
  isSelected: boolean
  onSelect: () => void 
  meshRef?: React.MutableRefObject<THREE.Mesh | null>
}) {
  const internalMeshRef = useRef<THREE.Mesh>(null!)
  const actualMeshRef = meshRef || internalMeshRef
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  
  // Load texture if URL is provided
  useEffect(() => {
    if (object.material.textureUrl) {
      const loader = new THREE.TextureLoader()
      loader.load(
        object.material.textureUrl,
        (loadedTexture) => {
          loadedTexture.wrapS = THREE.RepeatWrapping
          loadedTexture.wrapT = THREE.RepeatWrapping
          loadedTexture.repeat.set(1, 1)
          setTexture(loadedTexture)
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error)
          setTexture(null)
        }
      )
    } else {
      setTexture(null)
    }
  }, [object.material.textureUrl])
  
  const getGeometry = () => {
    switch (object.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />
      case 'torus':
        return <torusGeometry args={[0.4, 0.2, 16, 100]} />
      case 'plane':
        return <planeGeometry args={[1, 1]} />
      case 'tree':
        return <sphereGeometry args={[0.5, 16, 16]} />
      case 'car':
        return <boxGeometry args={[2, 0.8, 1]} />
      case 'road':
        return <planeGeometry args={[20, 4, 32, 8]} />
      case 'ground':
        return <planeGeometry args={[50, 50, 64, 64]} />
      case 'house':
        return <boxGeometry args={[2, 2, 2]} />
      case 'mountain':
        return <sphereGeometry args={[3, 16, 16]} />
      case 'player':
      case 'knight':
      case 'wizard':
      case 'robot':
        return <boxGeometry args={[1, 1, 1]} /> // Placeholder, actual models rendered separately
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }
  
  // Enhanced tree with detailed foliage
  if (object.type === 'tree') {
    return (
      <group
        ref={actualMeshRef as any}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={onSelect}
      >
        {/* Trunk */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 1.6, 12]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.9}
            wireframe={isSelected} 
          />
        </mesh>
        
        {/* Multiple Foliage Layers for Realistic Look */}
        {[0.3, 0.8, 1.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <sphereGeometry args={[0.6 + i * 0.2, 16, 16]} />
            <meshStandardMaterial 
              color={i === 0 ? "#2d5016" : i === 1 ? "#3d6b1f" : "#4a7c23"}
              roughness={0.8}
              wireframe={isSelected} 
            />
          </mesh>
        ))}
        
        {/* Random Branch Details */}
        {[...Array(4)].map((_, i) => (
          <mesh 
            key={`branch-${i}`} 
            position={[
              (Math.sin(i * Math.PI / 2) * 0.4),
              0.2 + i * 0.2,
              (Math.cos(i * Math.PI / 2) * 0.4)
            ]}
            rotation={[0, i * Math.PI / 2, Math.PI / 6]}
          >
            <cylinderGeometry args={[0.03, 0.05, 0.3, 6]} />
            <meshStandardMaterial color="#654321" wireframe={isSelected} />
          </mesh>
        ))}
      </group>
    )
  }

  // Enhanced ground with grass patches
  if (object.type === 'ground') {
    return (
      <group
        ref={actualMeshRef as any}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={onSelect}
      >
        {/* Main ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50, 128, 128]} />
          <meshStandardMaterial 
            color={object.material.color || '#3a5f3a'}
            metalness={object.material.metalness || 0}
            roughness={object.material.roughness || 0.95}
            emissive={object.material.emissive}
            emissiveIntensity={object.material.emissiveIntensity}
            map={texture}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Grass Patches */}
        {!isSelected && [...Array(200)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 40,
              0.05,
              (Math.random() - 0.5) * 40
            ]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            <planeGeometry args={[0.1, 0.3]} />
            <meshStandardMaterial 
              color="#2d5a2d"
              transparent
              opacity={0.8}
              side={2}
            />
          </mesh>
        ))}
      </group>
    )
  }

  // Enhanced house with better details
  if (object.type === 'house') {
    return (
      <group
        ref={actualMeshRef as any}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={onSelect}
      >
        {/* Foundation */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[2.2, 0.4, 2.2]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.9} wireframe={isSelected} />
        </mesh>
        
        {/* Main House Body */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2, 1.4, 2]} />
          <meshStandardMaterial 
            color={object.material.color || '#e6b17a'} 
            metalness={object.material.metalness || 0}
            roughness={object.material.roughness || 0.7}
            emissive={object.material.emissive}
            emissiveIntensity={object.material.emissiveIntensity}
            map={texture}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Roof Structure */}
        <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.6, 1.2, 4]} />
          <meshStandardMaterial color="#8b2635" roughness={0.8} wireframe={isSelected} />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, -0.8, 1.01]}>
          <boxGeometry args={[0.4, 0.8, 0.05]} />
          <meshStandardMaterial color="#4a2c2a" roughness={0.9} wireframe={isSelected} />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-0.6, -0.3, 1.01]}>
          <boxGeometry args={[0.3, 0.3, 0.02]} />
          <meshStandardMaterial color="#87ceeb" metalness={0.1} roughness={0.1} wireframe={isSelected} />
        </mesh>
        <mesh position={[0.6, -0.3, 1.01]}>
          <boxGeometry args={[0.3, 0.3, 0.02]} />
          <meshStandardMaterial color="#87ceeb" metalness={0.1} roughness={0.1} wireframe={isSelected} />
        </mesh>
        
        {/* Chimney */}
        <mesh position={[0.7, 1.2, -0.3]}>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#8b4513" roughness={0.9} wireframe={isSelected} />
        </mesh>
      </group>
    )
  }

  // Realistic mountain range
  if (object.type === 'mountain') {
    return (
      <group
        ref={actualMeshRef as any}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={onSelect}
      >
        {/* Main Mountain Body - Irregular Shape */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[3, 16, 12]} />
          <meshStandardMaterial 
            color={object.material.color || '#5a5a5a'} 
            metalness={object.material.metalness || 0}
            roughness={object.material.roughness || 0.95}
            emissive={object.material.emissive}
            emissiveIntensity={object.material.emissiveIntensity}
            map={texture}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Multiple peaks for realism */}
        <mesh position={[-1.2, 1.8, 0.5]}>
          <sphereGeometry args={[1.2, 12, 8]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.95} wireframe={isSelected} />
        </mesh>
        
        <mesh position={[1.8, 1.3, -0.8]}>
          <sphereGeometry args={[0.9, 10, 6]} />
          <meshStandardMaterial color="#6a6a6a" roughness={0.95} wireframe={isSelected} />
        </mesh>
        
        {/* Snow caps */}
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[1.5, 12, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} wireframe={isSelected} />
        </mesh>
        
        <mesh position={[-1.2, 2.5, 0.5]}>
          <sphereGeometry args={[0.8, 10, 6]} />
          <meshStandardMaterial color="#f8f8ff" roughness={0.3} wireframe={isSelected} />
        </mesh>
        
        {/* Rocky details */}
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 4,
              Math.random() * 1.5 - 1,
              (Math.random() - 0.5) * 4
            ]}
          >
            <sphereGeometry args={[0.1 + Math.random() * 0.3, 8, 6]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.9} wireframe={isSelected} />
          </mesh>
        ))}
      </group>
    )
  }

  // Modern car with details
  if (object.type === 'car') {
    return (
      <group
        ref={actualMeshRef as any}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={onSelect}
      >
        {/* Main Body */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2, 0.6, 1]} />
          <meshStandardMaterial 
            color={object.material.color || '#ff4444'} 
            metalness={object.material.metalness || 0.8}
            roughness={object.material.roughness || 0.2}
            emissive={object.material.emissive}
            emissiveIntensity={object.material.emissiveIntensity}
            map={texture}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.8, 0.4, 0.9]} />
          <meshStandardMaterial 
            color="#333333" 
            metalness={0.9}
            roughness={0.1}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Wheels */}
        {[[-0.7, -0.2, 0.6], [0.7, -0.2, 0.6], [-0.7, -0.2, -0.6], [0.7, -0.2, -0.6]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#222222" roughness={0.9} wireframe={isSelected} />
          </mesh>
        ))}
        
        {/* Headlights */}
        <mesh position={[1.05, 0.2, 0.3]}>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.3}
            wireframe={isSelected}
          />
        </mesh>
        <mesh position={[1.05, 0.2, -0.3]}>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.3}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Taillights */}
        <mesh position={[-1.05, 0.2, 0.3]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000"
            emissiveIntensity={0.2}
            wireframe={isSelected}
          />
        </mesh>
        <mesh position={[-1.05, 0.2, -0.3]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000"
            emissiveIntensity={0.2}
            wireframe={isSelected}
          />
        </mesh>
      </group>
    )
  }

  // Road with lane markings
  if (object.type === 'road') {
    return (
      <group
        ref={actualMeshRef as any}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={onSelect}
      >
        {/* Main Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 4, 32, 8]} />
          <meshStandardMaterial 
            color={object.material.color || '#333333'}
            metalness={object.material.metalness || 0}
            roughness={object.material.roughness || 0.8}
            emissive={object.material.emissive}
            emissiveIntensity={object.material.emissiveIntensity}
            map={texture}
            wireframe={isSelected}
          />
        </mesh>
        
        {/* Lane Markings */}
        {!isSelected && [...Array(10)].map((_, i) => (
          <mesh 
            key={i} 
            position={[-8 + i * 1.8, 0.005, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.8, 0.15]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
        
        {/* Road Edges */}
        <mesh position={[0, 0.005, 2.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, 0.005, -2.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
      </group>
    )
  }

  // Player models
  if (object.type === 'player') {
    return (
      <group onClick={onSelect}>
        <BasicPlayer
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          color={object.material.color}
          isSelected={isSelected}
        />
      </group>
    )
  }

  if (object.type === 'knight') {
    return (
      <group onClick={onSelect}>
        <Knight
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          isSelected={isSelected}
        />
      </group>
    )
  }

  if (object.type === 'wizard') {
    return (
      <group onClick={onSelect}>
        <Wizard
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          isSelected={isSelected}
        />
      </group>
    )
  }

  if (object.type === 'robot') {
    return (
      <group onClick={onSelect}>
        <Robot
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          isSelected={isSelected}
        />
      </group>
    )
  }

  return (
    <mesh
      ref={actualMeshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={onSelect}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={object.material.color}
        metalness={object.material.metalness}
        roughness={object.material.roughness}
        emissive={object.material.emissive}
        emissiveIntensity={object.material.emissiveIntensity}
        map={texture}
        wireframe={isSelected}
      />
    </mesh>
  )
}

function CameraAnimator({ 
  keyframes, 
  isPlaying, 
  onAnimationComplete,
  orbitControlsRef 
}: {
  keyframes: CameraKeyframe[]
  isPlaying: boolean
  onAnimationComplete: () => void
  orbitControlsRef: React.MutableRefObject<any>
}) {
  const { camera } = useThree()
  const [currentKeyframeIndex, setCurrentKeyframeIndex] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const startTimeRef = useRef<number>(0)
  const animationRef = useRef<number>(0)

  useFrame(() => {
    if (!isPlaying || keyframes.length < 2) return

    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now()
    }

    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const currentKeyframe = keyframes[currentKeyframeIndex]
    const nextKeyframe = keyframes[currentKeyframeIndex + 1]

    if (!currentKeyframe || !nextKeyframe) {
      onAnimationComplete()
      return
    }

    const progress = Math.min(elapsed / currentKeyframe.duration, 1)
    setAnimationProgress(progress)

    // Interpolate camera position and target
    const newPosition = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...currentKeyframe.position),
      new THREE.Vector3(...nextKeyframe.position),
      progress
    )
    
    const newTarget = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...currentKeyframe.target),
      new THREE.Vector3(...nextKeyframe.target),
      progress
    )

    camera.position.copy(newPosition)
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.copy(newTarget)
      orbitControlsRef.current.update()
    }

    if (progress >= 1) {
      if (currentKeyframeIndex < keyframes.length - 2) {
        setCurrentKeyframeIndex(prev => prev + 1)
        startTimeRef.current = Date.now()
      } else {
        onAnimationComplete()
      }
    }
  })

  useEffect(() => {
    if (!isPlaying) {
      setCurrentKeyframeIndex(0)
      setAnimationProgress(0)
      startTimeRef.current = 0
    }
  }, [isPlaying])

  return null
}

function SkyEnvironment({ skySettings }: { skySettings: SkySettings }) {
  const { scene } = useThree()
  
  useEffect(() => {
    // Set background color based on sky preset
    const skyColors = {
      day: '#87CEEB',
      night: '#191970', 
      sunset: '#FF6347',
      cloudy: '#708090',
      rainy: '#2F4F4F',
      orange: '#FF4500'
    }
    
    scene.background = new THREE.Color(skyColors[skySettings.preset])
    scene.fog = new THREE.Fog(skyColors[skySettings.preset], 10, 50 * (1 + skySettings.fogDensity * 10))
  }, [skySettings, scene])

  const getLighting = () => {
    switch (skySettings.preset) {
      case 'day':
        return (
          <>
            <ambientLight intensity={0.6 * skySettings.intensity} />
            <directionalLight position={[10, 10, 5]} intensity={1.2 * skySettings.intensity} color="#ffffff" />
          </>
        )
      case 'night':
        return (
          <>
            <ambientLight intensity={0.2 * skySettings.intensity} color="#4169E1" />
            <directionalLight position={[10, 10, 5]} intensity={0.3 * skySettings.intensity} color="#C0C0C0" />
            <pointLight position={[0, 5, 0]} intensity={0.8 * skySettings.intensity} color="#FFD700" />
          </>
        )
      case 'sunset':
        return (
          <>
            <ambientLight intensity={0.4 * skySettings.intensity} color="#FF8C00" />
            <directionalLight position={[10, 2, 5]} intensity={1 * skySettings.intensity} color="#FF6347" />
          </>
        )
      case 'cloudy':
        return (
          <>
            <ambientLight intensity={0.5 * skySettings.intensity} color="#D3D3D3" />
            <directionalLight position={[10, 10, 5]} intensity={0.6 * skySettings.intensity} color="#F5F5F5" />
          </>
        )
      case 'rainy':
        return (
          <>
            <ambientLight intensity={0.3 * skySettings.intensity} color="#778899" />
            <directionalLight position={[10, 10, 5]} intensity={0.4 * skySettings.intensity} color="#B0C4DE" />
          </>
        )
      case 'orange':
        return (
          <>
            <ambientLight intensity={0.5 * skySettings.intensity} color="#FF4500" />
            <directionalLight position={[10, 10, 5]} intensity={1 * skySettings.intensity} color="#FF8C00" />
          </>
        )
      default:
        return (
          <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </>
        )
    }
  }

  return (
    <>
      {getLighting()}
      
      {/* Cloud System - Simple Implementation */}
      {skySettings.cloudCoverage > 0 && (
        <group position={[0, 15, 0]}>
          {Array.from({ length: Math.floor(skySettings.cloudCoverage * 20) }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 40,
                Math.random() * 10,
                (Math.random() - 0.5) * 40
              ]}
            >
              <sphereGeometry args={[2 * skySettings.cloudDensity, 8, 6]} />
              <meshBasicMaterial 
                color="#ffffff" 
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  )
}

function CameraMarkers({ keyframes }: { keyframes: CameraKeyframe[] }) {
  return (
    <>
      {keyframes.map((keyframe, index) => (
        <group key={keyframe.id} position={keyframe.position}>
          {/* Camera Body */}
          <mesh>
            <boxGeometry args={[0.3, 0.2, 0.4]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          
          {/* Camera Lens */}
          <mesh position={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          
          {/* Keyframe Number */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color={index === 0 ? "#00ff00" : "#ff6600"} 
              emissive={index === 0 ? "#004400" : "#441100"}
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Direction Line to Target */}
          <Line
            points={[
              keyframe.position,
              keyframe.target
            ]}
            color="#ff6600"
            lineWidth={2}
            dashed={true}
          />
        </group>
      ))}
    </>
  )
}

function Viewport({
  objects, 
  selectedObjectId, 
  onSelectObject,
  transformMode,
  onTransformObject,
  keyframes,
  isPlaying,
  onAnimationComplete,
  onCameraChange,
  skySettings,
  controlMode
}: {
  objects: SceneObject[]
  selectedObjectId: string | null
  onSelectObject: (id: string | null) => void
  transformMode: TransformMode
  onTransformObject: (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void
  keyframes: CameraKeyframe[]
  isPlaying: boolean
  onAnimationComplete: () => void
  onCameraChange: (position: [number, number, number], target: [number, number, number]) => void
  skySettings: SkySettings
  controlMode: 'orbit' | 'firstperson'
}) {
  const selectedObject = objects.find(obj => obj.id === selectedObjectId)
  const selectedMeshRef = useRef<THREE.Mesh>(null)
  const orbitControlsRef = useRef<any>(null)
  
  return (
    <div className="flex-1 bg-viewport border border-border rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        onPointerMissed={() => onSelectObject(null)}
      >
        <SkyEnvironment skySettings={skySettings} />
        
        <Grid 
          args={[10, 10]} 
          cellColor="#333333"
          sectionColor="#555555"
          fadeDistance={20}
          fadeStrength={0.5}
        />
        
        {objects.map((object) => (
          <SceneObject
            key={object.id}
            object={object}
            isSelected={object.id === selectedObjectId}
            onSelect={() => onSelectObject(object.id)}
            meshRef={object.id === selectedObjectId ? selectedMeshRef : undefined}
          />
        ))}
        
        {selectedObject && selectedMeshRef.current && (
          <TransformControls
            object={selectedMeshRef.current}
            mode={transformMode}
            onObjectChange={() => {
              if (selectedMeshRef.current) {
                const mesh = selectedMeshRef.current
                onTransformObject(
                  selectedObject.id,
                  [mesh.position.x, mesh.position.y, mesh.position.z],
                  [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
                  [mesh.scale.x, mesh.scale.y, mesh.scale.z]
                )
              }
            }}
          />
        )}
        
        <CameraAnimator 
          keyframes={keyframes}
          isPlaying={isPlaying}
          onAnimationComplete={onAnimationComplete}
          orbitControlsRef={orbitControlsRef}
        />
        
        <CameraMarkers keyframes={keyframes} />
        
        {/* Camera Controls */}
        {controlMode === 'firstperson' ? (
          <FirstPersonControls 
            enabled={!isPlaying && controlMode === 'firstperson'} 
            speed={5}
          />
        ) : (
          <OrbitControls
            ref={orbitControlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2 * 1.8}
            enabled={!isPlaying && controlMode === 'orbit'}
            onChange={() => {
              if (orbitControlsRef.current && !isPlaying && controlMode === 'orbit') {
                const camera = orbitControlsRef.current.object
                const target = orbitControlsRef.current.target
                onCameraChange(
                  [camera.position.x, camera.position.y, camera.position.z],
                  [target.x, target.y, target.z]
                )
              }
            }}
          />
        )}
      </Canvas>
    </div>
  )
}

export default function Editor3D() {
  const [objects, setObjects] = useState<SceneObject[]>([])
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  const [transformMode, setTransformMode] = useState<TransformMode>('translate')
  const [showGrid, setShowGrid] = useState(true)
  
  // Camera animation state
  const [keyframes, setKeyframes] = useState<CameraKeyframe[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentCameraPosition, setCurrentCameraPosition] = useState<[number, number, number]>([5, 5, 5])
  const [currentCameraTarget, setCurrentCameraTarget] = useState<[number, number, number]>([0, 0, 0])
  
  // Object animation state
  const [animations, setAnimations] = useState<ObjectAnimation[]>([])
  const [playingAnimations, setPlayingAnimations] = useState<Record<string, boolean>>({})
  
  // Control mode state
  const [controlMode, setControlMode] = useState<'orbit' | 'firstperson'>('orbit')
  
  // Material state
  const [materialProperties, setMaterialProperties] = useState<MaterialProperties>({
    color: '#00ffff',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#000000',
    emissiveIntensity: 0
  })

  // Sky state
  const [skySettings, setSkySettings] = useState<SkySettings>({
    preset: 'day',
    intensity: 1,
    fogDensity: 0.02,
    cloudCoverage: 0.3,
    cloudDensity: 1
  })
  
  const addObject = (type: ObjectType) => {
    const id = Date.now().toString()
    const newObject: SceneObject = {
      id,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0], 
      scale: [1, 1, 1],
      material: { ...materialProperties }
    }
    setObjects(prev => [...prev, newObject])
    setSelectedObjectId(id)
  }
  
  const deleteSelectedObject = () => {
    if (selectedObjectId) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedObjectId))
      setSelectedObjectId(null)
    }
  }
  
  const onTransformObject = (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, position, rotation, scale } : obj
    ))
  }
  
  // Camera animation functions
  const handleAddCameraKeyframe = useCallback((keyframe: Omit<CameraKeyframe, 'id'>) => {
    const id = Date.now().toString()
    setKeyframes(prev => [...prev, { ...keyframe, id }])
  }, [])

  const handleDeleteCameraKeyframe = useCallback((id: string) => {
    setKeyframes(prev => prev.filter(kf => kf.id !== id))
  }, [])

  const handleReorderKeyframes = useCallback((newKeyframes: CameraKeyframe[]) => {
    setKeyframes(newKeyframes)
  }, [])

  const handlePlayCameraAnimation = useCallback(() => {
    if (keyframes.length >= 2) {
      setIsAnimating(true)
    }
  }, [keyframes.length])

  const handleStopCameraAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const handleJumpToKeyframe = useCallback((keyframe: CameraKeyframe) => {
    setCurrentCameraPosition(keyframe.position)
    setCurrentCameraTarget(keyframe.target)
  }, [])

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const handleCameraChange = useCallback((position: [number, number, number], target: [number, number, number]) => {
    setCurrentCameraPosition(position)
    setCurrentCameraTarget(target)
  }, [])

  // Material functions
  const handleMaterialChange = useCallback((newMaterial: MaterialProperties) => {
    setMaterialProperties(newMaterial)
    if (selectedObjectId) {
      setObjects(prev => prev.map(obj => 
        obj.id === selectedObjectId ? { ...obj, material: newMaterial } : obj
      ))
    }
  }, [selectedObjectId])

  // Sky functions
  const handleSkyChange = useCallback((newSkySettings: SkySettings) => {
    setSkySettings(newSkySettings)
  }, [])
  
  // Animation functions
  const handleAddAnimation = useCallback((animation: Omit<ObjectAnimation, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setAnimations(prev => [...prev, { ...animation, id }])
  }, [])

  const handleDeleteAnimation = useCallback((id: string) => {
    setAnimations(prev => prev.filter(anim => anim.id !== id))
    setPlayingAnimations(prev => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
  }, [])

  const handleUpdateAnimation = useCallback((id: string, updates: Partial<ObjectAnimation>) => {
    setAnimations(prev => prev.map(anim => 
      anim.id === id ? { ...anim, ...updates } : anim
    ))
  }, [])

  const handlePlayAnimation = useCallback((id: string) => {
    setPlayingAnimations(prev => ({ ...prev, [id]: true }))
    // In a real implementation, this would trigger the animation
    setTimeout(() => {
      setPlayingAnimations(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }, [])

  const handleStopAnimation = useCallback((id: string) => {
    setPlayingAnimations(prev => ({ ...prev, [id]: false }))
  }, [])

  const handleAddKeyframe = useCallback((animationId: string, keyframe: Omit<AnimationKeyframe, 'id'>) => {
    const keyframeId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setAnimations(prev => prev.map(anim => 
      anim.id === animationId 
        ? { ...anim, keyframes: [...anim.keyframes, { ...keyframe, id: keyframeId }] }
        : anim
    ))
  }, [])

  const handleDeleteKeyframe = useCallback((animationId: string, keyframeId: string) => {
    setAnimations(prev => prev.map(anim => 
      anim.id === animationId 
        ? { ...anim, keyframes: anim.keyframes.filter(kf => kf.id !== keyframeId) }
        : anim
    ))
  }, [])

  const handleUpdateKeyframe = useCallback((animationId: string, keyframeId: string, updates: Partial<AnimationKeyframe>) => {
    setAnimations(prev => prev.map(anim => 
      anim.id === animationId 
        ? { 
            ...anim, 
            keyframes: anim.keyframes.map(kf => 
              kf.id === keyframeId ? { ...kf, ...updates } : kf
            ) 
          }
        : anim
    ))
  }, [])
  
  // Import function
  const handleImportObjects = useCallback((importedObjects: SceneObject[]) => {
    setObjects(prev => [...prev, ...importedObjects.map(obj => ({
      ...obj,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Generate new IDs
    }))])
  }, [])

  const handleImportAnimations = useCallback((importedAnimations: ObjectAnimation[]) => {
    setAnimations(prev => [...prev, ...importedAnimations.map(anim => ({
      ...anim,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Generate new IDs
    }))])
  }, [])
  
  const selectedObject = objects.find(obj => obj.id === selectedObjectId)
  
  // Update material properties when selecting different objects
  useEffect(() => {
    if (selectedObject) {
      setMaterialProperties(selectedObject.material)
    }
  }, [selectedObjectId, selectedObject])
  
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <Link to="/editor">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                <Box className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">3D SETS Editor</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Left Collapsible Sidebar */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto">
          {/* Collapsible Navigation Sections */}
          <CollapsibleSection 
            title="Transform Tools" 
            icon={<Move className="h-4 w-4" />} 
            isOpen={openSection === 'transform'}
            onToggle={() => handleSectionToggle('transform')}
          >
            <div className="grid grid-cols-3 gap-2 p-4">
              <Button
                variant={transformMode === 'translate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTransformMode('translate')}
                className="p-2"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={transformMode === 'rotate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTransformMode('rotate')}
                className="p-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant={transformMode === 'scale' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTransformMode('scale')}
                className="p-2"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Add Objects" icon={<Box className="h-4 w-4" />}>
            <div className="space-y-2 p-4">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('cube')}>
                <Box className="h-4 w-4 mr-2" />
                Cube
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('sphere')}>
                <Circle className="h-4 w-4 mr-2" />
                Sphere
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('cylinder')}>
                <Cylinder className="h-4 w-4 mr-2" />
                Cylinder
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('cone')}>
                <Cylinder className="h-4 w-4 mr-2" />
                Cone
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('torus')}>
                <Circle className="h-4 w-4 mr-2" />
                Torus
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('plane')}>
                <Grid3X3 className="h-4 w-4 mr-2" />
                Plane
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('tree')}>
                <Trees className="h-4 w-4 mr-2" />
                Tree
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('ground')}>
                <Mountain className="h-4 w-4 mr-2" />
                Ground
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('house')}>
                <Home className="h-4 w-4 mr-2" />
                House
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('mountain')}>
                <Mountain className="h-4 w-4 mr-2" />
                Mountain
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('car')}>
                <Car className="h-4 w-4 mr-2" />
                Car
              </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('road')}>
                  <Route className="h-4 w-4 mr-2" />
                  Road
                </Button>
              </div>
            </CollapsibleSection>

            {/* Player Models Section */}
            <CollapsibleSection title="Player Models" icon={<Navigation className="h-4 w-4" />}>
              <div className="space-y-2 p-4">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('player')}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Basic Player
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('knight')}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Knight
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('wizard')}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Wizard
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addObject('robot')}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Robot
                </Button>
              </div>
            </CollapsibleSection>

          <CollapsibleSection title="Camera Controls" icon={<Eye className="h-4 w-4" />}>
            <div className="p-4">
              <CameraControls
                onAddKeyframe={handleAddCameraKeyframe}
                onDeleteKeyframe={handleDeleteCameraKeyframe}
                onPlayAnimation={handlePlayCameraAnimation}
                onStopAnimation={handleStopCameraAnimation}
                onJumpToKeyframe={handleJumpToKeyframe}
                onReorderKeyframes={handleReorderKeyframes}
                keyframes={keyframes}
                isPlaying={isAnimating}
                currentCameraPosition={currentCameraPosition}
                currentCameraTarget={currentCameraTarget}
                onCameraChange={handleCameraChange}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Sky & Weather" icon={<Circle className="h-4 w-4" />}>
            <div className="p-4">
              <SkyControls
                skySettings={skySettings}
                onSkyChange={handleSkyChange}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Control Mode" icon={<Navigation className="h-4 w-4" />}>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={controlMode === 'orbit' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setControlMode('orbit')}
                  className="flex items-center gap-2"
                >
                  <MousePointer className="h-4 w-4" />
                  Orbit
                </Button>
                <Button
                  variant={controlMode === 'firstperson' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setControlMode('firstperson')}
                  className="flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  WASD
                </Button>
              </div>
              {controlMode === 'firstperson' && (
                <div className="text-xs text-muted-foreground bg-secondary/20 p-2 rounded mt-2">
                  📋 Click viewport to enable mouse look<br/>
                  🎮 WASD: Move • Space: Up • Shift: Fast
                </div>
              )}
            </div>
            </CollapsibleSection>

            {/* Object Animation Section */}
            <CollapsibleSection title="Object Animation" icon={<RotateCcw className="h-4 w-4" />}>
              <div className="p-4">
                <AnimationControls
                  selectedObjectId={selectedObjectId}
                  animations={animations}
                  onAddAnimation={handleAddAnimation}
                  onDeleteAnimation={handleDeleteAnimation}
                  onUpdateAnimation={handleUpdateAnimation}
                  onPlayAnimation={handlePlayAnimation}
                  onStopAnimation={handleStopAnimation}
                  isPlaying={playingAnimations}
                  onAddKeyframe={handleAddKeyframe}
                  onDeleteKeyframe={handleDeleteKeyframe}
                  onUpdateKeyframe={handleUpdateKeyframe}
                  currentObjectTransform={selectedObject ? {
                    position: selectedObject.position,
                    rotation: selectedObject.rotation,
                    scale: selectedObject.scale
                  } : undefined}
                />
              </div>
            </CollapsibleSection>

            {/* Enhanced Shader Presets */}
            <CollapsibleSection title="Material Presets" icon={<Circle className="h-4 w-4" />}>
              <div className="p-4">
                <ShaderPresets
                  onApplyPreset={handleMaterialChange}
                  currentMaterial={materialProperties}
                />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Import/Export" icon={<Upload className="h-4 w-4" />}>
              <div className="p-4">
                <EnhancedExporter
                  objects={objects}
                  animations={animations}
                  onImportObjects={handleImportObjects}
                  onImportAnimations={handleImportAnimations}
                />
              </div>
            </CollapsibleSection>

          {/* Material Editor - Only show when object is selected */}
          {selectedObject && (
            <CollapsibleSection 
              title="Material Editor" 
              icon={<Circle className="h-4 w-4" />} 
              isOpen={openSection === 'material'}
              onToggle={() => handleSectionToggle('material')}
            >
              <div className="p-4">
                <MaterialEditor
                  materialProperties={materialProperties}
                  onMaterialChange={handleMaterialChange}
                  selectedObjectId={selectedObjectId}
                />
              </div>
            </CollapsibleSection>
          )}

          <CollapsibleSection title="Actions" icon={<Trash2 className="h-4 w-4" />}>
            <div className="p-4">
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start"
                onClick={deleteSelectedObject}
                disabled={!selectedObjectId}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </CollapsibleSection>
        </div>
        
        {/* Main Viewport */}
        <div className="flex-1 flex flex-col p-4">
          <Viewport
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            transformMode={transformMode}
            onTransformObject={onTransformObject}
            keyframes={keyframes}
            isPlaying={isAnimating}
            onAnimationComplete={handleAnimationComplete}
            onCameraChange={handleCameraChange}
            skySettings={skySettings}
            controlMode={controlMode}
          />
        </div>
        
        {/* Right Properties Panel */}
        <div className="w-80 bg-card border-l border-border p-4 space-y-6 overflow-y-auto">
          {/* Material Editor */}
          <MaterialEditor
            selectedObjectId={selectedObjectId}
            materialProperties={materialProperties}
            onMaterialChange={handleMaterialChange}
          />
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Object Properties</h3>
            
            {selectedObject ? (
              <Card className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Object: {selectedObject.type}</h4>
                  <p className="text-xs text-muted-foreground">ID: {selectedObject.id}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Position</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <input 
                        type="number" 
                        step="0.1"
                        value={selectedObject.position[0].toFixed(1)}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded"
                        readOnly
                      />
                      <input 
                        type="number" 
                        step="0.1"
                        value={selectedObject.position[1].toFixed(1)}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded"
                        readOnly
                      />
                      <input 
                        type="number" 
                        step="0.1"
                        value={selectedObject.position[2].toFixed(1)}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Scale</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <input 
                        type="number" 
                        step="0.1"
                        value={selectedObject.scale[0].toFixed(1)}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded"
                        readOnly
                      />
                      <input 
                        type="number" 
                        step="0.1"
                        value={selectedObject.scale[1].toFixed(1)}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded"
                        readOnly
                      />
                      <input 
                        type="number" 
                        step="0.1"
                        value={selectedObject.scale[2].toFixed(1)}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">No object selected</p>
              </Card>
            )}
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Scene Objects</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {objects.map((object) => (
                  <div
                    key={object.id}
                    className={`p-2 text-xs rounded cursor-pointer transition-colors ${
                      object.id === selectedObjectId 
                        ? 'bg-primary/20 text-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedObjectId(object.id)}
                  >
                    {object.type} {object.id.slice(-4)}
                  </div>
                ))}
                {objects.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No objects in scene</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}