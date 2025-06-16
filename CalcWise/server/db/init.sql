-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    birth_date DATE NOT NULL,
    passport_series VARCHAR(255) NOT NULL,
    passport_number VARCHAR(255) NOT NULL,
    passport_issued_by VARCHAR(255) NOT NULL,
    passport_issue_date DATE NOT NULL,
    passport_division_code VARCHAR(255) NOT NULL,
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

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Т-Банк', 'devs/Image/tbank.png', 5000000, 60, 29.9, 29.8 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Сбербанк', 'devs/Image/sber.png', 30000000, 60, 24.9, 22.9 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Совкомбанк', 'devs/Image/svk.png', 5000000, 60, 14.9, 14.8 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Альфа-Банк', 'devs/Image/alfa.png', 7500000, 60, 24, 23.9 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Россельхозбанк', 'devs/Image/rsk.png', 1000000, 60, 29.5, 28.4 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Локо-Банк', 'devs/Image/loco.png', 5000000, 60, 30, 29.5 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Русский Стандарт', 'devs/Image/stand.png', 3000000, 60, 65, 24.9 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Яндекс Банк', 'devs/Image/yand.png', 3000000, 60, 15, 13.1 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'МТС Банк', 'devs/Image/mts.png', 5000000, 60, 23.9, 23.4 );

INSERT INTO banks (name, logo_url, max_amount, max_term_months, interest_rate, psk)
VALUES ( 'Тендербанк', 'devs/Image/tender.png', 150000000, 180, 12, 11 );