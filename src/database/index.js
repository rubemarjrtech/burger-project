import Sequelize from "sequelize";
import configDatabase from "../config/database";
import User from "../app/models/User";
import Product from "../app/models/Product";
import Categories from "../app/models/Categories";

const models = [User, Product, Categories];
class Database {
    constructor() {
        this.init();
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
}

export default new Database();
