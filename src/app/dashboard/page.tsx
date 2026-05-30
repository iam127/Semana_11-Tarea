"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Spinner, SpinnerOverlay } from "@/components/ui/spinner"
import { ProjectForm, ProjectCard, useProjects } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TaskTable"
import { TeamTable } from "@/components/TeamTable"

const PER_PAGE = 3
type Tab = "overview" | "projects" | "team" | "tasks" | "settings"

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",  label: "Inicio",     icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "projects",  label: "Proyectos",  icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "team",      label: "Equipo",     icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "tasks",     label: "Tareas",     icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { id: "settings",  label: "Ajustes",    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
]

const LABELS: Record<Tab, string> = {
  overview: "Inicio", projects: "Proyectos", team: "Equipo", tasks: "Tareas", settings: "Ajustes",
}

/* Paleta */
const P = {
  bg:       "#F4F6FB",   /* fondo general ligeramente azulado */
  sidebar:  "#FFFFFF",
  topbar:   "#FFFFFF",
  border:   "#E8ECF4",
  text:     "#111827",
  muted:    "#6B7280",
  card:     "#FFFFFF",
  /* acentos vibrantes */
  indigo:   "#4F46E5",
  indigoL:  "#EEF2FF",
  indigoBorder: "#C7D2FE",
  violet:   "#7C3AED",
  emerald:  "#059669",
  emeraldL: "#ECFDF5",
  amber:    "#D97706",
  amberL:   "#FFFBEB",
  rose:     "#E11D48",
  roseL:    "#FFF1F2",
  sky:      "#0284C7",
  skyL:     "#E0F2FE",
}

function Ico({ d, size = 18, color = "currentColor" }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

/* ── Stat card ── */
function Stat({ label, n, unit, accent, light, border, icon, glow }: {
  label: string; n: number; unit: string; accent: string; light: string; border: string; icon: string; glow: string;
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? light : P.card,
        border: `1.5px solid ${hov ? border : P.border}`,
        borderRadius: 18, padding: "22px 20px",
        position: "relative", overflow: "hidden",
        boxShadow: hov
          ? `0 8px 32px -8px ${glow}, 0 2px 8px rgba(0,0,0,0.06)`
          : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all 0.22s ease",
        cursor: "default",
      }}
    >
      {/* Blob decorativo */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: light, opacity: 0.9, pointerEvents: "none" }} />

      {/* Icon */}
      <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg,${accent},${accent}CC)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: `0 4px 14px -4px ${glow}`, position: "relative" }}>
        <Ico d={icon} size={20} color="white" />
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{label}</p>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 46, fontWeight: 900, lineHeight: 1, color: accent }}>{n}</span>
        <span style={{ fontSize: 12, color: P.muted, marginBottom: 7 }}>{unit}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, borderRadius: 99, background: border, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, n * 14 + 12)}%`, borderRadius: 99, background: `linear-gradient(90deg,${accent},${accent}88)`, transition: "width 0.5s ease" }} />
      </div>
    </div>
  )
}

/* ── Feed row ── */
function FeedRow({ ini, name, action, task, time, c }: { ini: string; name: string; action: string; task: string; time: string; c: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 14, background: hov ? P.bg : "#FAFBFE", border: `1px solid ${hov ? P.border : "#EEF0F8"}`, transition: "all 0.15s" }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0, boxShadow: `0 4px 10px -2px ${c}88` }}>{ini}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: P.text, marginBottom: 2 }}>{name}</p>
        <p style={{ fontSize: 12, color: P.muted }}>{action} · <span style={{ color: c, fontWeight: 600 }}>{task}</span></p>
      </div>
      <span style={{ fontSize: 11, color: P.muted, background: P.bg, border: `1px solid ${P.border}`, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{time}</span>
    </div>
  )
}

/* ══════════════ PAGE ══════════════ */
export default function DashboardPage() {
  const { projects, addProject, deleteProject, updateProject } = useProjects()
  const [tab,     setTab]     = useState<Tab>("overview")
  const [date,    setDate]    = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const [alertOn, setAlertOn] = useState(false)
  const [pg,      setPg]      = useState(1)
  const [cfg, setCfg] = useState({ name: "Matias Galvan", email: "matias.galvan@tecsup.edu.pe", notifs: true, emails: false, dark: false })
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)

  const total  = Math.ceil(projects.length / PER_PAGE)
  const sliced = projects.slice((pg - 1) * PER_PAGE, pg * PER_PAGE)

  const simulate = () => { setLoading(true); setAlertOn(false); setTimeout(() => { setLoading(false); setAlertOn(true) }, 2000) }
  const onSave   = (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setSaved(false); setTimeout(() => { setSaving(false); setSaved(true) }, 1500) }

  const stats = [
    { label: "Total",       n: projects.length,                                          unit: "proyectos", accent: P.indigo,  light: P.indigoL,  border: P.indigoBorder, glow: "rgba(79,70,229,0.35)",  icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Completados", n: projects.filter(p => p.status === "Completado").length,   unit: "listos",    accent: P.emerald, light: P.emeraldL, border: "#A7F3D0",       glow: "rgba(5,150,105,0.35)",  icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
    { label: "En curso",    n: projects.filter(p => p.status === "En progreso").length,  unit: "activos",   accent: P.amber,   light: P.amberL,   border: "#FCD34D",       glow: "rgba(217,119,6,0.35)",  icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Pendientes",  n: projects.filter(p => p.status === "Planificado").length,  unit: "en espera", accent: P.sky,     light: P.skyL,     border: "#BAE6FD",       glow: "rgba(2,132,199,0.35)",  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  ]

  const feed = [
    { ini: "MG", name: "M. García",  action: "completó",  task: "Diseño UI",   time: "hace 5m",  c: P.indigo  },
    { ini: "JP", name: "J. Pérez",   action: "comentó",   task: "API Backend", time: "hace 1h",  c: P.emerald },
    { ini: "AL", name: "A. López",   action: "creó",      task: "Mobile App",  time: "hace 2h",  c: P.amber   },
    { ini: "CR", name: "C. Ruiz",    action: "actualizó", task: "Docs",        time: "hace 3h",  c: P.sky     },
  ]

  /* ── card base ── */
  const card = { background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" } as const

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: P.bg, fontFamily: "'Plus Jakarta Sans','Helvetica Neue',sans-serif" }}>

      {/* ════════ SIDEBAR ════════ */}
      <aside style={{
        width: 232, flexShrink: 0, display: "flex", flexDirection: "column",
        background: P.sidebar,
        borderRight: `1px solid ${P.border}`,
        boxShadow: "2px 0 16px rgba(79,70,229,0.06)",
      }}>
        {/* Brand / logo area — sin nombre de app */}
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${P.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(79,70,229,0.4)", flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: P.text, letterSpacing: -0.3 }}>Dashboard</p>
              <p style={{ fontSize: 11, color: P.muted, marginTop: 1 }}>TECSUP · 5to ciclo</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C4C9D8", letterSpacing: "0.13em", textTransform: "uppercase", padding: "0 10px", marginBottom: 8 }}>Menú</p>
          {NAV.map(item => {
            const active = tab === item.id
            return (
              <button key={item.id} onClick={() => setTab(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "10px 12px", borderRadius: 12, border: "none",
                  cursor: "pointer", width: "100%", textAlign: "left",
                  background: active ? P.indigoL : "transparent",
                  transition: "all 0.15s", position: "relative",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = P.bg }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
              >
                {active && (
                  <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: 99, background: P.indigo, boxShadow: `0 0 8px ${P.indigo}66` }} />
                )}
                <Ico d={item.icon} size={17} color={active ? P.indigo : "#9CA3AF"} />
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? P.indigo : P.muted, transition: "color 0.15s" }}>
                  {item.label}
                </span>
                {active && (
                  <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: P.indigo, boxShadow: `0 0 6px ${P.indigo}` }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${P.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", boxShadow: "0 3px 10px rgba(79,70,229,0.4)" }}>MG</div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: P.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Matias Galvan</p>
            <p style={{ fontSize: 10, color: P.muted }}>matias.galvan@tecsup.edu.pe</p>
          </div>
        </div>
      </aside>

      {/* ════════ MAIN ════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── Topbar ── */}
        <header style={{ height: 62, flexShrink: 0, background: P.topbar, borderBottom: `1px solid ${P.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Accent bar + title */}
            <div style={{ width: 4, height: 22, borderRadius: 99, background: `linear-gradient(180deg,${P.indigo},${P.violet})`, boxShadow: `0 0 8px ${P.indigo}66` }} />
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, color: P.text, letterSpacing: -0.4 }}>{LABELS[tab]}</span>
              <span style={{ fontSize: 11, color: P.muted, marginLeft: 10 }}>TECSUP 2026</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 14px", borderRadius: 11, background: P.bg, border: `1px solid ${P.border}`, color: P.muted, fontSize: 13, cursor: "text" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={P.muted} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Buscar...
            </div>

            {/* Bell */}
            <div style={{ position: "relative" }}>
              <button style={{ width: 38, height: 38, borderRadius: 11, background: P.bg, border: `1px solid ${P.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={P.muted} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </button>
              <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: `2px solid ${P.topbar}`, boxShadow: "0 0 5px rgba(239,68,68,0.6)" }} />
            </div>

            <ProjectForm onAdd={addProject} />

            <button onClick={simulate} disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 11, border: `1px solid ${P.border}`, background: P.bg, color: P.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {loading
                ? <><Spinner size="sm" />Cargando...</>
                : <><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Simular</>
              }
            </button>
          </div>
        </header>

        {alertOn && (
          <div style={{ padding: "12px 28px 0", flexShrink: 0 }}>
            <Alert style={{ background: P.emeraldL, border: "1px solid #A7F3D0", borderRadius: 14 }}>
              <svg className="h-4 w-4" style={{ color: P.emerald }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              <AlertTitle style={{ color: "#065F46" }}>Completado</AlertTitle>
              <AlertDescription style={{ color: "#047857" }}>Datos sincronizados correctamente.</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ══ INICIO ══ */}
          {tab === "overview" && (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {stats.map((s, i) => <Stat key={i} {...s} />)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
              {/* Feed */}
              <div style={{ ...card, padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: P.text }}>Actividad del equipo</p>
                    <p style={{ fontSize: 11, color: P.muted, marginTop: 2 }}>Últimas acciones registradas</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: P.indigo, background: P.indigoL, border: `1px solid ${P.indigoBorder}`, padding: "4px 14px", borderRadius: 20 }}>En vivo</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {feed.map((f, i) => <FeedRow key={i} {...f} />)}
                </div>
              </div>

              {/* Calendar */}
              <div style={{ ...card, padding: "22px 18px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: P.text, marginBottom: 4 }}>Calendario</p>
                <p style={{ fontSize: 11, color: P.muted, marginBottom: 16 }}>Fechas de entrega</p>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl" />
              </div>
            </div>
          </>)}

          {/* ══ PROYECTOS ══ */}
          {tab === "projects" && (<>
            {loading ? <SpinnerOverlay message="Cargando proyectos..." /> : (<>
              {projects.length === 0
                ? <div style={{ ...card, padding: "64px 24px", textAlign: "center" }}><p style={{ color: P.muted }}>Sin proyectos. Crea el primero.</p></div>
                : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{sliced.map(p => <ProjectCard key={p.id} project={p} onDelete={deleteProject} onUpdate={updateProject} />)}</div>
              }
              {total > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={() => setPg(p => Math.max(1, p - 1))} /></PaginationItem>
                    {Array.from({ length: total }, (_, i) => i + 1).map(p => (
                      <PaginationItem key={p}><PaginationLink href="#" isActive={pg === p} onClick={() => setPg(p)}>{p}</PaginationLink></PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={() => setPg(p => Math.min(total, p + 1))} /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>)}
          </>)}

          {/* ══ EQUIPO ══ */}
          {tab === "team" && (
            <div style={{ ...card, padding: "24px" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: P.text, marginBottom: 4 }}>Equipo de trabajo</p>
              <p style={{ fontSize: 11, color: P.muted, marginBottom: 20 }}>Gestión completa de integrantes</p>
              <TeamTable />
            </div>
          )}

          {/* ══ TAREAS ══ */}
          {tab === "tasks" && (
            <div style={{ ...card, padding: "24px" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: P.text, marginBottom: 4 }}>Gestión de tareas</p>
              <p style={{ fontSize: 11, color: P.muted, marginBottom: 20 }}>Control de avance por tarea</p>
              <TasksTable />
            </div>
          )}

          {/* ══ AJUSTES ══ */}
          {tab === "settings" && (
            <div style={{ maxWidth: 540, display: "flex", flexDirection: "column", gap: 14 }}>
              {saved && (
                <Alert style={{ background: P.emeraldL, border: "1px solid #A7F3D0", borderRadius: 14 }}>
                  <svg className="h-4 w-4" style={{ color: P.emerald }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  <AlertTitle style={{ color: "#065F46" }}>Guardado</AlertTitle>
                  <AlertDescription style={{ color: "#047857" }}>Preferencias actualizadas.</AlertDescription>
                </Alert>
              )}
              <form onSubmit={onSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    title: "Perfil",
                    body: (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[{ l: "Nombre", k: "name" as const, t: "text" }, { l: "Correo", k: "email" as const, t: "email" }].map(f => (
                          <div key={f.k}>
                            <Label style={{ fontSize: 12, color: P.muted, marginBottom: 6, display: "block" }}>{f.l}</Label>
                            <Input type={f.t} value={cfg[f.k]} onChange={e => setCfg({ ...cfg, [f.k]: e.target.value })} style={{ borderColor: P.border }} />
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Notificaciones",
                    body: (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                          { k: "notifs" as const, l: "Notificaciones en app", d: "Alertas dentro del dashboard" },
                          { k: "emails" as const, l: "Alertas por correo",    d: "Email al detectar cambios" },
                        ].map(item => (
                          <div key={item.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 500, color: P.text }}>{item.l}</p>
                              <p style={{ fontSize: 11, color: P.muted }}>{item.d}</p>
                            </div>
                            <Switch checked={cfg[item.k]} onCheckedChange={v => setCfg({ ...cfg, [item.k]: v })} />
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Apariencia",
                    body: (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: P.text }}>Modo oscuro</p>
                          <p style={{ fontSize: 11, color: P.muted }}>Cambiar tema visual</p>
                        </div>
                        <Switch checked={cfg.dark} onCheckedChange={v => setCfg({ ...cfg, dark: v })} />
                      </div>
                    ),
                  },
                ].map(s => (
                  <div key={s.title} style={{ ...card, padding: "20px 22px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>{s.title}</p>
                    {s.body}
                  </div>
                ))}

                <div style={{ display: "flex", gap: 12, paddingTop: 2 }}>
                  <button type="submit" disabled={saving}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${P.indigo},${P.violet})`, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(79,70,229,0.4)" }}>
                    {saving ? <><Spinner size="sm" />Guardando...</> : "Guardar cambios"}
                  </button>
                  <button type="button"
                    onClick={() => { setCfg({ name: "Matias Galvan", email: "matias.galvan@tecsup.edu.pe", notifs: true, emails: false, dark: false }); setSaved(false) }}
                    style={{ padding: "10px 20px", borderRadius: 12, border: `1px solid ${P.border}`, background: P.bg, color: P.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                    Restablecer
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}