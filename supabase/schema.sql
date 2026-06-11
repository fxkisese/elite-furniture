-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Products Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price NUMERIC,
    description TEXT,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    image TEXT
);

-- RLS: Anyone can read products, only authenticated admins can modify
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert products." ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update products." ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete products." ON public.products FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 2. Sales Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date DATE NOT NULL,
    customer TEXT NOT NULL,
    item TEXT NOT NULL,
    branch TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment TEXT NOT NULL,
    method TEXT NOT NULL
);

-- RLS: Only authenticated admins can read/modify
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view sales." ON public.sales FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can insert sales." ON public.sales FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update sales." ON public.sales FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete sales." ON public.sales FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 3. Credit Book Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.credit (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer TEXT NOT NULL,
    phone TEXT NOT NULL,
    item TEXT NOT NULL,
    total NUMERIC NOT NULL,
    paid NUMERIC NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    branch TEXT NOT NULL
);

-- RLS: Only authenticated admins can read/modify
ALTER TABLE public.credit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view credit." ON public.credit FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can insert credit." ON public.credit FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update credit." ON public.credit FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete credit." ON public.credit FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 4. Expenses Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    branch TEXT NOT NULL
);

-- RLS: Only authenticated admins can read/modify
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view expenses." ON public.expenses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can insert expenses." ON public.expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update expenses." ON public.expenses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete expenses." ON public.expenses FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 5. Messages Table (Contact Form)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL
);

-- RLS: Anyone can insert messages, only authenticated admins can read/modify
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert messages." ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can view messages." ON public.messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update messages." ON public.messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete messages." ON public.messages FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 6. Quotes Table (Custom Orders Form)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    furniture_type TEXT NOT NULL,
    measurements TEXT,
    notes TEXT,
    status TEXT DEFAULT 'NEW'
);

-- RLS: Anyone can insert quotes, only authenticated admins can read/modify
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert quotes." ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can view quotes." ON public.quotes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update quotes." ON public.quotes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete quotes." ON public.quotes FOR DELETE USING (auth.role() = 'authenticated');
