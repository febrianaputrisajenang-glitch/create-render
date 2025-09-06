import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { useRef, useState } from 'react'
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
  Eye
} from "lucide-react"
import { Link } from "react-router-dom"
import * as THREE from 'three'

type ObjectType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane'
type TransformMode = 'translate' | 'rotate' | 'scale'

interface SceneObject {
  id: string
  type: ObjectType
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

function SceneObject({ object, isSelected, onSelect }: { 
  object: SceneObject
  isSelected: boolean
  onSelect: () => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
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
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }
  
  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={onSelect}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={object.color}
        wireframe={isSelected}
        emissive={isSelected ? object.color : '#000000'}
        emissiveIntensity={isSelected ? 0.1 : 0}
      />
    </mesh>
  )
}

function Viewport({ 
  objects, 
  selectedObjectId, 
  onSelectObject,
  transformMode,
  onTransformObject 
}: {
  objects: SceneObject[]
  selectedObjectId: string | null
  onSelectObject: (id: string | null) => void
  transformMode: TransformMode
  onTransformObject: (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void
}) {
  const selectedObject = objects.find(obj => obj.id === selectedObjectId)
  
  return (
    <div className="flex-1 bg-viewport border border-border rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        onPointerMissed={() => onSelectObject(null)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        
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
          />
        ))}
        
        {selectedObject && (
          <TransformControls
            object-position={selectedObject.position}
            object-rotation={selectedObject.rotation} 
            object-scale={selectedObject.scale}
            mode={transformMode}
            onObjectChange={(event) => {
              if (event && event.target) {
                const target = event.target as any
                onTransformObject(
                  selectedObject.id,
                  [target.position.x, target.position.y, target.position.z],
                  [target.rotation.x, target.rotation.y, target.rotation.z],
                  [target.scale.x, target.scale.y, target.scale.z]
                )
              }
            }}
          />
        )}
        
        <OrbitControls 
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 * 1.8}
        />
      </Canvas>
    </div>
  )
}

export default function Editor3D() {
  const [objects, setObjects] = useState<SceneObject[]>([])
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  const [transformMode, setTransformMode] = useState<TransformMode>('translate')
  const [showGrid, setShowGrid] = useState(true)
  
  const addObject = (type: ObjectType) => {
    const id = Date.now().toString()
    const newObject: SceneObject = {
      id,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0], 
      scale: [1, 1, 1],
      color: '#00ffff'
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
  
  const selectedObject = objects.find(obj => obj.id === selectedObjectId)
  
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
        {/* Left Toolbar */}
        <div className="w-64 bg-card border-r border-border p-4 space-y-6">
          {/* Transform Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Transform</h3>
            <div className="grid grid-cols-3 gap-2">
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
          </div>
          
          {/* Add Objects */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Add Objects</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => addObject('cube')}
              >
                <Box className="h-4 w-4 mr-2" />
                Cube
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => addObject('sphere')}
              >
                <Circle className="h-4 w-4 mr-2" />
                Sphere
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => addObject('cylinder')}
              >
                <Cylinder className="h-4 w-4 mr-2" />
                Cylinder
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => addObject('cone')}
              >
                <Cylinder className="h-4 w-4 mr-2" />
                Cone
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => addObject('torus')}
              >
                <Circle className="h-4 w-4 mr-2" />
                Torus
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => addObject('plane')}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Plane
              </Button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Actions</h3>
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
        </div>
        
        {/* Main Viewport */}
        <div className="flex-1 flex flex-col p-4">
          <Viewport
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            transformMode={transformMode}
            onTransformObject={onTransformObject}
          />
        </div>
        
        {/* Right Properties Panel */}
        <div className="w-64 bg-card border-l border-border p-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Properties</h3>
            
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