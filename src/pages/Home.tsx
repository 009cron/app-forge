import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const Home = () => {
  const { addItem } = useCart();
  const featuredProducts = products.filter((p) => p.featured);
  const popularProducts = products.filter((p) => p.popular);

  const handleQuickAdd = (product: typeof products[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Sudut Kopi</h1>
          <Button variant="ghost" size="icon">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Find your favorite coffee"
            className="pl-12 h-12 bg-secondary border-0 rounded-xl"
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        <section className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex-shrink-0 w-80 h-48 rounded-2xl bg-gradient-warm p-6 shadow-card relative overflow-hidden">
            <img
              src="/promo-1.jpg"
              alt="Promo"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Buy 1 Get 1 Free Tuesdays
              </h3>
              <p className="text-muted-foreground">Special offer every Tuesday</p>
            </div>
          </div>
          <div className="flex-shrink-0 w-80 h-48 rounded-2xl bg-secondary p-6 shadow-card">
            <h3 className="text-2xl font-bold text-foreground mb-2">20% Off</h3>
            <p className="text-muted-foreground">Enjoy our premium selection</p>
          </div>
        </section>

        <section className="flex gap-4">
          <Button className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold">
            Order for Pick Up
          </Button>
          <Button
            variant="secondary"
            className="flex-1 h-14 bg-secondary hover:bg-secondary/90 text-foreground rounded-2xl font-semibold"
          >
            Order for Delivery
          </Button>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Featured Coffee
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-48">
                <ProductCard
                  product={product}
                  onAddToCart={() => handleQuickAdd(product)}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Popular Bites
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {popularProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-48">
                <ProductCard
                  product={product}
                  onAddToCart={() => handleQuickAdd(product)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
