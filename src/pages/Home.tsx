
import { Link } from 'react-router-dom';
import { BarChart, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import UserSelectionModal from '@/components/UserSelectionModal';
import { useState } from 'react';

const Home = () => {
  const { currentUser } = useUser();
  const [showUserSelection, setShowUserSelection] = useState(false);
  
  const handleGetStarted = () => {
    setShowUserSelection(true);
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="mb-16 text-center max-w-4xl mx-auto">
        <div className="glass-card p-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">NodeMingle</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            An educational platform that uses the Breadth-First Search algorithm to find connections in your social network
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/about" className="w-full">
              <div className="glass-card p-8 h-full transition-all hover:translate-y-[-8px] hover:shadow-xl flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
                  <BookOpen size={40} className="text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Learn About BFS</h3>
                <p className="text-muted-foreground text-center">
                  Understand how the Breadth-First Search algorithm works
                </p>
              </div>
            </Link>
            
            <div className="w-full">
              <div 
                onClick={handleGetStarted} 
                className="glass-card p-8 h-full transition-all hover:translate-y-[-8px] hover:shadow-xl flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-4">
                  <Users size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Get Started</h3>
                <p className="text-muted-foreground text-center">
                  Begin exploring your social network
                </p>
              </div>
            </div>
          </div>
          
          {currentUser && (
            <div className="mt-8 p-4 rounded-lg bg-accent/30">
              <p className="text-accent-foreground">
                Currently signed in as: <span className="font-bold">{currentUser.name}</span>
              </p>
            </div>
          )}
        </div>
      </section>
      
      <UserSelectionModal 
        isOpen={showUserSelection} 
        onClose={() => setShowUserSelection(false)} 
      />
    </div>
  );
};

export default Home;
