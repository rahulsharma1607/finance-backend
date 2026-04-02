const {
  addUser,
  getAllUsers,
  ROLES,
} = require("../models/user.model");

// GET users
const getUsers = (req, res) => {
  const users = getAllUsers();

  res.json({
    message: "List of users",
    data: users,
  });
};

// POST create user
const createUser = (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      message: "Name and role are required",
    });
  }

  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    role,
    status: "active",
  };

  addUser(newUser);

  res.status(201).json({
    message: "User created successfully",
    data: newUser,
  });
};

module.exports = {
  getUsers,
  createUser,
};