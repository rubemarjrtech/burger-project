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
                await schema.validateSync(request.body, {
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

            const findProducts = await Product.findAll({
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

            const editedProduct = findProducts.map((product) => {
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
                products: editedProduct,
                status: "Order was successful!"
            };

            const registeredOrder = await Order.create(order);

            return response.status(201).json({
                data: registeredOrder
            });
        } catch (error) {
            return response.status(401).json({
                error: "An error has occured with your order, please try again."
            });
        }
    }

    async index(request, response) {
        try {
            const allOrders = await Order.find();

            return response.status(201).json(allOrders);
        } catch (error) {
            return response.status(401).json({
                error: error.name
            });
        }
    }

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                status: Yup.string().required().strict()
            });

            try {
                await schema.validateSync(request.body);
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

            return response.status(201).json({
                message: "Order updated successfully!"
            });
        } catch (error) {
            return response.status(401).json({
                error: error.name,
                message:
                    "Error updating your order. Please refresh the page and try again"
            });
        }
    }
}

export default new OrderController();
