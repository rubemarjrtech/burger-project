import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";

export default (request, response, next) => {
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
        return response.status(401).json({
            error: "Missing token"
        });
    }

    const token = bearerToken.split(" ")[1];

    try {
        const decodedUser = jwt.verify(token, authConfig.secret);
        request["user"] = decodedUser;
        next();
    } catch (error) {
        console.log(error);
        response.status(403).json({
            error: "Invalid token"
        });
    }
};
