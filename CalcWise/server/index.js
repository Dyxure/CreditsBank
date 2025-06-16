const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  });

app.get('/api/banks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM banks');
    console.log('Банки из БД:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении банков:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);
const iv = Buffer.alloc(16, 0); 

// Функция шифрования
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

app.post('/api/register', async (req, res) => {
    const {
        email, password, last_name, first_name, middle_name,
        birth_date, passport_series, passport_number,
        passport_issued_by, passport_issue_date, passport_division_code
    } = req.body;

    if (!email || !password || !last_name || !first_name || !birth_date ||
        !passport_series || !passport_number || !passport_issued_by || !passport_issue_date || !passport_division_code) {
        return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Шифруем паспортные данные
        const encSeries = encrypt(passport_series);
        const encNumber = encrypt(passport_number);
        const encIssuedBy = encrypt(passport_issued_by);
        const encDivisionCode = encrypt(passport_division_code);

        await pool.query(`
            INSERT INTO users (
                email, password_hash, last_name, first_name, middle_name,
                birth_date, passport_series, passport_number,
                passport_issued_by, passport_issue_date, passport_division_code
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            `, [
            email, hashedPassword, last_name, first_name, middle_name || null,
            birth_date, encSeries, encNumber, encIssuedBy, passport_issue_date, encDivisionCode
        ]);

        res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            res.status(409).json({ message: 'Пользователь с таким email уже существует' });
        } else {
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    // Проверка корректности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Некорректный формат email' });
    }

    try {
        // Поиск пользователя в базе данных
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const user = result.rows[0];

        // Сравнение паролей
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Генерация JWT токена
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Успешный вход', token });
    } catch (err) {
        console.error('Ошибка входа:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/api/history', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена авторизации' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        console.log('Декодированный токен:', decoded);

        const userId = decoded.id;
        if (!userId) {
            return res.status(400).json({ message: 'userId не найден в токене' });
        }

        const { bank_id, amount, term_months, monthly_payment, interest_rate } = req.body;

        await pool.query(`
            INSERT INTO history (user_id, bank_id, amount, term_months, monthly_payment, interest_rate)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [userId, bank_id, amount, term_months, monthly_payment, interest_rate]);

        res.status(201).json({ message: 'История успешно записана' });
    } catch (err) {
        console.error('Ошибка:', err.message);
        res.status(403).json({ message: 'Неверный токен или ошибка сервера' });
    }
});

app.get('/api/history', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена авторизации' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        const userId = decoded.userId || decoded.id;

        const result = await pool.query(`
            SELECT h.amount, h.term_months, h.interest_rate, h.monthly_payment,
                   b.name AS bank_name, b.logo_url
            FROM history h
            JOIN banks b ON h.bank_id = b.id
            WHERE h.user_id = $1
            ORDER BY h.id DESC
        `, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Ошибка авторизации или сервера' });
    }
});



app.use((err, req, res, next) => {
    console.error('Внутренняя ошибка сервера:', err.stack);
    res.status(500).json({ message: 'Что-то пошло не так' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});