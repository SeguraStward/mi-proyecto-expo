# Design System — PlantCare App

## Descripción
Especificación del mini Design System para la aplicación PlantCare de identificación y mantenimiento de plantas. Basado en los hallazgos de la investigación de apps referentes (PlantNet, PictureThis) y las guías oficiales de Material Design 3 y Apple HIG.

---

## A. Tokens de Diseño

### A.1 Colores

#### Paleta Principal
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `primary` | `#2D6A4F` | `#52B788` | CTAs, acentos, elementos interactivos principales |
| `primaryLight` | `#52B788` | `#74D4A0` | Hover/focus suave, iconos activos |
| `primarySoft` | `#95D5B2` | `#3A8C65` | Fondos suaves, badges |
| `primaryPale` | `#D8F3DC` | `#1A3D2B` | Fondos de header, cards destacadas |

#### Superficie y Fondos
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `background` | `#F8FBF8` | `#0D1B12` | Fondo principal de la app |
| `surface` | `#FFFFFF` | `#1A2E22` | Cards, modals, inputs |
| `surfaceVariant` | `#F0F5F1` | `#243D2E` | Fondos secundarios, secciones alternantes |

#### Texto
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `textPrimary` | `#1B4332` | `#E8F5E9` | Títulos, texto principal |
| `textSecondary` | `#52796F` | `#A5C9B4` | Subtítulos, texto de soporte |
| `textMuted` | `#8DA89B` | `#6B8F7B` | Placeholders, texto desactivado |
| `textOnPrimary` | `#FFFFFF` | `#FFFFFF` | Texto sobre fondo primary |

#### Bordes y Divisores
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `border` | `#E8F0E8` | `#2E4A38` | Bordes de inputs, cards outlined |
| `divider` | `#E0E8E0` | `#263E30` | Separadores de listas |

#### Estados
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `success` | `#40916C` | `#52B788` | Confirmaciones, validaciones OK |
| `warning` | `#E9C46A` | `#F4D58D` | Alertas leves |
| `error` | `#E76F51` | `#FF8A6A` | Errores de validación, destructivos |
| `info` | `#457B9D` | `#6BAED6` | Información, tooltips |
| `disabled` | `#C8D6C8` | `#3A4D40` | Elementos no interactivos |
| `pressed` | `#1B5E40` | `#3A8C65` | Estado presionado de primario |

#### Utilitarios
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `white` | `#FFFFFF` | `#FFFFFF` | Constante |
| `black` | `#000000` | `#000000` | Constante |
| `shadow` | `#1B433220` | `#00000040` | Sombras (20% / 25% opacidad) |
| `overlay` | `#00000040` | `#00000060` | Modals, overlays |

---

### A.2 Tipografía

**Familia:** System font (SF Pro en iOS, Roboto en Android) — garantiza rendimiento nativo y legibilidad óptima.

| Preset | Tamaño | Peso | Line Height | Uso |
|--------|--------|------|-------------|-----|
| `hero` | 34px | Bold (700) | 1.2 | Pantallas de bienvenida, onboarding |
| `title` | 28px | Bold (700) | 1.2 | Títulos principales de pantalla |
| `subtitle` | 20px | SemiBold (600) | 1.3 | Subtítulos, títulos de sección |
| `body` | 16px | Regular (400) | 1.5 | Texto principal, descripciones |
| `bodySmall` | 14px | Regular (400) | 1.4 | Texto secundario, etiquetas |
| `caption` | 12px | Medium (500) | 1.3 | Labels, timestamps, metadata |
| `overline` | 11px | SemiBold (600) | 1.4 | Chips, badges, overlays |

---

### A.3 Espaciado

Escala base-4 (consistente con Material Design 3):

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Espaciado interno mínimo, gaps entre iconos |
| `sm` | 8px | Padding interno de chips, gaps pequeños |
| `md` | 12px | Padding de inputs, separación entre elementos |
| `lg` | 16px | Padding de cards, margen entre secciones |
| `xl` | 20px | Margen horizontal de pantalla |
| `2xl` | 24px | Separación entre secciones grandes |
| `3xl` | 32px | Padding vertical de headers |
| `4xl` | 40px | Separación de bloques principales |
| `5xl` | 48px | Padding top de pantallas (safe area) |

---

### A.4 Bordes / Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 8px | Chips, badges pequeños |
| `md` | 14px | Inputs, botones |
| `lg` | 20px | Cards |
| `xl` | 28px | Headers, modals |
| `full` | 999px | Avatares, FABs circulares |

---

### A.5 Elevación / Sombras

| Token | shadowOffset | shadowOpacity | shadowRadius | elevation (Android) | Uso |
|-------|-------------|---------------|--------------|-------------------|-----|
| `none` | {0, 0} | 0 | 0 | 0 | Elementos planos |
| `sm` | {0, 1} | 0.08 | 4 | 2 | Cards sutiles |
| `md` | {0, 4} | 0.12 | 12 | 6 | Cards principales |
| `lg` | {0, 8} | 0.16 | 24 | 12 | Modals, elementos flotantes |

---

## B. Componentes del Design System

### B.1 PrimaryButton
- **Variantes:** `filled` | `outlined`
- **Estados:** `default` | `pressed` | `disabled` | `loading`
- **Props:** title, onPress, variant, loading, disabled, style, textStyle
- **Accesibilidad:** `accessibilityRole="button"`, `accessibilityState={{ disabled }}`
- **Archivo:** `src/components/ui/PrimaryButton.tsx`

### B.2 Input
- **Estados:** `default` | `focused` | `error` | `disabled`
- **Props:** label, error, containerStyle, placeholder, disabled + todos los TextInputProps
- **Accesibilidad:** `accessibilityLabel`, `accessibilityState={{ disabled }}`
- **Archivo:** `src/components/ui/Input.tsx`

### B.3 Card
- **Variantes:** `elevated` (con sombra, default) | `outlined` (con borde, sin sombra)
- **Props:** children, variant, style
- **Archivo:** `src/components/ui/Card.tsx`

### B.4 Chip
- **Variantes:** `default` | `active`
- **Props:** label, active, onPress, style
- **Accesibilidad:** `accessibilityRole="button"`, `accessibilityState={{ selected: active }}`
- **Archivo:** `src/components/ui/Chip.tsx`

### B.5 AppText (Typography)
- **Presets:** `hero` | `title` | `subtitle` | `body` | `bodySmall` | `caption` | `overline`
- **Props:** preset, color, style, children + todos los TextProps
- **Archivo:** `src/components/ui/AppText.tsx`

---

## C. Navegación

### Estructura:
```
RootStack (Stack Navigator)
├── (auth) — Stack Navigator
│   ├── login
│   └── register
└── (app) — Stack Navigator
    └── (tabs) — Bottom Tab Navigator
        ├── index (Home — Identificar Planta)
        ├── explore (Explorar — Biblioteca de Plantas)
        └── profile (Perfil de Usuario)
```

### Justificación:
- **Bottom Tabs** para las 3 pantallas principales: es el patrón más usado en apps de este tipo (PlantNet, PictureThis) y recomendado por Material Design para 3-5 destinos principales.
- **Stack** para auth: flujo lineal login → register con navegación back.
- **Stack** envolviendo tabs: permite agregar pantallas de detalle que oculten las tabs (ej: detalle de planta).

---

## D. Accesibilidad

### Requisitos implementados:
1. **Contraste:** Ratio ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande (WCAG AA).
2. **Áreas de toque:** Mínimo 44pt (Apple HIG) / 48dp (Material Design).
3. **Labels:** `accessibilityLabel` en todos los controles interactivos.
4. **Roles:** `accessibilityRole` correcto (button, text, image, etc.).
5. **Estados:** `accessibilityState` para disabled, selected, checked.
6. **Tamaños legibles:** Fuente mínima 11px (caption), body mínimo 16px.
