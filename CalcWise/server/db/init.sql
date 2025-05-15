-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    birth_date DATE NOT NULL,
    passport_series VARCHAR(4) NOT NULL,
    passport_number VARCHAR(6) NOT NULL,
    passport_issued_by VARCHAR(255) NOT NULL,
    passport_issue_date DATE NOT NULL,
    passport_division_code VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы банков
CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    max_amount DECIMAL(15, 2) NOT NULL,
    max_term_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    psk DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы истории кредитов
CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bank_id INT REFERENCES banks(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL,
    term_months INT NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
