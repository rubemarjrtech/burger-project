import * as Yup from "yup";
import Categories from "../models/Categories";
import User from "../models/User";

class CategoriesController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required()
            });

            try {
                await schema.validateSync(request.body);
            } catch (err) {
                response.status(401).json({
                    error: err.errors
                });
            }

            const { name } = request.body;

            const { admin: isAdmin } = await User.findByPk(request.id);

            if (!isAdmin) {
                return response.status(401).json();
            }

            const categoryExists = await Categories.findOne({
                where: { name }
            });

            if (categoryExists) {
                return response.status(400).json({
                    error: "Category already exists. Please try another name."
                });
            }

            const { id } = await Categories.create({
                name
            });

            return response.status(201).json({
                message: "Category was created successfully",
                name,
                id
            });
        } catch (err) {
            return response.status(401).json({
                error: err.errors
            });
        }
    }

    async index(request, response) {
        try {
            const data = await Categories.findAll();

            return response.status(201).json({
                message: "Data retrieved successfully",
                data
            });
        } catch (error) {
            return response.status(401).json({
                message: error.name
            });
        }
    }
}

export default new CategoriesController();
