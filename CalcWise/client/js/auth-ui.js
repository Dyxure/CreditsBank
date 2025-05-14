document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const accountButton = document.getElementById('accountButton');
    const accountMenu = document.getElementById('accountMenu');
    const logoutButton = document.getElementById('logoutButton');

    if (token) {
        accountButton.textContent = 'Личный кабинет';
    } else {
        accountButton.textContent = 'Вход/Регистрация';
    }

    accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('вы нажали кнопку');

        if (token) {
            accountMenu.classList.toggle('hidden');
        } else {
            window.location.href = 'pages/entry.html';
        }
    });

    logoutButton?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
    });

    document.addEventListener('click', (e) => {
        if (
            !accountMenu.contains(e.target) &&
            !accountButton.contains(e.target)
        ) {
            accountMenu.classList.add('hidden');
        }
    });

    // Функция скрытия кнопок
    const hideApplyButtons = () => {
        if (!token) {
            const buttons = document.querySelectorAll('.cardButton');
            buttons.forEach(btn => {
                btn.style.display = 'none';
            });
        }
    };

    // Первый вызов на случай уже существующих кнопок
    hideApplyButtons();

    // MutationObserver на изменение DOM
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Новые элементы добавлены
                hideApplyButtons();
            }
        }
    });

    // Наблюдаем за телом документа (можно ограничить область)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
