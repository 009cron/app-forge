import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen pb-20 relative"
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
        <header className="bg-white/95 backdrop-blur-md border-b border-border px-4 py-4 shadow-soft">
          <div className="max-w-md mx-auto text-center">
            <img 
              src="/logo-sudutkopi.jpg" 
              alt="Sudut Kopi" 
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>
        </header>

      <div className="max-w-md mx-auto px-4 py-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">My Past Orders</h1>

        <div className="py-12">
          <div className="w-20 h-20 bg-secondary/50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl opacity-50">☕</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            No Orders Yet
          </h2>
          <p className="text-muted-foreground mb-8">
            Your past orders will appear here once you've made a purchase.
          </p>
          <Button
            onClick={() => navigate("/menu")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12 px-8"
          >
            Explore Menu
          </Button>
        </div>
      </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;
