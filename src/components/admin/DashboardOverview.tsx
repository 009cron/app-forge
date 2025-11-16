import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    lowStockItems: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Today's revenue and orders
    const { data: orders } = await supabase
      .from('orders')
      .select('total, status')
      .gte('created_at', `${today}T00:00:00`)
      .eq('status', 'completed');

    const todayRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const todayOrders = orders?.length || 0;

    // Pending orders
    const { count: pending } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'preparing']);

    // Low stock items
    const { count: lowStock } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true })
      .lt('quantity', 'min_stock_level');

    setStats({
      todayRevenue,
      todayOrders,
      lowStockItems: lowStock || 0,
      pendingOrders: pending || 0
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
