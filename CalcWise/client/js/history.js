document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('historyContainer');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Пожалуйста, войдите в аккаунт');
        return;
    }

    try {
        const res = await fetch('/api/history', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const history = await res.json();

        if (!Array.isArray(history)) {
            throw new Error('Неверный формат данных');
        }

        if (history.length === 0) {
            container.innerHTML = '<p class="tagP" >У вас пока нет оформленных кредитов.</p>';
            return;
        }

        history.forEach(entry => {
            const years = Math.floor(entry.term_months / 12);
            const amountFormatted = formatNumber(entry.amount) + ' ₽';
            const paymentFormatted = formatNumber(entry.monthly_payment) + ' ₽';
            const interestFormatted = formatNumber(entry.interest_rate) + '%';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="element">
                    <div class="cardLogo">
                        <img src="../${entry.logo_url}" alt="">
                        <div class="description">
                            <h4>${entry.bank_name}</h4>
                        </div>
                    </div>
                    <div class="desc">
                        <div class="conditions">
                            <p>Сумма кредита</p>
                            <h3>${amountFormatted}</h3>
                        </div>
                        <div class="conditions">
                            <p>Срок кредита</p>
                            <h3>${years} лет</h3>
                        </div>
                        <div class="conditions">
                            <p>Ставка по кредиту</p>
                            <h3>${interestFormatted}</h3>
                        </div>
                        <div class="conditions">
                            <p>Ежемесячный платеж</p>
                            <h3>${paymentFormatted}</h3>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Ошибка при загрузке истории.</p>';
    }

    function formatNumber(num) {
        return Number(num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',');
    }
});
