import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const taxesAndFees = subtotal * 0.08;
  const total = subtotal + taxesAndFees;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">☕</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some delicious items to get started!</p>
          <Button
            onClick={() => navigate("/menu")}
            className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12 px-8"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">My Cart</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl p-4 flex gap-4 shadow-card"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground mb-1 truncate">
                {item.name}
              </h3>
              {item.customizations && (
                <p className="text-sm text-muted-foreground mb-2">
                  {item.customizations}
                </p>
              )}
              <p className="text-lg font-bold text-foreground">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-6 text-center font-semibold">
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/menu")}
          className="text-primary underline text-center w-full py-4"
        >
          Add more items
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-6 z-50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Taxes & Fees</span>
              <span>${taxesAndFees.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-xl font-bold text-foreground">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold text-lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
