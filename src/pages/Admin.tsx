import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Users, QrCode, LogOut } from 'lucide-react';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import SalesReports from '@/components/admin/SalesReports';
import StaffManagement from '@/components/admin/StaffManagement';
import TableManagement from '@/components/admin/TableManagement';

const Admin = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div 
      className="min-h-screen pb-6 relative"
      style={{
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-border px-4 py-4 shadow-soft sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo-sudutkopi.jpg" 
                alt="Sudut Kopi" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Role: <span className="capitalize font-medium">{userRole}</span>
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6 bg-white/95 backdrop-blur-md">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="tables" className="gap-2">
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">Tables</span>
              </TabsTrigger>
              {userRole === 'owner' && (
                <TabsTrigger value="staff" className="gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Staff</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="products">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="reports">
              <SalesReports />
            </TabsContent>

            <TabsContent value="tables">
              <TableManagement />
            </TabsContent>

            {userRole === 'owner' && (
              <TabsContent value="staff">
                <StaffManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
