"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export interface Project {
  id: number
  name: string
  description: string
  category: string
  priority: string
  members: string
  status: string
  progress: number
}

const initialProjects: Project[] = [
  { id: 1, name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "high", members: "María García, Juan Pérez", status: "En progreso", progress: 65 },
  { id: 2, name: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "medium", members: "Ana López", status: "En revisión", progress: 90 },
  { id: 3, name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "low", members: "Carlos Ruiz", status: "Planificado", progress: 20 },
  { id: 4, name: "API Gateway", description: "Microservicios con Node.js", category: "other", priority: "urgent", members: "Laura Martínez", status: "En progreso", progress: 45 },
  { id: 5, name: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "medium", members: "María García", status: "Completado", progress: 100 },
  { id: 6, name: "Marketing Website", description: "Sitio web institucional", category: "marketing", priority: "high", members: "Juan Pérez, Ana López", status: "En progreso", progress: 75 },
]

const STORAGE_KEY = "lab11_projects"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === "undefined") return initialProjects
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialProjects
    } catch {
      return initialProjects
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch {
      // localStorage no disponible
    }
  }, [projects])

  const addProject = (project: Omit<Project, "id" | "status" | "progress">) => {
    const newProject: Project = {
      ...project,
      id: Date.now(),
      status: "Planificado",
      progress: 0,
    }
    setProjects(prev => [...prev, newProject])
  }

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  return { projects, addProject, deleteProject, updateProject }
}

interface ProjectFormProps {
  onAdd: (project: Omit<Project, "id" | "status" | "progress">) => void
}

export function ProjectForm({ onAdd }: ProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
    members: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.priority) {
      setError("Por favor completa todos los campos requeridos.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      onAdd(formData)
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setFormData({ name: "", description: "", category: "", priority: "", members: "" })
        setOpen(false)
      }, 1000)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">¡Proyecto creado exitosamente!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Proyecto <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoría <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Prioridad <span className="text-red-500">*</span></Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger><SelectValue placeholder="Selecciona la prioridad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="members">Miembros del equipo</Label>
              <Input
                id="members"
                placeholder="Ej: María García, Juan Pérez"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Guardando...
                </span>
              ) : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface ProjectCardProps {
  project: Project
  onDelete: (id: number) => void
  onUpdate: (project: Project) => void
}

export function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
  const [openDetail, setOpenDetail] = useState(false)
  const [editData, setEditData] = useState(project)

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(editData)
    setOpenDetail(false)
  }

  const priorityLabel: Record<string, string> = {
    low: "Baja", medium: "Media", high: "Alta", urgent: "Urgente"
  }
  const categoryLabel: Record<string, string> = {
    web: "Web", mobile: "Mobile", design: "Diseño", marketing: "Marketing", other: "Otro"
  }

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant={project.status === "Completado" ? "default" : project.status === "En revisión" ? "secondary" : "outline"}>
          {project.status}
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">{categoryLabel[project.category] ?? project.category}</Badge>
        <Badge variant="outline">{priorityLabel[project.priority] ?? project.priority}</Badge>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {project.members && (
        <p className="text-xs text-muted-foreground">👥 {project.members}</p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Dialog open={openDetail} onOpenChange={setOpenDetail}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">Ver detalles</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
                <DialogDescription>Modifica los datos del proyecto.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nombre</Label>
                  <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Miembros</Label>
                  <Input value={editData.members} onChange={(e) => setEditData({ ...editData, members: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Progreso (%)</Label>
                  <Input type="number" min={0} max={100} value={editData.progress} onChange={(e) => setEditData({ ...editData, progress: Number(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select value={editData.status} onValueChange={(v) => setEditData({ ...editData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planificado">Planificado</SelectItem>
                      <SelectItem value="En progreso">En progreso</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDetail(false)}>Cancelar</Button>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="destructive" onClick={() => onDelete(project.id)}>
          Eliminar
        </Button>
      </div>
    </div>
  )
}