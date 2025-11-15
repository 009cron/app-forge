import {
  User,
  History,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const menuItems = [
    { icon: User, label: "Personal Information", path: "/profile/info" },
    { icon: History, label: "Order History", path: "/orders" },
    { icon: CreditCard, label: "Payment Methods", path: "/profile/payment" },
    { icon: MapPin, label: "Delivery Addresses", path: "/profile/addresses" },
    { icon: Settings, label: "Settings", path: "/profile/settings" },
  ];

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
        <header className="bg-white/95 backdrop-blur-md border-b border-border px-4 py-6 shadow-soft">
          <div className="max-w-md mx-auto text-center">
            <img 
              src="/logo-sudutkopi.jpg" 
              alt="Sudut Kopi" 
              className="h-12 w-auto object-contain mx-auto"
            />
          </div>
        </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-card rounded-2xl p-6 text-center shadow-card">
          <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4 overflow-hidden">
            <div className="w-full h-full bg-gradient-warm flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Aria Starbucks
          </h2>
          <p className="text-primary font-semibold">Gold Member</p>
        </div>

        <div className="bg-card rounded-2xl overflow-hidden shadow-card">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          className="w-full h-14 text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
