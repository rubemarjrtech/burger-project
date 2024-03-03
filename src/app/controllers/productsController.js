import * as Yup from "yup";
import Product from "../models/Product";
import Categories from "../models/Categories";

class ProductController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
                category_id: Yup.number().required()
            });

            try {
                await schema.validateSync(request.body, { abortEarly: false });
            } catch (err) {
                response.status(401).json({
                    error: err.errors
                });
            }

            const { filename: path } = request.file;
            const { name, price, category_id } = request.body;

            const { admin: isAdmin } = await User.findByPk(request.id);

            if (!isAdmin) {
                return response.status(401).json();
            }

            const product = await Product.create({
                name,
                price,
                category_id,
                path
            });

            return response.status(201).json({
                message: "Product added successfully!",
                product
            });
        } catch (error) {
            response
                .status(401)
                .json({ error: error, message: "Not authorized" });
        }
    }

    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Categories,
                    as: "category",
                    attributes: ["name"]
                }
            ]
        });

        return response.json(products);
    }
}

export default new ProductController();
