const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

const createDatabase = async (dbName) => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.end();
};

const getSequelizeInstance = (dbName) => {
    return new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "mysql",
    });
};

module.exports = { createDatabase, getSequelizeInstance };
