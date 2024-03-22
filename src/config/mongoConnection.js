import { MongoClient } from "mongodb";
import { mongoConfig } from "./settings.js";

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
    if (!_connection) {
        console.log(
            "Attempting to connect to MongoDB at:",
            mongoConfig.serverUrl
        );
        _connection = await MongoClient.connect(mongoConfig.serverUrl);
        _db = _connection.db(mongoConfig.database);
    }

    console.log("Connected to database at " + mongoConfig.serverUrl);

    return _db;
};
const closeConnection = async () => {
    await _connection.close();
};

export { dbConnection, closeConnection };
