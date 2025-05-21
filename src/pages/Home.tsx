
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Users, Search, Info } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const Home = () => {
  const { currentUser } = useUser();
  
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="mb-16 text-center max-w-4xl mx-auto">
        <div className="glass-card p-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Friend Finder</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            An educational platform that uses the Breadth-First Search algorithm to find connections in your social network
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/about" className="w-full">
              <div className="glass-card p-6 h-full transition-all hover:translate-y-[-8px] hover:shadow-xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Info size={32} className="text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Learn About BFS</h3>
                <p className="text-muted-foreground text-center">
                  Understand how the Breadth-First Search algorithm works
                </p>
              </div>
            </Link>
            
            <Link to="/find-friends" className="w-full">
              <div className="glass-card p-6 h-full transition-all hover:translate-y-[-8px] hover:shadow-xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Get Started</h3>
                <p className="text-muted-foreground text-center">
                  Begin exploring your social network
                </p>
              </div>
            </Link>
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
      
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8 gradient-text">How It Works</h2>
        <div className="space-y-12">
          <div className="glass-card p-6 animate-slide-up">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-medium mb-2 gradient-text">Search for Users</h3>
                <p className="text-muted-foreground mb-4">
                  Start by searching for a user in our network. This will be the starting point for the BFS algorithm.
                </p>
              </div>
              <div className="md:w-1/2 bg-accent/30 rounded-lg p-4">
                <div className="h-32 flex items-center justify-center">
                  <Search size={48} className="text-accent-foreground" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col-reverse md:flex-row items-center gap-8">
              <div className="md:w-1/2 bg-accent/30 rounded-lg p-4">
                <div className="h-32 flex items-center justify-center">
                  <BarChart size={48} className="text-accent-foreground" />
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-medium mb-2 gradient-text">BFS Finds Connections</h3>
                <p className="text-muted-foreground mb-4">
                  The Breadth-First Search algorithm finds all possible connections by exploring the network level by level.
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-medium mb-2 gradient-text">Discover New Friends</h3>
                <p className="text-muted-foreground mb-4">
                  See suggested friends ranked by connection proximity and mutual friends.
                </p>
              </div>
              <div className="md:w-1/2 bg-accent/30 rounded-lg p-4">
                <div className="h-32 flex items-center justify-center">
                  <Users size={48} className="text-accent-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
