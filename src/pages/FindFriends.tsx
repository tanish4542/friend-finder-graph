
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSearchInput from '@/components/UserSearchInput';
import { User } from '@/utils/bfs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const FindFriends = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    toast.success(`Selected user: ${user.name}`);
  };
  
  const handleFindFriends = () => {
    if (selectedUser) {
      navigate(`/suggested-friends?userId=${selectedUser.id}`);
    } else {
      toast.error('Please select a user first');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Find Friends</h1>
        <p className="text-muted-foreground mb-8">
          Search for a user to start exploring their network connections
        </p>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Select a user</h2>
            <UserSearchInput onSelectUser={handleSelectUser} />
            
            {selectedUser && (
              <div className="mt-6 p-4 bg-social-light rounded-lg">
                <p className="font-medium">Selected User:</p>
                <p className="text-social-tertiary">{selectedUser.name} (@{selectedUser.username})</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleFindFriends} 
                className="bg-social-primary hover:bg-social-tertiary"
                disabled={!selectedUser}
              >
                <Search className="mr-2 h-4 w-4" />
                Find Connections
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">How it works</h3>
            <p className="text-muted-foreground">
              When you select a user, we'll use the Breadth-First Search (BFS) algorithm to explore their network and find potential connections.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2">Connection levels</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Level 1:</strong> Direct friends (already connected)
              </li>
              <li>
                <strong>Level 2:</strong> Friends of friends (suggested connections)
              </li>
              <li>
                <strong>Level 3+:</strong> Extended network (weaker connections)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
