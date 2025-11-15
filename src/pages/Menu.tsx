import { useState } from "react";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Menu = () => {
  const navigate = useNavigate();
  const { addItem, getTotalItems, getTotalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("espresso");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "espresso", label: "Espresso Based" },
    { id: "manual-brew", label: "Manual Brew" },
    { id: "pastries", label: "Pastries" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Our Menu</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            className="relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for coffee, pastries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-secondary border-0 rounded-xl"
          />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 whitespace-nowrap"
                  : "bg-secondary hover:bg-secondary/90 text-foreground rounded-full px-6 whitespace-nowrap"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleQuickAdd(product)}
            />
          ))}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary p-4 z-50">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => navigate("/cart")}
              className="w-full h-14 bg-primary-foreground hover:bg-primary-foreground/90 text-primary rounded-2xl font-semibold flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
              </div>
              <span>View Cart</span>
              <span>${totalPrice.toFixed(2)}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
