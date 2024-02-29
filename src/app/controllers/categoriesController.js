import * as Yup from "yup";
import Categories from "../models/Categories";

class CategoriesController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required()
        });

        schema.validateSync(request.body);

        const { name } = request.body;

        try {
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
        } catch (err) {
            return response.status(401).json({
                message: err.errors
            });
        }
    }
}

export default new CategoriesController();
