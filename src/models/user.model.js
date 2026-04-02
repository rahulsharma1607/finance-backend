// src/models/user.model.js

// in-memory storage (temporary)
let users = [];

// roles definition
const ROLES = {
  VIEWER: "viewer",
  ANALYST: "analyst",
  ADMIN: "admin",
};

// function to add user
const addUser = (user) => {
  users.push(user);
  return user;
};

// function to get all users
const getAllUsers = () => {
  return users;
};

module.exports = {
  addUser,
  getAllUsers,
  ROLES,
};