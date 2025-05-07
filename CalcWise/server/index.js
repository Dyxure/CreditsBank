//здесь будет основной серверный файл
const express = require('express');
const pool = require('./config/db');

const app = express();

pool.query('SELECT NOW()', (err, res) => {
    if(err) {
        console.error('Ошибка подключения к базе данных: ', err.stack);
    }
    else {
        console.log('Подлючение к базе данных прошло успешно: ', res.rows);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`)
});