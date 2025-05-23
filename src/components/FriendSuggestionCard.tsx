
import { User } from '@/utils/bfs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X, Star, Users } from 'lucide-react';

interface FriendCardProps {
  user: User;
  connectionLevel: number;
  mutualFriends: User[];
  score: number;
  interactionWeight: number;
  onAddFriend: (userId: number) => void;
  onIgnore: (userId: number) => void;
}

const FriendSuggestionCard = ({ 
  user, 
  connectionLevel, 
  mutualFriends, 
  score,
  interactionWeight,
  onAddFriend, 
  onIgnore 
}: FriendCardProps) => {
  return (
    <Card className="glass-card overflow-hidden relative">
      {score > 15 && (
        <div className="absolute right-2 top-2">
          <Badge className="bg-amber-500 border-none">
            <Star className="h-3 w-3 mr-1" /> Top Match
          </Badge>
        </div>
      )}
      
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-social-primary flex items-center justify-center text-white font-semibold text-lg">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm truncate">{user.bio}</p>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-social-primary/80">Level {connectionLevel}</Badge>
              <Badge className="bg-green-600/80">
                <Star className="h-3 w-3 mr-1" /> Score: {score}
              </Badge>
              <Badge variant="outline" className="border-social-light/30">
                <Users className="h-3 w-3 mr-1" />
                {mutualFriends.length} {mutualFriends.length === 1 ? 'mutual' : 'mutuals'}
              </Badge>
            </div>
            
            {interactionWeight > 0 && (
              <div className="mt-1">
                <Badge variant="outline" className="bg-accent/20 text-muted-foreground">
                  Interaction strength: {interactionWeight}
                </Badge>
              </div>
            )}
            
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
