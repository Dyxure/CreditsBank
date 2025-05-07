//здесь будет подключение к бд
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: String(process.env.PASSWORD),
    port: process.env.PORT,
});

module.exports = pool;