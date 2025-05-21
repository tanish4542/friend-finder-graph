
import { User } from '@/utils/bfs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X } from 'lucide-react';

interface FriendCardProps {
  user: User;
  connectionLevel: number;
  mutualFriends: User[];
  onAddFriend: (userId: number) => void;
  onIgnore: (userId: number) => void;
}

const FriendSuggestionCard = ({ user, connectionLevel, mutualFriends, onAddFriend, onIgnore }: FriendCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12 border-2 border-social-light">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-social-primary text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm truncate">{user.bio}</p>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-social-primary/80">Level {connectionLevel}</Badge>
              <Badge variant="outline" className="border-social-light/30">
                {mutualFriends.length} {mutualFriends.length === 1 ? 'mutual friend' : 'mutual friends'}
              </Badge>
            </div>
            
            {mutualFriends.length > 0 && (
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground">Mutual Friends:</p>
                <div className="flex flex-wrap gap-1">
                  {mutualFriends.map(friend => (
                    <Badge key={friend.id} variant="secondary" className="text-xs">
                      {friend.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex border-t border-border/30">
          <Button 
            variant="ghost"
            className="flex-1 rounded-none border-r border-border/30 text-sm py-2 h-auto hover:bg-background/10"
            onClick={() => onAddFriend(user.id)}
          >
            <UserPlus size={16} className="mr-2" />
            Add Friend
          </Button>
          <Button 
            variant="ghost"
            className="flex-1 rounded-none text-sm py-2 h-auto hover:bg-background/10"
            onClick={() => onIgnore(user.id)}
          >
            <X size={16} className="mr-2" />
            Ignore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendSuggestionCard;
