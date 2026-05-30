"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"

export interface Task {
  id: number
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  dateline: string
}

const initialTasks: Task[] = [
  { id: 1, description: "Implementar autenticación", projectId: "E-commerce Platform", status: "En progreso", priority: "Alta", userId: "María García", dateline: "2025-11-15" },
  { id: 2, description: "Diseñar pantalla de perfil", projectId: "Mobile App", status: "Pendiente", priority: "Media", userId: "Ana López", dateline: "2025-11-20" },
  { id: 3, description: "Configurar CI/CD", projectId: "API Gateway", status: "Completado", priority: "Alta", userId: "Carlos Ruiz", dateline: "2025-11-10" },
  { id: 4, description: "Optimizar queries SQL", projectId: "E-commerce Platform", status: "En progreso", priority: "Urgente", userId: "Juan Pérez", dateline: "2025-11-12" },
  { id: 5, description: "Documentar API endpoints", projectId: "API Gateway", status: "Pendiente", priority: "Baja", userId: "Laura Martínez", dateline: "2025-11-25" },
  { id: 6, description: "Crear pantalla de login", projectId: "Mobile App", status: "Completado", priority: "Alta", userId: "María García", dateline: "2025-11-05" },
  { id: 7, description: "Configurar Redis cache", projectId: "E-commerce Platform", status: "Pendiente", priority: "Media", userId: "Juan Pérez", dateline: "2025-12-01" },
]

const TASKS_PER_PAGE = 5

const emptyTask: Omit<Task, "id"> = {
  description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: ""
}

const statusVariant = (s: string): "default" | "secondary" | "outline" | "destructive" =>
  s === "Completado" ? "default" : s === "En progreso" ? "secondary" : "outline"

const priorityVariant = (p: string): "default" | "secondary" | "outline" | "destructive" =>
  p === "Urgente" ? "destructive" : p === "Alta" ? "default" : p === "Media" ? "secondary" : "outline"

function TaskForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Task, "id">
  onSave: (data: Omit<Task, "id">) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.description || !form.projectId || !form.userId) {
      setError("Completa descripción, proyecto y responsable.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => { setLoading(false); onSave(form) }, 900)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-3 py-2">
        <div className="grid gap-1">
          <Label>Descripción <span className="text-red-500">*</span></Label>
          <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la tarea" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label>Proyecto (projectId) <span className="text-red-500">*</span></Label>
            <Input value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} placeholder="Nombre del proyecto" />
          </div>
          <div className="grid gap-1">
            <Label>Responsable (userId) <span className="text-red-500">*</span></Label>
            <Input value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} placeholder="Nombre del responsable" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Prioridad</Label>
            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-1">
          <Label>Fecha límite (dateline)</Label>
          <Input type="date" value={form.dateline} onChange={e => setForm({ ...form, dateline: e.target.value })} />
        </div>
      </div>
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <span className="flex items-center gap-2"><Spinner size="sm" />Guardando...</span> : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE)
  const paginated = tasks.slice((page - 1) * TASKS_PER_PAGE, page * TASKS_PER_PAGE)

  const handleAdd = (data: Omit<Task, "id">) => {
    setTasks(prev => [...prev, { ...data, id: Date.now() }])
    setAddOpen(false)
    setPage(Math.ceil((tasks.length + 1) / TASKS_PER_PAGE))
  }

  const handleEdit = (data: Omit<Task, "id">) => {
    if (!editTask) return
    setTasks(prev => prev.map(t => t.id === editTask.id ? { ...data, id: editTask.id } : t))
    setEditTask(null)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setTasks(prev => prev.filter(t => t.id !== deleteId))
    setDeleteId(null)
    if (paginated.length === 1 && page > 1) setPage(page - 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{tasks.length} tareas en total</p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Nueva tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Crear tarea</DialogTitle>
              <DialogDescription>Completa los campos para registrar una nueva tarea.</DialogDescription>
            </DialogHeader>
            <TaskForm initial={emptyTask} onSave={handleAdd} onCancel={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Tareas — página {page} de {totalPages}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"><Checkbox /></TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(task => (
              <TableRow key={task.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>{task.projectId}</TableCell>
                <TableCell><Badge variant={statusVariant(task.status)}>{task.status}</Badge></TableCell>
                <TableCell><Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge></TableCell>
                <TableCell>{task.userId}</TableCell>
                <TableCell>{task.dateline}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Dialog open={editTask?.id === task.id} onOpenChange={open => !open && setEditTask(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditTask(task)}>Editar</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader>
                          <DialogTitle>Editar tarea</DialogTitle>
                          <DialogDescription>Modifica los datos de la tarea.</DialogDescription>
                        </DialogHeader>
                        {editTask && (
                          <TaskForm
                            initial={{ description: editTask.description, projectId: editTask.projectId, status: editTask.status, priority: editTask.priority, userId: editTask.userId, dateline: editTask.dateline }}
                            onSave={handleEdit}
                            onCancel={() => setEditTask(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog open={deleteId === task.id} onOpenChange={open => !open && setDeleteId(null)}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteId(task.id)}>Eliminar</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[360px]">
                        <DialogHeader>
                          <DialogTitle>¿Eliminar tarea?</DialogTitle>
                          <DialogDescription>Se eliminará "<strong>{task.description}</strong>". Esta acción no se puede deshacer.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
                          <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage(p => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PaginationItem key={p}>
                <PaginationLink href="#" isActive={page === p} onClick={() => setPage(p)}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}