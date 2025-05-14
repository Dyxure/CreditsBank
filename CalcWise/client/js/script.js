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

        banks.forEach(bank => {
            const rate = parseFloat(bank.interest_rate);
            const payment = calculateMonthlyPayment(amount, months, rate);

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
                    <button id="cardButton" class="cardButton">Оформить кредит</button>
                </div>
                <div class="downCard">
                    <div class="conditions"><p>Сумма</p><h3>До ${(bank.max_amount)}₽</h3></div>
                    <div class="conditions"><p>Срок</p><h3>До ${Math.floor(bank.max_term_months / 12)} лет</h3></div>
                    <div class="conditions"><p>ПСК</p><h3>${(bank.psk)}%</h3></div>
                    <div class="conditions"><p>Ставка</p><h3>${formatNumber(rate)}%</h3></div>
                    <div class="conditions"><p>Платеж</p><h3>${formatNumber(payment)} ₽</h3></div>
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

    calculateBtn.addEventListener('click', () => {
        calculateLoan();

        const amount = parseFloat(amountInput.value.replace(/\s/g, '').replace(',', '.')) || 0;
        const months = parseInt(monthsInput.value) || 0;

        if (amount > 0 && months > 0) {
            renderCards(amount, months);
        }
    });

    [amountInput, percentInput, monthsInput].forEach(input => {
        input.addEventListener('input', sanitizeInput);
    });
});
