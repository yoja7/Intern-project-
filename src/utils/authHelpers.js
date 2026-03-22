/**
 * authHelpers.js
 * All authentication-related helper functions for Dainiki.
 * Uses only localStorage — no backend, no API calls.
 */

import { v4 as uuidv4 } from "uuid";
import {
  getUsers,
  saveUsers,
  saveCurrentUser,
  removeCurrentUser,
  getCurrentUser as getStoredCurrentUser,
} from "./localStorage";

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Registers a new user.
 * Returns { success: true, user } or { success: false, error: "message" }
 */
export function registerUser({ fullName, email, password, confirmPassword }) {
  // Basic validation
  if (!fullName || !email || !password || !confirmPassword) {
    return { success: false, error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const users = getUsers();

  // Check for duplicate email (case-insensitive)
  const emailExists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (emailExists) {
    return { success: false, error: "An account with this email already exists." };
  }

  // Build new user object
  const newUser = {
    id: uuidv4(),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password, // plain text — acceptable for a frontend-only demo project
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  return { success: true, user: newUser };
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Validates credentials and saves the current user session.
 * Returns { success: true, user } or { success: false, error: "message" }
 */
export function loginUser({ email, password }) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const users = getUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  // Save session (exclude password from session object)
  const sessionUser = {
    id: user.id,
    fullName: user.fullName || user.name || "User",
    email: user.email,
    createdAt: user.createdAt,
  };

  saveCurrentUser(sessionUser);

  return { success: true, user: sessionUser };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Clears the current user session from localStorage.
 */
export function logoutUser() {
  removeCurrentUser();
}

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * Returns the currently logged-in user from localStorage, or null.
 */
export function getCurrentUser() {
  return getStoredCurrentUser();
}

// ─── Update Current User (Profile Edit) ──────────────────────────────────────

/**
 * Updates the logged-in user's fullName and/or email.
 * Syncs both the users array and the current session.
 * Returns { success: true } or { success: false, error: "message" }
 */
export function updateCurrentUser({ fullName, email }) {
  if (!fullName || !email) {
    return { success: false, error: "Name and email are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const currentUser = getStoredCurrentUser();
  if (!currentUser) {
    return { success: false, error: "No user is currently logged in." };
  }

  const users = getUsers();

  // Check if the new email is taken by a different user
  const emailTaken = users.some(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.id !== currentUser.id
  );
  if (emailTaken) {
    return { success: false, error: "This email is already in use by another account." };
  }

  // Update in users array
  const updatedUsers = users.map((u) =>
    u.id === currentUser.id
      ? { ...u, fullName: fullName.trim(), email: email.trim().toLowerCase() }
      : u
  );
  saveUsers(updatedUsers);

  // Update session
  const updatedSession = {
    ...currentUser,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
  };
  saveCurrentUser(updatedSession);

  return { success: true, user: updatedSession };
}

// ─── Change Password ──────────────────────────────────────────────────────────

/**
 * Changes the logged-in user's password after verifying the current one.
 * Returns { success: true } or { success: false, error: "message" }
 */
export function changePassword({ currentPassword, newPassword, confirmNewPassword }) {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return { success: false, error: "All password fields are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  const currentUser = getStoredCurrentUser();
  if (!currentUser) {
    return { success: false, error: "No user is currently logged in." };
  }

  const users = getUsers();
  const user = users.find((u) => u.id === currentUser.id);

  if (!user) {
    return { success: false, error: "User not found." };
  }

  if (user.password !== currentPassword) {
    return { success: false, error: "Current password is incorrect." };
  }

  // Update password in users array
  const updatedUsers = users.map((u) =>
    u.id === currentUser.id ? { ...u, password: newPassword } : u
  );
  saveUsers(updatedUsers);

  return { success: true };
}

// ─── Reset Password (Forgot Password flow) ────────────────────────────────────

/**
 * Resets a user's password by email (used after OTP verification).
 * Returns { success: true } or { success: false, error: "message" }
 */
export function resetPassword({ email, newPassword, confirmNewPassword }) {
  if (!newPassword || !confirmNewPassword) {
    return { success: false, error: "Both password fields are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const users = getUsers();
  const userIndex = users.findIndex(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (userIndex === -1) {
    return { success: false, error: "No account found with this email." };
  }

  users[userIndex] = { ...users[userIndex], password: newPassword };
  saveUsers(users);

  // Clean up the temporary reset email from localStorage
  localStorage.removeItem("dainiki_reset_email");

  return { success: true };
}

// ─── Forgot Password helpers ──────────────────────────────────────────────────

/**
 * Checks if an email exists in the users array.
 * If yes, saves it temporarily for the reset flow.
 * Returns { success: true } or { success: false, error: "message" }
 */
export function initiatePasswordReset(email) {
  if (!email) {
    return { success: false, error: "Email is required." };
  }

  const users = getUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!exists) {
    return { success: false, error: "No account found with this email address." };
  }

  localStorage.setItem("dainiki_reset_email", email.trim().toLowerCase());
  return { success: true };
}

/**
 * Returns the email currently stored for the password reset flow.
 */
export function getResetEmail() {
  return localStorage.getItem("dainiki_reset_email") || null;
}
