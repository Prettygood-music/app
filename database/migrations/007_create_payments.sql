-- Migration: 007_create_payments.sql
-- Description: Creates payment-related tables for the prettygood.music application

-- Payments table
CREATE TABLE IF NOT EXISTS prettygood.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE SET NULL,
  amount NUMERIC(20, 9) NOT NULL, -- Support for small denominations of crypto
  currency TEXT NOT NULL DEFAULT 'SUI',
  transaction_hash TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('tip', 'subscription', 'purchase')),
  track_id UUID REFERENCES prettygood.tracks(id) ON DELETE SET NULL,
  album_id UUID REFERENCES prettygood.albums(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment status history for tracking changes
CREATE TABLE IF NOT EXISTS prettygood_private.payment_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES prettygood.payments(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  notes TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by TEXT NOT NULL DEFAULT 'system'
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_payment_updated_at
BEFORE UPDATE ON prettygood.payments
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create a trigger to track payment status changes
CREATE OR REPLACE FUNCTION prettygood_private.track_payment_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO prettygood_private.payment_status_history
      (payment_id, old_status, new_status)
    VALUES
      (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_payment_status
AFTER UPDATE ON prettygood.payments
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.track_payment_status_changes();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_sender_id ON prettygood.payments(sender_id);
CREATE INDEX IF NOT EXISTS idx_payments_recipient_id ON prettygood.payments(recipient_id);
CREATE INDEX IF NOT EXISTS idx_payments_track_id ON prettygood.payments(track_id);
CREATE INDEX IF NOT EXISTS idx_payments_album_id ON prettygood.payments(album_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON prettygood.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON prettygood.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_status_history_payment_id ON prettygood_private.payment_status_history(payment_id);

-- Comments for documentation
COMMENT ON TABLE prettygood.payments IS 'Payment/tip transactions on the prettygood.music platform';
COMMENT ON TABLE prettygood_private.payment_status_history IS 'History of payment status changes';
COMMENT ON COLUMN prettygood.payments.amount IS 'Payment amount with 9 decimal places for small crypto denominations';
COMMENT ON COLUMN prettygood.payments.transaction_hash IS 'Blockchain transaction hash';
COMMENT ON COLUMN prettygood.payments.payment_type IS 'Type of payment (tip, subscription, purchase)';
