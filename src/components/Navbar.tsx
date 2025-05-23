
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Search, 
  Users, 
  UserPlus,
  BarChart, 
  Info, 
  Menu, 
  X 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavItem = ({ to, icon: Icon, label, active }: { 
  to: string; 
  icon: any; 
  label: string; 
  active: boolean 
}) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
      active 
        ? "bg-social-primary text-white font-medium" 
        : "hover:bg-accent hover:text-accent-foreground"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useUser();
  
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/find-friends", icon: Search, label: "Find Friends" },
    { to: "/my-friends", icon: Users, label: "My Friends" },
    { to: "/suggested-friends", icon: UserPlus, label: "Suggested Friends" },
    { to: "/graph", icon: BarChart, label: "Network Graph" },
    { to: "/about", icon: Info, label: "About BFS" }
  ];

  // Generate user initials for avatar fallback
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <Users className="text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold gradient-text">NodeMingle</h1>
              <p className="text-xs text-muted-foreground">BFS Social Network</p>
            </div>
          </Link>

          {/* Current user indicator (desktop) */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/30">
              <Avatar className="h-7 w-7">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-social-primary text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{currentUser.name}</span>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 animate-fade-in">
            {currentUser && (
              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-accent/30">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-social-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span>{currentUser.name}</span>
              </div>
            )}
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                />
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
