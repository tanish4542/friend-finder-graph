
import { ArrowRight } from 'lucide-react';
import { User } from '@/utils/bfs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConnectionPathProps {
  path: User[];
}

const ConnectionPath = ({ path }: ConnectionPathProps) => {
  if (!path || path.length < 2) {
    return null;
  }
  
  return (
    <div className="py-2 px-4 bg-white rounded-lg shadow-sm border flex items-center overflow-x-auto gap-2">
      {path.map((user, index) => (
        <div key={user.id} className="flex items-center shrink-0">
          {index > 0 && (
            <ArrowRight className="mx-1 text-social-tertiary" size={16} />
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-social-light">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs bg-social-primary text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-social-tertiary font-medium truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
};

export default ConnectionPath;
