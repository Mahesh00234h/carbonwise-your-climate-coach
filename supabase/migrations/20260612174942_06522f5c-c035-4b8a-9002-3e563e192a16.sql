CREATE TABLE public.scanned_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  vendor TEXT NOT NULL,
  estimate_kg NUMERIC NOT NULL DEFAULT 0,
  insight TEXT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scanned_bills TO authenticated;
GRANT ALL ON public.scanned_bills TO service_role;
ALTER TABLE public.scanned_bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own scanned bills" ON public.scanned_bills FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX scanned_bills_user_created_idx ON public.scanned_bills (user_id, created_at DESC);