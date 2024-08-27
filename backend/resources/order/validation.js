import Joi from "joi";

const makeOrder = Joi.object({
    address: Joi.string().required(),
    items: Joi.array().items(
        Joi.object().keys({
            item_id: Joi.number().required(),
            quantity: Joi.number().required(),
        })
    ),
});

export default { makeOrder };
