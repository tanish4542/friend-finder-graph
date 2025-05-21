
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/utils/bfs';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  addFriend: (userId: number, friendId: number) => Promise<boolean>;
  removeFriend: (userId: number, friendId: number) => Promise<boolean>;
  refreshUserData: (userId: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadInitialUser = async () => {
      try {
        // Default to user with ID 1 if no saved preference
        const savedUserId = localStorage.getItem('currentUserId') || '1';
        await refreshUserData(parseInt(savedUserId, 10));
      } catch (error) {
        console.error('Failed to load initial user:', error);
      }
    };
    
    loadInitialUser();
  }, []);

  const refreshUserData = async (userId: number) => {
    setIsLoading(true);
    try {
      const user = await api.getUser(userId);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUserId', userId.toString());
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      toast.error('Failed to refresh user data');
    } finally {
      setIsLoading(false);
    }
  };

  const addFriend = async (userId: number, friendId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await api.addFriend(userId, friendId);
      if (success) {
        // Refresh user data to get updated friends list
        await refreshUserData(userId);
        toast.success(`Friend added successfully!`);
      }
      return success;
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error('Failed to add friend');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (userId: number, friendId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await api.removeFriend(userId, friendId);
      if (success) {
        // Refresh user data to get updated friends list
        await refreshUserData(userId);
        toast.info(`Friend removed`);
      }
      return success;
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        setCurrentUser, 
        isLoading, 
        addFriend, 
        removeFriend,
        refreshUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
