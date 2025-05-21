
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, FriendSuggestion } from '@/utils/bfs';
import { api } from '@/services/api';
import FriendCard from '@/components/FriendCard';
import ConnectionPath from '@/components/ConnectionPath';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import UserSearchInput from '@/components/UserSearchInput';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/HelpTooltip';

const SuggestedFriends = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = Number(searchParams.get('userId')) || 1;
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<FriendSuggestion | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await api.getUser(userId);
        setUser(userData || null);
        
        if (userData) {
          const suggestionsData = await api.getFriendSuggestions(userData.id);
          setSuggestions(suggestionsData);
          
          if (suggestionsData.length > 0) {
            setSelectedConnection(suggestionsData[0]);
          } else {
            setSelectedConnection(null);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  const handleSelectUser = (selectedUser: User) => {
    setSearchParams({ userId: selectedUser.id.toString() });
  };
  
  const handleRemoveSuggestion = (suggestionId: number) => {
    setSuggestions(suggestions.filter(s => s.user.id !== suggestionId));
    
    if (selectedConnection && selectedConnection.user.id === suggestionId) {
      setSelectedConnection(suggestions.length > 1 ? suggestions[1] : null);
    }
  };
  
  const handleSelectConnection = (suggestion: FriendSuggestion) => {
    setSelectedConnection(suggestion);
  };
  
  if (loading) {
    return <LoadingSpinner message="Finding suggested friends..." />;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Suggested Friends</h1>
            <p className="text-muted-foreground">
              Potential connections based on BFS algorithm 
              <HelpTooltip text="These suggestions are found using the Breadth-First Search algorithm to explore the user's extended network." />
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <UserSearchInput onSelectUser={handleSelectUser} />
          </div>
        </div>
        
        {user && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-2">Selected User</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-social-tertiary">
                    {user.name} (@{user.username})
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {suggestions.length} suggested connection{suggestions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Link to={`/my-friends?userId=${user.id}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    View Direct Friends
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
        {suggestions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {suggestions.map(suggestion => (
                  <div 
                    key={suggestion.user.id}
                    onClick={() => handleSelectConnection(suggestion)} 
                    className={`cursor-pointer transition-all ${selectedConnection?.user.id === suggestion.user.id ? 'ring-2 ring-social-primary rounded-lg' : ''}`}
                  >
                    <FriendCard
                      user={suggestion.user}
                      currentUserId={userId}
                      isFriend={false}
                      mutualFriends={suggestion.mutualFriends}
                      connectionLevel={suggestion.connectionLevel}
                      onAddFriend={handleRemoveSuggestion}
                      onIgnore={handleRemoveSuggestion}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {selectedConnection && (
                <div className="sticky top-24">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-3">Connection Details</h3>
                      
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Connection path:</p>
                        <ConnectionPath path={selectedConnection.connectionPath} />
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Connection level:</p>
                        <Badge className="bg-social-primary">Level {selectedConnection.connectionLevel}</Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Mutual friends:</p>
                        <p>{selectedConnection.mutualFriends.length} mutual connection(s)</p>
                        
                        {selectedConnection.mutualFriends.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {selectedConnection.mutualFriends.map(friend => (
                              <li key={friend.id} className="text-sm">
                                • {friend.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<UserPlus size={32} />}
            title="No suggestions found"
            description="We couldn't find any friend suggestions for this user."
            action={{
              label: "Find Friends",
              onClick: () => window.location.href = "/find-friends"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SuggestedFriends;
