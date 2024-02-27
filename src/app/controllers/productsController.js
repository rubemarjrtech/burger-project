import * as Yup from "yup";

class ProductController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
                category: Yup.string().required()
            });

            schema.validateSync(request.body, { abortEarly: false });

            return response.status(201).json({
                message: "Product added successfully!"
            });
        } catch (error) {
            response.status(400).json({ message: error.errors });
        }
    }
}

export default new ProductController();
