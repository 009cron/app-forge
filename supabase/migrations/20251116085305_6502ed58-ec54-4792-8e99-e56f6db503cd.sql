-- =====================================================
-- SUDUT KOPI - Production Database Schema
-- =====================================================

-- 1. CREATE ENUMS
CREATE TYPE public.user_role AS ENUM ('owner', 'staff');
CREATE TYPE public.order_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE public.order_type AS ENUM ('dine_in', 'takeaway');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');
CREATE TYPE public.payment_method AS ENUM ('cash', 'card', 'digital_wallet', 'bank_transfer');

-- 2. USER ROLES TABLE
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
    sku TEXT UNIQUE,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    popular BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT VARIANTS (for sizes, types)
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- 'Small', 'Medium', 'Large', 'Hot', 'Iced'
    variant_type TEXT NOT NULL, -- 'size', 'temperature'
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADD-ONS TABLE
CREATE TABLE public.add_ons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY TABLE
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_stock_level INTEGER DEFAULT 10,
    last_restocked_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id)
);

-- 9. TABLES (Restaurant Tables)
CREATE TABLE public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number TEXT NOT NULL UNIQUE,
    qr_code TEXT UNIQUE, -- URL or code for QR
    capacity INTEGER DEFAULT 4,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDERS TABLE
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    table_id UUID REFERENCES public.tables(id) ON DELETE SET NULL,
    order_type order_type NOT NULL DEFAULT 'dine_in',
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
    discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
    total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDER ITEMS TABLE
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- Store name in case product is deleted
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    variant_details JSONB, -- Store selected variants
    add_ons JSONB, -- Store selected add-ons
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS TABLE
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'unpaid',
    transaction_ref TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SALES REPORTS (Materialized for performance)
CREATE TABLE public.daily_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL UNIQUE,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_tax DECIMAL(10,2) DEFAULT 0,
    total_discount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECURITY DEFINER FUNCTIONS
-- =====================================================

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$;

-- Generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$;

CREATE SEQUENCE order_number_seq START 1;

-- Apply triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_sales ENABLE ROW LEVEL SECURITY;

-- USER_ROLES POLICIES
CREATE POLICY "Owners and staff can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Only owners can manage roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'owner'));

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- CATEGORIES POLICIES (Public read, staff write)
CREATE POLICY "Anyone can view active categories"
    ON public.categories FOR SELECT
    USING (active = true OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage categories"
    ON public.categories FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- PRODUCTS POLICIES (Public read, staff write)
CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT
    USING (active = true OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage products"
    ON public.products FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- PRODUCT VARIANTS POLICIES
CREATE POLICY "Anyone can view active variants"
    ON public.product_variants FOR SELECT
    USING (active = true OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage variants"
    ON public.product_variants FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- ADD-ONS POLICIES
CREATE POLICY "Anyone can view active add-ons"
    ON public.add_ons FOR SELECT
    USING (active = true OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage add-ons"
    ON public.add_ons FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- INVENTORY POLICIES
CREATE POLICY "Staff can view inventory"
    ON public.inventory FOR SELECT
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage inventory"
    ON public.inventory FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- TABLES POLICIES
CREATE POLICY "Anyone can view active tables"
    ON public.tables FOR SELECT
    USING (active = true OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage tables"
    ON public.tables FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- ORDERS POLICIES
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (customer_id = auth.uid() OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage all orders"
    ON public.orders FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Customers can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (customer_id = auth.uid() OR public.has_role(auth.uid(), 'staff'));

-- ORDER ITEMS POLICIES
CREATE POLICY "Users can view order items of own orders"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.customer_id = auth.uid() OR public.has_role(auth.uid(), 'staff'))
        )
    );

CREATE POLICY "Staff can manage order items"
    ON public.order_items FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- PAYMENTS POLICIES
CREATE POLICY "Users can view payments for own orders"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
            AND (orders.customer_id = auth.uid() OR public.has_role(auth.uid(), 'staff'))
        )
    );

CREATE POLICY "Staff can manage payments"
    ON public.payments FOR ALL
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

-- DAILY SALES POLICIES
CREATE POLICY "Only staff can view sales reports"
    ON public.daily_sales FOR SELECT
    USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Only owners can manage sales reports"
    ON public.daily_sales FOR ALL
    USING (public.has_role(auth.uid(), 'owner'));

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(active);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_staff_id ON public.orders(staff_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_daily_sales_report_date ON public.daily_sales(report_date DESC);