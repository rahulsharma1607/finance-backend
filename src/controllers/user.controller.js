const { ROLE_VALUES } = require("../constants/roles");
const { createId } = require("../utils/id");
const { validateUserPayload } = require("../utils/validation");
const {
  getAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
} = require("../models/user.model");

const listUsers = (req, res) => {
  res.json({
    data: getAllUsers(),
    meta: {
      availableRoles: ROLE_VALUES,
    },
  });
};

const getUser = (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    data: user,
  });
};

const createUserHandler = (req, res) => {
  const { errors, data } = validateUserPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Invalid user payload",
      errors,
    });
  }

  if (findUserByEmail(data.email)) {
    return res.status(409).json({
      message: "A user with this email already exists",
    });
  }

  const now = new Date().toISOString();
  const user = createUser({
    id: createId("usr"),
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status || "active",
    createdAt: now,
    updatedAt: now,
  });

  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
};

const updateUserHandler = (req, res) => {
  const existingUser = findUserById(req.params.id);

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const { errors, data } = validateUserPayload(req.body, { allowPartial: true });

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Invalid user payload",
      errors,
    });
  }

  if (data.email && data.email !== existingUser.email && findUserByEmail(data.email)) {
    return res.status(409).json({
      message: "A user with this email already exists",
    });
  }

  const updatedUser = updateUser(req.params.id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });

  res.json({
    message: "User updated successfully",
    data: updatedUser,
  });
};

module.exports = {
  listUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
};
