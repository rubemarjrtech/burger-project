import Sequelize, { Model } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                senha: Sequelize.VIRTUAL,
                password: Sequelize.STRING,
                admin: Sequelize.BOOLEAN
            },
            { sequelize }
        );

        this.addHook("beforeSave", async (user) => {
            if (user.senha) {
                user.password = await bcrypt.hash(user.senha, 10);
            }
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

export default User;
