-- Payments schema for the Pretty Good Music application
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE SET NULL,
  amount NUMERIC(20,9) NOT NULL,
  currency TEXT DEFAULT 'SUI' NOT NULL,
  transaction_hash TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('tip', 'subscription', 'purchase')),
  track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.payments IS 'Payment/tip transactions on the public.music platform';
COMMENT ON COLUMN public.payments.amount IS 'Payment amount with 9 decimal places for small crypto denominations';
COMMENT ON COLUMN public.payments.transaction_hash IS 'Blockchain transaction hash';
COMMENT ON COLUMN public.payments.payment_type IS 'Type of payment (tip, subscription, purchase)';

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id
  );

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create trigger for updated_at
CREATE TRIGGER set_payment_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX idx_payments_sender_id ON public.payments(sender_id);
CREATE INDEX idx_payments_recipient_id ON public.payments(recipient_id);
CREATE INDEX idx_payments_track_id ON public.payments(track_id);
CREATE INDEX idx_payments_album_id ON public.payments(album_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);

-- Create payment status history table in main schema with RLS
CREATE TABLE public.payment_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  notes TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by TEXT DEFAULT 'system' NOT NULL
);

COMMENT ON TABLE public.payment_status_history IS 'History of payment status changes';

-- Enable RLS
ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can access payment history" ON public.payment_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY "Artists can see their own payment history" ON public.payment_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payments p
      WHERE p.id = payment_id AND p.recipient_id = auth.uid()
    )
  );

-- Create index
CREATE INDEX idx_payment_status_history_payment_id ON public.payment_status_history(payment_id);

-- Create trigger for tracking payment status changes
CREATE OR REPLACE FUNCTION public.track_payment_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.payment_status_history
      (payment_id, old_status, new_status)
    VALUES
      (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_payment_status
AFTER UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.track_payment_status_changes();

-- Function to tip an artist
CREATE OR REPLACE FUNCTION public.tip_artist(
  artist_id UUID,
  amount NUMERIC,
  transaction_hash TEXT,
  track_id UUID DEFAULT NULL,
  album_id UUID DEFAULT NULL,
  message TEXT DEFAULT NULL
)
RETURNS public.payments AS $$
DECLARE
  current_user_id UUID := auth.uid();
  new_payment public.payments;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify artist exists
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Create payment record
  INSERT INTO public.payments (
    sender_id,
    recipient_id,
    amount,
    currency,
    transaction_hash,
    status,
    payment_type,
    track_id,
    album_id,
    message
  )
  VALUES (
    current_user_id,
    artist_id,
    amount,
    'SUI',
    transaction_hash,
    'completed', -- Assuming the blockchain tx is already confirmed
    'tip',
    track_id,
    album_id,
    message
  )
  RETURNING * INTO new_payment;
  
  RETURN new_payment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Analytics functions for artists to view payment statistics
CREATE OR REPLACE FUNCTION public.get_artist_payment_stats(
  time_period TEXT DEFAULT 'all_time'
)
RETURNS TABLE (
  total_payments BIGINT,
  total_amount NUMERIC,
  avg_amount NUMERIC,
  payment_type TEXT,
  period TEXT
) AS $$
DECLARE
  current_user_id UUID := auth.uid();
  start_date TIMESTAMPTZ;
BEGIN
  -- Check authentication and artist status
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = current_user_id) THEN
    RAISE EXCEPTION 'User must be an artist to view payment statistics';
  END IF;
  
  -- Set date range based on requested time period
  CASE time_period
    WHEN 'last_7_days' THEN
      start_date := NOW() - INTERVAL '7 days';
    WHEN 'last_30_days' THEN
      start_date := NOW() - INTERVAL '30 days';
    WHEN 'last_90_days' THEN
      start_date := NOW() - INTERVAL '90 days';
    WHEN 'last_year' THEN
      start_date := NOW() - INTERVAL '1 year';
    ELSE
      start_date := '1970-01-01'::TIMESTAMPTZ; -- all time
  END CASE;
  
  -- Return payment statistics
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_payments,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    p.payment_type,
    CASE time_period
      WHEN 'last_7_days' THEN 'Last 7 days'
      WHEN 'last_30_days' THEN 'Last 30 days'
      WHEN 'last_90_days' THEN 'Last 90 days'
      WHEN 'last_year' THEN 'Last year'
      ELSE 'All time'
    END as period
  FROM 
    public.payments p
  WHERE 
    p.recipient_id = current_user_id
    AND p.status = 'completed'
    AND p.created_at >= start_date
  GROUP BY 
    p.payment_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Monthly payment trends for artists
CREATE OR REPLACE FUNCTION public.get_monthly_payment_trends(
  months_back INTEGER DEFAULT 12
)
RETURNS TABLE (
  month TEXT,
  total_amount NUMERIC,
  payment_count BIGINT
) AS $$
DECLARE
  current_user_id UUID := auth.uid();
  start_date TIMESTAMPTZ := NOW() - (months_back || ' months')::INTERVAL;
BEGIN
  -- Check authentication and artist status
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = current_user_id) THEN
    RAISE EXCEPTION 'User must be an artist to view payment statistics';
  END IF;
  
  -- Return monthly trends
  RETURN QUERY
  SELECT 
    TO_CHAR(p.created_at, 'YYYY-MM') as month,
    SUM(p.amount) as total_amount,
    COUNT(*)::BIGINT as payment_count
  FROM 
    public.payments p
  WHERE 
    p.recipient_id = current_user_id
    AND p.status = 'completed'
    AND p.created_at >= start_date
  GROUP BY 
    TO_CHAR(p.created_at, 'YYYY-MM')
  ORDER BY 
    month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
