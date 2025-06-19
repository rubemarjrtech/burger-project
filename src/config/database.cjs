require("dotenv").config();

module.exports = {
    production: {
        dialect: "postgres",
        url: process.env.POSTGRES_URL
    },
    development: {
        dialect: "postgres",
        url: process.env.POSTGRES_LOCAL_URL
    }
};
