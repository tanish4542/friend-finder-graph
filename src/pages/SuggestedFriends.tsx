
import { useState, useEffect } from 'react';
import { User, FriendSuggestion } from '@/utils/bfs';
import { api } from '@/services/api';
import FriendSuggestionCard from '@/components/FriendSuggestionCard';
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
import { toast } from "sonner";

const SuggestedFriends = () => {
  const { currentUser, isLoading: isUserLoading, refreshUserData } = useUser();
  
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<FriendSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [minMutualFriends, setMinMutualFriends] = useState<number>(0);
  const [alphaWeight, setAlphaWeight] = useState<number>(2);
  const [betaWeight, setBetaWeight] = useState<number>(1);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Get all friend suggestions with a high max depth to get all possible suggestions
        const suggestionsData = await api.getFriendSuggestions(currentUser.id, 5, alphaWeight, betaWeight);
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
  }, [currentUser, alphaWeight, betaWeight]);
  
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
  
  const handleIgnore = async (userId: number) => {
    if (!currentUser) return;
    
    try {
      // Call API to ignore friend suggestion
      await api.ignoreFriend(currentUser.id, userId);
      
      // Remove from suggestions
      setSuggestions(suggestions.filter(s => s.user.id !== userId));
      
      toast.success("Friend suggestion ignored");
    } catch (error) {
      console.error('Error ignoring friend suggestion:', error);
      toast.error("Failed to ignore friend suggestion");
    }
  };

  const handleAddFriend = async (userId: number) => {
    if (!currentUser) return;
    
    try {
      // Call API to add friend
      await api.addFriend(currentUser.id, userId);
      
      // Remove from suggestions
      setSuggestions(suggestions.filter(s => s.user.id !== userId));
      
      // Refresh user data to update friends list
      await refreshUserData(currentUser.id);
      
      toast.success("Friend added successfully!");
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error("Failed to add friend");
    }
  };

  const handleSelectUser = (selectedUser: User) => {
    refreshUserData(selectedUser.id);
  };
  
  const recalculateScores = () => {
    if (!currentUser) return;
    
    setLoading(true);
    api.getFriendSuggestions(currentUser.id, 5, alphaWeight, betaWeight)
      .then(newSuggestions => {
        setSuggestions(newSuggestions);
        toast.success("Recommendation scores recalculated");
      })
      .catch(error => {
        console.error('Error recalculating scores:', error);
        toast.error("Failed to recalculate recommendation scores");
      })
      .finally(() => {
        setLoading(false);
      });
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
            <h1 className="text-3xl font-bold mb-1 gradient-text">SocialBFS - Friend Finder</h1>
            <p className="text-muted-foreground">
              Smart friend recommendations using BFS algorithm
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
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recommendation Weight Factors</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm flex items-center gap-1">
                            Mutual Friends (α)
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={14} className="text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[200px] text-xs">
                                    Weight given to the number of mutual friends in the recommendation score
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <span className="text-sm bg-accent/50 px-2 py-0.5 rounded">
                            {alphaWeight}
                          </span>
                        </div>
                        <Slider 
                          value={[alphaWeight]} 
                          min={0}
                          max={5}
                          step={1}
                          onValueChange={(values) => setAlphaWeight(values[0])}
                          className="my-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm flex items-center gap-1">
                            Interaction Weight (β)
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={14} className="text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[200px] text-xs">
                                    Weight given to interaction strength in the recommendation score
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <span className="text-sm bg-accent/50 px-2 py-0.5 rounded">
                            {betaWeight}
                          </span>
                        </div>
                        <Slider 
                          value={[betaWeight]} 
                          min={0}
                          max={5}
                          step={1}
                          onValueChange={(values) => setBetaWeight(values[0])}
                          className="my-2"
                        />
                      </div>
                      
                      <button
                        onClick={recalculateScores}
                        className="w-full bg-social-primary/80 hover:bg-social-primary text-white py-1 px-3 rounded text-sm"
                      >
                        Recalculate Scores
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredSuggestions.length} of {suggestions.length} suggestions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formula: Score = ({alphaWeight} × Mutual Friends) + ({betaWeight} × Interaction Weight)
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
                  <FriendSuggestionCard
                    key={suggestion.user.id}
                    user={suggestion.user}
                    connectionLevel={suggestion.connectionLevel}
                    mutualFriends={suggestion.mutualFriends}
                    score={suggestion.score}
                    interactionWeight={suggestion.interactionWeight}
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
