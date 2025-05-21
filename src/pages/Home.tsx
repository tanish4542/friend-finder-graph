
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Graph, Users, Search, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const featureCards = [
  {
    icon: <Search size={24} />,
    title: "Find Friends",
    description: "Search for users and discover potential connections",
    link: "/find-friends",
    color: "bg-social-light text-social-primary"
  },
  {
    icon: <Users size={24} />,
    title: "Suggested Friends",
    description: "See who you might know based on your network",
    link: "/suggested-friends",
    color: "bg-purple-100 text-purple-500"
  },
  {
    icon: <Graph size={24} />,
    title: "Network Graph",
    description: "Visualize your social connections as an interactive graph",
    link: "/graph",
    color: "bg-blue-100 text-blue-500"
  },
  {
    icon: <Info size={24} />,
    title: "About BFS",
    description: "Learn how the Breadth-First Search algorithm works",
    link: "/about",
    color: "bg-orange-100 text-orange-500"
  }
];

const Home = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Friend Finder</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          An educational platform that uses the Breadth-First Search algorithm to find connections in your social network
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/find-friends">
            <Button size="lg" className="bg-social-primary hover:bg-social-tertiary">
              Get Started
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Learn About BFS
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-2">Search for Users</h3>
              <p className="text-muted-foreground mb-4">
                Start by searching for a user in our network. This will be the starting point for the BFS algorithm.
              </p>
            </div>
            <div className="md:w-1/2 bg-social-light rounded-lg p-4">
              <div className="h-32 flex items-center justify-center">
                <Search size={48} className="text-social-primary" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/2 bg-purple-100 rounded-lg p-4">
              <div className="h-32 flex items-center justify-center">
                <Graph size={48} className="text-purple-500" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-2">BFS Finds Connections</h3>
              <p className="text-muted-foreground mb-4">
                The Breadth-First Search algorithm finds all possible connections by exploring the network level by level.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-2">Discover New Friends</h3>
              <p className="text-muted-foreground mb-4">
                See suggested friends ranked by connection proximity and mutual friends.
              </p>
            </div>
            <div className="md:w-1/2 bg-blue-100 rounded-lg p-4">
              <div className="h-32 flex items-center justify-center">
                <Users size={48} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold text-center mb-8">Explore Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feature, index) => (
            <Link to={feature.link} key={index}>
              <Card className="transition-all hover:shadow-md hover:-translate-y-1 h-full">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
