import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Minus, Trash2, Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ThermalReceipt from '@/components/pos/ThermalReceipt';

interface POSProduct {
  id: string;
  name: string;
  base_price: number;
  image_url: string | null;
  category_id: string | null;
}

interface POSCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table');
  
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  
  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, base_price, image_url, category_id')
      .eq('active', true)
      .order('name');
    
    if (data && !error) {
      setProducts(data);
    }
  };

  const addToCart = (product: POSProduct) => {
    const existing = cart.find(item => item.productId === product.id);
    
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: Number(product.base_price),
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + tax;
  const change = amountPaid ? Number(amountPaid) - total : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (paymentMethod === 'cash' && Number(amountPaid) < total) {
      toast.error('Insufficient payment amount');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderData: any = {
        customer_id: null,
        staff_id: user?.id,
        order_type: tableId ? 'dine_in' : 'takeaway',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        status: 'pending'
      };

      if (tableId) {
        orderData.table_id = tableId;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          order_id: order.id,
          amount: total,
          payment_method: paymentMethod as any,
          payment_status: 'paid',
          paid_at: new Date().toISOString()
        }]);

      if (paymentError) throw paymentError;

      // Store order for receipt
      setLastOrder({
        ...order,
        items: cart,
        payment_method: paymentMethod,
        amount_paid: Number(amountPaid),
        change: change
      });

      toast.success('Order completed successfully!');
      
      // Clear cart
      setCart([]);
      setAmountPaid('');
      
      // Print receipt
      setTimeout(() => {
        handlePrint();
      }, 500);

    } catch (error: any) {
      toast.error(error.message || 'Failed to process order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (userRole !== 'owner' && userRole !== 'staff')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Access denied. Staff only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Hidden receipt for printing */}
      <div className="hidden">
        <ThermalReceipt ref={receiptRef} order={lastOrder} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">POS System</h1>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-secondary hover:bg-secondary/80 rounded-lg p-4 text-left transition-colors"
                    >
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-lg font-bold text-primary">
                        ${Number(product.base_price).toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Cart & Payment */}
          <div className="space-y-4">
            {/* Cart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Current Order</h2>
              {tableId && (
                <p className="text-sm text-muted-foreground mb-4">
                  Table Order (QR Code)
                </p>
              )}
              <ScrollArea className="h-[300px]">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Cart is empty</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (11%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'cash' && (
                  <div>
                    <Label>Amount Paid</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="0.00"
                    />
                    {change > 0 && (
                      <p className="text-sm mt-1 text-green-600">
                        Change: ${change.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={processing || cart.length === 0}
                >
                  {processing ? 'Processing...' : 'Complete Order'}
                </Button>

                {cart.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCart([])}
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
