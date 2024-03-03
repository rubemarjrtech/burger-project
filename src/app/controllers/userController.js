import User from "../models/User";
import * as Yup from "yup";
import { v4 } from "uuid";

class UserController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                senha: Yup.string().min(8).required(),
                admin: Yup.boolean()
            });

            try {
                await schema.validateSync(request.body, { abortEarly: false });
            } catch (err) {
                return response.status(401).json({
                    error: err.errors
                });
            }

            const { name, email, senha, admin } = request.body;

            const checkUser = await User.findOne({
                where: { email }
            });

            if (checkUser) {
                return response.status(400).json({
                    error: "Email already in use"
                });
            }

            const user = await User.create({
                id: v4(),
                name,
                email,
                senha,
                admin
            });

            return response.status(201).json({
                message: "User created successfully",
                id: user.id,
                name,
                email
            });
        } catch (err) {
            response
                .status(400)
                .json({
                    error: err.name,
                    message: "User signup failed. Please try again."
                });
        }
    }
}

export default new UserController();
