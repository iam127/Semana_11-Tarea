"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

const initialMembers: TeamMember[] = [
  { userId: "u1", role: "developer", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1995-03-12", phone: "+51 987 654 321", projectId: "p1", isActive: true },
  { userId: "u2", role: "developer", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1993-07-25", phone: "+51 912 345 678", projectId: "p2", isActive: true },
  { userId: "u3", role: "designer", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1997-01-08", phone: "+51 934 567 890", projectId: "p1", isActive: false },
  { userId: "u4", role: "devops", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1991-11-30", phone: "+51 956 789 012", projectId: "p3", isActive: true },
  { userId: "u5", role: "manager", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1988-05-17", phone: "+51 978 901 234", projectId: "p2", isActive: true },
]

const emptyMember: Omit<TeamMember, "userId"> = {
  role: "",
  name: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "",
  isActive: true,
}

function MemberForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<TeamMember, "userId">
  onSave: (data: Omit<TeamMember, "userId">) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role || !form.position) {
      setError("Completa los campos obligatorios.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSave(form)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-3 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label>Nombre <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
          </div>
          <div className="grid gap-1">
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label>Rol <span className="text-red-500">*</span></Label>
            <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="qa">QA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Posición <span className="text-red-500">*</span></Label>
            <Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Ej: Frontend Developer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label>Fecha de nacimiento</Label>
            <Input type="date" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} />
          </div>
          <div className="grid gap-1">
            <Label>Teléfono</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+51 999 999 999" />
          </div>
        </div>
        <div className="grid gap-1">
          <Label>ID de Proyecto</Label>
          <Input value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} placeholder="Ej: p1" />
        </div>
        <div className="grid gap-1">
          <Label>Estado</Label>
          <Select value={form.isActive ? "active" : "inactive"} onValueChange={v => setForm({ ...form, isActive: v === "active" })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
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

export function TeamTable() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [addOpen, setAddOpen] = useState(false)
  const [editMember, setEditMember] = useState<TeamMember | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleAdd = (data: Omit<TeamMember, "userId">) => {
    setMembers(prev => [...prev, { ...data, userId: "u" + Date.now() }])
    setAddOpen(false)
  }

  const handleEdit = (data: Omit<TeamMember, "userId">) => {
    if (!editMember) return
    setMembers(prev => prev.map(m => m.userId === editMember.userId ? { ...data, userId: editMember.userId } : m))
    setEditMember(null)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setMembers(prev => prev.filter(m => m.userId !== deleteId))
    setDeleteId(null)
  }

  const roleLabel: Record<string, string> = {
    developer: "Developer", designer: "Designer", devops: "DevOps", manager: "Manager", qa: "QA"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{members.length} miembros registrados</p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Agregar miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Nuevo miembro</DialogTitle>
              <DialogDescription>Completa los datos del nuevo integrante del equipo.</DialogDescription>
            </DialogHeader>
            <MemberForm initial={emptyMember} onSave={handleAdd} onCancel={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {members.map(member => (
          <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.position}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
                {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
                {member.birthdate && <p className="text-xs text-muted-foreground">Nac: {member.birthdate}</p>}
                {member.projectId && <p className="text-xs text-muted-foreground">Proyecto: {member.projectId}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge variant="outline">{roleLabel[member.role] ?? member.role}</Badge>
              <Badge variant={member.isActive ? "default" : "secondary"}>{member.isActive ? "Activo" : "Inactivo"}</Badge>
              <Dialog open={editMember?.userId === member.userId} onOpenChange={open => !open && setEditMember(null)}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => setEditMember(member)}>Editar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px]">
                  <DialogHeader>
                    <DialogTitle>Editar miembro</DialogTitle>
                    <DialogDescription>Modifica los datos del integrante.</DialogDescription>
                  </DialogHeader>
                  {editMember && (
                    <MemberForm
                      initial={{ role: editMember.role, name: editMember.name, email: editMember.email, position: editMember.position, birthdate: editMember.birthdate, phone: editMember.phone, projectId: editMember.projectId, isActive: editMember.isActive }}
                      onSave={handleEdit}
                      onCancel={() => setEditMember(null)}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <Dialog open={deleteId === member.userId} onOpenChange={open => !open && setDeleteId(null)}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(member.userId)}>Eliminar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[360px]">
                  <DialogHeader>
                    <DialogTitle>¿Eliminar miembro?</DialogTitle>
                    <DialogDescription>Esta acción eliminará a <strong>{member.name}</strong> del equipo. No se puede deshacer.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}