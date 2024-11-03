import Sequelize from "sequelize";
import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Categories from "../app/models/Categories.js";
import mongoose from "mongoose";
import "dotenv/config";

const models = [User, Product, Categories];
class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(process.env.POSTGRES_URL, {
            dialect: "postgres"
        });
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL);
    }
}

export default new Database();
