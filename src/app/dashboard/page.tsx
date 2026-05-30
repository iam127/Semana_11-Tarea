"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Spinner, SpinnerOverlay } from "@/components/ui/spinner"
import { ProjectForm, ProjectCard, useProjects } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TaskTable"

const PROJECTS_PER_PAGE = 3

export default function DashboardPage() {
  const { projects, addProject, deleteProject, updateProject } = useProjects()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const paginatedProjects = projects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  )

  const handleSimulateLoad = () => {
    setIsLoading(true)
    setShowAlert(false)
    setTimeout(() => {
      setIsLoading(false)
      setShowAlert(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard de Proyectos
          </h1>
          <p className="text-slate-600">
            Gestiona tus proyectos y tareas con shadcn/ui
          </p>
          <div className="pt-4 flex items-center gap-4">
            <ProjectForm onAdd={addProject} />
            <Button variant="outline" onClick={handleSimulateLoad} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Cargando...
                </span>
              ) : "Simular petición"}
            </Button>
          </div>

          {showAlert && (
            <div className="mt-4">
              <Alert className="border-blue-200 bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <AlertTitle className="text-blue-800">¡Éxito!</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Los datos se cargaron correctamente desde el servidor.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">Total de proyectos activos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completados</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.filter(p => p.status === "Completado").length}</div>
                  <p className="text-xs text-muted-foreground">Proyectos finalizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.filter(p => p.status === "En progreso").length}</div>
                  <p className="text-xs text-muted-foreground">Proyectos en curso</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Planificados</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.filter(p => p.status === "Planificado").length}</div>
                  <p className="text-xs text-muted-foreground">Proyectos por iniciar</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
                      { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
                      { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
                      { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Avatar><AvatarFallback>{activity.user[0]}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action} <span className="font-medium">{activity.task}</span>
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendario</CardTitle>
                  <CardDescription>Fechas importantes del proyecto</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            {isLoading ? (
              <SpinnerOverlay message="Cargando proyectos..." />
            ) : (
              <>
                {projects.length === 0 ? (
                  <Alert>
                    <AlertDescription>No hay proyectos. Crea uno nuevo con el botón de arriba.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={deleteProject}
                        onUpdate={updateProject}
                      />
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink href="#" isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext href="#" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "María García", role: "Frontend Developer", email: "maria@example.com", status: "Activo" },
                    { name: "Juan Pérez", role: "Backend Developer", email: "juan@example.com", status: "Activo" },
                    { name: "Ana López", role: "UI/UX Designer", email: "ana@example.com", status: "Ausente" },
                    { name: "Carlos Ruiz", role: "DevOps Engineer", email: "carlos@example.com", status: "Activo" },
                    { name: "Laura Martínez", role: "Project Manager", email: "laura@example.com", status: "Activo" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.status === "Activo" ? "default" : "secondary"}>{member.status}</Badge>
                        <Button size="sm" variant="outline">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tasks */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configuración en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}