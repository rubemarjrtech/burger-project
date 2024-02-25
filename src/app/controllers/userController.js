import User from "../models/User";
import * as Yup from "yup";
import { v4 } from "uuid";

class UserController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                password: Yup.string().min(8).required(),
                admin: Yup.boolean()
            });

            await schema.validateSync(request.body, { abortEarly: false });

            const { name, email, password, admin } = request.body;

            const user = await User.create({
                id: v4(),
                name,
                email,
                password,
                admin
            });

            return response
                .status(201)
                .json({ message: "usuario criado com sucesso", user });
        } catch (err) {
            response.status(400).json({ error: err.errors });
        }
    }
}

export default new UserController();
