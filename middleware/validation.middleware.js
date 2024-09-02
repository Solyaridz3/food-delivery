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
      const errors = [];
      error.details.forEach((error) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
}

export { validationMiddleware };
