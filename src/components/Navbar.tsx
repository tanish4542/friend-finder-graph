
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
        : "hover:bg-social-light hover:text-social-tertiary"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/find-friends", icon: Search, label: "Find Friends" },
    { to: "/my-friends", icon: Users, label: "My Friends" },
    { to: "/suggested-friends", icon: UserPlus, label: "Suggested Friends" },
    { to: "/graph", icon: BarChart, label: "Network Graph" },
    { to: "/about", icon: Info, label: "About BFS" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <Users className="text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold gradient-text">FriendFinder</h1>
              <p className="text-xs text-gray-500">BFS Social Network</p>
            </div>
          </Link>

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
