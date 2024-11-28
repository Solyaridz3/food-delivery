/**
 * Middleware to validate request bodies using a Joi schema.
 * @param {Object} schema - The Joi schema for validation.
 * @returns {Function} - Middleware function.
 */
function validationMiddleware(schema) {
  return async (req, res, next) => {
    const validationOption = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    try {
      const value = await schema.validateAsync(req.body, validationOption);
      req.body = value;
      next();
    } catch (error) {
      const errors = error.details.map((err) => err.message);
      res.status(400).send({ errors });
    }
  };
}

export { validationMiddleware };
