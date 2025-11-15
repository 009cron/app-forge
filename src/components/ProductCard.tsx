import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
