
import { useState, useEffect } from 'react';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { User } from '@/utils/bfs';
import { api } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader } from 'lucide-react';

interface UserSearchInputProps {
  onSelectUser: (user: User) => void;
}

const UserSearchInput = ({ onSelectUser }: UserSearchInputProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await api.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search for users..." 
          className="h-12 text-base"
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            // Close the dropdown on Escape
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        
        {open && (
          <CommandList className="absolute top-full left-0 right-0 max-h-52 overflow-auto z-10 bg-white rounded-b-lg border border-t-0 shadow-lg">
            {loading ? (
              <div className="py-6 flex justify-center items-center">
                <Loader className="animate-spin h-6 w-6 text-social-primary" />
              </div>
            ) : (
              <>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup heading="Users">
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleSelectUser(user)}
                      className="cursor-pointer flex items-center gap-2 p-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-social-light text-social-tertiary text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default UserSearchInput;
