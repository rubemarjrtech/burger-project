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
                admin: { type: Sequelize.BOOLEAN, defaultValue: false }
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

    checkPassword(senha) {
        return bcrypt.compare(senha, this.password);
    }
}

export default User;
