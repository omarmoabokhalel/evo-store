-- Fix RLS policies to allow service role access

-- Drop old policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can bypass RLS" ON public.profiles;

-- Create new policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can bypass RLS" ON public.profiles
    FOR ALL USING (auth.uid() IS NULL);

CREATE POLICY "Authenticated users can read profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Drop old policies for products
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Service role can manage products" ON public.products;

-- Create new policies for products
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage products" ON public.products
    FOR ALL USING (auth.uid() IS NULL);

CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Drop old policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;

-- Create new policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage orders" ON public.orders
    FOR ALL USING (auth.uid() IS NULL);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Drop old policies for cart items
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Service role can manage cart items" ON public.cart_items;

-- Create new policies for cart items
CREATE POLICY "Users can view their own cart" ON public.cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON public.cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON public.cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage cart items" ON public.cart_items
    FOR ALL USING (auth.uid() IS NULL);

-- Drop old policies for wheel spins
DROP POLICY IF EXISTS "Users can view their own wheel spins" ON public.wheel_spins;
DROP POLICY IF EXISTS "Users can insert their own wheel spins" ON public.wheel_spins;
DROP POLICY IF EXISTS "Users can update their own wheel spins" ON public.wheel_spins;
DROP POLICY IF EXISTS "Service role can manage wheel spins" ON public.wheel_spins;

-- Create new policies for wheel spins
CREATE POLICY "Users can view their own wheel spins" ON public.wheel_spins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wheel spins" ON public.wheel_spins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wheel spins" ON public.wheel_spins
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage wheel spins" ON public.wheel_spins
    FOR ALL USING (auth.uid() IS NULL);
