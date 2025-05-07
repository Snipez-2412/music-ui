import { User } from "../types/User";

const BASE_URL = "http://localhost:8080/users";

/**
 * Fetch all users
 * @returns {Promise<User[]>}
 */
export const fetchAllUsers = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    credentials: 'include', // Include session cookie
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

/**
 * Fetch a user by ID
 * @param {number} id - User's ID
 * @returns {Promise<User>}
 */
export const fetchUserById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: 'include', // Include session cookie
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};

/**
 * Fetch the currently authenticated user's ID
 * @returns {Promise<number>}
 */
export const fetchCurrentUserId = async () => {
  const response = await fetch(`${BASE_URL}/me/id`, {
    method: "GET",
    credentials: 'include',
  });
  console.log("Response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch current user ID");
  }
  return response.json();
};

/**
 * Fetch a user by username
 * @param {string} username - User's username
 * @returns {Promise<User>}
 */
export const fetchUserByUsername = async (username) => {
  const response = await fetch(`${BASE_URL}/username/${username}`, {
    method: "GET",
    credentials: 'include', // Include session cookie
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user by username");
  }
  return response.json();
};

/**
 * Add a new user
 * @param {User} user - The user object to add
 * @param {File} [profilePic] - Optional profile picture file
 * @returns {Promise<User>}
 */
export const addUser = async (user, profilePic) => {
  const formData = new FormData();
  formData.append("userDTO", JSON.stringify(user));
  if (profilePic) {
    formData.append("profilePic", profilePic);
  }

  const response = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
    credentials: 'include', // Include session cookie
  });

  if (!response.ok) {
    throw new Error("Failed to add user");
  }
  return response.json();
};

/**
 * Update an existing user
 * @param {number} id - User's ID
 * @param {User} user - The updated user object
 * @param {File} [profilePic] - Optional profile picture file
 * @returns {Promise<User>}
 */
export const updateUser = async (id, user, profilePic) => {
  const formData = new FormData();
  formData.append("userDTO", JSON.stringify(user));
  if (profilePic) {
    formData.append("profilePic", profilePic);
  }

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
    credentials: 'include', // Include session cookie
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};

/**
 * Delete a user by ID
 * @param {number} id - User's ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: 'include', // Include session cookie
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

/**
 * Fetch the currently authenticated user
 * @returns {Promise<User>}
 */
export const fetchCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/current-user`, {
    method: "GET",
    credentials: "include", 
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized: No active session");
    }
    throw new Error("Failed to fetch current user");
  }
  return res.json();
};


