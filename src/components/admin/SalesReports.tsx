import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const SalesReports = () => {
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Today's sales
    const { data: orders } = await supabase
      .from('orders')
      .select('total, subtotal, tax, discount')
      .gte('created_at', `${today}T00:00:00`)
      .eq('status', 'completed');

    if (orders) {
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const totalOrders = orders.length;
      const totalTax = orders.reduce((sum, o) => sum + Number(o.tax), 0);
      const totalDiscount = orders.reduce((sum, o) => sum + Number(o.discount), 0);

      setDailyStats({
        revenue: totalRevenue,
        orders: totalOrders,
        tax: totalTax,
        discount: totalDiscount,
        avgOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0
      });
    }

    // Top products
    const { data: items } = await supabase
      .from('order_items')
      .select('product_name, quantity, subtotal')
      .gte('created_at', `${today}T00:00:00`);

    if (items) {
      const productMap: any = {};
      items.forEach((item) => {
        if (!productMap[item.product_name]) {
          productMap[item.product_name] = { qty: 0, revenue: 0 };
        }
        productMap[item.product_name].qty += item.quantity;
        productMap[item.product_name].revenue += Number(item.subtotal);
      });

      const topList = Object.entries(productMap)
        .map(([name, data]: [string, any]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topList);
    }
  };

  const exportCSV = () => {
    if (!dailyStats) return;
    
    const csv = [
      ['Metric', 'Value'],
      ['Total Revenue', `$${dailyStats.revenue.toFixed(2)}`],
      ['Total Orders', dailyStats.orders],
      ['Average Order', `$${dailyStats.avgOrder.toFixed(2)}`],
      ['Total Tax', `$${dailyStats.tax.toFixed(2)}`],
      ['Total Discount', `$${dailyStats.discount.toFixed(2)}`],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Reports</h2>
        <Button onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${dailyStats?.revenue.toFixed(2) || '0.00'}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dailyStats?.orders || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm">Average Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${dailyStats?.avgOrder.toFixed(2) || '0.00'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Top Products Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.qty} sold</p>
                </div>
                <p className="font-bold">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReports;
