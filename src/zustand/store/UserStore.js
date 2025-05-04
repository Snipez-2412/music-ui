import { create } from "zustand";
import * as userAPI from "../api/UserAPI";

export const useUserStore = create((set) => ({
  users: [],
  currentUser: null,
  currentUserId: null,

  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null, currentUserId: null }),

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


fetchCurrentUser: async () => {
  try {
    const userId = await userAPI.fetchCurrentUserId();
    const user = await userAPI.fetchUserById(userId);
    set({ currentUser: user });
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
},

  createUser: async (user, profilePic) => {
    try {
      const addedUser = await userAPI.addUser(user, profilePic);
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
        currentUser: updatedUser,
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

