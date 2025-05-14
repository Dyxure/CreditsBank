document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        last_name: document.getElementById('lastName').value.trim(),
        first_name: document.getElementById('firstName').value.trim(),
        middle_name: document.getElementById('middleName').value.trim(),
        birth_date: document.getElementById('birthDate').value,
        passport_series: document.getElementById('passportSeries').value.trim(),
        passport_number: document.getElementById('passportNumber').value.trim(),
        passport_issued_by: document.getElementById('passportIssuedBy').value.trim(),
        passport_issue_date: document.getElementById('passportIssueDate').value,
        passport_division_code: document.getElementById('passportDivisionCode').value.trim(),
    };

    if (data.password !== data.confirmPassword) {
        return alert('Пароли не совпадают!');
    }

    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            alert('Регистрация успешна!');
            window.location.href = '/index.html';
        } else {
            alert(result.message || 'Ошибка регистрации');
        }
    } catch (err) {
        alert('Ошибка сети: ' + err.message);
    }
});
