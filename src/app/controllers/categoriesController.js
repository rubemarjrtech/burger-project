import * as Yup from "yup";
import Categories from "../models/Categories.js";
import Product from "../models/Product.js";

class CategoriesController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required()
            });

            try {
                schema.validateSync(request.body);
            } catch (err) {
                return response.status(422).json({
                    error: err.errors
                });
            }

            const { filename: path } = request.file;
            const { name } = request.body;

            const category = await Categories.findOne({
                where: { name }
            });

            if (category) {
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
            return response.status(500).json({
                error: "Something went wrong. Please try again or contact support."
            });
        }
    }

    async index(_, response) {
        try {
            const categories = await Categories.findAll();

            return response.status(200).json(categories);
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }

    async findOne(request, response) {
        try {
            const id = request.params["id"];
            const category = await Categories.findByPk(id, {
                include: [
                    {
                        model: Product,
                        as: "products",
                        attributes: ["id", "name", "url", "price", "offer"]
                    }
                ]
            });

            if (!category)
                return response.status(404).json({
                    message: "Category not found"
                });

            return response.status(200).json(category);
        } catch (error) {
            console.log(error);
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
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
                return response.status(422).json({
                    error: err.errors
                });
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
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }

    async remove(request, response) {
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
                message: "Category deleted successfully!"
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }
}

export default new CategoriesController();
