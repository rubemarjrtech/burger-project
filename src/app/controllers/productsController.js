import * as Yup from "yup";
import Product from "../models/Product.js";
import Categories from "../models/Categories.js";
import User from "../models/User.js";

class ProductController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
                category_id: Yup.number().required(),
                offer: Yup.bool()
            });

            try {
                schema.validateSync(request.body, { abortEarly: false });
            } catch (err) {
                return response.status(401).json({
                    error: err.errors
                });
            }

            const { filename: path } = request.file;
            const { name, price, category_id, offer } = request.body;

            const { admin: isAdmin } = await User.findByPk(request.id);

            if (!isAdmin) {
                return response.status(401).json();
            }

            const product = await Product.create({
                name,
                price,
                category_id,
                path,
                offer
            });

            return response.status(201).json({
                message: "Product added successfully!",
                product
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ error: "Something went wrong" });
        }
    }

    async index(_, response) {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Categories,
                        as: "category",
                        attributes: ["name"]
                    }
                ]
            });

            return response.status(200).json(products);
        } catch (err) {
            console.log(err);
            response.status(500).json({
                error: "Something went wrong"
            });
        }
    }

    async findOne(request, response) {
        try {
            const id = request.params["id"];

            const product = await Product.findByPk(id, {
                include: {
                    all: true,
                    attributes: {
                        exclude: ["path", "url", "createdAt", "updatedAt"]
                    }
                }
            });

            if (!product)
                return response.status(400).json({
                    message: "Product not found."
                });

            return response.status(200).json(product);
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                price: Yup.number(),
                category_id: Yup.number(),
                offer: Yup.boolean()
            });

            try {
                schema.validateSync(request.body, { abortEarly: false });
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

            const { id } = request.params;

            const product = await Product.findByPk(id);

            if (!product) {
                return response.status(404).json({
                    error: "Product does not exist. Please try again."
                });
            }

            const { name, price, category_id, offer } = request.body;

            await Product.update(
                {
                    name,
                    price,
                    category_id,
                    path,
                    offer
                },
                {
                    where: { id }
                }
            );

            return response.status(200).json({
                message: "Product info updated successfully!"
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ error: "Something went wrong" });
        }
    }

    async remove(request, response) {
        try {
            const { id } = request.params;

            const result = await Product.destroy({ where: { id } });

            if (!result)
                return response.status(400).json({
                    message:
                        "Could not delete product. Please verify if id exists and is valid"
                });

            return response.status(200).json({
                message: "Product deleted successfully!"
            });
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }
}

export default new ProductController();
