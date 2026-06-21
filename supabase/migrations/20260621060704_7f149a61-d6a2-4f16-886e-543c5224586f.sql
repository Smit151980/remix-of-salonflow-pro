
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- service_categories
CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_categories TO authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY sc_select ON public.service_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY sc_write  ON public.service_categories FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist']::app_role[]));
CREATE TRIGGER sc_updated BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  duration_minutes int NOT NULL DEFAULT 30 CHECK (duration_minutes > 0),
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY svc_select ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY svc_write  ON public.services FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist']::app_role[]));
CREATE INDEX svc_category_idx ON public.services(category_id);
CREATE TRIGGER svc_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- staff
CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  role_title text,
  specialties text[] NOT NULL DEFAULT '{}',
  commission_pct numeric(5,2) NOT NULL DEFAULT 0 CHECK (commission_pct >= 0 AND commission_pct <= 100),
  color text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT ALL ON public.staff TO service_role;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_select ON public.staff FOR SELECT TO authenticated USING (true);
CREATE POLICY staff_write  ON public.staff FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]));
CREATE TRIGGER staff_updated BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- staff_schedules
CREATE TABLE public.staff_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (staff_id, day_of_week)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_schedules TO authenticated;
GRANT ALL ON public.staff_schedules TO service_role;
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY ss_select ON public.staff_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY ss_write  ON public.staff_schedules FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]));
CREATE TRIGGER ss_updated BEFORE UPDATE ON public.staff_schedules FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- staff_leaves
CREATE TABLE public.staff_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_leaves TO authenticated;
GRANT ALL ON public.staff_leaves TO service_role;
ALTER TABLE public.staff_leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY sl_select ON public.staff_leaves FOR SELECT TO authenticated USING (true);
CREATE POLICY sl_write  ON public.staff_leaves FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]));
CREATE TRIGGER sl_updated BEFORE UPDATE ON public.staff_leaves FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  date_of_birth date,
  gender text CHECK (gender IN ('male','female','other') OR gender IS NULL),
  address text,
  loyalty_points int NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  marketing_opt_in boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX customers_phone_idx ON public.customers(phone);
CREATE INDEX customers_name_trgm ON public.customers USING gin (full_name gin_trgm_ops);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY cust_select ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY cust_write  ON public.customers FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist']::app_role[]));
CREATE TRIGGER cust_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- customer_notes
CREATE TABLE public.customer_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cn_customer_idx ON public.customer_notes(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_notes TO authenticated;
GRANT ALL ON public.customer_notes TO service_role;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY cn_select ON public.customer_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY cn_insert ON public.customer_notes FOR INSERT TO authenticated
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','manager','receptionist','staff']::app_role[]));
CREATE POLICY cn_update ON public.customer_notes FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]))
  WITH CHECK (author_id = auth.uid() OR public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]));
CREATE POLICY cn_delete ON public.customer_notes FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.has_any_role(auth.uid(), ARRAY['owner','manager']::app_role[]));
CREATE TRIGGER cn_updated BEFORE UPDATE ON public.customer_notes FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
