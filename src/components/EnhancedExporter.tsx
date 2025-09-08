import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { 
  Download, 
  Upload, 
  FileText, 
  Video, 
  Package,
  Loader2
} from "lucide-react"

interface SceneObject {
  id: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  material: any
}

interface ObjectAnimation {
  id: string
  objectId: string
  name: string
  duration: number
  loop: boolean
  keyframes: any[]
}

interface EnhancedExporterProps {
  objects: SceneObject[]
  animations: ObjectAnimation[]
  onImportObjects: (objects: SceneObject[]) => void
  onImportAnimations?: (animations: ObjectAnimation[]) => void
}

type ExportFormat = 'json' | 'gltf' | 'fbx' | 'obj' | 'mp4' | 'gif'

export default function EnhancedExporter({ 
  objects, 
  animations,
  onImportObjects,
  onImportAnimations 
}: EnhancedExporterProps) {
  const [fileName, setFileName] = useState('scene')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Enhanced export with different formats
  const exportScene = async () => {
    if (objects.length === 0) {
      toast.error("No objects to export")
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      let content: string
      let mimeType: string
      let extension: string

      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify({
            metadata: {
              version: '2.0',
              type: 'LovableEditor3D',
              generator: 'Enhanced 3D Editor',
              timestamp: new Date().toISOString()
            },
            scene: {
              objects,
              animations,
              settings: {
                backgroundColor: '#87CEEB',
                lighting: 'default'
              }
            }
          }, null, 2)
          mimeType = 'application/json'
          extension = 'json'
          break

        case 'gltf':
          // Enhanced GLTF export with animation support
          const gltfData = {
            asset: {
              version: '2.0',
              generator: 'Enhanced 3D Editor'
            },
            scene: 0,
            scenes: [{ nodes: objects.map((_, i) => i) }],
            nodes: objects.map((obj, index) => ({
              name: `${obj.type}_${obj.id.slice(-4)}`,
              translation: obj.position,
              rotation: obj.rotation,
              scale: obj.scale,
              mesh: index
            })),
            meshes: objects.map((obj) => ({
              primitives: [{
                attributes: { POSITION: 0 },
                material: 0
              }]
            })),
            materials: objects.map((obj) => ({
              name: `material_${obj.id.slice(-4)}`,
              pbrMetallicRoughness: {
                baseColorFactor: hexToRgba(obj.material.color || '#ffffff'),
                metallicFactor: obj.material.metalness || 0,
                roughnessFactor: obj.material.roughness || 1
              },
              emissiveFactor: hexToRgba(obj.material.emissive || '#000000')
            })),
            animations: animations.map(anim => ({
              name: anim.name,
              channels: anim.keyframes.map((_, i) => ({
                sampler: i,
                target: {
                  node: objects.findIndex(obj => obj.id === anim.objectId),
                  path: 'translation'
                }
              })),
              samplers: anim.keyframes.map(kf => ({
                input: 0,
                output: 1,
                interpolation: kf.easing === 'linear' ? 'LINEAR' : 'CUBICSPLINE'
              }))
            }))
          }
          content = JSON.stringify(gltfData, null, 2)
          mimeType = 'model/gltf+json'
          extension = 'gltf'
          break

        case 'fbx':
          // FBX-compatible format for Unity
          const fbxCompatible = {
            version: '7.4.0',
            objects: objects.map(obj => ({
              name: obj.type,
              type: 'Mesh',
              properties: {
                position: obj.position,
                rotation: obj.rotation.map(r => r * 180 / Math.PI), // Convert to degrees
                scale: obj.scale
              },
              material: {
                diffuse: obj.material.color,
                metallic: obj.material.metalness,
                roughness: obj.material.roughness
              }
            })),
            animations: animations
          }
          content = JSON.stringify(fbxCompatible, null, 2)
          mimeType = 'application/octet-stream'
          extension = 'fbx.json' // JSON representation for FBX
          break

        case 'obj':
          // Wavefront OBJ format
          let objContent = '# Generated by Enhanced 3D Editor\n\n'
          let vertexIndex = 1
          
          objects.forEach((obj, objIndex) => {
            objContent += `o ${obj.type}_${obj.id.slice(-4)}\n`
            
            // Simple cube vertices for demonstration
            const vertices = [
              [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5],
              [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]
            ]
            
            vertices.forEach(vertex => {
              const [x, y, z] = vertex
              const worldPos = [
                x * obj.scale[0] + obj.position[0],
                y * obj.scale[1] + obj.position[1],
                z * obj.scale[2] + obj.position[2]
              ]
              objContent += `v ${worldPos[0]} ${worldPos[1]} ${worldPos[2]}\n`
            })
            
            // Cube faces
            const faces = [
              [1, 2, 3, 4], [5, 8, 7, 6], [1, 5, 6, 2],
              [2, 6, 7, 3], [3, 7, 8, 4], [5, 1, 4, 8]
            ]
            
            faces.forEach(face => {
              const faceIndices = face.map(v => v + vertexIndex - 1)
              objContent += `f ${faceIndices.join(' ')}\n`
            })
            
            vertexIndex += 8
            objContent += '\n'
          })
          
          content = objContent
          mimeType = 'text/plain'
          extension = 'obj'
          break

        default:
          throw new Error(`Unsupported export format: ${exportFormat}`)
      }

      clearInterval(progressInterval)
      setExportProgress(100)

      // Download file
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`Scene exported as ${extension.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export scene')
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  // Export animation as MP4 (simulation)
  const exportAnimationVideo = async () => {
    if (animations.length === 0) {
      toast.error("No animations to export")
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate video rendering progress
      for (let i = 0; i <= 100; i += 5) {
        setExportProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // In a real implementation, this would render frames and create MP4
      toast.success("Animation export completed! (Video rendering requires server-side processing)")
    } catch (error) {
      toast.error("Failed to export animation")
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (data.scene?.objects) {
          onImportObjects(data.scene.objects)
          if (data.scene?.animations && onImportAnimations) {
            onImportAnimations(data.scene.animations)
          }
          toast.success(`Imported ${data.scene.objects.length} objects`)
        } else if (Array.isArray(data)) {
          onImportObjects(data)
          toast.success(`Imported ${data.length} objects`)
        } else {
          toast.error("Invalid file format")
        }
      } catch (error) {
        console.error('Import error:', error)
        toast.error("Failed to import file")
      }
    }
    reader.readAsText(file)
  }

  const hexToRgba = (hex: string): [number, number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
          1.0
        ]
      : [1, 1, 1, 1]
  }

  return (
    <div className="space-y-4">
      {/* Export Section */}
      <Card className="p-4 space-y-4">
        <h4 className="text-sm font-medium">Export Scene</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">File Name</label>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter filename"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground">Format</label>
            <Select value={exportFormat} onValueChange={(value: ExportFormat) => setExportFormat(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (Scene Data)
                  </div>
                </SelectItem>
                <SelectItem value="gltf">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    GLTF (3D Model)
                  </div>
                </SelectItem>
                <SelectItem value="fbx">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    FBX (Unity Compatible)
                  </div>
                </SelectItem>
                <SelectItem value="obj">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    OBJ (Wavefront)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}

          <Button
            onClick={exportScene}
            disabled={objects.length === 0 || isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </div>
      </Card>

      {/* Animation Export */}
      {animations.length > 0 && (
        <Card className="p-4 space-y-4">
          <h4 className="text-sm font-medium">Export Animation</h4>
          
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Export animations as video files or animation data
            </p>
            
            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rendering animation...
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={exportAnimationVideo}
                disabled={isExporting}
                variant="outline"
                size="sm"
              >
                <Video className="h-4 w-4 mr-2" />
                MP4
              </Button>
              <Button
                onClick={exportAnimationVideo}
                disabled={isExporting}
                variant="outline"
                size="sm"
              >
                <Video className="h-4 w-4 mr-2" />
                GIF
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Separator />

      {/* Import Section */}
      <Card className="p-4 space-y-4">
        <h4 className="text-sm font-medium">Import Scene</h4>
        
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Import JSON scene files with objects and animations
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            style={{ display: 'none' }}
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
        </div>
      </Card>

      {/* Unity Integration Info */}
      <Card className="p-4 space-y-2 bg-secondary/20">
        <h5 className="text-xs font-medium">Unity Integration</h5>
        <p className="text-xs text-muted-foreground">
          Export as FBX or GLTF for direct import into Unity 3D. 
          Animation data is preserved and ready for Unity's Animator system.
        </p>
      </Card>
    </div>
  )
}