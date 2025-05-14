document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const accountButton = document.getElementById('accountButton');
    const accountMenu = document.getElementById('accountMenu');
    const logoutButton = document.getElementById('logoutButton');
    const applyButtons = document.querySelectorAll('.cardButton');

    if (token) {
        accountButton.textContent = 'Личный кабинет';
        applyButtons.forEach(btn => btn.style.display = 'inline-block');
    } else {
        accountButton.textContent = 'Вход/Регистрация';
        applyButtons.forEach(btn => btn.style.display = 'none');
    }

    accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // чтобы клик по кнопке не закрывал меню
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
});
