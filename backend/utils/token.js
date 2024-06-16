import jwt from "jsonwebtoken";

const createToken = (user) => {
    return jwt.sign({ id: user.id }, "secret", { expiresIn: "10d" });
};

export default { createToken };

