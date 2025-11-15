import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Coffee, Clock, Heart } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo with animation */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-20">
              <div className="w-48 h-48 bg-primary rounded-full" />
            </div>
            <img
              src="/logo-sudutkopi.jpg"
              alt="Sudut Kopi"
              className="w-48 h-48 object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Hero content */}
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
          <h1 className="text-5xl font-bold text-coffee-dark leading-tight">
            Your Daily Brew <br />
            <span className="text-primary">Awaits</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium coffee, delivered fresh to your doorstep.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 py-6 animate-slide-up" style={{ animationDelay: "0.4s", opacity: 0, animationFillMode: "forwards" }}>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Coffee className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-coffee-dark">Fresh</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-coffee-dark">Fast</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-coffee-dark">Quality</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 pt-4 animate-slide-up" style={{ animationDelay: "0.6s", opacity: 0, animationFillMode: "forwards" }}>
          <Button
            onClick={() => navigate("/")}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300 group"
          >
            Order Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate("/menu")}
            variant="outline"
            className="w-full h-14 text-lg font-semibold bg-white/80 hover:bg-white border-2 border-primary/20 text-coffee-dark rounded-2xl backdrop-blur-sm hover:border-primary/40 transition-all duration-300"
          >
            View Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
