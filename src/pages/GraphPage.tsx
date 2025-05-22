
import { useState, useEffect } from 'react';
import { User } from '@/utils/bfs';
import { api } from '@/services/api';
import GraphView from '@/components/GraphView';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserSearchInput from '@/components/UserSearchInput';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/HelpTooltip';
import { useUser } from '@/context/UserContext';

const GraphPage = () => {
  const { currentUser, refreshUserData } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<{source: number; target: number; weight?: number}[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all users
        const allUsers = await api.getUsers();
        setUsers(allUsers);
        
        // Get connections with weights
        const connectionList: {source: number; target: number; weight?: number}[] = [];
        
        // For each user, add their friend connections
        allUsers.forEach(user => {
          user.friends.forEach(friendId => {
            // Only add each connection once
            if (user.id < friendId) {
              // Find interaction weight if available
              const interaction = user.interactions?.find(i => i.userId === friendId);
              const weight = interaction?.weight;
              
              connectionList.push({ 
                source: user.id, 
                target: friendId,
                weight
              });
            }
          });
        });
        
        setConnections(connectionList);
        
        // Set selected user
        if (currentUser) {
          setSelectedUser(currentUser);
        } else if (allUsers.length > 0) {
          setSelectedUser(allUsers[0]);
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);
  
  const handleSelectUser = (user: User) => {
    refreshUserData(user.id);
    setSelectedUser(user);
  };
  
  const handleSelectNode = (nodeId: number) => {
    const user = users.find(u => u.id === nodeId);
    if (user) {
      setSelectedUser(user);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading network graph..." />;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 gradient-text">SocialBFS - Network Graph</h1>
            <p className="text-muted-foreground">
              Visual representation of the social network
              <HelpTooltip text="This graph uses a force-directed algorithm to display connections between users. Click on any node to select that user. Edge thickness represents interaction strength." />
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <UserSearchInput onSelectUser={handleSelectUser} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            {selectedUser && (
              <div className="sticky top-24">
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-medium mb-4 gradient-text">Selected User</h2>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-social-light">
                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                        <AvatarFallback className="bg-social-primary text-white">
                          {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">{selectedUser.name}</p>
                        <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Bio:</p>
                      <p className="text-sm">{selectedUser.bio}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Direct connections:</p>
                      <Badge className="bg-social-primary">{selectedUser.friends.length} friends</Badge>
                    </div>
                    
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Network legend:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-social-primary"></div>
                          <p className="text-xs">Selected user</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <p className="text-xs">Direct friends (Level 1)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          <p className="text-xs">Friends of friends (Level 2)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-social-tertiary"></div>
                          <p className="text-xs">Other users</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 mt-4 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Edge connections:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-green-500"></div>
                          <p className="text-xs">Strong interaction (8-10)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-orange-500"></div>
                          <p className="text-xs">Medium interaction (5-7)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-500"></div>
                          <p className="text-xs">Light interaction (1-4)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="glass-card p-4">
              <GraphView 
                users={users}
                connections={connections}
                highlightedUserId={selectedUser?.id}
                currentUserId={currentUser?.id}
                width={800}
                height={600}
                onSelectNode={handleSelectNode}
              />
              <p className="text-sm text-muted-foreground text-center mt-4">
                Click on any node to select a user. Drag nodes to explore connections. Thicker edges represent stronger interactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
