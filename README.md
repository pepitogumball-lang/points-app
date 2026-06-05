# Points

Aplicación web full-stack de contador de puntos en tiempo real. Diseño **Cyberpunk Glassmorphism** con React, Supabase Realtime y Framer Motion.

---

## Características

- **Contador en tiempo real** — actualización instantánea vía Supabase Realtime
- **Optimistic UI** — el número cambia en pantalla antes de que el servidor confirme
- **Panel admin oculto** — ruta secreta para controlar los puntos
- **Diseño premium** — glassmorphism, tipografía neon, animaciones fluidas
- **Sin dependencias de Vercel** — 100% compatible con Netlify y Render

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Estilos | Tailwind CSS 4 + CSS custom |
| Animaciones | Framer Motion |
| Base de datos | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (WebSockets) |
| Iconos | Lucide React |
| Tipografía | JetBrains Mono + Space Grotesk |
| Hosting | Netlify o Render |

---

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [app.supabase.com](https://app.supabase.com) y crea un nuevo proyecto.
2. Anota tu **Project URL** y tu **anon key** (en Settings → API).

### 2. Ejecutar el script de base de datos

1. En tu proyecto de Supabase, ve a **SQL Editor**.
2. Copia y pega el contenido de `setup.sql`.
3. Haz clic en **Run**.

Esto crea:
- La tabla `stats` con una fila inicial (`id=1, points=0`)
- Políticas de Row Level Security (RLS) para lectura y escritura pública
- La función RPC `increment_points` para actualizaciones atómicas
- Habilita Realtime para la tabla `stats`

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

> **Nota:** Nunca subas `.env` a tu repositorio. Está incluido en `.gitignore`.

---

## Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Build de producción
pnpm build
```

---

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Vista pública — contador de puntos en tiempo real |
| `/Holaquetalsoypepi5` | Panel admin oculto — botones `+1` y `-1` |

---

## Despliegue en Netlify

### Opción A: Interfaz web

1. Sube tu repositorio a GitHub.
2. En [app.netlify.com](https://app.netlify.com), haz clic en **Add new site → Import an existing project**.
3. Conecta tu repositorio.
4. Configura:
   - **Build command:** `pnpm run build`
   - **Publish directory:** `dist/public`
5. En **Site settings → Environment variables**, añade:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
6. Haz clic en **Deploy site**.

### Opción B: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set VITE_SUPABASE_KEY "your-anon-key"
netlify deploy --prod
```

El archivo `netlify.toml` ya está configurado con:
- Redirecciones SPA
- Headers de seguridad
- Cache de assets

---

## Despliegue en Render

1. Sube tu repositorio a GitHub.
2. En [render.com](https://render.com), haz clic en **New → Static Site**.
3. Conecta tu repositorio.
4. Render detectará automáticamente el `render.yaml`.
5. En **Environment**, añade las variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
6. Haz clic en **Create Static Site**.

---

## Atajos de Teclado (Panel Admin)

| Tecla | Acción |
|---|---|
| `+` o `=` | Sumar 1 punto |
| `-` | Restar 1 punto |

---

## Estructura del Proyecto

```
points/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedCounter.tsx   # Contador con Framer Motion
│   │   │   └── ParticleBackground.tsx # Fondo animado con Canvas
│   │   ├── hooks/
│   │   │   └── usePoints.ts          # Hook con Supabase + Optimistic UI
│   │   ├── lib/
│   │   │   └── supabase.ts           # Cliente de Supabase
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Vista pública
│   │   │   └── Admin.tsx             # Panel admin oculto
│   │   ├── App.tsx                   # Rutas
│   │   └── index.css                 # Tema cyberpunk
├── setup.sql                         # Script de base de datos
├── netlify.toml                      # Configuración Netlify
├── render.yaml                       # Configuración Render
└── README.md                         # Esta documentación
```

---

## Seguridad

> **Importante:** La ruta del panel admin (`/Holaquetalsoypepi5`) es una medida de seguridad por oscuridad. Para producción con datos sensibles, considera añadir autenticación real con Supabase Auth o una clave secreta en las políticas RLS.

---

## Licencia

MIT
