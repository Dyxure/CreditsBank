document.addEventListener('DOMContentLoaded', () => {
    // DOM элементы
    const amountInput = document.getElementById('amount');
    const percentInput = document.getElementById('percent');
    const monthsInput = document.getElementById('months');
    const calculateBtn = document.getElementById('calculateBtn');

    const monthlyPaymentEl = document.getElementById('monthlyPayment');
    const totalAmountEl = document.getElementById('totalAmount');
    const overpaymentEl = document.getElementById('overpayment');
    const totalCreditEl = document.getElementById('totalCredit');

    const container = document.getElementById('offers');

    let banks = [];

    // Форматирование числа с пробелами и запятой
    function formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '—';
        return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',');
    }

    // Расчет ежемесячного платежа
    function calculateMonthlyPayment(amount, months, rate) {
        if (typeof amount !== 'number' || typeof months !== 'number' || typeof rate !== 'number') return NaN;
        const monthlyRate = rate / 100 / 12;
        return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    }

    // Расчет итогов по кредиту
    function calculateLoan() {
        const amount = parseFloat(amountInput.value.replace(/\s/g, '').replace(',', '.')) || 0;
        const percent = parseFloat(percentInput.value.replace(',', '.')) || 0;
        const months = parseInt(monthsInput.value) || 0;

        const monthlyRate = percent / 100 / 12;
        const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        const totalCredit = monthlyPayment * months;
        const overpayment = totalCredit - amount;

        monthlyPaymentEl.textContent = formatNumber(monthlyPayment) + ' ₽';
        totalAmountEl.textContent = formatNumber(amount) + ' ₽';
        overpaymentEl.textContent = formatNumber(overpayment) + ' ₽';
        totalCreditEl.textContent = formatNumber(totalCredit) + ' ₽';
    }

    // Отображение карточек банков
    function renderCards(amount, months) {
    container.innerHTML = '';

    // Сначала вычисляем платежи для всех банков
    const banksWithPayment = banks.map(bank => {
        const rate = parseFloat(bank.interest_rate);
        const payment = calculateMonthlyPayment(amount, months, rate);
        return { ...bank, payment, rate };
    });

    // Сортировка: от самого меньшего платежа к большему
    banksWithPayment.sort((a, b) => a.payment - b.payment);

    // Отрисовка карточек
    banksWithPayment.forEach(bank => {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
            <div class="upCard">
                <div class="cardLogo">
                    <img src="${bank.logo_url}" alt="лого">
                    <div class="description">
                        <h4>${bank.name}</h4>
                        <p>Наличными</p>
                    </div>
                </div> 
                <button 
                    class="cardButton"
                    data-bank-id="${bank.id}"
                    data-interest-rate="${bank.rate}"
                    data-monthly-payment="${bank.payment}"
                >Оформить кредит</button>
            </div>
            <div class="downCard">
                <div class="conditions"><p>Сумма</p><h3>До ${bank.max_amount}₽</h3></div>
                <div class="conditions"><p>Срок</p><h3>До ${Math.floor(bank.max_term_months / 12)} лет</h3></div>
                <div class="conditions"><p>ПСК</p><h3>${bank.psk}%</h3></div>
                <div class="conditions"><p>Ставка</p><h3>${formatNumber(bank.rate)}%</h3></div>
                <div class="conditions"><p>Платеж</p><h3>${formatNumber(bank.payment)} ₽</h3></div>
            </div>
        `;

        container.appendChild(div);
    });
}


    // Очистка ввода
    function sanitizeInput(e) {
        e.target.value = e.target.value.replace(/[^\d,.]/g, '');
    }

    // Загрузка банков с сервера
    fetch('/api/banks')
        .then(res => res.json())
        .then(data => {
            console.log('Банки с сервера:', data);
            banks = data;
            calculateBtn.click(); // Автоматический запуск после загрузки банков
        })
        .catch(err => {
            console.error('Ошибка загрузки банков:', err);
        });

    // Кнопка расчета
    calculateBtn.addEventListener('click', () => {
        calculateLoan();

        const amount = parseFloat(amountInput.value.replace(/\s/g, '').replace(',', '.')) || 0;
        const months = parseInt(monthsInput.value) || 0;

        if (amount > 0 && months > 0) {
            renderCards(amount, months);
        }
    });

    // Очистка ввода
    [amountInput, percentInput, monthsInput].forEach(input => {
        input.addEventListener('input', sanitizeInput);
    });

    // Обработка кликов по динамически созданным кнопкам
    container.addEventListener('click', async (e) => {
        const btn = e.target.closest('.cardButton');
        if (!btn) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }

        const bankId = btn.getAttribute('data-bank-id');
        const interestRate = parseFloat(btn.getAttribute('data-interest-rate'));
        const monthlyPayment = parseFloat(btn.getAttribute('data-monthly-payment'));

        const amount = parseFloat(amountInput.value.replace(/\s/g, '').replace(',', '.')) || 0;
        const term = parseInt(monthsInput.value) || 0;

        if (!amount || !term) {
            alert('Введите сумму и срок кредита');
            return;
        }

        console.log(`полученные данные: id банка: ${bankId}, ставка: ${interestRate}, платеж: ${monthlyPayment}, сумма: ${amount}, срок: ${term}`);

        try {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bank_id: bankId,
                    amount,
                    term_months: term,
                    monthly_payment: monthlyPayment,
                    interest_rate: interestRate
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Кредит успешно оформлен!');
            } else {
                alert('Ошибка: ' + result.message);
            }
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка при оформлении кредита');
        }
    });
});
