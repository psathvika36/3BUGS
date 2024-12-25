document.addEventListener('DOMContentLoaded', () => {
  const username = sessionStorage.getItem('username') || 'User';
  document.getElementById('usernameDisplay').textContent = username;
  document.getElementById('profileIcon').textContent = username.charAt(0).toUpperCase();
});
