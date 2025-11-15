import { useState } from "react";
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { products, addOns } from "@/data/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [type, setType] = useState<"hot" | "iced">("hot");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const calculateTotalPrice = () => {
    let total = product.price;
    selectedAddOns.forEach((addonId) => {
      const addon = addOns.find((a) => a.id === addonId);
      if (addon) total += addon.price;
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    const customizations = [
      size.charAt(0).toUpperCase() + size.slice(1),
      type === "iced" ? "Iced" : "Hot",
      ...selectedAddOns.map(
        (id) => addOns.find((a) => a.id === id)?.name || ""
      ),
    ]
      .filter(Boolean)
      .join(", ");

    addItem({
      productId: product.id,
      name: product.name,
      price: calculateTotalPrice() / quantity,
      quantity,
      image: product.image,
      size,
      type,
      addOns: selectedAddOns,
      customizations,
    });

    toast.success(`Added ${quantity} ${product.name} to cart`);
    navigate("/cart");
  };

  return (
    <div 
      className="min-h-screen pb-24 relative"
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
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-border z-40 px-4 py-4 shadow-soft">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <img 
              src="/logo-sudutkopi.jpg" 
              alt="Sudut Kopi" 
              className="h-10 w-auto object-contain"
            />
          <Button variant="ghost" size="icon">
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <div className="aspect-square bg-secondary overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-6 py-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Indulge in our rich, full-bodied espresso marked with steamed milk
              and a velvety foam, finished with a luscious caramel drizzle for
              the perfect balance of sweet and bold.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Size</h3>
            <div className="flex gap-3">
              {(["small", "medium", "large"] as const).map((s) => (
                <Button
                  key={s}
                  onClick={() => setSize(s)}
                  className={
                    size === s
                      ? "flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary rounded-xl"
                      : "flex-1 h-12 bg-transparent hover:bg-secondary text-foreground border-2 border-border rounded-xl"
                  }
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Type</h3>
            <div className="flex gap-3">
              {(["hot", "iced"] as const).map((t) => (
                <Button
                  key={t}
                  onClick={() => setType(t)}
                  className={
                    type === t
                      ? "flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary rounded-xl"
                      : "flex-1 h-12 bg-transparent hover:bg-secondary text-foreground border-2 border-border rounded-xl"
                  }
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Add-ons
            </h3>
            <div className="space-y-3">
              {addOns.map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center justify-between p-4 bg-card rounded-xl cursor-pointer hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedAddOns.includes(addon.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAddOns([...selectedAddOns, addon.id]);
                        } else {
                          setSelectedAddOns(
                            selectedAddOns.filter((id) => id !== addon.id)
                          );
                        }
                      }}
                    />
                    <span className="text-foreground">{addon.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    +${addon.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-4 z-50 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 bg-secondary rounded-xl p-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
          >
            Add to Cart - ${calculateTotalPrice().toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
