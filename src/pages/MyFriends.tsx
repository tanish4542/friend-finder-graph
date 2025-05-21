
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User } from '@/utils/bfs';
import { api } from '@/services/api';
import FriendCard from '@/components/FriendCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import UserSearchInput from '@/components/UserSearchInput';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import HelpTooltip from '@/components/HelpTooltip';

const MyFriends = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = Number(searchParams.get('userId')) || 1;
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await api.getUser(userId);
        const friendsData = await api.getUserFriends(userId);
        
        setUser(userData || null);
        setFriends(friendsData);
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
  
  const handleRemoveFriend = (friendId: number) => {
    // In a real app, this would update the database
    setFriends(friends.filter(friend => friend.id !== friendId));
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading friends..." />;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Friends</h1>
            <p className="text-muted-foreground">
              Direct connections (Level 1) 
              <HelpTooltip text="Level 1 connections are users directly connected to the selected user." />
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
              <p className="text-social-tertiary">
                {user.name} (@{user.username})
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
                currentUserId={userId}
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
          />
        )}
      </div>
    </div>
  );
};

export default MyFriends;
