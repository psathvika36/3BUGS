document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeatPassword').value;

    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        sessionStorage.setItem('username', data.username);
        window.location.href = '/';
      } else {
        alert(data.message || 'Registration failed');
      }
    });
  });
});
