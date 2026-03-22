# Claude Skills — Guía de uso

Documentación de los comandos personalizados de Claude Code disponibles en este proyecto y cómo aprovecharlos al máximo.

---

## ¿Qué son las skills?

Son comandos `/slash` que puedes escribir directamente en el chat de Claude Code. Cada uno inyecta automáticamente un contexto especializado antes de tu instrucción, lo que significa que Claude responde con mayor precisión sin necesidad de explicar el proyecto desde cero cada vez.

Se guardan en `.claude/commands/` y son exclusivos de este proyecto.

---

## Skills disponibles

### `/ui` — Frontend especializado
**Archivo:** `.claude/commands/ui.md`

Carga todo el contexto del design system y las convenciones de frontend antes de tu tarea.

**Cuándo usarlo:**
- Crear un nuevo componente UI
- Implementar animaciones con Reanimated
- Aplicar tokens del design system (colores, espaciado, tipografía)
- Construir una pantalla nueva con el estilo pixel art
- Implementar cualquier feature del roadmap de gamificación

**Ejemplos:**
```
/ui crea el componente ProgressBar estilo RPG con animación de llenado
/ui implementa el tab El Invernadero con la vista Daily Overview
/ui añade la secuencia de animación de riego a PlantCareCard
/ui crea RarityBadge con los 4 niveles de rareza y sus colores
```

---

### `/nav` — Navegación y arquitectura
**Archivo:** `.claude/commands/nav.md`

Proporciona el mapa exacto de archivos y recetas paso a paso para tareas estructurales.

**Cuándo usarlo:**
- Agregar un nuevo tab a la navegación
- Crear una ruta dinámica nueva
- Saber exactamente qué archivos tocar para una tarea
- Refactorizar o mover partes del proyecto
- Agregar contexto global (nuevo context, nuevo hook)
- Cualquier tarea que involucre más de 2-3 archivos a la vez

**Ejemplos:**
```
/nav agrega un nuevo tab llamado Herbario a la navegación
/nav crea una ruta dinámica para el detalle de logros /achievement/[id]
/nav mueve la lógica de riego a un contexto PlantContext separado
/nav qué archivos debo tocar para agregar un color nuevo al tema
```

---

## Sistema de memoria automática (`MEMORY.md`)

Además de las skills manuales, Claude Code carga automáticamente el archivo de memoria del proyecto en cada nueva conversación.

**Archivo:** `.claude/projects/[proyecto]/memory/MEMORY.md`

### Qué contiene
- Resumen del stack técnico
- Mapa de archivos con rutas exactas
- Tabla de "tareas por tipo → archivos a tocar"
- Tokens del design system más usados
- Estado del roadmap

### Diferencia con las skills

| | `MEMORY.md` | Skills `/ui` y `/nav` |
|--|-------------|----------------------|
| **Se activa** | Automático en cada sesión | Solo cuando escribes el comando |
| **Propósito** | Contexto base siempre presente | Contexto profundo para tareas específicas |
| **Detalle** | Alto nivel, conciso (< 200 líneas) | Completo, con ejemplos de código |
| **Cuándo ayuda** | En toda conversación | En tareas de implementación concretas |

### Recomendación de uso

```
Conversación normal sobre el proyecto  →  MEMORY.md se carga solo
Crear componente nuevo                 →  /ui [descripción]
Modificar la navegación               →  /nav [descripción]
Tarea que toca design system + routes →  /nav + /ui (puedes combinarlos)
```

---

## Flujo recomendado para implementar features

### 1. Tareas pequeñas (1 archivo)
```
/ui crea el componente XPFloatingLabel
```
Claude tiene todo el contexto necesario. Sin preguntas de ruta ni convenciones.

### 2. Tareas medianas (2-4 archivos)
```
/nav agrega el tab Herbario con su screen básica
```
Claude sabe exactamente qué archivos crear y cuáles modificar.

### 3. Tareas grandes (feature completo)
Parte la tarea en pasos y usa la skill adecuada para cada uno:
```
Paso 1: /nav crea PlantContext con el modelo de datos Plant
Paso 2: /ui implementa la pantalla El Invernadero (Daily Overview)
Paso 3: /ui crea PlantCareCard con animación idle del sprite
Paso 4: /ui añade la secuencia completa de animación de riego
```

---

## Actualizar las skills

Las skills deben evolucionar con el proyecto. Actualízalas cuando:

- Se agregan componentes nuevos → añadir a la lista en `/ui`
- Se crean pantallas o rutas nuevas → actualizar el mapa en `/nav`
- Cambian convenciones de código → reflejar en ambas skills
- Se instalan nuevas librerías relevantes → documentar en `/ui`

**Archivos a editar:**
- `.claude/commands/ui.md`
- `.claude/commands/nav.md`
- `.claude/projects/[proyecto]/memory/MEMORY.md`

---

## Documentación relacionada

| Archivo | Contenido |
|---------|-----------|
| `docs/DESIGN_SYSTEM_RETRO.md` | Especificación completa del design system RGDS v1.0 |
| `docs/GAMIFICATION_SPEC.md` | Spec completa de la app gamificada (roadmap, componentes, datos) |
| `docs/CLAUDE_SKILLS.md` | Este archivo — guía de uso de skills |
| `.claude/commands/ui.md` | Skill de frontend |
| `.claude/commands/nav.md` | Skill de navegación |
