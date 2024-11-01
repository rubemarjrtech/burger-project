import * as Yup from "yup";
import Product from "../models/Product";
import Categories from "../models/Categories";
import User from "../models/User";

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
}

export default new ProductController();
