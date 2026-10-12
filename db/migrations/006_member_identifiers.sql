-- Identificadores editables y únicos de cada socio.
-- external_id conserva el número de socio importado; dni se permite NULL
-- durante la carga inicial para no bloquear los socios históricos.

ALTER TABLE members ADD COLUMN IF NOT EXISTS dni TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS members_dni_idx ON members(dni) WHERE dni IS NOT NULL AND dni <> '';
CREATE UNIQUE INDEX IF NOT EXISTS members_external_id_idx ON members(external_id) WHERE external_id IS NOT NULL;
