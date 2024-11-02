import Sequelize from "sequelize";
import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Categories from "../app/models/Categories.js";
import mongoose from "mongoose";

const models = [User, Product, Categories];
class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(
            "postgresql://postgres:NPFTxfnuJOfwEOtiShsMudLUHeYFjUzr@autorack.proxy.rlwy.net:58077/railway"
        );
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            "mongodb://mongo:lTOoduUWFDjDOjEOlaFarZbZswRzZJyi@autorack.proxy.rlwy.net:57456"
        );
    }
}

export default new Database();
