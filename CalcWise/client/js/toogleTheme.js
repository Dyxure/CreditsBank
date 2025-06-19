const toggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    toggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    toggle.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

toggle.addEventListener('click', () => {
  const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(newTheme);
});

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
});