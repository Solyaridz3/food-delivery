import Joi from "joi";

const register = Joi.object({
    name: Joi.string().max(30).required(),

    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),
});

const login = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required(),
});

const deleteUser = Joi.object({
    id: Joi.string().required(),
});

const updateUser = Joi.object({
    old_password: Joi.string().required(),
    name: Joi.string().max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6),
});

export default { register, login, deleteUser, updateUser };
