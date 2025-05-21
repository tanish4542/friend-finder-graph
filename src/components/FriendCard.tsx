
import { User } from '@/utils/bfs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserPlus, X, Check, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { api } from '@/services/api';

interface FriendCardProps {
  user: User;
  currentUserId: number;
  isFriend?: boolean;
  connectionLevel?: number;
  mutualFriends?: User[];
  onAddFriend?: (userId: number) => void;
  onIgnore?: (userId: number) => void;
}

const FriendCard = ({ 
  user, 
  currentUserId,
  isFriend = false, 
  connectionLevel = 1,
  mutualFriends = [],
  onAddFriend,
  onIgnore
}: FriendCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      await api.addFriend(currentUserId, user.id);
      toast.success(`Added ${user.name} as a friend!`);
      if (onAddFriend) onAddFriend(user.id);
    } catch (error) {
      toast.error("Failed to add friend");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleIgnore = async () => {
    setIsLoading(true);
    try {
      await api.ignoreFriend(currentUserId, user.id);
      toast.info(`Ignored suggestion for ${user.name}`);
      if (onIgnore) onIgnore(user.id);
    } catch (error) {
      toast.error("Failed to ignore suggestion");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate user initials for avatar fallback
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-social-light">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-social-primary text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
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
            <div className="flex -space-x-2 overflow-hidden">
              {mutualFriends.slice(0, 3).map((friend) => (
                <TooltipProvider key={friend.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="bg-social-tertiary text-white text-xs">
                          {friend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{friend.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              
              {mutualFriends.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-social-light text-social-tertiary text-xs flex items-center justify-center border-2 border-white">
                  +{mutualFriends.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3">
        {isFriend ? (
          <Button 
            variant="outline" 
            className="w-full bg-social-light text-social-tertiary border-none"
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
              onClick={handleIgnore}
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
