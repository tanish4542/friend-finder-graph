
import { useNavigate } from 'react-router-dom';
import UserSearchInput from '@/components/UserSearchInput';
import { User } from '@/utils/bfs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Users, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const FindFriends = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUserData } = useUser();
  
  const handleSelectUser = (user: User) => {
    refreshUserData(user.id);
    toast.success(`Selected user: ${user.name}`);
  };
  
  const handleNavigate = (path: string) => {
    if (currentUser) {
      navigate(path);
    } else {
      toast.error('Please select a user first');
    }
  };

  // Generate user initials for avatar fallback
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : "?";

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Find Friends</h1>
        <p className="text-muted-foreground mb-8">
          Search for a user to start exploring their network connections
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card className="h-full glass-card">
              <CardContent className="pt-6 flex flex-col h-full">
                <h2 className="text-xl font-medium mb-4 gradient-text">Select User</h2>
                <UserSearchInput onSelectUser={handleSelectUser} />
                
                {currentUser && (
                  <div className="mt-6 p-4 bg-accent/30 rounded-lg flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-social-light">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="bg-social-primary text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 gradient-text">Explore Network</h2>
                <div className="space-y-4">
                  <Button 
                    onClick={() => handleNavigate('/suggested-friends')} 
                    className="w-full flex items-center justify-start bg-accent hover:bg-accent/80 text-accent-foreground"
                    disabled={!currentUser}
                  >
                    <Search className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Find Connections</div>
                      <div className="text-xs opacity-90">Discover potential friends through BFS</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handleNavigate('/my-friends')} 
                    className="w-full flex items-center justify-start bg-accent hover:bg-accent/80 text-accent-foreground"
                    disabled={!currentUser}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">View My Friends</div>
                      <div className="text-xs opacity-90">See your direct connections</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handleNavigate('/graph')} 
                    className="w-full flex items-center justify-start bg-accent hover:bg-accent/80 text-accent-foreground"
                    disabled={!currentUser}
                  >
                    <BarChart className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Network Graph</div>
                      <div className="text-xs opacity-90">Visualize your social connections</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 gradient-text">Connection Levels</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Badge className="bg-social-primary h-6 w-6 rounded-full flex items-center justify-center p-0">1</Badge>
                  <div>
                    <strong className="text-accent-foreground">Level 1:</strong> 
                    <span className="ml-1">Direct friends (already connected)</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Badge className="bg-secondary h-6 w-6 rounded-full flex items-center justify-center p-0">2</Badge>
                  <div>
                    <strong className="text-accent-foreground">Level 2:</strong> 
                    <span className="ml-1">Friends of friends (suggested connections)</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Badge className="bg-muted h-6 w-6 text-muted-foreground rounded-full flex items-center justify-center p-0">3+</Badge>
                  <div>
                    <strong className="text-accent-foreground">Level 3+:</strong> 
                    <span className="ml-1">Extended network (weaker connections)</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
