CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  external_id INTEGER,
  address TEXT,
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Activo',
  plan TEXT NOT NULL DEFAULT 'Socio colaborador',
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  paid_at DATE NOT NULL DEFAULT CURRENT_DATE,
  period TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pagado',
  method TEXT NOT NULL DEFAULT 'Transferencia'
);

CREATE INDEX IF NOT EXISTS payments_member_id_idx ON payments(member_id);
CREATE INDEX IF NOT EXISTS payments_period_idx ON payments(period);
CREATE UNIQUE INDEX IF NOT EXISTS members_external_id_idx ON members(external_id) WHERE external_id IS NOT NULL;
