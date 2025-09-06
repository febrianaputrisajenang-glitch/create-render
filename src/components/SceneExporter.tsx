import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download, Upload, FileText } from "lucide-react"
import { useState, useRef } from 'react'
import * as THREE from 'three'

interface SceneObject {
  id: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  material: {
    color: string
    metalness: number
    roughness: number
    emissive: string
    emissiveIntensity: number
  }
}

interface SceneExporterProps {
  objects: SceneObject[]
  onImportObjects: (objects: SceneObject[]) => void
}

export default function SceneExporter({ objects, onImportObjects }: SceneExporterProps) {
  const [fileName, setFileName] = useState('my-3d-scene')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportScene = () => {
    const sceneData = {
      version: '1.0',
      objects: objects,
      metadata: {
        generator: '3D Sets Editor',
        createdAt: new Date().toISOString(),
        objectCount: objects.length
      }
    }

    const dataStr = JSON.stringify(sceneData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${fileName}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const exportAsGLTF = () => {
    // Simple GLTF export structure
    const gltfData = {
      asset: {
        generator: "3D Sets Editor",
        version: "2.0"
      },
      scenes: [{
        nodes: objects.map((_, index) => index)
      }],
      nodes: objects.map((obj, index) => ({
        name: `${obj.type}_${obj.id}`,
        translation: obj.position,
        rotation: obj.rotation,
        scale: obj.scale,
        mesh: index
      })),
      meshes: objects.map((obj, index) => ({
        primitives: [{
          attributes: {
            POSITION: index * 2,
            NORMAL: index * 2 + 1
          },
          material: index
        }]
      })),
      materials: objects.map(obj => ({
        pbrMetallicRoughness: {
          baseColorFactor: hexToRgb(obj.material.color),
          metallicFactor: obj.material.metalness,
          roughnessFactor: obj.material.roughness
        },
        emissiveFactor: hexToRgb(obj.material.emissive),
        name: `material_${obj.id}`
      }))
    }

    const dataStr = JSON.stringify(gltfData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${fileName}.gltf`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const sceneData = JSON.parse(content)
        
        if (sceneData.objects && Array.isArray(sceneData.objects)) {
          onImportObjects(sceneData.objects)
        } else {
          alert('Invalid scene file format')
        }
      } catch (error) {
        alert('Error reading file: ' + error)
      }
    }
    reader.readAsText(file)
  }

  const hexToRgb = (hex: string): [number, number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
      1.0
    ] : [1, 1, 1, 1]
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Import / Export
        </h3>
      </div>

      {/* File Name Input */}
      <div className="space-y-2">
        <Label htmlFor="fileName" className="text-xs">File Name</Label>
        <Input
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="my-3d-scene"
          className="text-xs"
        />
      </div>

      {/* Export Buttons */}
      <div className="space-y-2">
        <Label className="text-xs">Export Scene</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportScene}
            disabled={objects.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-3 w-3" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsGLTF}
            disabled={objects.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-3 w-3" />
            GLTF
          </Button>
        </div>
      </div>

      {/* Import Button */}
      <div className="space-y-2">
        <Label className="text-xs">Import Scene</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-2"
        >
          <Upload className="h-3 w-3" />
          Import JSON Scene
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        💾 Save and share your 3D creations
      </div>
    </Card>
  )
}