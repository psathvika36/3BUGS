document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const repeatPassword = document.getElementById('repeatPassword').value.trim();
  const passwordError = document.getElementById('passwordError'); // Error message container

  // Clear previous errors
  passwordError.textContent = '';

  if (!firstName || !lastName || !email || !password || !repeatPassword) {
    passwordError.textContent = 'All fields are required.';
    return;
  }

  function validatePassword() {
    const password = passwordField.value.trim();

  // Password validation (must match backend requirements)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    passwordError.textContent = 'Password must be at least 8 characters, include an uppercase, a lowercase, a number, and a special character.';
    return;
  }
  else {
    passwordError.textContent = ''; // Clear error when valid
  }
  }
  if (password !== repeatPassword) {
    passwordError.textContent = 'Passwords do not match.';
    return;
  }
  // Attach event listener to password field for real-time validation
  passwordField.addEventListener('input', validatePassword);
  // Proceed with registration
  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
  });

  const result = await response.json();
  if (response.ok) {
    alert('Registration successful!');
    window.location.href = '/login';
  } else {
    passwordError.textContent = `Registration failed: ${result.message}`;
  }
});
