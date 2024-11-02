import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";

export default (request, response, next) => {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            error: "Not authorized, make sure to be logged in and try again"
        });
    }

    const token = authToken.split(" ")[1];

    if (!token) {
        return response.status(401).json({
            error: "Not authorized, make sure to be logged in and try again"
        });
    }

    try {
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                throw new Error();
            }

            request.id = decoded.id;
            request.name = decoded.name;

            return next();
        });
    } catch (err) {
        return response.status(401).json({
            error: "invalid token"
        });
    }
};
