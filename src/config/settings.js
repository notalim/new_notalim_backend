export const mongoConfig = {
    serverUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/",
    database: process.env.DB_NAME || "notalim_portfolio",
};
