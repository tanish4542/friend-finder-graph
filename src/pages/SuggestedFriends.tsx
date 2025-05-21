
import { useState, useEffect } from 'react';
import { User, FriendSuggestion } from '@/utils/bfs';
import { api } from '@/services/api';
import FriendCard from '@/components/FriendCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { UserPlus, Filter, Info } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import UserSearchInput from '@/components/UserSearchInput';

const SuggestedFriends = () => {
  const { currentUser, isLoading: isUserLoading, refreshUserData } = useUser();
  
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<FriendSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [minMutualFriends, setMinMutualFriends] = useState<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Get all friend suggestions with a high max depth to get all possible suggestions
        const suggestionsData = await api.getFriendSuggestions(currentUser.id, 5);
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching friend suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);
  
  // Apply filters whenever filters or suggestions change
  useEffect(() => {
    if (suggestions.length) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.connectionLevel <= maxDepth && 
        suggestion.mutualFriends.length >= minMutualFriends
      );
      
      setFilteredSuggestions(filtered);
    }
  }, [suggestions, maxDepth, minMutualFriends]);
  
  const handleIgnore = (userId: number) => {
    // Remove from suggestions
    setSuggestions(suggestions.filter(s => s.user.id !== userId));
  };

  const handleAddFriend = (userId: number) => {
    // Remove from suggestions
    setSuggestions(suggestions.filter(s => s.user.id !== userId));
  };

  const handleSelectUser = (selectedUser: User) => {
    refreshUserData(selectedUser.id);
  };
  
  if (isUserLoading || loading) {
    return <LoadingSpinner message="Loading suggested friends..." />;
  }
  
  if (!currentUser) {
    return (
      <div className="container mx-auto py-10 px-4">
        <EmptyState
          icon={<UserPlus size={32} />}
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
              Discover potential connections using BFS algorithm 
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <UserSearchInput onSelectUser={handleSelectUser} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium gradient-text">Filters</h2>
                  <Filter size={18} />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        Max BFS Depth
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={14} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Level 1: Direct friends<br />
                                Level 2: Friends of friends<br />
                                Level 3+: Extended network
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <span className="text-sm bg-accent/50 px-2 py-0.5 rounded">
                        Level {maxDepth}
                      </span>
                    </div>
                    <Select 
                      value={maxDepth.toString()} 
                      onValueChange={(value) => setMaxDepth(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select maximum depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Level 2 (Friends of friends)</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                        <SelectItem value="5">Level 5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        Min Mutual Friends
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={14} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Filter by minimum number of mutual connections
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <span className="text-sm bg-accent/50 px-2 py-0.5 rounded">
                        {minMutualFriends}+
                      </span>
                    </div>
                    <Slider 
                      value={[minMutualFriends]} 
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(values) => setMinMutualFriends(values[0])}
                      className="my-4"
                    />
                  </div>
                  
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredSuggestions.length} of {suggestions.length} suggestions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            {filteredSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSuggestions.map(suggestion => (
                  <FriendCard
                    key={suggestion.user.id}
                    user={suggestion.user}
                    connectionLevel={suggestion.connectionLevel}
                    mutualFriends={suggestion.mutualFriends}
                    onAddFriend={handleAddFriend}
                    onIgnore={handleIgnore}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<UserPlus size={32} />}
                title="No suggested friends"
                description={
                  suggestions.length > 0 
                    ? "Try adjusting your filters to see more suggestions." 
                    : "No friend suggestions found for this user."
                }
                action={{
                  label: "Adjust Filters",
                  onClick: () => {
                    setMaxDepth(5);
                    setMinMutualFriends(0);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedFriends;
