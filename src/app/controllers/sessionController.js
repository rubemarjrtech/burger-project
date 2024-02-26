import * as Yup from "yup";
import User from "../models/User";

class SessionController {
    async store(request, response) {
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
                error: "Make sure your email and password are correct and try again."
            });
        }

        if (!(await user.checkPassword(senha))) {
            return response
                .status(401)
                .json({
                    error: "Make sure your email and password are correct and try again."
                });
        }

        return response.json({ id: user.id, email, name: user.name });
    }
}

export default new SessionController();
