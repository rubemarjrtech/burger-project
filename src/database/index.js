import Sequelize from "sequelize";
import configDatabase from "../config/database";
import User from "../app/models/User";
import Product from "../app/models/Product";
import Categories from "../app/models/Categories";
import mongoose from "mongoose";

const models = [User, Product, Categories];
class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(process.env.POSTGRES_URL);
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
