ALTER TABLE payments ADD COLUMN IF NOT EXISTS months_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_data TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_name TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_mime_type TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_status TEXT NOT NULL DEFAULT 'Pendiente de revisión';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS submitted_by TEXT;

CREATE INDEX IF NOT EXISTS payments_receipt_status_idx ON payments(receipt_status);
