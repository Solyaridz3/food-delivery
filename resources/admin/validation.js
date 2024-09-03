import Joi from "joi";

// Admin operations related joi schemas

const updateOrderStatus = Joi.object({
  status: Joi.string()
    .required()
    .valid("pending", "confirmed", "delivered", "canceled"),
});

const createItem = Joi.object({
  name: Joi.string().required().max(50),
  preparation_time: Joi.number().required(),
  price: Joi.number().required(),
});

export default { updateOrderStatus, createItem };
