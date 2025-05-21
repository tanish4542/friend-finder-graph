
import { User, getAllUsers, getUserById, getDirectFriends, getFriendSuggestions } from '../utils/bfs';

// Simulate API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for user data (simulating a database)
let users = getAllUsers();

export const api = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    await delay(800); // Simulate network delay
    return [...users]; // Return a copy to prevent direct mutations
  },
  
  // Get user by ID
  getUser: async (id: number): Promise<User | null> => {
    await delay(500);
    const user = users.find(user => user.id === id);
    return user ? {...user} : null; // Return a copy to prevent direct mutations
  },
  
  // Get user's friends
  getUserFriends: async (userId: number): Promise<User[]> => {
    await delay(700);
    return getDirectFriends(userId, users);
  },
  
  // Get friend suggestions for a user
  getFriendSuggestions: async (userId: number, maxLevel = 2, minMutualFriends = 0) => {
    await delay(1200); // Longer delay for "complex" operation
    const suggestions = getFriendSuggestions(userId, maxLevel, users);
    
    // Filter by mutual friends if specified
    if (minMutualFriends > 0) {
      return suggestions.filter(suggestion => suggestion.mutualFriends.length >= minMutualFriends);
    }
    
    return suggestions;
  },
  
  // Add friend (persists the change)
  addFriend: async (userId: number, friendId: number): Promise<boolean> => {
    await delay(600);
    try {
      // Find the users in our "database"
      const userIndex = users.findIndex(u => u.id === userId);
      const friendIndex = users.findIndex(u => u.id === friendId);
      
      if (userIndex === -1 || friendIndex === -1) {
        console.error('User or friend not found');
        return false;
      }
      
      // Clone the users to avoid direct mutation
      const updatedUsers = [...users];
      
      // Add the friend to the user's friends list if not already there
      if (!updatedUsers[userIndex].friends.includes(friendId)) {
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          friends: [...updatedUsers[userIndex].friends, friendId]
        };
      }
      
      // Add the user to the friend's friends list if not already there (bidirectional)
      if (!updatedUsers[friendIndex].friends.includes(userId)) {
        updatedUsers[friendIndex] = {
          ...updatedUsers[friendIndex],
          friends: [...updatedUsers[friendIndex].friends, userId]
        };
      }
      
      // Update our "database"
      users = updatedUsers;
      console.log(`Added user ${friendId} as a friend of user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error adding friend:', error);
      return false;
    }
  },
  
  // Remove friend (persists the change)
  removeFriend: async (userId: number, friendId: number): Promise<boolean> => {
    await delay(400);
    try {
      // Find the users in our "database"
      const userIndex = users.findIndex(u => u.id === userId);
      const friendIndex = users.findIndex(u => u.id === friendId);
      
      if (userIndex === -1 || friendIndex === -1) {
        console.error('User or friend not found');
        return false;
      }
      
      // Clone the users to avoid direct mutation
      const updatedUsers = [...users];
      
      // Remove the friend from the user's friends list
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        friends: updatedUsers[userIndex].friends.filter(id => id !== friendId)
      };
      
      // Remove the user from the friend's friends list (bidirectional)
      updatedUsers[friendIndex] = {
        ...updatedUsers[friendIndex],
        friends: updatedUsers[friendIndex].friends.filter(id => id !== userId)
      };
      
      // Update our "database"
      users = updatedUsers;
      console.log(`Removed user ${friendId} as a friend of user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      return false;
    }
  },
  
  // Simulate "ignore friend" action
  ignoreFriend: async (userId: number, friendId: number): Promise<boolean> => {
    await delay(400);
    console.log(`Ignored user ${friendId} for user ${userId}`);
    return true; // Simulate successful operation
  }
};
