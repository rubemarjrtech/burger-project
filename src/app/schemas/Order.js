import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        user: {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
        products: [
            {
                id: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                category: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

OrderSchema.virtual("total").get(function () {
    if (!this.products || !Array.isArray(this.products)) return 0;

    return this.products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
    );
});
OrderSchema.set("toJSON", {
    virtuals: true,
    transform: function (_, ret) {
        delete ret.__v;
        delete ret._id;
        return ret;
    }
});
OrderSchema.set("toObject", {
    virtuals: true,
    transform: function (_, ret) {
        delete ret.__v;
        delete ret._id;
        return ret;
    }
});

export default mongoose.model("Order", OrderSchema);
