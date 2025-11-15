import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations
    setTimeout(() => setIsLoaded(true), 100);

    // Auto-navigate after animation
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay for better logo visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" />
      
      {/* Animated Logo */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
        isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
      }`}>
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 blur-3xl opacity-30 animate-pulse">
            <div className="w-64 h-64 bg-primary rounded-full" />
          </div>
          
          {/* Logo */}
          <img
            src="/logo-sudutkopi.jpg"
            alt="Sudut Kopi"
            className="w-64 h-64 object-contain relative z-10 animate-float"
            style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.1))" }}
          />
        </div>
        
        {/* Tagline */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}>
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Sudut Kopi</h1>
          <p className="text-muted-foreground text-lg">Your Daily Brew Awaits</p>
        </div>

        {/* Loading indicator */}
        <div className={`mt-12 transition-all duration-1000 delay-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
