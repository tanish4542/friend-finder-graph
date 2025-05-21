
import usersData from '../data/users.json';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  friends: number[];
}

export interface FriendSuggestion {
  user: User;
  mutualFriends: User[];
  connectionLevel: number;
  connectionPath: User[];
}

// Get all users
export const getAllUsers = (): User[] => {
  return usersData.users;
};

// Get user by ID
export const getUserById = (id: number, users: User[] = usersData.users): User | undefined => {
  return users.find(user => user.id === id);
};

// Get user by username
export const getUserByUsername = (username: string, users: User[] = usersData.users): User | undefined => {
  return users.find(user => user.username === username);
};

// Get direct friends (level 1)
export const getDirectFriends = (userId: number, users: User[] = usersData.users): User[] => {
  const user = getUserById(userId, users);
  
  if (!user) return [];
  
  return user.friends.map(friendId => {
    const friend = getUserById(friendId, users);
    return friend as User;
  }).filter(Boolean);
};

// Get connection path between two users
export const findConnectionPath = (startUserId: number, endUserId: number, users: User[] = usersData.users): User[] => {
  // If same user, return just that user
  if (startUserId === endUserId) {
    const user = getUserById(startUserId, users);
    return user ? [user] : [];
  }
  
  // BFS to find shortest path
  const visited = new Set<number>();
  const queue: { id: number; path: User[] }[] = [];
  
  const startUser = getUserById(startUserId, users);
  if (!startUser) return [];
  
  queue.push({ id: startUserId, path: [startUser] });
  visited.add(startUserId);
  
  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    
    const user = getUserById(id, users);
    if (!user) continue;
    
    for (const friendId of user.friends) {
      if (friendId === endUserId) {
        const endUser = getUserById(endUserId, users);
        if (endUser) {
          return [...path, endUser];
        }
      }
      
      if (!visited.has(friendId)) {
        visited.add(friendId);
        const friend = getUserById(friendId, users);
        if (friend) {
          queue.push({ id: friendId, path: [...path, friend] });
        }
      }
    }
  }
  
  return []; // No path found
};

// Find mutual friends between two users
export const findMutualFriends = (user1Id: number, user2Id: number, users: User[] = usersData.users): User[] => {
  const user1 = getUserById(user1Id, users);
  const user2 = getUserById(user2Id, users);
  
  if (!user1 || !user2) return [];
  
  const mutualFriendIds = user1.friends.filter(id => user2.friends.includes(id));
  return mutualFriendIds.map(id => getUserById(id, users)!).filter(Boolean);
};

// Get friend suggestions using BFS algorithm
export const getFriendSuggestions = (
  userId: number, 
  maxLevel = 2,
  users: User[] = usersData.users
): FriendSuggestion[] => {
  const user = getUserById(userId, users);
  if (!user) return [];
  
  const visited = new Set<number>([userId]);
  const suggestions: FriendSuggestion[] = [];
  
  // Queue with [userId, level, path]
  const queue: [number, number, User[]][] = [];
  queue.push([userId, 0, [user]]);
  
  while (queue.length > 0) {
    const [currentId, level, path] = queue.shift()!;
    
    if (level > maxLevel) continue;
    
    const currentUser = getUserById(currentId, users);
    if (!currentUser) continue;
    
    for (const friendId of currentUser.friends) {
      if (!visited.has(friendId)) {
        visited.add(friendId);
        
        const friend = getUserById(friendId, users);
        if (!friend) continue;
        
        // Add to suggestions if level >= 1 (not direct friend)
        if (level >= 1) {
          const mutualFriends = findMutualFriends(userId, friendId, users);
          suggestions.push({
            user: friend,
            mutualFriends,
            connectionLevel: level + 1,
            connectionPath: [...path, friend]
          });
        }
        
        // Continue BFS
        queue.push([friendId, level + 1, [...path, friend]]);
      }
    }
  }
  
  return suggestions;
};
