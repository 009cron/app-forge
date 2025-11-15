import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-coffee flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-12">
          <div className="w-64 h-64 rounded-3xl bg-gradient-warm shadow-card overflow-hidden flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Sudut Kopi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Your Daily Brew Awaits
          </h1>
          <p className="text-xl text-muted-foreground">
            The best coffee, right at your fingertips.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            onClick={() => navigate("/menu")}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-glow"
          >
            Order Now
          </Button>
          <Button
            onClick={() => navigate("/menu")}
            variant="secondary"
            className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-primary rounded-2xl"
          >
            View Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
