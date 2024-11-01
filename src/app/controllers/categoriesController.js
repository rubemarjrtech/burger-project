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
                schema.validateSync(request.body);
            } catch (err) {
                return response.status(401).json({
                    error: err.errors
                });
            }

            const { filename: path } = request.file;
            const { name } = request.body;

            const { admin: isAdmin } = await User.findByPk(request.id);

            if (!isAdmin) {
                return response.status(403).json();
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
                name,
                path
            });

            return response.status(201).json({
                message: "Category was created successfully",
                name,
                id
            });
        } catch (err) {
            return response.status(401).json({
                error: err.name
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

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
            });

            try {
                schema.validateSync(request.body);
            } catch (err) {
                return response.status(401).json({
                    error: err.errors
                });
            }

            const { admin: isAdmin } = await User.findByPk(request.id);

            if (!isAdmin) {
                return response.status(401).json();
            }

            let path;
            if (request.file) {
                path = request.file.filename;
            }

            const { name } = request.body;
            const { id } = request.params;

            const category = await Categories.findOne({
                where: { id }
            });

            if (!category) {
                return response.status(404).json({
                    error: "Category does not exist. Please check the category id and try again."
                });
            }

            await Categories.update(
                {
                    name,
                    path
                },
                {
                    where: { id }
                }
            );

            return response.status(200).json({
                message: "Category updated successfully"
            });
        } catch (err) {
            return response.status(500).json({
                error: err.message
            });
        }
    }

    async delete(request, response) {
        try {
            const { id } = request.params;

            const category = await Categories.findOne({
                where: { id }
            });

            if (!category) {
                return response.status(404).json({
                    message: "Category does not exist"
                });
            }

            await category.destroy();

            return response.status(200).json({
                message: "Categoria deleted successfully!"
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({
                message: "Something went wrong"
            });
        }
    }
}

export default new CategoriesController();
