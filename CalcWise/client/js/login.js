document.getElementById('loginButton').addEventListener('click', async function () {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return alert('Введите email и пароль');
    }

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await res.json();

        if (res.ok) {
            alert('Успешный вход!');
            localStorage.setItem('token', result.token); 
            window.location.href = '/index.html'; 
        } else {
            alert(result.message || 'Ошибка входа');
        }
    } catch (err) {
        alert('Ошибка сети: ' + err.message);
    }
});
