
import usersData from '../data/users.json';

export interface Interaction {
  userId: number;
  weight: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  friends: number[];
  interactions: Interaction[];
}

export interface FriendSuggestion {
  user: User;
  mutualFriends: User[];
  connectionLevel: number;
  connectionPath: User[];
  score: number;
  interactionWeight: number;
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

// Get interaction weight between two users
export const getInteractionWeight = (user1Id: number, user2Id: number, users: User[] = usersData.users): number => {
  const user1 = getUserById(user1Id, users);
  if (!user1) return 0;
  
  const interaction = user1.interactions.find(i => i.userId === user2Id);
  return interaction ? interaction.weight : 0;
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

// Calculate total interaction weight through mutual friends
export const calculateInteractionWeight = (
  userId: number,
  targetId: number,
  mutualFriends: User[],
  users: User[] = usersData.users
): number => {
  let totalWeight = 0;
  
  mutualFriends.forEach(friend => {
    // Get weights of interactions between mutual friend and both users
    const weight1 = getInteractionWeight(userId, friend.id, users);
    const weight2 = getInteractionWeight(friend.id, targetId, users);
    
    // Add the minimum of these weights (representing the "strength" of this path)
    totalWeight += Math.min(weight1, weight2);
  });
  
  return totalWeight;
};

// Get friend suggestions using BFS algorithm with weighted scoring
export const getFriendSuggestions = (
  userId: number, 
  maxLevel = 2,
  users: User[] = usersData.users,
  alphaWeight = 2,  // Coefficient for mutual friends count
  betaWeight = 1    // Coefficient for interaction weight
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
          const interactionWeight = calculateInteractionWeight(userId, friendId, mutualFriends, users);
          
          // Calculate recommendation score using formula:
          // Score = (alpha * numMutualFriends) + (beta * totalInteractionWeight)
          const score = (alphaWeight * mutualFriends.length) + (betaWeight * interactionWeight);
          
          suggestions.push({
            user: friend,
            mutualFriends,
            connectionLevel: level + 1,
            connectionPath: [...path, friend],
            score,
            interactionWeight
          });
        }
        
        // Continue BFS
        queue.push([friendId, level + 1, [...path, friend]]);
      }
    }
  }
  
  // Sort suggestions by score (higher is better)
  return suggestions.sort((a, b) => b.score - a.score);
};
