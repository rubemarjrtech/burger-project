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
        this.connection = new Sequelize(configDatabase);
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            "mongodb://localhost:27017/codeburger"
        );
    }
}

export default new Database();
