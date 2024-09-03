import Joi from "joi";

// Joi user related validation objects

const register = Joi.object({
  name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(6).max(20).required(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const deleteUser = Joi.object({
  id: Joi.string().required(),
});

const updateUser = Joi.object({
  password: Joi.string().required(),
  name: Joi.string().max(30),
  email: Joi.string().email(),
  new_password: Joi.string().min(6),
  phone: Joi.string().min(6).max(20),
});

export default { register, login, deleteUser, updateUser };
