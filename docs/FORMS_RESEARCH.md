# Actividad 2: Formularios — Investigacion y Decisiones Tecnicas

> **Proyecto:** Retro Garden (React Native + Expo)
> **Fecha:** 28/03/2026
> **Stack:** Expo SDK 54 | React Native 0.81.5 | TypeScript 5.9.2 | Firebase 12.11.0

---

## Parte 1: Investigacion de Tecnologias

### 1.1 Comparacion de Librerias de Formularios

Se evaluaron dos librerias ampliamente utilizadas en el ecosistema React / React Native para el manejo de formularios:

#### react-hook-form (v7)

| Aspecto | Detalle |
|---------|---------|
| **Paradigma** | Inputs no controlados (uncontrolled) mediante refs |
| **Tamano** | ~9 kB gzip (sin dependencias) |
| **API** | Hooks: `useForm()`, `useController()`, `useWatch()` |
| **Integracion RN** | Componente `Controller` disenado para React Native |
| **Re-renders** | Minimos — solo el campo que cambia se re-renderiza |
| **TypeScript** | `useForm<T>()` infiere tipos del formulario automaticamente |
| **Validacion** | Resolvers externos (`@hookform/resolvers`) para Zod, Yup, etc. |
| **Comunidad** | 42k+ estrellas en GitHub, mantenimiento activo |

**Ventajas:**
- Rendimiento superior en movil por arquitectura uncontrolled (menos re-renders = UI mas fluida)
- API moderna basada en hooks, alineada con React 19
- `Controller` simplifica la integracion con componentes custom de React Native
- `reset()` permite cargar datos existentes de forma limpia (ideal para formularios de edicion)
- Soporte nativo para validacion `onBlur`, `onChange`, `onSubmit`

**Desventajas:**
- La curva de aprendizaje inicial con `Controller` puede ser mas empinada que Formik
- Requiere `ref` forwarding en componentes custom (solucionable con `React.forwardRef`)

#### Formik (v2)

| Aspecto | Detalle |
|---------|---------|
| **Paradigma** | Inputs controlados (controlled) via state |
| **Tamano** | ~13 kB gzip |
| **API** | Componentes: `<Formik>`, `<Form>`, `<Field>`, `<ErrorMessage>` + hooks |
| **Integracion RN** | Manual: `handleChange`, `handleBlur`, `setFieldValue` |
| **Re-renders** | Frecuentes — todo el formulario se re-renderiza en cada cambio |
| **TypeScript** | Soporte basico, requiere genericos explicitos |
| **Validacion** | Integrada con Yup; otros validadores requieren configuracion manual |
| **Comunidad** | 34k+ estrellas en GitHub, desarrollo menos activo desde 2023 |

**Ventajas:**
- Documentacion extensa y muchos ejemplos disponibles
- Patron familiar para desarrolladores que vienen de web React
- Integracion nativa con Yup para validacion

**Desventajas:**
- Re-renders excesivos en formularios con muchos campos (impacto notable en movil)
- API basada en render-props (`<Formik>` wrapper) es verbose en React Native
- Integracion con RN requiere cableado manual de `onChangeText`, `onBlur`, `value`
- Menor actividad de mantenimiento en los ultimos anos

#### Decision: react-hook-form

**Justificacion:** Para una aplicacion movil como Retro Garden, el rendimiento es critico. react-hook-form minimiza los re-renders al usar inputs no controlados, lo que se traduce en una UI mas fluida, especialmente en formularios con multiples campos. Su API basada en hooks es consistente con la arquitectura del proyecto (React 19 + hooks custom). El componente `Controller` facilita la integracion con nuestro componente `Input` custom sin necesidad de refactorizar la interfaz existente. Adicionalmente, la inferencia de tipos con `useForm<T>()` elimina errores de tipado y alinea con nuestra configuracion TypeScript estricta.

---

### 1.2 Comparacion de Librerias de Validacion

Se evaluaron dos librerias de validacion del lado del cliente compatibles con react-hook-form:

#### Zod (v3)

| Aspecto | Detalle |
|---------|---------|
| **Paradigma** | TypeScript-first, schemas declarativos |
| **Tamano** | ~11 kB gzip |
| **Inferencia de tipos** | `z.infer<typeof schema>` genera el tipo TS automaticamente |
| **Composabilidad** | Schemas combinables con `.merge()`, `.extend()`, `.pick()`, `.omit()` |
| **Transformaciones** | `.transform()`, `.refine()`, `.superRefine()` para logica custom |
| **Integracion RHF** | `@hookform/resolvers/zod` — plug-and-play |
| **Mensajes** | Mensajes de error personalizables por campo y por regla |

**Ventajas:**
- Inferencia automatica de tipos elimina duplicacion entre schema y interface
- API declarativa e intuitiva: `z.string().min(2).max(30)` se lee como lenguaje natural
- Composable: permite reutilizar sub-schemas entre formularios (ej. `locationSchema` en user y plant)
- Transformaciones integradas permiten parsear strings a numeros en un solo paso
- Mejor soporte para TypeScript strict mode (nuestro proyecto lo usa)

**Desventajas:**
- Ecosistema mas joven que Yup (menos tutoriales legacy)
- Algunos patrones de validacion asincrona requieren `.refine()` con async callbacks

#### Yup (v1)

| Aspecto | Detalle |
|---------|---------|
| **Paradigma** | Imperativo, schemas encadenados |
| **Tamano** | ~13 kB gzip |
| **Inferencia de tipos** | `InferType<typeof schema>` — disponible pero menos ergonomico |
| **Composabilidad** | `.shape()`, `.concat()` — menos flexible que Zod |
| **Transformaciones** | `.transform()`, `.test()` para validacion custom |
| **Integracion RHF** | `@hookform/resolvers/yup` — disponible |
| **Mensajes** | Personalizables, con soporte para i18n |

**Ventajas:**
- Ampliamente adoptado, gran cantidad de recursos y ejemplos
- Integracion historica con Formik (relevante si se migra en el futuro)
- Soporte maduro para i18n de mensajes de error

**Desventajas:**
- La inferencia de tipos es menos precisa que Zod, requiere configuracion adicional
- API mas verbose para validaciones complejas
- Bundle ligeramente mas grande
- Los tipos inferidos pueden divergir del schema en edge cases

#### Decision: Zod

**Justificacion:** Retro Garden utiliza TypeScript 5.9.2 con configuracion estricta (`strict: true`). Zod fue disenado desde cero para TypeScript, y su capacidad de generar tipos automaticamente con `z.infer<>` elimina la duplicacion entre los schemas de validacion y las interfaces de TypeScript. Esto reduce errores y facilita el mantenimiento: cuando se modifica un schema, el tipo se actualiza automaticamente. La API declarativa de Zod produce codigo mas legible y conciso, y su sistema de composicion permite reutilizar sub-schemas entre el formulario de usuario y el de planta. El resolver `@hookform/resolvers/zod` integra ambas librerias sin friccion.

---

### 1.3 Diseno de Mensajes de Error y Notificaciones

#### Estrategia de dos niveles

Se implementa un sistema de feedback visual en dos niveles complementarios:

##### Nivel 1: Errores inline (por campo)

**Ubicacion:** Inmediatamente debajo de cada campo de formulario.

**Comportamiento:**
- Se activa cuando el usuario sale del campo (`onBlur`) y la validacion falla
- El borde del input cambia a rojo (`theme.colors.error`)
- El mensaje de error aparece en texto rojo debajo del input
- El error desaparece automaticamente cuando el usuario corrige el valor

**Justificacion:**
- **Proximidad:** El error se muestra junto al campo que lo causa, siguiendo el principio de proximidad de Gestalt. El usuario no necesita buscar cual campo fallo.
- **Feedback inmediato:** La validacion `onBlur` proporciona feedback oportuno sin ser intrusivo (a diferencia de `onChange` que valida en cada tecla).
- **Patron establecido:** Es el patron mas reconocido en formularios web y movil, reduciendo la carga cognitiva del usuario.

##### Nivel 2: Toast/Notificacion global

**Ubicacion:** Parte superior de la pantalla, debajo de la barra de estado (safe area).

**Variantes:**
| Tipo | Color | Icono | Caso de uso |
|------|-------|-------|-------------|
| `success` | Verde (`primary`) | `check-circle` | Guardado exitoso |
| `error` | Rojo (`error`) | `alert-circle` | Error de red/servidor |
| `info` | Azul (`info`) | `information` | Informacion general |

**Comportamiento:**
- **Aparicion:** Animacion slide-in desde arriba (Reanimated `translateY`, 300ms)
- **Duracion:** Auto-dismiss despues de 3 segundos
- **Cierre manual:** El usuario puede deslizar hacia arriba (swipe-up) para cerrar anticipadamente, o presionar el toast para descartarlo
- **Apilamiento:** Solo un toast a la vez; un nuevo toast reemplaza al anterior

**Justificacion de la ubicacion (top):**
- **No bloquea el formulario:** Los formularios ocupan la parte central e inferior de la pantalla. Un toast en la parte superior no obstruye los campos ni los botones de accion.
- **Visibilidad natural:** La parte superior de la pantalla esta dentro del campo visual primario del usuario, especialmente cuando el teclado esta abierto y reduce el area visible.
- **Consistencia con plataformas nativas:** Tanto iOS como Android muestran notificaciones del sistema en la parte superior, lo que establece una expectativa de comportamiento en el usuario.

**Justificacion del mecanismo de cierre:**
- **Auto-dismiss (3s):** Los mensajes de exito y error son informativos, no requieren accion. El cierre automatico evita que el usuario tenga que interactuar para descartarlos.
- **Swipe-up:** Ofrece un gesto natural y familiar (patron de notificaciones de iOS/Android) para cerrar el toast antes de tiempo si el usuario ya lo leyo.
- **Sin boton de cierre (X):** Un boton de cierre en un toast tan pequeno seria dificil de presionar en movil (target < 44px). El swipe es mas ergonomico y coherente con la estetica pixel art del proyecto.

**Estetica pixel art:**
- Borde grueso (3px) con color solido
- Sombra solida sin blur (offset 2x2)
- Tipografia PressStart2P para el titulo del tipo
- Tipografia Courier New para el mensaje
- Icono de MaterialCommunityIcons a la izquierda

---

## Parte 2: Estrategia de Implementacion

### 2.1 Arquitectura de componentes

```
FormInput (wrapper RHF)
  └── Input (componente puro, reutilizable)
        ├── Label (PressStart2P)
        ├── TextInput (Courier New)
        ├── HelperText (opcional)
        └── ErrorText (condicional)

ToastProvider (contexto global)
  └── Toast (componente animado)
        ├── Icon (MaterialCommunityIcons)
        ├── Title (tipo: success/error/info)
        └── Message
```

### 2.2 Patron de integracion RHF + Zod

```typescript
// 1. Definir schema Zod
const userSchema = z.object({
  displayName: z.string().min(2, 'Min 2 caracteres'),
  bio: z.string().max(200).optional(),
});

// 2. Inferir tipo automaticamente
type UserFormData = z.infer<typeof userSchema>;

// 3. Usar en el formulario
const { control, handleSubmit, reset } = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  mode: 'onBlur', // validar al salir del campo
});

// 4. Cargar datos existentes
useEffect(() => {
  if (userData) reset(flattenUserData(userData));
}, [userData]);

// 5. Renderizar con FormInput
<FormInput control={control} name="displayName" label="NOMBRE" />
```

### 2.3 Flujo de datos

```
Firestore (DB)
  → getDoc / getDocs (servicio)
    → useUserProfile / usePlantDetail (hook)
      → reset() (react-hook-form)
        → FormInput (UI)
          → Edicion del usuario
            → handleSubmit + zodResolver (validacion)
              → updateDoc (servicio)
                → Toast (feedback)
```

### 2.4 Componente reutilizable FormInput

**Parametros seleccionados y justificacion:**

| Parametro | Tipo | Justificacion |
|-----------|------|--------------|
| `control` | `Control<T>` | Conecta el campo con el estado del formulario RHF |
| `name` | `Path<T>` | Identifica el campo en el schema; tipado garantiza que solo se usen campos validos |
| `label` | `string` | Accesibilidad + UX: el usuario sabe que dato ingresar |
| `placeholder` | `string` | Ejemplo del formato esperado |
| `helperText` | `string` | Guia adicional sin ser un error (ej. "Max 200 caracteres") |
| `multiline` | `boolean` | Campos como `bio` o `notas` requieren multiples lineas |
| `keyboardType` | `KeyboardType` | Optimiza el teclado segun el tipo de dato (numerico, email, etc.) |
| `secureTextEntry` | `boolean` | Para campos de contrasena |
| `disabled` | `boolean` | Campos de solo lectura (ej. email, username) |
| `leftIcon` | `string` | Contexto visual rapido (ej. icono de Instagram para el campo de Instagram) |
| `maxLength` | `number` | Limite de caracteres con contador visual |

**Mejora sobre la logica actual:** El componente `Input` actual requiere que el desarrollador maneje manualmente `value`, `onChangeText` y `error`. `FormInput` automatiza esto via `Controller`, reduciendo el boilerplate de ~8 lineas por campo a solo 1 linea declarativa. Los errores de validacion se muestran automaticamente sin logica adicional.

---

## Parte 3: Conclusiones

### Ventajas de la implementacion

1. **Type-safety end-to-end:** Zod infiere tipos que fluyen desde el schema hasta el formulario y la llamada a Firestore, eliminando errores de tipado en tiempo de compilacion.

2. **Rendimiento movil optimizado:** react-hook-form minimiza re-renders, crucial en dispositivos con recursos limitados.

3. **Reutilizabilidad:** `FormInput` y `Toast` son componentes genericos que se pueden usar en cualquier formulario futuro (registro, configuracion, marketplace).

4. **Feedback UX claro:** El sistema de dos niveles (inline + toast) cubre tanto errores de campo como estados de operacion (exito/fallo de red).

5. **Mantenibilidad:** Los schemas Zod centralizados en `src/schemas/` actuan como fuente de verdad para validacion y tipos.

### Desventajas y limitaciones

1. **Dependencias adicionales:** Se agregan 3 paquetes (`react-hook-form`, `zod`, `@hookform/resolvers`), incrementando el bundle size (~20 kB total gzip).

2. **Curva de aprendizaje:** El patron `Controller` + `forwardRef` puede ser confuso para desarrolladores nuevos en RHF.

3. **Validacion solo client-side:** No se implementan reglas de seguridad en Firestore (security rules), lo cual seria necesario para produccion.

4. **Sin soporte offline:** Los formularios requieren conexion a Firestore; no hay manejo de cache local para operaciones offline.

### Posibles mejoras futuras

1. **Firestore Security Rules:** Implementar reglas de seguridad que validen los mismos constraints del schema Zod en el servidor.

2. **Optimistic updates:** Actualizar la UI inmediatamente y revertir si Firestore falla, mejorando la percepcion de velocidad.

3. **Soporte offline:** Usar la persistencia local de Firestore (`enableIndexedDbPersistence`) para permitir edicion sin conexion.

4. **Validacion asincrona:** Agregar validacion de unicidad de username via `.refine()` async que consulte Firestore en tiempo real.

5. **Formularios multi-paso:** Para datos complejos de plantas, implementar un wizard/stepper que divida el formulario en secciones.

6. **Internacionalizacion (i18n):** Externalizar los mensajes de error de Zod para soportar multiples idiomas.

---

## Referencias

- [react-hook-form - Documentacion oficial](https://react-hook-form.com/)
- [Formik - Documentacion oficial](https://formik.org/)
- [Zod - Documentacion oficial](https://zod.dev/)
- [Yup - Repositorio GitHub](https://github.com/jquense/yup)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [Nielsen Norman Group - Error Messages](https://www.nngroup.com/articles/error-message-guidelines/)
- [Material Design 3 - Text Fields](https://m3.material.io/components/text-fields/overview)
