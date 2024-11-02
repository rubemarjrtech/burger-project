import * as Yup from "yup";
import Product from "../models/Product";
import Categories from "../models/Categories";
import Order from "../schemas/Order";
import User from "../models/User";

class OrderController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                products: Yup.array()
                    .required()
                    .of(
                        Yup.object().shape({
                            id: Yup.number().required(),
                            quantity: Yup.number().required()
                        })
                    )
            });

            try {
                schema.validateSync(request.body, {
                    abortEarly: false
                });
            } catch (err) {
                return response.status(401).json({
                    error: err.errors
                });
            }

            const productsId = request.body.products.map(
                (product) => product.id
            );

            const products = await Product.findAll({
                where: {
                    id: productsId
                },
                include: [
                    {
                        model: Categories,
                        as: "category",
                        attributes: ["name"]
                    }
                ]
            });

            const normalizedProducts = products.map((product) => {
                const productIndex = request.body.products.findIndex(
                    (currentItem) => currentItem.id === product.id
                );

                const productInfo = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    url: product.url,
                    category: product.category.name,
                    quantity: request.body.products[productIndex].quantity
                };

                return productInfo;
            });

            const order = {
                user: {
                    id: request.id,
                    name: request.name
                },
                products: normalizedProducts,
                status: "Order was successful!"
            };

            const registeredOrder = await Order.create(order);

            return response.status(201).json({
                data: registeredOrder
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({
                error: "Something went wrong"
            });
        }
    }

    async index(_, response) {
        try {
            const orders = await Order.find();

            return response.status(200).json(orders);
        } catch (err) {
            console.log(err);
            return response.status(500).json({
                error: "Something went wrong"
            });
        }
    }

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                status: Yup.string().required().strict()
            });

            try {
                schema.validateSync(request.body);
            } catch (err) {
                return response.status(401).json({
                    error: err.errors
                });
            }

            const { id } = request.params;
            const { status } = request.body;

            const { admin: isAdmin } = await User.findByPk(request.id);

            if (!isAdmin) {
                return response.status(401).json();
            }

            await Order.updateOne(
                {
                    _id: id
                },
                { status }
            );

            return response.status(200).json({
                message: "Order updated successfully!"
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({
                error: "Something went wrong"
            });
        }
    }
}

export default new OrderController();
