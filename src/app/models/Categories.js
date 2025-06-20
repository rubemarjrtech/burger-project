import Sequelize, { Model } from "sequelize";

class Categories extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3000/category-file/${this.path}`;
                    }
                }
            },
            {
                sequelize
            }
        );

        return this;
    }

    static associate(models) {
        this.hasMany(models.Product, {
            foreignKey: "category_id",
            as: "products"
        });
    }
}

export default Categories;
