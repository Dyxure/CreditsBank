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
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создание индексов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_bank_id ON history(bank_id);
CREATE INDEX idx_history_status ON history(status);

-- Вставка тестовых данных для банков
INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk) VALUES
('Сбербанк', 'https://example.com/sberbank.png', 5000000, 84, 7.9, 8.5),
('Тинькофф', 'https://example.com/tinkoff.png', 3000000, 60, 8.9, 9.2),
('ВТБ', 'https://example.com/vtb.png', 4000000, 72, 8.5, 9.0); 