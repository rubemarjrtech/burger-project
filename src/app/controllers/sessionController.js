import * as Yup from "yup";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";

class SessionController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email().required(),
                senha: Yup.string().required()
            });

            if (!(await schema.isValid(request.body))) {
                return response.status(401).json({
                    error: "Make sure your email and password are correct and try again."
                });
            }

            const { email, senha } = request.body;

            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return response.status(401).json({
                    error: "Login failed. Make sure your email and password are correct and try again."
                });
            }

            if (!(await user.checkPassword(senha))) {
                return response.status(401).json({
                    error: "Login failed. Make sure your email and password are correct and try again."
                });
            }

            const tkn = jwt.sign(
                { id: user.id, name: user.name },
                authConfig.secret,
                {
                    expiresIn: authConfig.expiresIn
                }
            );

            return response.json({
                id: user.id,
                email,
                name: user.name,
                token: tkn
            });
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }
}

export default new SessionController();
