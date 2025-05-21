
import { User, getAllUsers, getUserById, getDirectFriends, getFriendSuggestions } from '../utils/bfs';

// Simulate API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    await delay(800); // Simulate network delay
    return getAllUsers();
  },
  
  // Get user by ID
  getUser: async (id: number): Promise<User | null> => {
    await delay(500);
    const user = getUserById(id);
    return user || null;
  },
  
  // Get user's friends
  getUserFriends: async (userId: number): Promise<User[]> => {
    await delay(700);
    return getDirectFriends(userId);
  },
  
  // Get friend suggestions for a user
  getFriendSuggestions: async (userId: number, maxLevel = 2) => {
    await delay(1200); // Longer delay for "complex" operation
    return getFriendSuggestions(userId, maxLevel);
  },
  
  // Simulate "add friend" action
  addFriend: async (userId: number, friendId: number): Promise<boolean> => {
    await delay(600);
    console.log(`Added user ${friendId} as a friend of user ${userId}`);
    return true; // Simulate successful operation
  },
  
  // Simulate "ignore friend" action
  ignoreFriend: async (userId: number, friendId: number): Promise<boolean> => {
    await delay(400);
    console.log(`Ignored user ${friendId} for user ${userId}`);
    return true; // Simulate successful operation
  }
};
