"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
var dotenv = require("dotenv");
dotenv.config();
exports.databaseConfig = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "fittrackpro_db",
    synchronize: true, // DEV only! Set to false for production
    autoLoadEntities: true,
    logging: false,
};
