CREATE TABLE IF NOT EXISTS payment_months (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  paid_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (member_id, period_key)
);

CREATE INDEX IF NOT EXISTS payment_months_payment_id_idx ON payment_months(payment_id);
CREATE INDEX IF NOT EXISTS payment_months_member_id_idx ON payment_months(member_id);

INSERT INTO payment_months (id, payment_id, member_id, period_key, paid_at)
SELECT DISTINCT ON (member_id, period)
  'legacy-' || md5(id || ':' || period), id, member_id,
  CASE lower(split_part(period, ' ', 1))
    WHEN 'enero' THEN split_part(period, ' ', 2) || '-01'
    WHEN 'febrero' THEN split_part(period, ' ', 2) || '-02'
    WHEN 'marzo' THEN split_part(period, ' ', 2) || '-03'
    WHEN 'abril' THEN split_part(period, ' ', 2) || '-04'
    WHEN 'mayo' THEN split_part(period, ' ', 2) || '-05'
    WHEN 'junio' THEN split_part(period, ' ', 2) || '-06'
    WHEN 'julio' THEN split_part(period, ' ', 2) || '-07'
    WHEN 'agosto' THEN split_part(period, ' ', 2) || '-08'
    WHEN 'septiembre' THEN split_part(period, ' ', 2) || '-09'
    WHEN 'octubre' THEN split_part(period, ' ', 2) || '-10'
    WHEN 'noviembre' THEN split_part(period, ' ', 2) || '-11'
    WHEN 'diciembre' THEN split_part(period, ' ', 2) || '-12'
    ELSE period
  END,
  paid_at
FROM payments
WHERE period IS NOT NULL AND period <> ''
ORDER BY member_id, period, paid_at ASC, id ASC
ON CONFLICT (member_id, period_key) DO NOTHING;
