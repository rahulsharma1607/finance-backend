const { readJsonFile, writeJsonFile } = require("./store");

const USERS_FILE = "data/users.json";

const getAllUsers = () => {
  return readJsonFile(USERS_FILE);
};

const findUserById = (id) => {
  return getAllUsers().find((user) => user.id === id);
};

const findUserByEmail = (email) => {
  return getAllUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
};

const createUser = (user) => {
  const users = getAllUsers();
  users.push(user);
  writeJsonFile(USERS_FILE, users);
  return user;
};

const updateUser = (id, updates) => {
  const users = getAllUsers();
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  };

  writeJsonFile(USERS_FILE, users);
  return users[userIndex];
};

module.exports = {
  getAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
};
