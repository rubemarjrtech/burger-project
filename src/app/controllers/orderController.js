import * as Yup from "yup";
import Product from "../models/Product.js";
import Categories from "../models/Categories.js";
import Order from "../schemas/Order.js";
import User from "../models/User.js";
import mongoose from "mongoose";

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
                return response.status(422).json({
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

            const newOrder = {
                user: {
                    id: request.user.id,
                    name: request.user.name
                },
                products: normalizedProducts,
                status: "Order was successful!"
            };

            const order = await Order.create(newOrder);

            const total = normalizedProducts.reduce(
                (total, currentProduct) =>
                    total + currentProduct.price * currentProduct.quantity,
                0
            );

            return response.status(201).json({
                data: order,
                total
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({
                error: "Something went wrong. Please try again or contact support."
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

    async findOne(request, response) {
        try {
            const id = request.params["id"];

            const order = await Order.findById(id);

            if (!order)
                return response.status(404).json({
                    message: "Order not found"
                });

            return response.status(200).json({
                info: order
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
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

    async remove(request, response) {
        try {
            const { id } = request.params;

            const { deletedCount } = await Order.deleteOne(id);

            if (!deletedCount)
                return response.status(400).json({
                    message:
                        "Could not delete order. Please verify if id exists and is valid"
                });

            return response.status(200).json({
                message: "Order deleted successfully!"
            });
        } catch (error) {
            return response.status(500).json({
                message:
                    "Something went wrong. Please try again or contact support"
            });
        }
    }
}

export default new OrderController();
