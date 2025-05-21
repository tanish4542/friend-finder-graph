
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, FriendSuggestion } from '@/utils/bfs';
import { api } from '@/services/api';
import FriendCard from '@/components/FriendCard';
import ConnectionPath from '@/components/ConnectionPath';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import UserSearchInput from '@/components/UserSearchInput';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Users, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/HelpTooltip';
import { useUser } from '@/context/UserContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const SuggestedFriends = () => {
  const { currentUser, refreshUserData } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [allSuggestions, setAllSuggestions] = useState<FriendSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<FriendSuggestion[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<FriendSuggestion | null>(null);
  
  // Filter settings
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [minMutualFriends, setMinMutualFriends] = useState<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const suggestionsData = await api.getFriendSuggestions(currentUser.id, 3, 0);
        setAllSuggestions(suggestionsData);
        applyFilters(suggestionsData, maxDepth, minMutualFriends);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);
  
  const applyFilters = (suggestions: FriendSuggestion[], depth: number, mutual: number) => {
    const filtered = suggestions.filter(s => 
      s.connectionLevel <= depth && 
      s.mutualFriends.length >= mutual
    );
    
    setFilteredSuggestions(filtered);
    
    if (filtered.length > 0) {
      // If current selection no longer matches filter, reset selection
      if (!selectedConnection || !filtered.some(s => s.user.id === selectedConnection.user.id)) {
        setSelectedConnection(filtered[0]);
      }
    } else {
      setSelectedConnection(null);
    }
  };
  
  const handleDepthChange = (value: string) => {
    const depth = parseInt(value, 10);
    setMaxDepth(depth);
    applyFilters(allSuggestions, depth, minMutualFriends);
  };
  
  const handleMutualFriendsChange = (value: number[]) => {
    const mutual = value[0];
    setMinMutualFriends(mutual);
    applyFilters(allSuggestions, maxDepth, mutual);
  };
  
  const handleSelectUser = (selectedUser: User) => {
    refreshUserData(selectedUser.id);
  };
  
  const handleRemoveSuggestion = (suggestionId: number) => {
    const updatedSuggestions = allSuggestions.filter(s => s.user.id !== suggestionId);
    setAllSuggestions(updatedSuggestions);
    applyFilters(updatedSuggestions, maxDepth, minMutualFriends);
    
    if (selectedConnection && selectedConnection.user.id === suggestionId) {
      if (filteredSuggestions.length > 1) {
        const nextSuggestion = filteredSuggestions.find(s => s.user.id !== suggestionId);
        setSelectedConnection(nextSuggestion || null);
      } else {
        setSelectedConnection(null);
      }
    }
  };
  
  const handleSelectConnection = (suggestion: FriendSuggestion) => {
    setSelectedConnection(suggestion);
  };
  
  if (loading) {
    return <LoadingSpinner message="Finding suggested friends..." />;
  }
  
  if (!currentUser) {
    return (
      <div className="container mx-auto py-10 px-4">
        <EmptyState
          icon={<Users size={32} />}
          title="No user selected"
          description="Please select a user to view their suggested friends"
          action={{
            label: "Find Friends",
            onClick: () => window.location.href = "/find-friends"
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 gradient-text">Suggested Friends</h1>
            <p className="text-muted-foreground">
              Potential connections based on BFS algorithm 
              <HelpTooltip text="These suggestions are found using the Breadth-First Search algorithm to explore the user's extended network." />
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <UserSearchInput onSelectUser={handleSelectUser} />
          </div>
        </div>
        
        <Card className="mb-6 glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium mb-2 gradient-text">Selected User</h2>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-accent-foreground">
                      {currentUser.name} (@{currentUser.username})
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filteredSuggestions.length} suggested connection{filteredSuggestions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link to={`/my-friends`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent/30">
                      View Direct Friends
                    </Badge>
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Max Connection Level</p>
                  </div>
                  <Select defaultValue="3" onValueChange={handleDepthChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Max Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:pl-4 md:border-l border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Min Mutual Friends</p>
                    </div>
                    <span className="text-sm font-medium">{minMutualFriends}</span>
                  </div>
                  <div className="w-32 px-1">
                    <Slider 
                      defaultValue={[0]} 
                      max={5}
                      step={1}
                      onValueChange={handleMutualFriendsChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredSuggestions.map(suggestion => (
                  <div 
                    key={suggestion.user.id}
                    onClick={() => handleSelectConnection(suggestion)} 
                    className={`cursor-pointer transition-all ${selectedConnection?.user.id === suggestion.user.id ? 'ring-2 ring-social-primary rounded-lg' : ''}`}
                  >
                    <FriendCard
                      user={suggestion.user}
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
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-3 gradient-text">Connection Details</h3>
                      
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
            description="We couldn't find any friend suggestions matching your filters."
            action={{
              label: "Reset Filters",
              onClick: () => {
                setMaxDepth(3);
                setMinMutualFriends(0);
                applyFilters(allSuggestions, 3, 0);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SuggestedFriends;
