import { create } from "zustand";
import * as userAPI from "../api/UserAPI";

export const useUserStore = create((set) => ({
  users: [],
  currentUser: null,
  currentUserId: null,

  setCurrentUser: (user) => {
  console.log('Setting currentUser:', user);
  set({ currentUser: user });
  },
  clearCurrentUser: () => set({ currentUser: null, currentUserId: null }),

  restoreUserFromSession: async () => {
    try {
      const user = await userAPI.fetchCurrentUser();
      set({ currentUser: user });
    } catch (error) {
      console.error("Failed to restore user from session:", error);
      set({ currentUser: null });
    }
  },

  fetchUsers: async () => {
    try {
      const users = await userAPI.fetchAllUsers();
      set({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  fetchUser: async (id) => {
    try {
      const user = await userAPI.fetchUserById(id);
      set({ currentUser: user });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },

  fetchUserByUsername: async (username) => {
    try {
      const user = await userAPI.fetchUserByUsername(username);
      set({ currentUser: user });
    } catch (error) {
      console.error("Error fetching user by username:", error);
    }
  },

  createUser: async (user) => {
    try {
      const addedUser = await userAPI.addUser(user);
      set((state) => ({ users: [...state.users, addedUser] }));
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },

  updateUser: async (id, user, profilePic) => {
    try {
      const updatedUser = await userAPI.updateUser(id, user, profilePic);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
      }));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  removeUser: async (id) => {
    try {
      await userAPI.deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },
}));

