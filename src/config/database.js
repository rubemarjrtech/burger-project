module.exports = {
    dialect: "postgres",
    url: process.env.POSTGRES_URL,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
};
