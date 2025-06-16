function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark');
    }
});