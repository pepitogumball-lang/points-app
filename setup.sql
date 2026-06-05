-- ============================================================
-- Points — Setup SQL para Supabase (PostgreSQL)
-- ============================================================
-- Ejecuta este script en el SQL Editor de Supabase:
--   https://app.supabase.com → Tu Proyecto → SQL Editor
-- ============================================================

-- 1. Crear la tabla stats
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stats (
  id      integer PRIMARY KEY DEFAULT 1,
  points  integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Asegurar que solo exista una fila (row id = 1)
INSERT INTO public.stats (id, points)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública (para el contador en Home)
CREATE POLICY "Lectura pública de stats"
  ON public.stats
  FOR SELECT
  USING (true);

-- Política: actualización pública (para el panel admin)
-- NOTA: Para mayor seguridad en producción, restringe esto
-- usando autenticación de Supabase o una función RPC con secret.
CREATE POLICY "Actualización pública de stats"
  ON public.stats
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política: inserción pública (para la inicialización automática)
CREATE POLICY "Inserción pública de stats"
  ON public.stats
  FOR INSERT
  WITH CHECK (true);

-- 3. Función RPC para incremento/decremento atómico
-- ============================================================
-- Esta función garantiza que los cambios sean atómicos,
-- evitando condiciones de carrera cuando múltiples clientes
-- actualizan simultáneamente.
CREATE OR REPLACE FUNCTION public.increment_points(
  row_id    integer,
  delta_value integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.stats
  SET
    points     = points + delta_value,
    updated_at = now()
  WHERE id = row_id;
END;
$$;

-- Permitir ejecución pública de la función RPC
GRANT EXECUTE ON FUNCTION public.increment_points(integer, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_points(integer, integer) TO authenticated;

-- 4. Habilitar Realtime para la tabla stats
-- ============================================================
-- Esto permite que el frontend reciba cambios en tiempo real.
ALTER PUBLICATION supabase_realtime ADD TABLE public.stats;

-- ============================================================
-- ✅ Setup completado.
-- Verifica que la tabla existe:
--   SELECT * FROM public.stats;
-- Debería retornar: id=1, points=0
-- ============================================================
