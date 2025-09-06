import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { 
  Box, 
  Zap, 
  Download, 
  Share2, 
  Palette, 
  MousePointer,
  RotateCcw,
  Move3D
} from "lucide-react"
import Hero3D from "./Hero3D"

export default function LandingPage() {
  const features = [
    {
      icon: <Box className="h-6 w-6" />,
      title: "3D Primitives",
      description: "Add cubes, spheres, cylinders and more basic shapes"
    },
    {
      icon: <Move3D className="h-6 w-6" />,
      title: "Transform Tools", 
      description: "Move, rotate, and scale objects with precision"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Materials & Textures",
      description: "Apply colors, materials and upload custom textures"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Formats",
      description: "Export to GLB, GLTF, OBJ, FBX and more"
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Easy Sharing",
      description: "Share your models with unique links or downloads"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "No Registration",
      description: "Start creating immediately - no signup required"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Box className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              3D SETS
            </h1>
          </div>
          <Link to="/editor">
            <Button size="lg" className="glow transition-glow">
              Start Modeling
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Create <span className="bg-gradient-primary bg-clip-text text-transparent">3D Assets</span>
                <br />
                for Games & Animation
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Professional 3D modeling in your browser. No downloads, no registration - 
                just create, export, and share amazing 3D models instantly.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/editor">
                <Button size="lg" className="glow transition-glow text-lg px-8">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Download className="mr-2 h-5 w-5" />
                View Examples
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>No Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Export Any Format</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 lg:h-[500px]">
            <div className="absolute inset-0 bg-card rounded-2xl border border-border overflow-hidden">
              <Hero3D />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-bold">Everything You Need</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional 3D modeling tools designed for speed and simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 transition-smooth hover:shadow-glow hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold">
              Ready to Start Creating?
            </h3>
            <p className="text-xl text-muted-foreground">
              Join thousands of creators building amazing 3D assets with our powerful web-based editor
            </p>
            <Link to="/editor">
              <Button size="lg" className="glow transition-glow text-lg px-12 py-6">
                <Box className="mr-3 h-6 w-6" />
                Launch 3D Editor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                <Box className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">3D SETS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with React Three Fiber & Three.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}