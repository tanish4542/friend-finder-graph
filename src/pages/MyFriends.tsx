
import { useState, useEffect } from 'react';
import { User } from '@/utils/bfs';
import { api } from '@/services/api';
import FriendCard from '@/components/FriendCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import UserSearchInput from '@/components/UserSearchInput';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import HelpTooltip from '@/components/HelpTooltip';
import { useUser } from '@/context/UserContext';
import { toast } from "sonner";

const MyFriends = () => {
  const { currentUser, isLoading: isUserLoading, refreshUserData } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<User[]>([]);
  
  const fetchFriends = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const friendsData = await api.getUserFriends(currentUser.id);
      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);
  
  const handleSelectUser = (selectedUser: User) => {
    refreshUserData(selectedUser.id);
  };
  
  const handleRemoveFriend = async (friendId: number) => {
    if (!currentUser) return;
    
    try {
      // Call the API to remove friend
      await api.removeFriend(currentUser.id, friendId);
      
      // Update local state for immediate feedback
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      
      // Refresh user data to ensure consistency
      await refreshUserData(currentUser.id);
      
      toast.success("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend");
    }
  };
  
  if (isUserLoading || loading) {
    return <LoadingSpinner message="Loading friends..." />;
  }
  
  if (!currentUser) {
    return (
      <div className="container mx-auto py-10 px-4">
        <EmptyState
          icon={<Users size={32} />}
          title="No user selected"
          description="Please select a user to view their friends"
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
            <h1 className="text-3xl font-bold mb-1 gradient-text">SocialBFS - My Friends</h1>
            <p className="text-muted-foreground">
              Direct connections (Level 1) 
              <HelpTooltip text="Level 1 connections are users directly connected to the selected user." />
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <UserSearchInput onSelectUser={handleSelectUser} />
          </div>
        </div>
        
        {currentUser && (
          <Card className="mb-6 glass-card">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-2 gradient-text">Selected User</h2>
              <p className="text-accent-foreground">
                {currentUser.name} (@{currentUser.username})
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {friends.length} direct connection{friends.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        )}
        
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map(friend => (
              <FriendCard
                key={friend.id}
                user={friend}
                isFriend={true}
                connectionLevel={1}
                onIgnore={handleRemoveFriend}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users size={32} />}
            title="No friends yet"
            description="This user doesn't have any direct connections yet."
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

export default MyFriends;
