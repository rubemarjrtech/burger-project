import User from "../models/User.js";
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
                schema.validateSync(request.body, { abortEarly: false });
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
            console.log(err);
            response.status(500).json({
                error: err.name,
                message: "User signup failed. Please try again."
            });
        }
    }

    async index(_, response) {
        try {
            const users = await User.findAll({
                attributes: {
                    exclude: ["password"]
                }
            });

            return response.status(200).json(users);
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }

    async remove(request, response) {
        try {
            const result = await User.destroy({
                where: { id: request.user.id }
            });

            if (!result)
                return response.status(400).json({
                    message:
                        "Could not delete user. Please verify if id exists and is valid"
                });

            return response.status(200).json({
                message: "User deleted successfully!"
            });
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }
}

export default new UserController();
