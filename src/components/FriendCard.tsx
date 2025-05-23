
import { User } from '@/utils/bfs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserPlus, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';

interface FriendCardProps {
  user: User;
  isFriend?: boolean;
  connectionLevel?: number;
  mutualFriends?: User[];
  onAddFriend?: (userId: number) => void;
  onIgnore?: (userId: number) => void;
}

const FriendCard = ({ 
  user, 
  isFriend = false, 
  connectionLevel = 1,
  mutualFriends = [],
  onAddFriend,
  onIgnore
}: FriendCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, addFriend, removeFriend } = useUser();
  
  const handleAddFriend = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const success = await addFriend(currentUser.id, user.id);
      if (success && onAddFriend) {
        onAddFriend(user.id);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveFriend = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const success = await removeFriend(currentUser.id, user.id);
      if (success && onIgnore) {
        onIgnore(user.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="w-full transition-all hover:shadow-md glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-social-primary flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <Badge 
            variant={connectionLevel === 1 ? "default" : "secondary"} 
            className={connectionLevel === 1 ? "bg-social-primary" : ""}
          >
            Level {connectionLevel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm line-clamp-2 h-10">{user.bio}</p>
        
        {mutualFriends.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">
              {mutualFriends.length} mutual connection{mutualFriends.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {mutualFriends.slice(0, 5).map((friend) => (
                <Badge key={friend.id} variant="secondary" className="text-xs">
                  {friend.name}
                </Badge>
              ))}
              {mutualFriends.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{mutualFriends.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-border/30 pt-3">
        {isFriend ? (
          <Button 
            variant="outline" 
            className="w-full bg-accent/50 text-accent-foreground border-none"
            onClick={handleRemoveFriend}
            disabled={isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            Already Friends
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Button 
              onClick={handleAddFriend} 
              className="flex-1 bg-social-primary hover:bg-social-tertiary" 
              disabled={isLoading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Friend
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleRemoveFriend}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Ignore
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FriendCard;
